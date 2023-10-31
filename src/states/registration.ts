import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { initialRegistrationValues } from '../constants'
import { ErrorsField, Registration } from '../types'

interface RegistrationState {
  registrations: Registration[]
  currentRegistration: Registration
  isErrorsField: ErrorsField
  saveCurrentRegistration: (registration: Registration) => void
  addRegistration: (registration: Registration) => void
  setErrorsField: (errorsField: string, isError: boolean) => void
}

export const useRegistration = create<RegistrationState>()(
  persist(
    (set) => ({
      registrations: [],
      currentRegistration: initialRegistrationValues,
      isErrorsField: {},
      saveCurrentRegistration: (currentRegistration) => set(() => ({ currentRegistration })),
      addRegistration: (registration) => set((states) => ({ registrations: [...states.registrations, registration] })),
      setErrorsField: (errorsField, isError) =>
        set((state) => ({ isErrorsField: { ...state.isErrorsField, [errorsField]: isError } }))
    }),
    {
      name: 'registration',
      version: 1
    }
  )
)
