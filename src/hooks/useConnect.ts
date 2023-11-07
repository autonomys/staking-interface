import { useDisclosure } from '@chakra-ui/react'
import { ApiPromise } from '@polkadot/api'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { WsProvider } from '@polkadot/rpc-provider'
import { useCallback, useEffect } from 'react'
import { SUBSPACE_EXTENSION_ID, initialExtensionValues } from '../constants'
import { useExtension } from '../states/extension'
import {
  AccountDetails,
  DomainRegistry,
  DomainStakingSummary,
  OperatorIdOwner,
  Operators,
  PendingStakingOperationCount
} from '../types'

export const useConnect = () => {
  const extension = useExtension((state) => state.extension)
  const api = useExtension((state) => state.api)
  const setApi = useExtension((state) => state.setApi)
  const setExtension = useExtension((state) => state.setExtension)
  const setInjectedExtension = useExtension((state) => state.setInjectedExtension)
  const setAccountDetails = useExtension((state) => state.setAccountDetails)
  const setStakingConstants = useExtension((state) => state.setStakingConstants)
  const { isOpen: isConnectOpen, onOpen: onConnectOpen, onClose: onConnectClose } = useDisclosure()

  const handleConnect = useCallback(async () => {
    setExtension({ ...initialExtensionValues, loading: true })

    try {
      if (!process.env.NEXT_PUBLIC_PROVIDER_URL) throw new Error('NEXT_PUBLIC_PROVIDER_URL not set')

      const wsProvider = new WsProvider(process.env.NEXT_PUBLIC_PROVIDER_URL)
      const _api = await ApiPromise.create({ provider: wsProvider })
      if (_api) {
        console.log('Connection Success')
        setApi(_api)
        const { maxNominators, minOperatorStake, stakeEpochDuration, stakeWithdrawalLockingPeriod } =
          _api.consts.domains
        console.log('stakimg', _api.consts.domains)

        const domainRegistry = await _api.query.domains.domainRegistry.entries()
        console.log(
          'domainRegistry',
          domainRegistry.map((domain) => domain[1].toJSON() as DomainRegistry)
        )

        const domainStakingSummary = await _api.query.domains.domainStakingSummary.entries()
        console.log(
          'domainStakingSummary',
          domainStakingSummary.map((domain) => domain[1].toJSON() as DomainStakingSummary)
        )

        const operatorIdOwner = await _api.query.domains.operatorIdOwner.entries()
        console.log(
          'operatorIdOwner',
          operatorIdOwner.map((operator) => operator[1].toJSON() as OperatorIdOwner)
        )

        const operators = await _api.query.domains.operators.entries()
        console.log(
          'operators',
          operators.map((operator) => operator[1].toJSON() as Operators)
        )

        const pendingStakingOperationCount = await _api.query.domains.pendingStakingOperationCount.entries()
        console.log(
          'pendingStakingOperationCount',
          pendingStakingOperationCount.map((operator) => operator[1].toJSON() as PendingStakingOperationCount)
        )

        setStakingConstants({
          maxNominators: Number(maxNominators.toString()),
          minOperatorStake: BigInt(minOperatorStake.toString()),
          stakeEpochDuration: Number(stakeEpochDuration.toString()),
          stakeWithdrawalLockingPeriod: Number(stakeWithdrawalLockingPeriod.toString()),
          domainRegistry: domainRegistry.map((domain) => domain[1].toJSON() as DomainRegistry),
          domainStakingSummary: domainStakingSummary.map((domain) => domain[1].toJSON() as DomainStakingSummary),
          operatorIdOwner: operatorIdOwner.map((operator) => operator[1].toJSON() as OperatorIdOwner),
          operators: operators.map((operator) => operator[1].toJSON() as Operators),
          pendingStakingOperationCount: pendingStakingOperationCount.map(
            (operator) => operator[1].toJSON() as PendingStakingOperationCount
          )
        })
      }
    } catch (error) {
      console.log(error)
    }

    web3Enable(SUBSPACE_EXTENSION_ID)
      .then((injectedExtensions) => {
        if (!injectedExtensions.length) return Promise.reject(new Error('NO_INJECTED_EXTENSIONS'))

        setInjectedExtension(injectedExtensions[0])

        return web3Accounts()
      })
      .then(async (accounts) => {
        if (!accounts.length) return Promise.reject(new Error('NO_ACCOUNTS'))

        setExtension({
          error: null,
          loading: false,
          data: {
            accounts: accounts,
            defaultAccount: accounts[0]
          }
        })

        console.log('accounts', accounts)
      })
      .catch((error) => {
        console.error('Error with connect', error)
        setExtension({ error, loading: false, data: undefined })
      })
  }, [setApi, setExtension, setInjectedExtension, setStakingConstants])

  const handleSelectFirstWalletFromExtension = useCallback(
    async (source: string) => {
      await handleConnect()
      const mainAccount = extension.data?.accounts.find((account) => account.meta.source === source)
      console.log('mainAccount', mainAccount)
      if (mainAccount && extension.data)
        setExtension({
          ...extension,
          data: {
            ...extension.data,
            defaultAccount: mainAccount
          }
        })
      onConnectClose()
    },
    [handleConnect, extension, setExtension, onConnectClose]
  )

  const handleSelectWallet = useCallback(
    async (address: string) => {
      const mainAccount = extension.data?.accounts.find((account) => account.address === address)
      console.log('mainAccount', mainAccount)
      if (mainAccount && extension.data)
        setExtension({
          ...extension,
          data: {
            ...extension.data,
            defaultAccount: mainAccount
          }
        })
    },
    [extension, setExtension]
  )

  const handleRefreshBalance = useCallback(async () => {
    if (!api || !extension.data) throw new Error('API not set')

    const rawAccountDetails = await api.query.system.account(extension.data.defaultAccount.address)
    const accountDetails = rawAccountDetails.toJSON() as AccountDetails
    setAccountDetails(accountDetails)

    const balance = accountDetails.data.free
    console.log('balance', balance)
  }, [api, extension.data, setAccountDetails])

  const handleDisconnect = useCallback(() => setExtension(initialExtensionValues), [setExtension])

  useEffect(() => {
    if (extension.data) handleRefreshBalance()
  }, [extension.data, handleRefreshBalance])

  return {
    handleConnect,
    handleSelectFirstWalletFromExtension,
    handleSelectWallet,
    handleDisconnect,
    onConnectOpen,
    isConnectOpen,
    onConnectClose
  }
}
