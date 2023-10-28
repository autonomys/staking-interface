import { ExtensionState, NetworkConstants, Registration } from '../types'
export * from './errors'

export const ROUTES = {
  HOME: '/',
  REGISTER: '/register',
  MANAGE: '/manage'
}

export const EXTERNAL_ROUTES = {
  OPERATORS_DOCS: 'https://docs.subspace.network/docs/operators_and_staking/operators',
  STAKING_INCENTIVES: 'https://docs.subspace.network/docs/operators_and_staking/intro#staking',
  STAKING_INFORMATION: 'https://docs.subspace.network/docs/operators_and_staking/staking'
}

export const PROVIDER_URL = 'wss://rpc-0.devnet.subspace.network/ws'

export enum ActionType {
  Deregister = 'deregister',
  AddFund = 'addFund',
  Withdraw = 'withdraw'
}

export const initialRegistrationValues: Registration = {
  domainId: '',
  minimumNominatorStake: '',
  amountToStake: '',
  nominatorTax: 0,
  signingKey: ''
}

export const initialExtensionValues: ExtensionState = {
  loading: false,
  data: undefined,
  error: null
}

export const initialNetworkConstants: NetworkConstants = {
  maxNominators: 0,
  minOperatorStake: BigInt(0),
  stakeEpochDuration: 0,
  stakeWithdrawalLockingPeriod: 0
}

export const toastConfig = {
  duration: 9000,
  isClosable: true
}
