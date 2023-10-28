import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import { useExtension } from '../states/extension'

export const useTx = () => {
  const toast = useToast()
  const api = useExtension((state) => state.api)
  const extension = useExtension((state) => state.extension)
  const injectedExtension = useExtension((state) => state.injectedExtension)

  const handleDeregister = useCallback(
    async (operatorId: string) => {
      if (!api || !extension.data || !injectedExtension)
        return toast({
          title: 'Error: Wallet provider not found',
          description: `Please make sure you have the Polkadot{.js} extension installed and setup or an other wallet provider and that you connected your wallet to the app.`,
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      console.log('Deregister')
      if (extension.data) {
        const result = await api.tx.domains
          .deregisterOperator(operatorId)
          .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer }, ({ status }) => {
            console.log('status', status)
          })
        console.log('result', result)
      }
      return
    },
    [api, extension.data, injectedExtension, toast]
  )

  const handleAddFund = useCallback(
    async (operatorId: string) => {
      if (!api || !extension.data || !injectedExtension)
        return toast({
          title: 'Error: Wallet provider not found',
          description: `Please make sure you have the Polkadot{.js} extension installed and setup or an other wallet provider and that you connected your wallet to the app.`,
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      console.log('AddFund')
      if (extension.data) {
        const result = await api.tx.domains
          .autoStakeBlock(operatorId)
          .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer }, ({ status }) => {
            console.log('status', status)
          })
        console.log('result', result)
      }
      return
    },
    [api, extension.data, injectedExtension, toast]
  )

  const handleWithdraw = useCallback(
    async (operatorId: string, amount: string) => {
      if (!api || !extension.data || !injectedExtension)
        return toast({
          title: 'Error: Wallet provider not found',
          description: `Please make sure you have the Polkadot{.js} extension installed and setup or an other wallet provider and that you connected your wallet to the app.`,
          status: 'error',
          duration: 9000,
          isClosable: true
        })
      console.log('Withdraw')
      if (extension.data) {
        const result = await api.tx.domains
          .withdrawStake(operatorId, amount)
          .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer }, ({ status }) => {
            console.log('status', status)
          })
        console.log('result', result)
      }
      return
    },
    [api, extension.data, injectedExtension, toast]
  )

  return {
    handleDeregister,
    handleAddFund,
    handleWithdraw
  }
}
