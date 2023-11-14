import { Box, HStack, Heading } from '@chakra-ui/react'
import { GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo } from 'react'
import { Wallet } from '../../components/icons'
import { OperatorsList } from '../../components/operatorsList'
import { OperatorsTotal } from '../../components/operatorsTotal'
import { useOnchainData } from '../../hooks/useOnchainData'

const Page: React.FC = () => {
  const { handleOnchainData } = useOnchainData()
  const { query } = useRouter()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData])

  const operatorOwner = useMemo(() => {
    if (query.operatorOwner && typeof query.operatorOwner === 'string') return query.operatorOwner as string
    return ''
  }, [query])

  return (
    <Box minW='60vw' maxW='60vw' mt='10' p='4' border='0'>
      <HStack>
        <Wallet />
        <Heading ml='2'>Stats</Heading>
      </HStack>
      <OperatorsList operatorOwner={operatorOwner} />
      <OperatorsTotal operatorOwner={operatorOwner} />
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Stats' } }
}

export const getStaticPaths: GetStaticPaths<{ operatorOwner: string }> = async () => {
  return {
    paths: [{ params: { operatorOwner: 'st00' } }],
    fallback: true
  }
}

export default Page
