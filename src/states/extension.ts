import { ApiPromise } from '@polkadot/api'
import { InjectedExtension } from '@polkadot/extension-inject/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { initialExtensionValues, initialStakingConstants, TransactionStatus } from '../constants'
import { AccountDetails, ExtensionState, NewTransaction, StakingConstants, Transaction } from '../types'

interface RegistrationState {
  api: ApiPromise | undefined
  extension: ExtensionState
  subspaceAccount: string | undefined
  injectedExtension: InjectedExtension | undefined
  accountDetails: AccountDetails | undefined
  stakingConstants: StakingConstants
  setApi: (api: ApiPromise) => void
  setExtension: (registration: ExtensionState) => void
  setSubspaceAccount: (subspaceAccount: string) => void
  setInjectedExtension: (injectedExtension: InjectedExtension) => void
  setAccountDetails: (accountDetails: AccountDetails) => void
  setStakingConstants: (networkConstants: StakingConstants) => void
}

interface LastConnection {
  subspaceAccount: string | undefined
  setSubspaceAccount: (subspaceAccount: string | undefined) => void
}

interface TransactionsState {
  transactions: Transaction[]
  addTransactionToWatch: (newTransaction: NewTransaction) => void
  changeTransactionStatus: (extrinsicHash: string, status: TransactionStatus) => void
}

export const useExtension = create<RegistrationState>((set) => ({
  api: undefined,
  extension: initialExtensionValues,
  subspaceAccount: undefined,
  injectedExtension: undefined,
  accountDetails: undefined,
  stakingConstants: initialStakingConstants,
  setApi: (api) => set(() => ({ api })),
  setExtension: (extension) => set(() => ({ extension })),
  setSubspaceAccount: (subspaceAccount) => set(() => ({ subspaceAccount })),
  setInjectedExtension: (injectedExtension) => set(() => ({ injectedExtension })),
  setAccountDetails: (accountDetails) => set(() => ({ accountDetails })),
  setStakingConstants: (stakingConstants) => set(() => ({ stakingConstants }))
}))

export const useLastConnection = create<LastConnection>()(
  persist(
    (set) => ({
      subspaceAccount: undefined,
      setSubspaceAccount: (subspaceAccount) => set(() => ({ subspaceAccount }))
    }),
    {
      name: 'lastConnection',
      version: 1
    }
  )
)

export const useTransactions = create<TransactionsState>()(
  persist(
    (set) => ({
      transactions: [],
      addTransactionToWatch: (newTransaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            {
              ...newTransaction,
              status: TransactionStatus.Pending
            }
          ]
        })),
      changeTransactionStatus: (extrinsicHash, status) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.extrinsicHash === extrinsicHash ? { ...transaction, status } : transaction
          )
        }))
    }),
    {
      name: 'transactions',
      version: 1
    }
  )
)
