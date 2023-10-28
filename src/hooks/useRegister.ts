import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'
import { ROUTES } from '../constants'
import { useExtension } from '../states/extension'
import { useRegistration } from '../states/registration'

export const useRegister = () => {
  const toast = useToast()
  const { push } = useRouter()
  const currentRegistration = useRegistration((state) => state.currentRegistration)
  const saveCurrentRegistration = useRegistration((state) => state.saveCurrentRegistration)
  const addRegistration = useRegistration((state) => state.addRegistration)
  const setErrorsField = useRegistration((state) => state.setErrorsField)
  const extension = useExtension((state) => state.extension)
  const api = useExtension((state) => state.api)
  const injectedExtension = useExtension((state) => state.injectedExtension)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    saveCurrentRegistration({ ...currentRegistration, [name]: value })
    setErrorsField(name, detectError(name, value))
  }

  const handleSubmit = useCallback(async () => {
    console.log('currentRegistration', currentRegistration)
    if (!api || !extension.data || !injectedExtension) {
      toast({
        title: 'Error: Wallet provider not found',
        description: `Please make sure you have the Polkadot{.js} extension installed and setup or an other wallet provider and that you connected your wallet to the app.`,
        status: 'error',
        duration: 9000,
        isClosable: true
      })
      return
    }
    try {
      const result = await api.tx.domains
        .registerOperator(currentRegistration.domainId, currentRegistration.amountToStake, {
          signingKey: currentRegistration.signingKey,
          minimumNominatorStake: currentRegistration.minimumNominatorStake,
          nominationTax: currentRegistration.nominatorTax
        })
        .signAndSend(extension.data?.defaultAccount.address, { signer: injectedExtension.signer }, ({ status }) => {
          console.log('status', status)
        })
      console.log('result', result)

      addRegistration(currentRegistration)
      push(ROUTES.MANAGE)
    } catch (error) {
      toast({
        title: 'Error: Registration failed',
        description: `Please make sure the information you provided is correct and try again.`,
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    }
  }, [addRegistration, api, currentRegistration, extension.data, injectedExtension, push, toast])

  const detectError = (key: string, value: string) => {
    // To do: Improve the validation
    switch (key) {
      case 'domainId':
        return value.length < 1
      case 'minimumNominatorStake':
        return parseInt(value) < 0
      case 'amountToStake':
        return value.length < 1
      case 'nominatorTax':
        return parseInt(value) < 0 && parseInt(value) > 100 && value.length < 1 && !isNaN(parseInt(value))
      case 'signingKey':
        return value.length < 1
      default:
        return false
    }
  }

  return {
    handleChange,
    handleSubmit
  }
}
