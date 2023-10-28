import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'

export type ExtensionState = {
  loading: boolean
  data?: {
    accounts: InjectedAccountWithMeta[]
    defaultAccount: InjectedAccountWithMeta
  }
  error: null | Error
}

export type NetworkConstants = {
  maxNominators: number
  minOperatorStake: bigint
  stakeEpochDuration: number
  stakeWithdrawalLockingPeriod: number
}

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

export type ActionInput = {
  operatorId: string
  amount: string
}
