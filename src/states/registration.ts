import { create } from 'zustand'
import { initialRegistrationValues } from '../constants'
import { ErrorsField, Registration } from '../types'

interface RegistrationState {
  currentRegistration: Registration
  isErrorsField: ErrorsField
  saveCurrentRegistration: (registration: Registration) => void
  clearCurrentRegistration: () => void
  setErrorsField: (errorsField: string, isError: boolean) => void
}

export const useRegistration = create<RegistrationState>((set) => ({
  currentRegistration: initialRegistrationValues,
  isErrorsField: {},
  saveCurrentRegistration: (currentRegistration) => set(() => ({ currentRegistration })),
  clearCurrentRegistration: () => set(() => ({ currentRegistration: initialRegistrationValues })),
  setErrorsField: (errorsField, isError) => {
    set((state) => ({ isErrorsField: { ...state.isErrorsField, [errorsField]: isError } }))
    set(() => ({ isErrorsField: {} }))
  }
}))
