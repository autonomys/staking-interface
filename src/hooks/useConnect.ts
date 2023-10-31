import { useDisclosure } from '@chakra-ui/react'
import { ApiPromise } from '@polkadot/api'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { WsProvider } from '@polkadot/rpc-provider'
import { useCallback } from 'react'
import { PROVIDER_URL, SUBSPACE_EXTENSION_ID, initialExtensionValues } from '../constants'
import { useExtension } from '../states/extension'

export const useConnect = () => {
  const extension = useExtension((state) => state.extension)
  const setApi = useExtension((state) => state.setApi)
  const setExtension = useExtension((state) => state.setExtension)
  const setInjectedExtension = useExtension((state) => state.setInjectedExtension)
  const setNetworkConstants = useExtension((state) => state.setNetworkConstants)
  const { isOpen: isConnectOpen, onOpen: onConnectOpen, onClose: onConnectClose } = useDisclosure()

  const handleConnect = useCallback(async () => {
    setExtension({ ...initialExtensionValues, loading: true })

    try {
      const wsProvider = new WsProvider(PROVIDER_URL)
      const _api = await ApiPromise.create({ provider: wsProvider })
      if (_api) {
        console.log('Connection Success', _api)
        setApi(_api)
        setNetworkConstants({
          maxNominators: Number(_api.consts.staking.maxNominatorsCount.toString()),
          minOperatorStake: BigInt(_api.consts.domains.minOperatorStake.toString()),
          stakeEpochDuration: Number(_api.consts.staking.stakeEpochDuration.toString()),
          stakeWithdrawalLockingPeriod: Number(_api.consts.staking.stakeWithdrawalLockingPeriod.toString())
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
      .then((accounts) => {
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
  }, [setApi, setExtension, setInjectedExtension, setNetworkConstants])

  const handleSelectFirstWalletFromExtension = useCallback(
    (source: string) => {
      handleConnect()
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
    (address: string) => {
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

  const handleDisconnect = useCallback(() => setExtension(initialExtensionValues), [setExtension])

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
