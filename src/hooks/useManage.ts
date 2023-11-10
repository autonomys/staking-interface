import { useToast } from '@chakra-ui/react'
import type { SingleValue } from 'chakra-react-select'
import React, { useCallback, useMemo, useState } from 'react'
import { ActionType, DECIMALS, ERROR_DESC_INFORMATION_INCORRECT, toastConfig } from '../constants'
import { useExtension } from '../states/extension'
import { ActionInput, Option } from '../types'
import { capitalizeFirstLetter, formatAddress, formatNumber, parseNumber } from '../utils'
import { useTx } from './useTx'

export const useManage = () => {
  const toast = useToast()
  const accountDetails = useExtension((state) => state.accountDetails)
  const stakingConstants = useExtension((state) => state.stakingConstants)
  const [deregister, setDeregister] = useState<string>('')
  const [addFundsAmount, setAddFundsAmount] = useState<ActionInput>({
    operatorId: '',
    amount: '',
    formattedAmount: ''
  })
  const [withdrawAmount, setWithdrawAmount] = useState<ActionInput>({
    operatorId: '',
    amount: '',
    formattedAmount: ''
  })
  const { handleDeregister, handleAddFunds, handleWithdraw } = useTx()

  const operatorsOptions = useMemo(
    () =>
      stakingConstants.operatorIdOwner
        ? stakingConstants.operatorIdOwner.map((owner, key) => ({
            label: `${key} - ${formatAddress(owner)}`,
            value: key
          }))
        : [],
    [stakingConstants.operatorIdOwner]
  )

  const operatorId = useCallback(
    (actionType: ActionType) => {
      switch (actionType) {
        case ActionType.Deregister:
          return deregister
        case ActionType.AddFunds:
          return addFundsAmount.operatorId
        case ActionType.Withdraw:
          return addFundsAmount.operatorId
      }
    },
    [addFundsAmount.operatorId, deregister]
  )

  const handleChangeOperatorId = useCallback(
    (actionType: ActionType, operatorSelected: SingleValue<Option<number>>) => {
      const operatorId = operatorSelected != null ? operatorSelected.value.toString() : ''
      switch (actionType) {
        case ActionType.Deregister:
          setDeregister(operatorId)
          break
        case ActionType.AddFunds:
          setAddFundsAmount({
            ...addFundsAmount,
            operatorId
          })
          break
        case ActionType.Withdraw:
          setWithdrawAmount({
            ...withdrawAmount,
            operatorId
          })
          break
      }
    },
    [addFundsAmount, withdrawAmount]
  )

  const handleChangeAmount = useCallback(
    (actionType: ActionType, e: React.ChangeEvent<HTMLInputElement>) => {
      switch (actionType) {
        case ActionType.AddFunds:
          setAddFundsAmount({
            ...addFundsAmount,
            amount: parseNumber(e.target.value),
            formattedAmount: e.target.value
          })
          break
        case ActionType.Withdraw:
          setWithdrawAmount({
            ...withdrawAmount,
            amount: parseNumber(e.target.value),
            formattedAmount: e.target.value
          })
          break
      }
    },
    [addFundsAmount, withdrawAmount]
  )

  const handleMaxAmountToAddFunds = useCallback(() => {
    if (!accountDetails) return
    setAddFundsAmount({
      ...addFundsAmount,
      amount: accountDetails.data.free,
      formattedAmount: formatNumber(accountDetails.data.free, DECIMALS)
    })
  }, [accountDetails, addFundsAmount])

  const handleSubmit = useCallback(
    async (actionType: ActionType) => {
      try {
        switch (actionType) {
          case ActionType.Deregister:
            return await handleDeregister(deregister)
          case ActionType.AddFunds:
            return await handleAddFunds(addFundsAmount.operatorId, addFundsAmount.amount)
          case ActionType.Withdraw:
            return await handleWithdraw(withdrawAmount.operatorId, withdrawAmount.amount)
        }
      } catch (error) {
        toast({
          title: 'Error: ' + capitalizeFirstLetter(actionType) + ' failed',
          description: ERROR_DESC_INFORMATION_INCORRECT,
          status: 'error',
          ...toastConfig
        })
      }
    },
    [addFundsAmount, deregister, handleAddFunds, handleDeregister, handleWithdraw, toast, withdrawAmount]
  )

  return {
    operatorsOptions,
    operatorId,
    handleChangeOperatorId,
    handleChangeAmount,
    handleMaxAmountToAddFunds,
    handleSubmit
  }
}
