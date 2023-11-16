import { useToast } from '@chakra-ui/react'
import type { SingleValue } from 'chakra-react-select'
import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'
import { ERROR_REGISTRATION_FAILED, ROUTES, toastConfig } from '../constants'
import { useExtension } from '../states/extension'
import { useRegistration } from '../states/registration'
import { Option } from '../types'
import { capitalizeFirstLetter, hexToFormattedNumber, hexToNumber, parseNumber } from '../utils'
import { isValidSr25519PublicKey } from '../utils/signingKey'
import { useTx } from './useTx'

export const useRegister = () => {
  const toast = useToast()
  const { push } = useRouter()
  const currentRegistration = useRegistration((state) => state.currentRegistration)
  const saveCurrentRegistration = useRegistration((state) => state.saveCurrentRegistration)
  const addRegistration = useRegistration((state) => state.addRegistration)
  const setErrorsField = useRegistration((state) => state.setErrorsField)
  const accountDetails = useExtension((state) => state.accountDetails)
  const stakingConstants = useExtension((state) => state.stakingConstants)
  const { handleRegisterOperator } = useTx()

  const detectError = useCallback((key: string, value: string) => {
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
        return value.length < 1 && isValidSr25519PublicKey(value)
      default:
        return false
    }
  }, [])

  const domainsOptions = useMemo(
    () =>
      stakingConstants.domainRegistry
        ? stakingConstants.domainRegistry.map((domain, key) => ({
            label: `${key} - ${capitalizeFirstLetter(domain.domainConfig.domainName)}`,
            value: key
          }))
        : [],
    [stakingConstants.domainRegistry]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      if (name === 'minimumNominatorStake')
        saveCurrentRegistration({
          ...currentRegistration,
          minimumNominatorStake: parseNumber(value),
          formattedMinimumNominatorStake: value
        })
      else if (name === 'amountToStake')
        saveCurrentRegistration({
          ...currentRegistration,
          amountToStake: parseNumber(value),
          formattedAmountToStake: value
        })
      else saveCurrentRegistration({ ...currentRegistration, [name]: value })
      setErrorsField(name, detectError(name, value))
    },
    [currentRegistration, detectError, saveCurrentRegistration, setErrorsField]
  )

  const handleDomainChange = useCallback(
    (domainSelected: SingleValue<Option<number>>) => {
      const domainId = domainSelected != null ? domainSelected.value.toString() : ''
      saveCurrentRegistration({ ...currentRegistration, domainId })
      setErrorsField('domainId', detectError('domainId', domainId))
    },
    [currentRegistration, detectError, saveCurrentRegistration, setErrorsField]
  )

  const handleMaxAmountToStake = useCallback(() => {
    if (!accountDetails) return
    saveCurrentRegistration({
      ...currentRegistration,
      amountToStake: hexToNumber(accountDetails.data.free).toString(),
      formattedAmountToStake: hexToFormattedNumber(accountDetails.data.free)
    })
  }, [accountDetails, currentRegistration, saveCurrentRegistration])

  const handleSubmit = useCallback(async () => {
    try {
      await handleRegisterOperator(currentRegistration)

      addRegistration(currentRegistration)
      push(ROUTES.MANAGE)
    } catch (error) {
      toast({
        ...ERROR_REGISTRATION_FAILED,
        status: 'error',
        ...toastConfig
      })
    }
  }, [addRegistration, currentRegistration, handleRegisterOperator, push, toast])

  return {
    domainsOptions,
    handleChange,
    handleDomainChange,
    handleMaxAmountToStake,
    handleSubmit
  }
}
