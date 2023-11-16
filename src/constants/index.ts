import { ExtensionState, Registration, StakingConstants } from '../types'
export * from './errors'
export * from './styles'

export const ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  MANAGE: '/manage',
  STATS: '/stats',
  OPERATOR_STATS: '/operatorStats'
}

export const EXTERNAL_ROUTES = {
  OPERATORS_DOCS: 'https://docs.subspace.network/docs/Farming%20&%20Staking/Staking/operators',
  STAKING_INCENTIVES: 'https://docs.subspace.network/docs/Farming%20&%20Staking/Staking/intro',
  STAKING_INFORMATION: 'https://docs.subspace.network/docs/Farming%20&%20Staking/Staking/',
  RISK: 'https://docs.subspace.network/docs/security'
}

export const SUBSPACE_EXTENSION_ID = 'subspace-staking-interface'

export const SUBSPACE_ACCOUNT_FORMAT = 2254

export const SYMBOL = 'tSSC'

export const DECIMALS = 18

export enum ActionType {
  Deregister = 'deregister',
  AddFunds = 'addFunds',
  Withdraw = 'withdraw'
}

export const initialRegistrationValues: Registration = {
  domainId: '',
  minimumNominatorStake: '',
  formattedMinimumNominatorStake: '',
  amountToStake: '',
  formattedAmountToStake: '',
  nominatorTax: 0,
  signingKey: ''
}

export const initialActionInput = {
  operatorId: '',
  amount: '',
  formattedAmount: ''
}

export const initialExtensionValues: ExtensionState = {
  loading: false,
  data: undefined,
  error: null
}

export const initialStakingConstants: StakingConstants = {
  maxNominators: 0,
  minOperatorStake: BigInt(0),
  stakeEpochDuration: 0,
  stakeWithdrawalLockingPeriod: 0,
  domainRegistry: [],
  domainStakingSummary: [],
  operatorIdOwner: [],
  operators: [],
  pendingStakingOperationCount: []
}

export const toastConfig = {
  duration: 9000,
  isClosable: true
}
