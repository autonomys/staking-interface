import { DragHandleIcon, HamburgerIcon, UpDownIcon } from '@chakra-ui/icons'
import { ButtonGroup, HStack, IconButton, Spacer, Text } from '@chakra-ui/react'
import type { SingleValue } from 'chakra-react-select'
import { Select } from 'chakra-react-select'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ViewOrderBy, ViewOrderDirection } from '../constants'
import { useView } from '../states/view'
import { Option } from '../types'
import { capitalizeFirstLetter } from '../utils'

export const ViewSelector: React.FC = () => {
  const [clientSide, setClientSide] = useState(false)
  const {
    operatorsOrderBy,
    operatorsOrderByDirection,
    setOperatorsListTypeList,
    setOperatorsListTypeCardGrid,
    setOperatorsOrderBy,
    setOperatorsOrderByDirectionAscending,
    setOperatorsOrderByDirectionDescending
  } = useView()

  const viewOrderByOptions = useMemo(
    () =>
      Object.keys(ViewOrderBy).map((value) => ({
        label: capitalizeFirstLetter(value),
        value
      })),
    []
  )

  const viewOrderByValue = useMemo(
    () =>
      Object.keys(ViewOrderBy).map(
        (value) =>
          value === operatorsOrderBy && {
            label: capitalizeFirstLetter(value),
            value: value.toString()
          }
      ),
    [operatorsOrderBy]
  )

  const handleOrderChange = useCallback(
    (value: SingleValue<false | Option<string>>) => {
      if (value) setOperatorsOrderBy(value.value as ViewOrderBy)
    },
    [setOperatorsOrderBy]
  )

  const handleOrderChangeDirection = useCallback(
    () =>
      operatorsOrderByDirection === ViewOrderDirection.Ascending
        ? setOperatorsOrderByDirectionDescending()
        : setOperatorsOrderByDirectionAscending(),
    [operatorsOrderByDirection, setOperatorsOrderByDirectionAscending, setOperatorsOrderByDirectionDescending]
  )

  useEffect(() => {
    setClientSide(true)
  }, [])

  if (!clientSide) return null

  return (
    <HStack w='100%' spacing={4} mt={8}>
      <Text>View</Text>
      <ButtonGroup size='md' isAttached variant='outline' colorScheme='brand'>
        <IconButton aria-label='List view' onClick={setOperatorsListTypeList} icon={<HamburgerIcon />} />
        <IconButton aria-label='Grid view' onClick={setOperatorsListTypeCardGrid} icon={<DragHandleIcon />} />
      </ButtonGroup>
      <Spacer />
      <Text>Order by</Text>
      <Select value={viewOrderByValue} onChange={handleOrderChange} options={viewOrderByOptions} />
      <ButtonGroup size='md' isAttached variant='outline' colorScheme='brand'>
        <IconButton aria-label='Switch order' onClick={handleOrderChangeDirection} icon={<UpDownIcon />} />
      </ButtonGroup>
    </HStack>
  )
}
