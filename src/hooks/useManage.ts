import { useToast } from '@chakra-ui/react'
import React, { useCallback } from 'react'
import {
  AMOUNT_TO_SUBTRACT_FROM_MAX_AMOUNT,
  ActionType,
  ERROR_DESC_INFORMATION_INCORRECT,
  toastConfig
} from '../constants'
import { useExtension } from '../states/extension'
import { useManageState } from '../states/manage'
import { capitalizeFirstLetter, formatNumber, parseNumber } from '../utils'
import { useTx } from './useTx'

export const useManage = () => {
  const toast = useToast()
  const {
    accountDetails,
    stakingConstants,
    chainDetails: { tokenDecimals }
  } = useExtension()
  const {
    deregister,
    addFundsAmount,
    withdrawAmount,
    setDeregister,
    setAddFundsOperator,
    setWithdrawOperator,
    setAddFundsAmount,
    setWithdrawAmount,
    clearInput,
    setErrorsField
  } = useManageState()
  const { handleDeregister, handleAddFunds, handleWithdraw } = useTx()

  const detectError = useCallback(
    (value: string) => parseInt(value) < 0 || value.length < 1 || isNaN(Number(value)),
    []
  )

  const operatorId = useCallback(
    (actionType: ActionType) => {
      switch (actionType) {
        case ActionType.Deregister:
          return deregister
        case ActionType.AddFunds:
          return addFundsAmount.operatorId
        case ActionType.Withdraw:
          return withdrawAmount.operatorId
      }
    },
    [addFundsAmount.operatorId, deregister, withdrawAmount.operatorId]
  )

  const handleChangeOperatorId = useCallback(
    (actionType: ActionType, operatorId: string) => {
      switch (actionType) {
        case ActionType.Deregister:
          setDeregister(operatorId)
          break
        case ActionType.AddFunds:
          setAddFundsOperator(operatorId)
          break
        case ActionType.Withdraw:
          setWithdrawOperator(operatorId)
          break
      }
    },
    [setAddFundsOperator, setDeregister, setWithdrawOperator]
  )

  const handleChangeAmount = useCallback(
    (actionType: ActionType, e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        const formattedAmount = e.target.value === '' ? '0' : e.target.value
        switch (actionType) {
          case ActionType.AddFunds:
            setAddFundsAmount({
              ...addFundsAmount,
              amount: parseNumber(formattedAmount, tokenDecimals),
              formattedAmount
            })
            break
          case ActionType.Withdraw:
            setWithdrawAmount({
              ...withdrawAmount,
              amount: parseNumber(formattedAmount, tokenDecimals),
              formattedAmount
            })
            break
        }
        setErrorsField(actionType, detectError(e.target.value))
      } catch (error) {
        console.error('Error: ', error)
        setErrorsField(actionType, true)
      }
    },
    [addFundsAmount, detectError, setAddFundsAmount, setErrorsField, setWithdrawAmount, tokenDecimals, withdrawAmount]
  )

  const handleMaxAmountToAddFunds = useCallback(() => {
    if (!accountDetails) return
    try {
      const fullAmount = parseInt(accountDetails.data.free, 16)
      const amount = fullAmount > 0 ? fullAmount - AMOUNT_TO_SUBTRACT_FROM_MAX_AMOUNT : 0
      setAddFundsAmount({
        ...addFundsAmount,
        amount: amount.toString(),
        formattedAmount: formatNumber(amount / 10 ** tokenDecimals)
      })
    } catch (error) {
      console.error('Error: ', error)
      toast({
        title: 'Error: ' + capitalizeFirstLetter(ActionType.AddFunds) + ' failed',
        description: ERROR_DESC_INFORMATION_INCORRECT,
        status: 'error',
        ...toastConfig
      })
    }
  }, [accountDetails, addFundsAmount, setAddFundsAmount, toast, tokenDecimals])

  const handleMaxAmountToWithdraw = useCallback(() => {
    try {
      const operator = stakingConstants.operators[parseInt(withdrawAmount.operatorId)]
      const amount = operator ? parseInt(operator.operatorDetail.currentTotalStake) : 0
      setWithdrawAmount({
        ...withdrawAmount,
        amount: amount.toString(),
        formattedAmount: formatNumber(amount / 10 ** tokenDecimals)
      })
    } catch (error) {
      console.error('Error: ', error)
      toast({
        title: 'Error: ' + capitalizeFirstLetter(ActionType.Withdraw) + ' failed',
        description: ERROR_DESC_INFORMATION_INCORRECT,
        status: 'error',
        ...toastConfig
      })
    }
  }, [setWithdrawAmount, stakingConstants.operators, toast, tokenDecimals, withdrawAmount])

  const handleSubmit = useCallback(
    async (actionType: ActionType) => {
      try {
        switch (actionType) {
          case ActionType.Deregister:
            await handleDeregister(deregister)
            break
          case ActionType.AddFunds:
            await handleAddFunds(addFundsAmount.operatorId, addFundsAmount.amount)
            break
          case ActionType.Withdraw:
            await handleWithdraw(withdrawAmount.operatorId, withdrawAmount.amount)
            break
        }
        clearInput(actionType)
      } catch (error) {
        console.error('Error: ', error)
        toast({
          title: 'Error: ' + capitalizeFirstLetter(actionType) + ' failed',
          description: ERROR_DESC_INFORMATION_INCORRECT,
          status: 'error',
          ...toastConfig
        })
      }
    },
    [addFundsAmount, deregister, handleAddFunds, handleDeregister, handleWithdraw, toast, withdrawAmount, clearInput]
  )

  return {
    operatorId,
    addFundsAmount,
    withdrawAmount,
    handleChangeOperatorId,
    handleChangeAmount,
    handleMaxAmountToAddFunds,
    handleMaxAmountToWithdraw,
    handleSubmit
  }
}
