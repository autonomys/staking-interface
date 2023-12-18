import { useToast } from '@chakra-ui/react'
import type { SingleValue } from 'chakra-react-select'
import { useRouter } from 'next/navigation'
import React, { useCallback, useMemo } from 'react'
import {
  AMOUNT_TO_SUBTRACT_FROM_MAX_AMOUNT,
  ERROR_DESC_INFORMATION_INCORRECT,
  ERROR_REGISTRATION_FAILED,
  ROUTES,
  toastConfig
} from '../constants'
import { useExtension } from '../states/extension'
import { useRegistration } from '../states/registration'
import { Option } from '../types'
import { capitalizeFirstLetter, formatNumber, parseNumber } from '../utils'
import { isValidSr25519PublicKey } from '../utils/signingKey'
import { useTx } from './useTx'

export const useRegister = () => {
  const toast = useToast()
  const { push } = useRouter()
  const { currentRegistration, saveCurrentRegistration, clearCurrentRegistration, setErrorsField } = useRegistration(
    (state) => state
  )
  const { accountDetails, stakingConstants, chainDetails } = useExtension((state) => state)
  const { handleRegisterOperator } = useTx()
  const { tokenDecimals } = chainDetails

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
        ? stakingConstants.domainRegistry.map((domain) => ({
            label: `${domain.domainId} - ${capitalizeFirstLetter(domain.domainDetail.domainConfig.domainName)}`,
            value: domain.domainId
          }))
        : [],
    [stakingConstants.domainRegistry]
  )

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const { name, value } = e.target
        const _value = value === '' ? '0' : value
        if (name === 'minimumNominatorStake')
          saveCurrentRegistration({
            ...currentRegistration,
            minimumNominatorStake: parseNumber(_value, tokenDecimals),
            formattedMinimumNominatorStake: _value
          })
        else if (name === 'amountToStake')
          saveCurrentRegistration({
            ...currentRegistration,
            amountToStake: parseNumber(_value, tokenDecimals),
            formattedAmountToStake: _value
          })
        else saveCurrentRegistration({ ...currentRegistration, [name]: _value })
        setErrorsField(name, detectError(name, _value))
      } catch (error) {
        toast({
          title: 'Error: Register as operator failed',
          description: ERROR_DESC_INFORMATION_INCORRECT,
          status: 'error',
          ...toastConfig
        })
      }
    },
    [currentRegistration, detectError, saveCurrentRegistration, setErrorsField, toast, tokenDecimals]
  )

  const handleDomainChange = useCallback(
    (domainSelected: SingleValue<Option<string>>) => {
      const domainId = domainSelected != null ? domainSelected.value : ''
      saveCurrentRegistration({ ...currentRegistration, domainId })
      setErrorsField('domainId', detectError('domainId', domainId))
    },
    [currentRegistration, detectError, saveCurrentRegistration, setErrorsField]
  )

  const handleMaxAmountToStake = useCallback(() => {
    if (!accountDetails) return
    try {
      const fullAmount = parseInt(accountDetails.data.free, 16)
      const amount = fullAmount > 0 ? fullAmount - AMOUNT_TO_SUBTRACT_FROM_MAX_AMOUNT : 0
      saveCurrentRegistration({
        ...currentRegistration,
        amountToStake: amount.toString(),
        formattedAmountToStake: formatNumber(amount / 10 ** tokenDecimals)
      })
    } catch (error) {
      toast({
        title: 'Error: Register as operator failed',
        description: ERROR_DESC_INFORMATION_INCORRECT,
        status: 'error',
        ...toastConfig
      })
    }
  }, [accountDetails, currentRegistration, saveCurrentRegistration, toast, tokenDecimals])

  const handleSubmit = useCallback(async () => {
    try {
      await handleRegisterOperator(currentRegistration)

      clearCurrentRegistration()
      push(ROUTES.MANAGE)
    } catch (error) {
      toast({
        ...ERROR_REGISTRATION_FAILED,
        status: 'error',
        ...toastConfig
      })
    }
  }, [clearCurrentRegistration, currentRegistration, handleRegisterOperator, push, toast])

  return {
    domainsOptions,
    handleChange,
    handleDomainChange,
    handleMaxAmountToStake,
    handleSubmit
  }
}
