import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import { SuccessTxToast } from '../components/toasts'
import { ERROR_WALLET_NOT_FOUND, toastConfig } from '../constants'
import { useExtension, useTransactions } from '../states/extension'
import { Registration } from '../types'

export const useTx = () => {
  const toast = useToast()
  const api = useExtension((state) => state.api)
  const extension = useExtension((state) => state.extension)
  const injectedExtension = useExtension((state) => state.injectedExtension)
  const addTransactionToWatch = useTransactions((state) => state.addTransactionToWatch)

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
        try {
          const hash = await api.tx.domains
            .registerOperator(registration.domainId, registration.amountToStake, {
              signingKey: registration.signingKey,
              minimumNominatorStake: registration.minimumNominatorStake,
              nominationTax: registration.nominatorTax
            })
            .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
          console.log('hash', hash)
          addTransactionToWatch({
            extrinsicHash: hash.toString(),
            method: 'registerOperator',
            sender: extension.data?.defaultAccount.address,
            parameters: [
              registration.domainId,
              registration.amountToStake,
              JSON.stringify({
                signingKey: registration.signingKey,
                minimumNominatorStake: registration.minimumNominatorStake,
                nominationTax: registration.nominatorTax
              })
            ]
          })
          toast({
            ...toastConfig,
            isClosable: true,
            render: () => (
              <SuccessTxToast
                heading='Registration successful'
                description='Your registration tx. was sent. The transaction need to be minted then, you will see the change after the next epoch.'
                hash={hash.toString()}
              />
            )
          })
          return hash
        } catch (error) {
          console.error('error', error)
        }
      }
      return
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, toast]
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
        const hash = await api.tx.domains
          .deregisterOperator(operatorId)
          .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
        console.log('hash', hash)
        addTransactionToWatch({
          extrinsicHash: hash.toString(),
          method: 'deregisterOperator',
          sender: extension.data?.defaultAccount.address,
          parameters: [operatorId]
        })
        toast({
          ...toastConfig,
          isClosable: true,
          render: () => (
            <SuccessTxToast
              heading='Registration successful'
              description='Your request to de-register tx. was sent. The transaction need to be minted then, you will see the change after the next epoch.'
              hash={hash.toString()}
            />
          )
        })
      }
      return
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, toast]
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
        const hash = await api.tx.domains
          .nominateOperator(operatorId, amount)
          .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
        console.log('hash', hash)
        addTransactionToWatch({
          extrinsicHash: hash.toString(),
          method: 'nominateOperator',
          sender: extension.data?.defaultAccount.address,
          parameters: [operatorId, amount]
        })
        toast({
          ...toastConfig,
          isClosable: true,
          render: () => (
            <SuccessTxToast
              heading='Registration successful'
              description='Your request to add funds tx. was sent. The transaction need to be minted then, you will see the change after the next epoch.'
              hash={hash.toString()}
            />
          )
        })
      }
      return
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, toast]
  )

  const handleWithdraw = useCallback(
    async (operatorId: string, amount: string) => {
      if (!api || !extension.data || !injectedExtension)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      if (extension.data) {
        const hash = await api.tx.domains
          .withdrawStake(operatorId, {
            Some: amount
          })
          .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
        console.log('hash', hash)
        addTransactionToWatch({
          extrinsicHash: hash.toString(),
          method: 'withdrawStake',
          sender: extension.data?.defaultAccount.address,
          parameters: [operatorId, JSON.stringify({ Some: amount })]
        })
        toast({
          ...toastConfig,
          isClosable: true,
          render: () => (
            <SuccessTxToast
              heading='Withdraw successful'
              description='Your withdraw request tx. was sent. The transaction need to be minted then, you will see the change after the next epoch.'
              hash={hash.toString()}
            />
          )
        })
      }
      return
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, toast]
  )

  return {
    handleRegisterOperator,
    handleDeregister,
    handleAddFunds,
    handleWithdraw
  }
}
