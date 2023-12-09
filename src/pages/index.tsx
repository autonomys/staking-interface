import { Box, Grid, GridItem, Heading, Text } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { ConnectWallet, FormButton } from '../components/buttons'
import { Intro } from '../components/intro'
import { EXTERNAL_ROUTES, ROUTES, headingStyles, pageStyles, textStyles } from '../constants'
import { useOnchainData } from '../hooks/useOnchainData'
import { useWallet } from '../hooks/useWallet'
import { useExtension } from '../states/extension'

const PieGraph = dynamic(() => import('../components/pieGraph').then((m) => m.PieGraph), { ssr: false })

const Page: React.FC = () => {
  const subspaceAccount = useExtension((state) => state.subspaceAccount)
  const { extension, handleConnect } = useWallet()
  const { handleOnchainData } = useOnchainData()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData, subspaceAccount])

  return (
    <Box {...pageStyles}>
      <Intro />
      <Box mt='66px'>
        <Box mt='4'>
          <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']} gap={[2, 4, 6]}>
            <GridItem>
              <Heading {...headingStyles.page}>Setup a node</Heading>
              <Link href={EXTERNAL_ROUTES.OPERATORS_DOCS} target='_blank'>
                <Text {...textStyles.link}>Please follow the docs to setup a node</Text>
              </Link>
              <Image src='/images/SetupANode.png' width='561' height='326' alt='Setup a Node Readme' />
            </GridItem>
            <GridItem>
              <PieGraph small />
            </GridItem>
          </Grid>
        </Box>

        {extension.data ? (
          <Link href={ROUTES.REGISTER}>
            <FormButton>Next</FormButton>
          </Link>
        ) : (
          <Box mt='8'>
            <ConnectWallet onClick={handleConnect} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface' } }
}

export default Page
