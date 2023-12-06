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
  const { setApi, setChainDetails, setStakingConstants } = useExtension((state) => state)

  const domainIdFiltering = useMemo(() => parseInt(process.env.NEXT_PUBLIC_DOMAIN_ID || '0'), [])

  const handleOnchainData = useCallback(async () => {
    try {
      if (!process.env.NEXT_PUBLIC_PROVIDER_URL) throw new Error('NEXT_PUBLIC_PROVIDER_URL not set')

      const wsProvider = new WsProvider(process.env.NEXT_PUBLIC_PROVIDER_URL)
      const api = await ApiPromise.create({ provider: wsProvider })
      if (api) {
        setApi(api)

        const [
          domains,
          chain,
          name,
          properties,
          domainRegistry,
          domainStakingSummary,
          operatorIdOwner,
          operators,
          pendingStakingOperationCount,
          pendingDeposits
        ] = await Promise.all([
          api.consts.domains,
          api.rpc.system.chain(),
          api.rpc.system.name(),
          api.rpc.system.properties(),
          api.query.domains.domainRegistry.entries(),
          api.query.domains.domainStakingSummary.entries(),
          api.query.domains.operatorIdOwner.entries(),
          api.query.domains.operators.entries(),
          api.query.domains.pendingStakingOperationCount.entries(),
          api.query.domains.pendingDeposits.entries()
        ])
        const { maxNominators, minOperatorStake, stakeEpochDuration, stakeWithdrawalLockingPeriod } = domains

        setChainDetails({
          chain: chain.toJSON(),
          name: name.toJSON(),
          tokenDecimals: (properties.tokenDecimals.toJSON() as number[])[0],
          tokenSymbol: (properties.tokenSymbol.toJSON() as string[])[0],
          ss58Format: properties.ss58Format.toJSON() as number
        })
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
  }, [domainIdFiltering, setApi, setChainDetails, setStakingConstants])

  return {
    handleOnchainData
  }
}
