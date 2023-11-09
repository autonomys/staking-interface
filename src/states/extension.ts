import { ApiPromise } from '@polkadot/api'
import { InjectedExtension } from '@polkadot/extension-inject/types'
import { create } from 'zustand'
import { initialExtensionValues, initialStakingConstants } from '../constants'
import { AccountDetails, ExtensionState, StakingConstants } from '../types'

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
