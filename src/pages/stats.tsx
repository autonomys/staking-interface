import { Box, HStack, Heading } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Wallet } from '../components/icons'
import { OperatorsList } from '../components/operatorsList'
import { OperatorsTotal } from '../components/operatorsTotal'
import { headingStyles, pageStyles } from '../constants'
import { useOnchainData } from '../hooks/useOnchainData'

const Page: React.FC = () => {
  const { handleOnchainData } = useOnchainData()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData])

  return (
    <Box {...pageStyles}>
      <HStack>
        <Wallet />
        <Heading {...headingStyles.page}>Stats</Heading>
      </HStack>
      <OperatorsList />
      <OperatorsTotal />
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Stats' } }
}

export default Page
