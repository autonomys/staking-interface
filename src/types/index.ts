import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import type { OptionBase } from 'chakra-react-select'

export type ExtensionState = {
  loading: boolean
  data?: {
    accounts: InjectedAccountWithMeta[]
    defaultAccount: InjectedAccountWithMeta
  }
  error: null | Error
}

export type AccountDetails = {
  nonce: number
  consumers: number
  providers: number
  sufficients: number
  data: {
    free: string
    reserved: string
    frozen: string
    flags: string
  }
}

export type StakingConstants = {
  maxNominators: number
  minOperatorStake: bigint
  stakeEpochDuration: number
  stakeWithdrawalLockingPeriod: number
  domainRegistry: DomainRegistry[]
  domainStakingSummary: DomainStakingSummary[]
  operatorIdOwner: string[]
  operators: Operators[]
  pendingStakingOperationCount: PendingStakingOperationCount[]
}

export type DomainRegistry = {
  ownerAccountId: string
  createdAt: number
  genesisReceiptHash: string
  domainConfig: {
    domainName: string
    runtimeId: number
    maxBlockSize: number
    maxBlockWeight: {
      refTime: number
      proofSize: string
    }
    bundleSlotProbability: number[]
    targetBundlesPerBlock: number
    operatorAllowList: {
      operators: string[]
    }
  }
}

export type DomainStakingSummary = {
  currentEpochIndex: number
  currentTotalStake: string
  currentOperators: {
    [key: string]: string
  }
  nextOperators: string[]
  currentEpochRewards: {
    [key: string]: string
  }
}

export type OperatorDetail = {
  signingKey: string
  currentDomainId: number
  nextDomainId: number
  minimumNominatorStake: string
  nominationTax: number
  currentTotalStake: string
  currentEpochRewards: number
  totalShares: number
  status: string
}

export type Operators = {
  operatorId: string
  operatorDetail: OperatorDetail
}

export type PendingStakingOperationCount = {
  [key: string]: number
}

export type Registration = {
  domainId: string
  minimumNominatorStake: string
  amountToStake: string
  nominatorTax: number
  signingKey: string
}

export interface Option<T> extends OptionBase {
  label: string
  value: T
}

export type ErrorsField = {
  [key: string]: boolean
}

export type ActionInput = {
  operatorId: string
  amount: string
  formattedAmount: string
}

export type Error = {
  title: string
  description: string
}
