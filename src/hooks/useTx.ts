import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import { ERROR_WALLET_NOT_FOUND, toastConfig } from '../constants'
import { useExtension } from '../states/extension'
import { Registration } from '../types'

export const useTx = () => {
  const toast = useToast()
  const api = useExtension((state) => state.api)
  const extension = useExtension((state) => state.extension)
  const injectedExtension = useExtension((state) => state.injectedExtension)

  const handleRegisterOperator = useCallback(
    async (registration: Registration) => {
      if (!api || !extension.data || !injectedExtension)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      console.log('RegisterOperator')
      if (extension.data) {
        const result = await api.tx.domains
          .registerOperator(registration.domainId, registration.amountToStake, {
            signingKey: registration.signingKey,
            minimumNominatorStake: registration.minimumNominatorStake,
            nominationTax: registration.nominatorTax
          })
          .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer }, ({ status }) => {
            console.log('status', status)
          })
        console.log('result', result)
      }
      return
    },
    [api, extension.data, injectedExtension, toast]
  )

  const handleDeregister = useCallback(
    async (operatorId: string) => {
      if (!api || !extension.data || !injectedExtension)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
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

  const handleAddFunds = useCallback(
    async (operatorId: string, amount: string) => {
      if (!api || !extension.data || !injectedExtension)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      console.log('AddFund')
      if (extension.data) {
        const result = await api.tx.domains
          .nominateOperator(operatorId, amount)
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
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      const hexAmount = '0x0' + BigInt(amount).toString(16)
      if (extension.data) {
        const result = await api.tx.domains
          .withdrawStake(operatorId, hexAmount)
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
    handleRegisterOperator,
    handleDeregister,
    handleAddFunds,
    handleWithdraw
  }
}
