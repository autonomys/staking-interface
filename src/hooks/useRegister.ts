import { useToast } from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import React, { useCallback } from 'react'
import { ROUTES } from '../constants'
import { useRegistration } from '../states/registration'
import { useTx } from './useTx'

export const useRegister = () => {
  const toast = useToast()
  const { push } = useRouter()
  const currentRegistration = useRegistration((state) => state.currentRegistration)
  const saveCurrentRegistration = useRegistration((state) => state.saveCurrentRegistration)
  const addRegistration = useRegistration((state) => state.addRegistration)
  const setErrorsField = useRegistration((state) => state.setErrorsField)
  const { handleRegisterOperator } = useTx()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    saveCurrentRegistration({ ...currentRegistration, [name]: value })
    setErrorsField(name, detectError(name, value))
  }

  const handleSubmit = useCallback(async () => {
    console.log('currentRegistration', currentRegistration)
    try {
      await handleRegisterOperator(currentRegistration)

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
  }, [addRegistration, currentRegistration, handleRegisterOperator, push, toast])

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
