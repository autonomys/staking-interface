import { useToast } from '@chakra-ui/react'
import type { SingleValue } from 'chakra-react-select'
import React, { useCallback, useMemo, useState } from 'react'
import { ActionType, ERROR_DESC_INFORMATION_INCORRECT, toastConfig } from '../constants'
import { useExtension } from '../states/extension'
import { ActionAmountInput, Option } from '../types'
import { capitalizeFirstLetter, formatAddress } from '../utils'
import { useTx } from './useTx'

export const useManage = () => {
  const toast = useToast()
  const accountDetails = useExtension((state) => state.accountDetails)
  const stakingConstants = useExtension((state) => state.stakingConstants)
  const [operatorId, setOperatorId] = useState<string>('')
  const [addFundsAmount, setAddFundsAmount] = useState<ActionAmountInput>({
    amount: ''
  })
  const [withdrawAmount, setWithdrawAmount] = useState<ActionAmountInput>({
    amount: ''
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

  const handleChangeOperatorId = useCallback((operatorSelected: SingleValue<Option<number>>) => {
    const operatorId = operatorSelected != null ? operatorSelected.value.toString() : ''
    setOperatorId(operatorId)
  }, [])

  const handleChangeAmount = useCallback((actionType: ActionType, e: React.ChangeEvent<HTMLInputElement>) => {
    switch (actionType) {
      case ActionType.AddFunds: {
        setAddFundsAmount({ amount: e.target.value })
        break
      }
      case ActionType.Withdraw:
        setWithdrawAmount({ amount: e.target.value })
        break
    }
  }, [])

  const handleMaxAmountToAddFunds = useCallback(() => {
    if (!accountDetails) return
    setAddFundsAmount({ amount: accountDetails.data.free })
  }, [accountDetails])

  const handleSubmit = useCallback(
    async (actionType: ActionType) => {
      try {
        switch (actionType) {
          case ActionType.Deregister:
            return await handleDeregister(operatorId)
          case ActionType.AddFunds:
            return await handleAddFunds(operatorId, addFundsAmount.amount)
          case ActionType.Withdraw:
            return await handleWithdraw(operatorId, withdrawAmount.amount)
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
    [addFundsAmount.amount, handleAddFunds, handleDeregister, handleWithdraw, operatorId, toast, withdrawAmount.amount]
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
