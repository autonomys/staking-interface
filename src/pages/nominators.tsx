import { Box, HStack, Heading } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Wallet } from '../components/icons'
import { NominatorsList } from '../components/nominatorsList'
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
        <Heading {...headingStyles.page}>Nominators</Heading>
      </HStack>
      <NominatorsList />
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Nominators' } }
}

export default Page
