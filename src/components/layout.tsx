import { Box, Button, Center, HStack, Spacer, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { ConnectWallet } from './buttons'
import { Subspace } from './icons'

interface LayoutProps {
  children: React.ReactNode
}

export const Header: React.FC = () => {
  return (
    <HStack w='50vw' h='10vh' display='flex' flexDir='row'>
      <Link href='/'>
        <Subspace />
      </Link>
      <Spacer maxW='18px' />
      <Button bg='#241235' color='#FFF' borderRadius='9999' pl='16px' pr='16px' pt='8px' pb='7px'>
        Stake as a pool operator
      </Button>
      <Spacer />
      <ConnectWallet />
    </HStack>
  )
}

export const Footer: React.FC = () => {
  return <Box> </Box>
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Center>
        <VStack h='100%' p={1} pt={4} display='flex' flexDir='column'>
          <Header />
          {children}
          <Footer />
        </VStack>
      </Center>
    </Box>
  )
}
