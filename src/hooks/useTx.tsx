import { useToast } from '@chakra-ui/react'
import { useCallback } from 'react'
import { SuccessTxToast } from '../components/toasts'
import { ERROR_WALLET_NOT_FOUND, toastConfig } from '../constants'
import { useExtension, useTransactions } from '../states/extension'
import { Registration } from '../types'

export const useTx = () => {
  const toast = useToast()
  const { api, mmApi, extension, subspaceAccount, injectedExtension } = useExtension()
  const addTransactionToWatch = useTransactions((state) => state.addTransactionToWatch)

  const handleRegisterOperator = useCallback(
    async (registration: Registration) => {
      console.log('handleRegisterOperator')
      console.log('api', api)
      console.log('extension.data', extension.data)
      console.log('injectedExtension', injectedExtension)
      console.log('subspaceAccount', subspaceAccount)
      if (!api || !extension.data || !subspaceAccount)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      console.log('handleRegisterOperator-2')
      if (extension.data) {
        console.log('extension.data', extension.data)
        const block = await api.rpc.chain.getBlock()
        console.log('block', block)
        if (extension.data.defaultAccount.meta.source === 'metamask') {
          try {
            if (!mmApi) return

            console.log('mmApi', mmApi)

            const txPayload = await mmApi.generateRegisterOperatorPayload(
              registration.domainId,
              registration.amountToStake,
              {
                signingKey: registration.signingKey,
                minimumNominatorStake: registration.minimumNominatorStake,
                nominationTax: registration.nominatorTax
              }
            )
            console.log('txPayload', txPayload)

            const signedTx = await mmApi.signPayloadJSON(txPayload.payload)
            console.log('signedTx', signedTx)

            const tx = await mmApi.send(signedTx, txPayload)
            console.log('tx', tx)

            addTransactionToWatch({
              extrinsicHash: tx.hash.toString(),
              method: 'registerOperator',
              sender: subspaceAccount,
              fromBlockNumber: block.block.header.number.toNumber(),
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
                  heading='Registration request sent'
                  description='Your registration tx. was sent. The transaction need to be minted then, you will see the change after the next epoch.'
                  hash={tx.hash.toString()}
                />
              )
            })
          } catch (error) {
            console.log('error', error)
            toast({
              ...toastConfig,
              status: 'error',
              title: 'Error',
              description: 'Something went wrong'
            })
          }
        } else if (injectedExtension) {
          const hash = await api.tx.domains
            .registerOperator(registration.domainId, registration.amountToStake, {
              signingKey: registration.signingKey,
              minimumNominatorStake: registration.minimumNominatorStake,
              nominationTax: registration.nominatorTax
            })
            .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
          addTransactionToWatch({
            extrinsicHash: hash.toString(),
            method: 'registerOperator',
            sender: subspaceAccount,
            fromBlockNumber: block.block.header.number.toNumber(),
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
                heading='Registration request sent'
                description='Your registration tx. was sent. The transaction need to be minted then, you will see the change after the next epoch.'
                hash={hash.toString()}
              />
            )
          })
          return hash
        } else
          return toast({
            ...ERROR_WALLET_NOT_FOUND,
            ...toastConfig,
            status: 'error'
          })
      }
      return
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, mmApi, subspaceAccount, toast]
  )

  const handleDeregister = useCallback(
    async (operatorId: string) => {
      if (!api || !extension.data || !subspaceAccount)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      if (extension.data) {
        console.log('extension.data', extension.data)
        const block = await api.rpc.chain.getBlock()
        console.log('block', block)
        if (extension.data.defaultAccount.meta.source === 'metamask') {
          try {
            if (!mmApi) return

            console.log('mmApi', mmApi)

            const txPayload = await mmApi.generateDeregisterOperatorPayload(operatorId)
            console.log('txPayload', txPayload)

            const signedTx = await mmApi.signPayloadJSON(txPayload.payload)
            console.log('signedTx', signedTx)

            const tx = await mmApi.send(signedTx, txPayload)
            console.log('tx', tx)

            addTransactionToWatch({
              extrinsicHash: tx.hash.toString(),
              method: 'deregisterOperator',
              sender: subspaceAccount,
              fromBlockNumber: block.block.header.number.toNumber(),
              parameters: [operatorId]
            })
            toast({
              ...toastConfig,
              isClosable: true,
              render: () => (
                <SuccessTxToast
                  heading='Registration request sent'
                  description='Your request to de-register tx. was sent. The transaction need to be minted then, you will see the change after the next epoch.'
                  hash={tx.hash.toString()}
                />
              )
            })
          } catch (error) {
            console.log('error', error)
            toast({
              ...toastConfig,
              status: 'error',
              title: 'Error',
              description: 'Something went wrong'
            })
          }
        } else if (injectedExtension) {
          const hash = await api.tx.domains
            .deregisterOperator(operatorId)
            .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
          addTransactionToWatch({
            extrinsicHash: hash.toString(),
            method: 'deregisterOperator',
            sender: subspaceAccount,
            fromBlockNumber: block.block.header.number.toNumber(),
            parameters: [operatorId]
          })
          toast({
            ...toastConfig,
            isClosable: true,
            render: () => (
              <SuccessTxToast
                heading='Registration request sent'
                description='Your request to de-register tx. was sent. The transaction need to be minted then, you will see the change after the next epoch.'
                hash={hash.toString()}
              />
            )
          })
        } else
          return toast({
            ...ERROR_WALLET_NOT_FOUND,
            ...toastConfig,
            status: 'error'
          })
      }
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, mmApi, subspaceAccount, toast]
  )

  const handleAddFunds = useCallback(
    async (operatorId: string, amount: string) => {
      if (!api || !extension.data || !subspaceAccount)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      if (extension.data) {
        console.log('extension.data', extension.data)
        const block = await api.rpc.chain.getBlock()
        console.log('block', block)
        if (extension.data.defaultAccount.meta.source === 'metamask') {
          try {
            if (!mmApi) return

            console.log('mmApi', mmApi)

            const txPayload = await mmApi.generateNominateOperatorPayload(operatorId, amount)
            console.log('txPayload', txPayload)

            const signedTx = await mmApi.signPayloadJSON(txPayload.payload)
            console.log('signedTx', signedTx)

            const tx = await mmApi.send(signedTx, txPayload)
            console.log('tx', tx)

            addTransactionToWatch({
              extrinsicHash: tx.hash.toString(),
              method: 'nominateOperator',
              sender: subspaceAccount,
              fromBlockNumber: block.block.header.number.toNumber(),
              parameters: [operatorId, amount]
            })
            toast({
              ...toastConfig,
              isClosable: true,
              render: () => (
                <SuccessTxToast
                  heading='Registration request sent'
                  description='Your request to add funds tx. was sent. The transaction need to be minted then, you will see the change after the next epoch.'
                  hash={tx.hash.toString()}
                />
              )
            })
          } catch (error) {
            console.log('error', error)
            toast({
              ...toastConfig,
              status: 'error',
              title: 'Error',
              description: 'Something went wrong'
            })
          }
        } else if (injectedExtension) {
          const hash = await api.tx.domains
            .nominateOperator(operatorId, amount)
            .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
          addTransactionToWatch({
            extrinsicHash: hash.toString(),
            method: 'nominateOperator',
            sender: subspaceAccount,
            fromBlockNumber: block.block.header.number.toNumber(),
            parameters: [operatorId, amount]
          })
          toast({
            ...toastConfig,
            isClosable: true,
            render: () => (
              <SuccessTxToast
                heading='Registration request sent'
                description='Your request to add funds tx. was sent. The transaction need to be minted then, you will see the change after the next epoch.'
                hash={hash.toString()}
              />
            )
          })
          return hash
        }
      } else
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, mmApi, subspaceAccount, toast]
  )

  const handleWithdraw = useCallback(
    async (operatorId: string, amount: string) => {
      if (!api || !extension.data || !subspaceAccount)
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
      if (extension.data) {
        console.log('extension.data', extension.data)
        const block = await api.rpc.chain.getBlock()
        console.log('block', block)
        if (extension.data.defaultAccount.meta.source === 'metamask') {
          try {
            if (!mmApi) return

            console.log('mmApi', mmApi)

            const txPayload = await mmApi.generateWithdrawStakePayload(operatorId)
            console.log('txPayload', txPayload)

            const signedTx = await mmApi.signPayloadJSON(txPayload.payload)
            console.log('signedTx', signedTx)

            const tx = await mmApi.send(signedTx, txPayload)
            console.log('tx', tx)

            addTransactionToWatch({
              extrinsicHash: tx.hash.toString(),
              method: 'withdrawStake',
              sender: subspaceAccount,
              fromBlockNumber: block.block.header.number.toNumber(),
              parameters: [operatorId, JSON.stringify({ Some: amount })]
            })
            toast({
              ...toastConfig,
              isClosable: true,
              render: () => (
                <SuccessTxToast
                  heading='Withdraw request sent'
                  description='Your withdraw request tx. was sent. The transaction need to be minted then, you will see the change after the next epoch.'
                  hash={tx.hash.toString()}
                />
              )
            })
          } catch (error) {
            console.log('error', error)
            toast({
              ...toastConfig,
              status: 'error',
              title: 'Error',
              description: 'Something went wrong'
            })
          }
        } else if (injectedExtension) {
          const hash = await api.tx.domains
            .withdrawStake(operatorId, {
              Some: amount
            })
            .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer })
          addTransactionToWatch({
            extrinsicHash: hash.toString(),
            method: 'withdrawStake',
            sender: subspaceAccount,
            fromBlockNumber: block.block.header.number.toNumber(),
            parameters: [operatorId, JSON.stringify({ Some: amount })]
          })
          toast({
            ...toastConfig,
            isClosable: true,
            render: () => (
              <SuccessTxToast
                heading='Withdraw request sent'
                description='Your withdraw request tx. was sent. The transaction need to be minted then, you will see the change after the next epoch.'
                hash={hash.toString()}
              />
            )
          })
          return hash
        }
      } else
        return toast({
          ...ERROR_WALLET_NOT_FOUND,
          ...toastConfig,
          status: 'error'
        })
    },
    [addTransactionToWatch, api, extension.data, injectedExtension, mmApi, subspaceAccount, toast]
  )

  return {
    handleRegisterOperator,
    handleDeregister,
    handleAddFunds,
    handleWithdraw
  }
}
