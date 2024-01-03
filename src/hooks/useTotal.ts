import { useMemo } from 'react'
import { useExtension } from '../states/extension'
import { calculateSharedToStake, hexToNumber } from '../utils'

export const useTotal = (operatorOwner?: string) => {
  const {
    stakingConstants,
    chainDetails: { tokenDecimals }
  } = useExtension()

  const operatorOwnerId = useMemo(
    () =>
      operatorOwner &&
      stakingConstants.operators
        .filter((operator) => operator.operatorOwner === operatorOwner)
        .map((operator) => operator.operatorId),
    [operatorOwner, stakingConstants.operators]
  )

  const totalPendingDeposits = useMemo(() => {
    if (!stakingConstants.pendingDeposits || stakingConstants.pendingDeposits.length === 0) return 0
    if (operatorOwner)
      return stakingConstants.pendingDeposits
        .filter((deposit) => deposit.operatorOwner === operatorOwner)
        .reduce((acc, deposit) => acc + parseInt(deposit.amount) / 10 ** tokenDecimals, 0)
    return stakingConstants.pendingDeposits.reduce(
      (acc, deposit) => acc + parseInt(deposit.amount) / 10 ** tokenDecimals,
      0
    )
  }, [operatorOwner, stakingConstants.pendingDeposits, tokenDecimals])

  const totalFundsInStake = useMemo(() => {
    if (operatorOwner)
      return (
        stakingConstants.operators
          .filter((operator) => operator.operatorOwner === operatorOwner)
          .reduce((acc, operator) => acc + hexToNumber(operator.operatorDetail.currentTotalStake), 0) +
        totalPendingDeposits
      )
    return (
      stakingConstants.operators.reduce(
        (acc, operator) => acc + hexToNumber(operator.operatorDetail.currentTotalStake),
        0
      ) + totalPendingDeposits
    )
  }, [operatorOwner, stakingConstants.operators, totalPendingDeposits])

  const totalFundsInStakeAvailable = useMemo(() => {
    const minOperatorStake = Number(BigInt(stakingConstants.minOperatorStake) / BigInt(10 ** tokenDecimals))
    if (operatorOwner)
      return stakingConstants.operators
        .filter((operator) => operator.operatorOwner === operatorOwner)
        .reduce((acc, operator) => {
          const amount = hexToNumber(operator.operatorDetail.currentTotalStake, tokenDecimals)
          if (amount <= minOperatorStake) return acc
          return acc + amount - minOperatorStake
        }, 0)
    return stakingConstants.operators.reduce((acc, operator) => {
      const amount = hexToNumber(operator.operatorDetail.currentTotalStake, tokenDecimals)
      if (amount <= minOperatorStake) return acc
      return acc + amount - minOperatorStake
    }, 0)
  }, [operatorOwner, stakingConstants.minOperatorStake, stakingConstants.operators, tokenDecimals])

  const totalOperators = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.operators
        .filter((operator) => operator.operatorOwner === operatorOwner)
        .reduce((acc) => acc + 1, 0)
    return stakingConstants.operators.reduce((acc) => acc + 1, 0)
  }, [operatorOwner, stakingConstants.operators])

  const totalOperatorsStake = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.operators
        .filter((operator) => operator.operatorOwner === operatorOwner)
        .reduce(
          (acc, operator) =>
            acc +
            calculateSharedToStake(
              stakingConstants.nominators.find((nominator) => nominator.nominatorOwner === operator.operatorOwner)
                ?.shares ?? '0x0',
              operator.operatorDetail.totalShares ?? '0x0',
              operator.operatorDetail.currentTotalStake ?? '0x0'
            ),
          0
        )

    return stakingConstants.operators.reduce((acc, operator) => {
      const find = stakingConstants.nominators.find((nominator) => nominator.nominatorOwner === operator.operatorOwner)
      const total = calculateSharedToStake(
        find?.shares ?? '0x0',
        operator.operatorDetail.totalShares ?? '0x0',
        operator.operatorDetail.currentTotalStake ?? '0x0'
      )
      if (find) return acc + total
      return acc
    }, 0)
  }, [operatorOwner, stakingConstants.nominators, stakingConstants.operators])

  const totalNominators = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.nominators
        .filter(
          (nominator) =>
            nominator.nominatorOwner !== operatorOwner &&
            operatorOwnerId &&
            operatorOwnerId.includes(nominator.operatorId)
        )
        .reduce((acc) => acc + 1, 0)
    return stakingConstants.nominators.reduce((acc, nominator) => {
      const operator = stakingConstants.operators.find((operator) => operator.operatorId === nominator.operatorId)
      if (operator && nominator.nominatorOwner !== operator.operatorOwner) return acc + 1
      return acc
    }, 0)
  }, [operatorOwner, operatorOwnerId, stakingConstants.nominators, stakingConstants.operators])

  const totalNominatorsStake = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.operators
        .filter((operator) => operator.operatorOwner === operatorOwner)
        .reduce(
          (acc, operator) =>
            acc +
            calculateSharedToStake(
              operator.operatorDetail.totalShares,
              operator.operatorDetail.totalShares ?? '0x0',
              operator.operatorDetail.currentTotalStake ?? '0x0'
            ) -
            calculateSharedToStake(
              stakingConstants.nominators.find((nominator) => nominator.nominatorOwner === operator.operatorOwner)
                ?.shares ?? '0x0',
              operator.operatorDetail.totalShares ?? '0x0',
              operator.operatorDetail.currentTotalStake ?? '0x0'
            ),
          0
        )

    return stakingConstants.operators.reduce((acc, operator) => {
      const total = calculateSharedToStake(
        operator.operatorDetail.totalShares,
        operator.operatorDetail.totalShares ?? '0x0',
        operator.operatorDetail.currentTotalStake ?? '0x0'
      )
      const find = stakingConstants.nominators.find((nominator) => nominator.nominatorOwner === operator.operatorOwner)
      const operatorStake = calculateSharedToStake(
        find?.shares ?? '0x0',
        operator.operatorDetail.totalShares ?? '0x0',
        operator.operatorDetail.currentTotalStake ?? '0x0'
      )
      if (find) return acc + total - operatorStake
      return acc
    }, 0)
  }, [operatorOwner, stakingConstants.nominators, stakingConstants.operators])

  return {
    totalFundsInStake,
    totalFundsInStakeAvailable,
    totalOperators,
    totalOperatorsStake,
    totalNominators,
    totalNominatorsStake
  }
}
