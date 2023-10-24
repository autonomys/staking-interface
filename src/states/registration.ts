import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Registration = {
  domainId: string
  minimumNominatorStake: string
  amountToStake: string
  nominatorTax: number
  signingKey: string
}

export type ErrorsField = {
  [key: string]: boolean
}

export const initialRegistrationValues: Registration = {
  domainId: '',
  minimumNominatorStake: '',
  amountToStake: '',
  nominatorTax: 0,
  signingKey: ''
}

interface RegistrationState {
  registration: Registration
  isErrorsField: ErrorsField
  saveRegistration: (registration: Registration) => void
  setErrorsField: (errorsField: string, isError: boolean) => void
}

export const useRegistration = create<RegistrationState>()(
  persist(
    (set) => ({
      registration: initialRegistrationValues,
      isErrorsField: {},
      saveRegistration: (registration) => set(() => ({ registration })),
      setErrorsField: (errorsField, isError) =>
        set((state) => ({ isErrorsField: { ...state.isErrorsField, [errorsField]: isError } }))
    }),
    {
      name: 'registration',
      version: 1
    }
  )
)
