import { ApiPromise } from '@polkadot/api'
import { WsProvider } from '@polkadot/rpc-provider'
import { useCallback } from 'react'
import { useExtension } from '../states/extension'
import {
  DomainRegistry,
  DomainRegistryDetail,
  DomainStakingSummary,
  OperatorDetail,
  Operators,
  PendingStakingOperationCount
} from '../types'

export const useOnchainData = () => {
  const setApi = useExtension((state) => state.setApi)
  const setStakingConstants = useExtension((state) => state.setStakingConstants)

  const handleOnchainData = useCallback(async () => {
    try {
      if (!process.env.NEXT_PUBLIC_PROVIDER_URL) throw new Error('NEXT_PUBLIC_PROVIDER_URL not set')

      const wsProvider = new WsProvider(process.env.NEXT_PUBLIC_PROVIDER_URL)
      const _api = await ApiPromise.create({ provider: wsProvider })
      if (_api) {
        setApi(_api)
        const { maxNominators, minOperatorStake, stakeEpochDuration, stakeWithdrawalLockingPeriod } =
          _api.consts.domains

        const domainRegistry = await _api.query.domains.domainRegistry.entries()
        const domainStakingSummary = await _api.query.domains.domainStakingSummary.entries()
        const operatorIdOwner = await _api.query.domains.operatorIdOwner.entries()
        const operators = await _api.query.domains.operators.entries()
        const pendingStakingOperationCount = await _api.query.domains.pendingStakingOperationCount.entries()

        setStakingConstants({
          maxNominators: Number(maxNominators.toString()),
          minOperatorStake: BigInt(minOperatorStake.toString()),
          stakeEpochDuration: Number(stakeEpochDuration.toString()),
          stakeWithdrawalLockingPeriod: Number(stakeWithdrawalLockingPeriod.toString()),
          domainRegistry: domainRegistry.map((domain) => {
            return {
              domainId: (domain[0].toHuman() as string[])[0],
              domainDetail: domain[1].toJSON() as DomainRegistryDetail
            } as DomainRegistry
          }),
          domainStakingSummary: domainStakingSummary.map((domain) => domain[1].toJSON() as DomainStakingSummary),
          operatorIdOwner: operatorIdOwner.map((operator) => operator[1].toJSON() as string),
          operators: operators.map((operator) => {
            return {
              operatorId: (operator[0].toHuman() as string[])[0],
              operatorDetail: operator[1].toJSON() as OperatorDetail
            } as Operators
          }),
          pendingStakingOperationCount: pendingStakingOperationCount.map(
            (operator) => operator[1].toJSON() as PendingStakingOperationCount
          )
        })
      }
    } catch (error) {
      console.error(error)
    }
  }, [setApi, setStakingConstants])

  return {
    handleOnchainData
  }
}
