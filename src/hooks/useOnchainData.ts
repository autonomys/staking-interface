import { ApiPromise } from '@polkadot/api'
import { WsProvider } from '@polkadot/rpc-provider'
import { useCallback, useMemo } from 'react'
import { useExtension } from '../states/extension'
import {
  DomainRegistry,
  DomainRegistryDetail,
  DomainStakingSummary,
  OperatorDetail,
  Operators,
  PendingDeposit,
  PendingStakingOperationCount
} from '../types'

export const useOnchainData = () => {
  const setApi = useExtension((state) => state.setApi)
  const setStakingConstants = useExtension((state) => state.setStakingConstants)

  const domainIdFiltering = useMemo(() => parseInt(process.env.NEXT_PUBLIC_DOMAIN_ID || '0'), [])

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
        const pendingDeposits = await _api.query.domains.pendingDeposits.entries()
        const pendingOperatorDeregistrations = await _api.query.domains.pendingOperatorDeregistrations.entries()
        const pendingOperatorSwitches = await _api.query.domains.pendingOperatorSwitches.entries()
        // const pendingOperatorUnlocks = await _api.query.domains.pendingOperatorUnlocks.entries()
        // console.log('pendingOperatorUnlocks', pendingOperatorUnlocks)
        const pendingSlashes = await _api.query.domains.pendingSlashes.entries()
        const pendingUnlocks = await _api.query.domains.pendingUnlocks.entries()
        const pendingWithdrawals = await _api.query.domains.pendingWithdrawals.entries()
        console.log(
          'pendingStakingOperationCount',
          pendingStakingOperationCount.map((operator) => {
            return {
              [0]: operator[0].toHuman(),
              [1]: operator[1].toJSON()
            }
          })
        )
        console.log(
          'pendingDeposits',
          pendingDeposits.map((operator) => {
            return {
              [0]: operator[0].toHuman(),
              [1]: operator[1].toHuman()
            }
          })
        )
        console.log('pendingOperatorDeregistrations', pendingOperatorDeregistrations)
        console.log('pendingOperatorSwitches', pendingOperatorSwitches)
        console.log(
          'pendingSlashes',
          pendingSlashes.map((operator) => {
            return {
              [0]: operator[0].toHuman(),
              [1]: operator[1].toJSON()
            }
          })
        )
        console.log(
          'pendingUnlocks',
          pendingUnlocks.map((operator) => {
            return {
              [0]: operator[0].toHuman(),
              [1]: operator[1].toJSON()
            }
          })
        )

        console.log(
          'pendingWithdrawals',
          pendingWithdrawals.map((operator) => {
            return {
              [0]: operator[0].toHuman(),
              [1]: operator[1].toHuman()
            }
          })
        )

        setStakingConstants({
          maxNominators: Number(maxNominators.toString()),
          minOperatorStake: BigInt(minOperatorStake.toString()),
          stakeEpochDuration: Number(stakeEpochDuration.toString()),
          stakeWithdrawalLockingPeriod: Number(stakeWithdrawalLockingPeriod.toString()),
          domainRegistry: domainRegistry
            .map((domain) => {
              return {
                domainId: (domain[0].toHuman() as string[])[0],
                domainDetail: domain[1].toJSON() as DomainRegistryDetail
              } as DomainRegistry
            })
            .filter((domain) => domain.domainId === domainIdFiltering.toString()),
          domainStakingSummary: domainStakingSummary.map((domain) => domain[1].toJSON() as DomainStakingSummary),
          operators: operators
            .map((operator, key) => {
              return {
                operatorId: (operator[0].toHuman() as string[])[0],
                operatorOwner: operatorIdOwner[key][1].toJSON() as string,
                operatorDetail: operator[1].toJSON() as OperatorDetail
              } as Operators
            })
            .filter((operator) => operator.operatorDetail.currentDomainId === domainIdFiltering),
          pendingStakingOperationCount: pendingStakingOperationCount.map(
            (operator) => operator[1].toJSON() as PendingStakingOperationCount
          ),
          pendingDeposits: pendingDeposits.map((operator) => {
            const details = operator[0].toHuman() as string[]
            return {
              operatorId: details[0],
              operatorOwner: details[1],
              amount: operator[1].toJSON()
            } as PendingDeposit
          })
        })
      }
    } catch (error) {
      console.error(error)
    }
  }, [domainIdFiltering, setApi, setStakingConstants])

  return {
    handleOnchainData
  }
}
