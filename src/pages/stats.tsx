import { Box, HStack, Heading } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Wallet } from '../components/icons'
import { OperatorsList } from '../components/operatorsList'
import { OperatorsTotal } from '../components/operatorsTotal'
import { useOnchainData } from '../hooks/useOnchainData'

const Page: React.FC = () => {
  const { handleOnchainData } = useOnchainData()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData])

  return (
    <Box minW='60vw' maxW='60vw' mt='10' p='4' border='0'>
      <HStack>
        <Wallet />
        <Heading ml='2'>Stats</Heading>
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
