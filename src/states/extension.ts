import { ApiPromise } from '@polkadot/api'
import { InjectedExtension } from '@polkadot/extension-inject/types'
import { create } from 'zustand'
import { initialExtensionValues, initialStakingConstants } from '../constants'
import { ExtensionState, StakingConstants } from '../types'

interface RegistrationState {
  api: ApiPromise | undefined
  extension: ExtensionState
  injectedExtension: InjectedExtension | undefined
  stakingConstants: StakingConstants
  setApi: (api: ApiPromise) => void
  setExtension: (registration: ExtensionState) => void
  setInjectedExtension: (injectedExtension: InjectedExtension) => void
  setStakingConstants: (networkConstants: StakingConstants) => void
}

export const useExtension = create<RegistrationState>((set) => ({
  api: undefined,
  extension: initialExtensionValues,
  injectedExtension: undefined,
  stakingConstants: initialStakingConstants,
  setApi: (api) => set(() => ({ api })),
  setExtension: (extension) => set(() => ({ extension })),
  setInjectedExtension: (injectedExtension) => set(() => ({ injectedExtension })),
  setStakingConstants: (stakingConstants) => set(() => ({ stakingConstants }))
}))
