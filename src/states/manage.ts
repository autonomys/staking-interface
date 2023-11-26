import { create } from 'zustand'
import { ActionType, initialActionInput } from '../constants'
import { ActionInput } from '../types'

interface ManageState {
  deregister: string
  addFundsAmount: ActionInput
  withdrawAmount: ActionInput
  setDeregister: (deregister: string) => void
  setAddFundsOperator: (operatorId: string) => void
  setWithdrawOperator: (operatorId: string) => void
  setAddFundsAmount: (amount: Omit<ActionInput, 'operatorId'>) => void
  setWithdrawAmount: (amount: Omit<ActionInput, 'operatorId'>) => void
  clearInput: (actionType: ActionType) => void
}

export const useManageState = create<ManageState>((set) => ({
  deregister: '',
  addFundsAmount: initialActionInput,
  withdrawAmount: initialActionInput,
  setDeregister: (deregister) => set(() => ({ deregister })),
  setAddFundsOperator: (operatorId) => set((states) => ({ addFundsAmount: { ...states.addFundsAmount, operatorId } })),
  setWithdrawOperator: (operatorId) => set((states) => ({ withdrawAmount: { ...states.withdrawAmount, operatorId } })),
  setAddFundsAmount: (amount) => set((states) => ({ addFundsAmount: { ...states.addFundsAmount, ...amount } })),
  setWithdrawAmount: (amount) => set((states) => ({ withdrawAmount: { ...states.withdrawAmount, ...amount } })),
  clearInput: (actionType: ActionType) =>
    set(() => {
      switch (actionType) {
        case ActionType.Deregister:
          return { deregister: '' }
        case ActionType.AddFunds:
          return { addFundsAmount: initialActionInput }
        case ActionType.Withdraw:
          return { withdrawAmount: initialActionInput }
      }
    })
}))
