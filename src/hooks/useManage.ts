import { useToast } from '@chakra-ui/react'
import type { SingleValue } from 'chakra-react-select'
import React, { useCallback, useMemo } from 'react'
import { ActionType, DECIMALS, ERROR_DESC_INFORMATION_INCORRECT, toastConfig } from '../constants'
import { useExtension } from '../states/extension'
import { useManageState } from '../states/manage'
import { Option } from '../types'
import { capitalizeFirstLetter, formatAddress, formatNumber, parseNumber } from '../utils'
import { useTx } from './useTx'

export const useManage = () => {
  const toast = useToast()
  const accountDetails = useExtension((state) => state.accountDetails)
  const stakingConstants = useExtension((state) => state.stakingConstants)
  const deregister = useManageState((state) => state.deregister)
  const addFundsAmount = useManageState((state) => state.addFundsAmount)
  const withdrawAmount = useManageState((state) => state.withdrawAmount)
  const setDeregister = useManageState((state) => state.setDeregister)
  const setAddFundsOperator = useManageState((state) => state.setAddFundsOperator)
  const setWithdrawOperator = useManageState((state) => state.setWithdrawOperator)
  const setAddFundsAmount = useManageState((state) => state.setAddFundsAmount)
  const setWithdrawAmount = useManageState((state) => state.setWithdrawAmount)
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
    [addFundsAmount, setAddFundsAmount, setWithdrawAmount, withdrawAmount]
  )

  const handleMaxAmountToAddFunds = useCallback(() => {
    if (!accountDetails) return
    setAddFundsAmount({
      ...addFundsAmount,
      amount: accountDetails.data.free,
      formattedAmount: formatNumber(accountDetails.data.free)
    })
  }, [accountDetails, addFundsAmount, setAddFundsAmount])

  const handleMaxAmountToWithdraw = useCallback(() => {
    const operator = stakingConstants.operators[parseInt(withdrawAmount.operatorId)]
    const amount = operator ? parseInt(operator.currentTotalStake) : 0
    setWithdrawAmount({
      ...withdrawAmount,
      amount: amount.toString(),
      formattedAmount: formatNumber(amount / 10 ** DECIMALS)
    })
  }, [setWithdrawAmount, stakingConstants.operators, withdrawAmount])

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
    addFundsAmount,
    withdrawAmount,
    handleChangeOperatorId,
    handleChangeAmount,
    handleMaxAmountToAddFunds,
    handleMaxAmountToWithdraw,
    handleSubmit
  }
}
