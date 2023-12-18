import { useMemo } from 'react'
import { ViewOrderBy, ViewOrderDirection } from '../constants'
import { useExtension } from '../states/extension'
import { useView } from '../states/view'
import { hexToNumber } from '../utils'

interface OperatorsListProps {
  operatorOwner?: string
  fromManage?: boolean
}

export const useOrderedOperators = ({ operatorOwner, fromManage }: OperatorsListProps) => {
  const { stakingConstants } = useExtension()
  const { operatorsOrderBy, operatorsOrderByDirection } = useView()

  const operators = useMemo(() => {
    if (operatorOwner) return stakingConstants.operators.filter((operator) => operator.operatorOwner === operatorOwner)
    return stakingConstants.operators
  }, [operatorOwner, stakingConstants.operators])

  const nominatorsOperators = useMemo(() => {
    if (fromManage) {
      const nominators = stakingConstants.nominators.filter((operator) => operator.nominatorOwner === operatorOwner)
      return stakingConstants.operators.filter((operator) =>
        nominators.find((nominator) => nominator.operatorId === operator.operatorId)
      )
    }
  }, [fromManage, stakingConstants.nominators, stakingConstants.operators, operatorOwner])

  const operatorsList = useMemo(() => {
    const allOperators = fromManage && nominatorsOperators ? [...operators, ...nominatorsOperators] : operators
    return allOperators.filter((operator, index) => allOperators.indexOf(operator) == index)
  }, [fromManage, nominatorsOperators, operators])

  const orderedOperators = useMemo(() => {
    switch (operatorsOrderBy) {
      case ViewOrderBy.NominatorTax:
        return operatorsList.sort((a, b) =>
          operatorsOrderByDirection === ViewOrderDirection.Ascending
            ? a.operatorDetail.nominationTax - b.operatorDetail.nominationTax
            : b.operatorDetail.nominationTax - a.operatorDetail.nominationTax
        )
      case ViewOrderBy.NominatorCount:
        return operatorsList.sort((a, b) => {
          const nominatorsCountA =
            stakingConstants.nominators.filter((nominator) => nominator.operatorId === a.operatorId).length - 1
          const nominatorsCountB =
            stakingConstants.nominators.filter((nominator) => nominator.operatorId === b.operatorId).length - 1
          return operatorsOrderByDirection === ViewOrderDirection.Ascending
            ? nominatorsCountA - nominatorsCountB
            : nominatorsCountB - nominatorsCountA
        })
      case ViewOrderBy.MinimumNominatorStake:
        return operatorsList.sort((a, b) =>
          operatorsOrderByDirection === ViewOrderDirection.Ascending
            ? hexToNumber(a.operatorDetail.minimumNominatorStake) - hexToNumber(b.operatorDetail.minimumNominatorStake)
            : hexToNumber(b.operatorDetail.minimumNominatorStake) - hexToNumber(a.operatorDetail.minimumNominatorStake)
        )
      case ViewOrderBy.TotalStake:
        return operatorsList.sort((a, b) =>
          operatorsOrderByDirection === ViewOrderDirection.Ascending
            ? hexToNumber(a.operatorDetail.currentTotalStake) - hexToNumber(b.operatorDetail.currentTotalStake)
            : hexToNumber(b.operatorDetail.currentTotalStake) - hexToNumber(a.operatorDetail.currentTotalStake)
        )
      case ViewOrderBy.OperatorId:
      default:
        return operatorsList.sort((a, b) =>
          operatorsOrderByDirection === ViewOrderDirection.Ascending
            ? Number(a.operatorId) - Number(b.operatorId)
            : Number(b.operatorId) - Number(a.operatorId)
        )
    }
  }, [operatorsList, operatorsOrderBy, operatorsOrderByDirection, stakingConstants.nominators])

  return { orderedOperators }
}
