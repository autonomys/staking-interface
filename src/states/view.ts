import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { OperatorListType, ViewOrderBy, ViewOrderDirection } from '../constants'

interface ViewState {
  operatorsListType: OperatorListType
  operatorsOrderBy: ViewOrderBy
  operatorsOrderByDirection: ViewOrderDirection
  setOperatorsListTypeList: () => void
  setOperatorsListTypeCardGrid: () => void
  setOperatorsOrderBy: (operatorsOrderBy: ViewOrderBy) => void
  setOperatorsOrderByDirectionAscending: () => void
  setOperatorsOrderByDirectionDescending: () => void
}

export const useView = create<ViewState>()(
  persist(
    (set) => ({
      operatorsListType: OperatorListType.LIST,
      operatorsOrderBy: ViewOrderBy.OperatorId,
      operatorsOrderByDirection: ViewOrderDirection.Ascending,
      setOperatorsListTypeList: () => set(() => ({ operatorsListType: OperatorListType.CARD_GRID })),
      setOperatorsListTypeCardGrid: () => set(() => ({ operatorsListType: OperatorListType.LIST })),
      setOperatorsOrderBy: (operatorsOrderBy: ViewOrderBy) => set(() => ({ operatorsOrderBy })),
      setOperatorsOrderByDirectionAscending: () =>
        set(() => ({ operatorsOrderByDirection: ViewOrderDirection.Ascending })),
      setOperatorsOrderByDirectionDescending: () =>
        set(() => ({ operatorsOrderByDirection: ViewOrderDirection.Descending }))
    }),
    {
      name: 'view',
      version: 1
    }
  )
)
