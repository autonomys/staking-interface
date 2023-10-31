import { Error } from '../types'

export const ERROR_DESC_INFORMATION_INCORRECT = `Please make sure the information you provided is correct and try again.`

export const ERROR_WALLET_NOT_FOUND: Error = {
  title: 'Error: Wallet provider not found',
  description: `Please ensure you have installed and set up the Polkadot{.js} extension or another wallet provider. Additionally, make sure that you have connected your wallet to the app.`
}

export const ERROR_REGISTRATION_FAILED: Error = {
  title: 'Error: Registration failed',
  description: ERROR_DESC_INFORMATION_INCORRECT
}
