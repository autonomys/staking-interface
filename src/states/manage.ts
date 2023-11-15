import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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
}

const initialActionInput = {
  operatorId: '',
  amount: '',
  formattedAmount: ''
}

export const useManageState = create<ManageState>()(
  persist(
    (set) => ({
      deregister: '',
      addFundsAmount: initialActionInput,
      withdrawAmount: initialActionInput,
      setDeregister: (deregister) => set(() => ({ deregister })),
      setAddFundsOperator: (operatorId) =>
        set((states) => ({ addFundsAmount: { ...states.addFundsAmount, operatorId } })),
      setWithdrawOperator: (operatorId) =>
        set((states) => ({ withdrawAmount: { ...states.withdrawAmount, operatorId } })),
      setAddFundsAmount: (amount) => set((states) => ({ addFundsAmount: { ...states.addFundsAmount, ...amount } })),
      setWithdrawAmount: (amount) => set((states) => ({ withdrawAmount: { ...states.withdrawAmount, ...amount } }))
    }),
    {
      name: 'manage',
      version: 1
    }
  )
)
