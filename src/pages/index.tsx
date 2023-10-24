import { Box, Heading, Text, useColorMode } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FormButton } from '../components/buttons'
import { Intro } from '../components/intro'

const Page: React.FC = () => {
  const [clientSide, setClientSide] = useState(false)
  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    setClientSide(true)
  }, [])

  useEffect(() => {
    if (colorMode === 'dark') toggleColorMode()
  }, [colorMode, toggleColorMode])

  if (!clientSide) return null

  return (
    <Box minW='60vw' maxW='60vw' mt='10' p='4' border='0'>
      <Intro />
      <Box>
        <Heading size='lg' fontWeight='700' fontSize='30px' ml='2' mt='66px'>
          1. Setup a node
        </Heading>
        <Link href='/learnMore'>
          <Text textDecoration='underline' color='#4524C1' mt='4'>
            Please follow the docs to setup a node
          </Text>
        </Link>
        <Box mt='4'>
          <Image src='/images/SetupANode.png' width='561' height='326' alt='Setup a Node Readme' />
        </Box>
        <Link href='/register'>
          <FormButton>Next</FormButton>
        </Link>
      </Box>
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface' } }
}

export default Page
