import { ApiPromise } from '@polkadot/api'
import { WsProvider } from '@polkadot/rpc-provider'
import { useCallback } from 'react'
import { useExtension } from '../states/extension'
import { DomainRegistry, DomainStakingSummary, Operators, PendingStakingOperationCount } from '../types'

export const useOnchainData = () => {
  const setApi = useExtension((state) => state.setApi)
  const setStakingConstants = useExtension((state) => state.setStakingConstants)

  const handleOnchainData = useCallback(async () => {
    try {
      if (!process.env.NEXT_PUBLIC_PROVIDER_URL) throw new Error('NEXT_PUBLIC_PROVIDER_URL not set')

      const wsProvider = new WsProvider(process.env.NEXT_PUBLIC_PROVIDER_URL)
      const _api = await ApiPromise.create({ provider: wsProvider })
      if (_api) {
        console.log('Connection Success')
        setApi(_api)
        const { maxNominators, minOperatorStake, stakeEpochDuration, stakeWithdrawalLockingPeriod } =
          _api.consts.domains
        console.log('stakimg', _api.consts.domains)

        const domainRegistry = await _api.query.domains.domainRegistry.entries()
        console.log(
          'domainRegistry',
          domainRegistry.map((domain) => domain[1].toJSON() as DomainRegistry)
        )

        const domainStakingSummary = await _api.query.domains.domainStakingSummary.entries()
        console.log(
          'domainStakingSummary',
          domainStakingSummary.map((domain) => domain[1].toJSON() as DomainStakingSummary)
        )

        const operatorIdOwner = await _api.query.domains.operatorIdOwner.entries()
        console.log(
          'operatorIdOwner',
          operatorIdOwner.map((operator) => operator[1].toJSON() as string)
        )

        const operators = await _api.query.domains.operators.entries()
        console.log(
          'operators',
          operators.map((operator) => operator[1].toJSON() as Operators)
        )

        const pendingStakingOperationCount = await _api.query.domains.pendingStakingOperationCount.entries()
        console.log(
          'pendingStakingOperationCount',
          pendingStakingOperationCount.map((operator) => operator[1].toJSON() as PendingStakingOperationCount)
        )

        setStakingConstants({
          maxNominators: Number(maxNominators.toString()),
          minOperatorStake: BigInt(minOperatorStake.toString()),
          stakeEpochDuration: Number(stakeEpochDuration.toString()),
          stakeWithdrawalLockingPeriod: Number(stakeWithdrawalLockingPeriod.toString()),
          domainRegistry: domainRegistry.map((domain) => domain[1].toJSON() as DomainRegistry),
          domainStakingSummary: domainStakingSummary.map((domain) => domain[1].toJSON() as DomainStakingSummary),
          operatorIdOwner: operatorIdOwner.map((operator) => operator[1].toJSON() as string),
          operators: operators.map((operator) => operator[1].toJSON() as Operators),
          pendingStakingOperationCount: pendingStakingOperationCount.map(
            (operator) => operator[1].toJSON() as PendingStakingOperationCount
          )
        })
      }
    } catch (error) {
      console.log(error)
    }
  }, [setApi, setStakingConstants])

  return {
    handleOnchainData
  }
}
