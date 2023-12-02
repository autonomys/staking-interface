import { Box, HStack, Heading } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Wallet } from '../components/icons'
import { OperatorsCards } from '../components/operatorsCards'
import { OperatorsList } from '../components/operatorsList'
import { OperatorsTotal } from '../components/operatorsTotal'
import { ViewSelector } from '../components/viewSelector'
import { OperatorListType, headingStyles, pageStyles } from '../constants'
import { useOnchainData } from '../hooks/useOnchainData'
import { useView } from '../states/view'

const Page: React.FC = () => {
  const { handleOnchainData } = useOnchainData()
  const { operatorsListType } = useView()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData])

  console.log('operatorsListType', operatorsListType)
  return (
    <Box {...pageStyles}>
      <HStack>
        <Wallet />
        <Heading {...headingStyles.page}>Stats</Heading>
      </HStack>
      <OperatorsTotal />
      <ViewSelector />
      {operatorsListType === OperatorListType.CARD_GRID && <OperatorsCards />}
      {operatorsListType === OperatorListType.LIST && <OperatorsList />}
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Stats' } }
}

export default Page
