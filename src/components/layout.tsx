import { Box, Button, Center, HStack, Spacer, VStack } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { ROUTES } from '../constants'
import { ConnectWallet } from './buttons'
import { Subspace } from './icons'
import { TransactionsSpotter } from './transactionsSpotter'
import { WalletDetails } from './walletDetails'

interface LayoutProps {
  children: React.ReactNode
}

export const Header: React.FC = () => {
  return (
    <HStack w='60vw' h='10vh' display='flex' flexDir='row'>
      <Link href={ROUTES.HOME}>
        <Subspace />
      </Link>
      <Spacer maxW='18px' />
      <Link href={ROUTES.REGISTER}>
        <Button bg='#241235' color='#FFF' borderRadius='9999' pl='16px' pr='16px' pt='8px' pb='7px'>
          Stake as a pool operator
        </Button>
      </Link>
      <Link href={ROUTES.MANAGE}>
        <Button bg='#241235' color='#FFF' borderRadius='9999' pl='16px' pr='16px' pt='8px' pb='7px'>
          Manage your stake
        </Button>
      </Link>
      <Link href={ROUTES.STATS}>
        <Button bg='#241235' color='#FFF' borderRadius='9999' pl='16px' pr='16px' pt='8px' pb='7px'>
          Stats
        </Button>
      </Link>
      <Spacer />
      <ConnectWallet />
      <WalletDetails />
      <TransactionsSpotter />
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
