import { useDisclosure } from '@chakra-ui/react'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { encodeAddress } from '@polkadot/keyring'
import { useCallback, useEffect } from 'react'
import { SUBSPACE_ACCOUNT_FORMAT, SUBSPACE_EXTENSION_ID, initialExtensionValues } from '../constants'
import { useExtension, useLastConnection } from '../states/extension'
import { AccountDetails } from '../types'

export const useConnect = () => {
  const extension = useExtension((state) => state.extension)
  const api = useExtension((state) => state.api)
  const setExtension = useExtension((state) => state.setExtension)
  const setSubspaceAccount = useExtension((state) => state.setSubspaceAccount)
  const setInjectedExtension = useExtension((state) => state.setInjectedExtension)
  const setAccountDetails = useExtension((state) => state.setAccountDetails)
  const subspaceAccount = useExtension((state) => state.subspaceAccount)
  const lastSubspaceAccount = useLastConnection((state) => state.subspaceAccount)
  const setLastSubspaceAccount = useLastConnection((state) => state.setSubspaceAccount)
  const { isOpen: isConnectOpen, onOpen: onConnectOpen, onClose: onConnectClose } = useDisclosure()

  const handleConnect = useCallback(async () => {
    setExtension({ ...initialExtensionValues, loading: true })

    web3Enable(SUBSPACE_EXTENSION_ID)
      .then((injectedExtensions) => {
        if (!injectedExtensions.length) return Promise.reject(new Error('NO_INJECTED_EXTENSIONS'))

        setInjectedExtension(injectedExtensions[0])

        return web3Accounts()
      })
      .then(async (accounts) => {
        if (!accounts.length) return Promise.reject(new Error('NO_ACCOUNTS'))

        const lastAccount = accounts.find((account) => account.address === lastSubspaceAccount)
        const defaultAccount = lastAccount ? lastAccount : accounts[0]

        setExtension({
          error: null,
          loading: false,
          data: {
            accounts: accounts,
            defaultAccount
          }
        })
        setSubspaceAccount(encodeAddress(defaultAccount.address, SUBSPACE_ACCOUNT_FORMAT))
        setLastSubspaceAccount(defaultAccount.address)
      })
      .catch((error) => {
        console.error('Error with connect', error)
        setExtension({ error, loading: false, data: undefined })
      })
  }, [lastSubspaceAccount, setExtension, setInjectedExtension, setLastSubspaceAccount, setSubspaceAccount])

  const handleSelectFirstWalletFromExtension = useCallback(
    async (source: string) => {
      await handleConnect()
      const mainAccount = extension.data?.accounts.find((account) => account.meta.source === source)
      if (mainAccount && extension.data) {
        setExtension({
          ...extension,
          data: {
            ...extension.data,
            defaultAccount: mainAccount
          }
        })
        setSubspaceAccount(encodeAddress(mainAccount.address, SUBSPACE_ACCOUNT_FORMAT))
        setLastSubspaceAccount(mainAccount.address)
      }
      onConnectClose()
    },
    [handleConnect, extension, onConnectClose, setExtension, setSubspaceAccount, setLastSubspaceAccount]
  )

  const handleSelectWallet = useCallback(
    async (address: string) => {
      const mainAccount = extension.data?.accounts.find((account) => account.address === address)
      if (mainAccount && extension.data) {
        setExtension({
          ...extension,
          data: {
            ...extension.data,
            defaultAccount: mainAccount
          }
        })
        setSubspaceAccount(encodeAddress(mainAccount.address, SUBSPACE_ACCOUNT_FORMAT))
        setLastSubspaceAccount(mainAccount.address)
      }
    },
    [extension, setExtension, setLastSubspaceAccount, setSubspaceAccount]
  )

  const handleRefreshBalance = useCallback(async () => {
    if (!api || !extension.data) return

    const rawAccountDetails = await api.query.system.account(extension.data.defaultAccount.address)
    const accountDetails = rawAccountDetails.toJSON() as AccountDetails
    setAccountDetails(accountDetails)
  }, [api, extension.data, setAccountDetails])

  const handleDisconnect = useCallback(() => {
    setExtension(initialExtensionValues)
    setLastSubspaceAccount(undefined)
  }, [setExtension, setLastSubspaceAccount])

  useEffect(() => {
    if (api && extension.data) handleRefreshBalance()
  }, [api, extension.data, handleRefreshBalance])

  useEffect(() => {
    if (lastSubspaceAccount && !subspaceAccount) handleConnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
