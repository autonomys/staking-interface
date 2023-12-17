import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { OperatorListType, ViewOrderBy, ViewOrderDirection } from '../constants'

interface ViewState {
  isMobile: boolean
  operatorsListType: OperatorListType
  operatorsOrderBy: ViewOrderBy
  operatorsOrderByDirection: ViewOrderDirection
  setIsMobile: (isMobile: boolean) => void
  setOperatorsListTypeList: () => void
  setOperatorsListTypeCardGrid: () => void
  setOperatorsOrderBy: (operatorsOrderBy: ViewOrderBy) => void
  setOperatorsOrderByDirectionAscending: () => void
  setOperatorsOrderByDirectionDescending: () => void
}

export const useView = create<ViewState>()(
  persist(
    (set) => ({
      isMobile: false,
      operatorsListType: OperatorListType.LIST,
      operatorsOrderBy: ViewOrderBy.OperatorId,
      operatorsOrderByDirection: ViewOrderDirection.Ascending,
      setIsMobile: (isMobile: boolean) => {
        set(() => ({ isMobile }))
        isMobile
          ? set(() => ({ operatorsListType: OperatorListType.CARD_GRID }))
          : set(() => ({ operatorsListType: OperatorListType.LIST }))
      },
      setOperatorsListTypeList: () => set(() => ({ operatorsListType: OperatorListType.LIST })),
      setOperatorsListTypeCardGrid: () => set(() => ({ operatorsListType: OperatorListType.CARD_GRID })),
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
