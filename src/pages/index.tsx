import { Box, Heading, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { ConnectWallet, FormButton } from '../components/buttons'
import { Intro } from '../components/intro'
import { EXTERNAL_ROUTES, ROUTES } from '../constants'
import { useWallet } from '../hooks/useWallet'

const Page: React.FC = () => {
  const { extension, handleConnect } = useWallet()

  return (
    <Box minW='60vw' maxW='60vw' mt='10' p='4' border='0'>
      <Intro />
      <Box>
        <Heading size='lg' fontWeight='700' fontSize='30px' ml='2' mt='66px'>
          1. Setup a node
        </Heading>
        <Link href={EXTERNAL_ROUTES.OPERATORS_DOCS} target='_blank'>
          <Text textDecoration='underline' color='#4524C1' mt='4'>
            Please follow the docs to setup a node
          </Text>
        </Link>
        <Box mt='4'>
          <Image src='/images/SetupANode.png' width='561' height='326' alt='Setup a Node Readme' />
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
