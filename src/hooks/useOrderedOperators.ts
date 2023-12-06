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
  const { stakingConstants } = useExtension((state) => state)
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

  const operatorsList = useMemo(
    () => (fromManage && nominatorsOperators ? [...operators, ...nominatorsOperators] : operators),
    [fromManage, nominatorsOperators, operators]
  )

  const orderedOperators = useMemo(() => {
    switch (operatorsOrderBy) {
      case ViewOrderBy.NominatorTax:
        return operatorsList.sort((a, b) =>
          operatorsOrderByDirection === ViewOrderDirection.Ascending
            ? a.operatorDetail.nominationTax - b.operatorDetail.nominationTax
            : b.operatorDetail.nominationTax - a.operatorDetail.nominationTax
        )
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
  }, [operatorsList, operatorsOrderBy, operatorsOrderByDirection])

  return { orderedOperators }
}
