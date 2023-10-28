import { Error } from '../types'

export const ERROR_DESC_INFORMATION_INCORRECT = `Please make sure the information you provided is correct and try again.`

export const ERROR_WALLET_NOT_FOUND: Error = {
  title: 'Error: Wallet provider not found',
  description: `Please make sure you have the Polkadot{.js} extension installed and setup or an other wallet provider and that you connected your wallet to the app.`
}

export const ERROR_REGISTRATION_FAILED: Error = {
  title: 'Error: Registration failed',
  description: ERROR_DESC_INFORMATION_INCORRECT
}
