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
  const { accountDetails, stakingConstants, chainDetails } = useExtension((state) => state)
  const {
    deregister,
    addFundsAmount,
    withdrawAmount,
    setDeregister,
    setAddFundsOperator,
    setWithdrawOperator,
    setAddFundsAmount,
    setWithdrawAmount,
    clearInput
  } = useManageState((state) => state)
  const { handleDeregister, handleAddFunds, handleWithdraw } = useTx()
  const { tokenDecimals } = chainDetails

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
      switch (actionType) {
        case ActionType.AddFunds:
          setAddFundsAmount({
            ...addFundsAmount,
            amount: parseNumber(e.target.value, tokenDecimals),
            formattedAmount: e.target.value
          })
          break
        case ActionType.Withdraw:
          setWithdrawAmount({
            ...withdrawAmount,
            amount: parseNumber(e.target.value, tokenDecimals),
            formattedAmount: e.target.value
          })
          break
      }
    },
    [addFundsAmount, setAddFundsAmount, setWithdrawAmount, tokenDecimals, withdrawAmount]
  )

  const handleMaxAmountToAddFunds = useCallback(() => {
    if (!accountDetails) return
    const fullAmount = parseInt(accountDetails.data.free, 16)
    const amount = fullAmount > 0 ? fullAmount - AMOUNT_TO_SUBTRACT_FROM_MAX_AMOUNT : 0
    setAddFundsAmount({
      ...addFundsAmount,
      amount: amount.toString(),
      formattedAmount: formatNumber(amount / 10 ** tokenDecimals)
    })
  }, [accountDetails, addFundsAmount, setAddFundsAmount, tokenDecimals])

  const handleMaxAmountToWithdraw = useCallback(() => {
    const operator = stakingConstants.operators[parseInt(withdrawAmount.operatorId)]
    const amount = operator ? parseInt(operator.operatorDetail.currentTotalStake) : 0
    setWithdrawAmount({
      ...withdrawAmount,
      amount: amount.toString(),
      formattedAmount: formatNumber(amount / 10 ** tokenDecimals)
    })
  }, [setWithdrawAmount, stakingConstants.operators, tokenDecimals, withdrawAmount])

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
