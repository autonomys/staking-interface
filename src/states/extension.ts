import { ApiPromise } from '@polkadot/api'
import { InjectedExtension } from '@polkadot/extension-inject/types'
import { create } from 'zustand'
import { initialExtensionValues, initialNetworkConstants } from '../constants'
import { ExtensionState, NetworkConstants } from '../types'

interface RegistrationState {
  api: ApiPromise | undefined
  extension: ExtensionState
  injectedExtension: InjectedExtension | undefined
  networkConstants: NetworkConstants
  setApi: (api: ApiPromise) => void
  setExtension: (registration: ExtensionState) => void
  setInjectedExtension: (injectedExtension: InjectedExtension) => void
  setNetworkConstants: (networkConstants: NetworkConstants) => void
}

export const useExtension = create<RegistrationState>((set) => ({
  api: undefined,
  extension: initialExtensionValues,
  injectedExtension: undefined,
  networkConstants: initialNetworkConstants,
  setApi: (api) => set(() => ({ api })),
  setExtension: (extension) => set(() => ({ extension })),
  setInjectedExtension: (injectedExtension) => set(() => ({ injectedExtension })),
  setNetworkConstants: (networkConstants) => set(() => ({ networkConstants }))
}))
