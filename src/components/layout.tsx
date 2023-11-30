import { Box, Button, Center, Grid, GridItem, HStack, Heading, Spacer, Text, Tooltip, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { EXTERNAL_ROUTES, ROUTES, textStyles } from '../constants'
import { ConnectWallet } from './buttons'
import { Subspace } from './icons'
import { TransactionsSpotter } from './transactionsSpotter'
import { WalletDetails } from './walletDetails'

interface LayoutProps {
  children: React.ReactNode
}

export const Header: React.FC = () => {
  return (
    <HStack w='60vw' h='10vh' maxW='1600px' display='flex' flexDir='row'>
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
  return (
    <Box bg='#F0f0f0' w='100%' h='200px'>
      <Box w='60vw' maxW='1600px' p={1} pt={4} display='flex' flexDir='column' m='auto'>
        <Grid templateColumns='repeat(3, 1fr)' gap={6}>
          <Box w='100%' h='100%'>
            <Grid h='100px' templateColumns='repeat(1, 1fr)'>
              <GridItem>
                <Center>
                  <Heading size='md' {...textStyles.text}>
                    Other tools
                  </Heading>
                </Center>
              </GridItem>
              <GridItem p={2}>
                <Link href={EXTERNAL_ROUTES.OPERATORS_DOCS}>
                  <Text textDecoration='underline' {...textStyles.text}>
                    Operator documentation
                  </Text>
                </Link>
              </GridItem>
              <GridItem p={2}>
                <Link href={EXTERNAL_ROUTES.ASTRAL}>
                  <Text textDecoration='underline' {...textStyles.text}>
                    Astral Explorer
                  </Text>
                </Link>
              </GridItem>
            </Grid>
          </Box>
          <Box w='100%' h='100%'></Box>
          <Box w='100%' h='100%'>
            <Center pb={3}>
              <Heading size='md' {...textStyles.text}>
                Social
              </Heading>
            </Center>
            <Grid h='100px' templateColumns='repeat(9, 1fr)'>
              <GridItem>
                <Link href={EXTERNAL_ROUTES.DISCORD} target='_blank'>
                  <Tooltip hasArrow label='Discord' aria-label='Discord' bg='brand.500'>
                    <Image src='/images/discord.svg' width={24} height={24} alt='Reddit' />
                  </Tooltip>
                </Link>
              </GridItem>
              <GridItem>
                <Link href={EXTERNAL_ROUTES.TELEGRAM} target='_blank'>
                  <Tooltip hasArrow label='Telegram' aria-label='Discord' bg='brand.500'>
                    <Image src='/images/telegram.svg' width={24} height={24} alt='Reddit' />
                  </Tooltip>
                </Link>
              </GridItem>
              <GridItem>
                <Link href={EXTERNAL_ROUTES.TWITTER} target='_blank'>
                  <Tooltip hasArrow label='Twitter' aria-label='Discord' bg='brand.500'>
                    <Image src='/images/twitter.svg' width={24} height={24} alt='Reddit' />
                  </Tooltip>
                </Link>
              </GridItem>
              <GridItem>
                <Link href={EXTERNAL_ROUTES.GITHUB} target='_blank'>
                  <Tooltip hasArrow label='GitHub' aria-label='Discord' bg='brand.500'>
                    <Image src='/images/github.svg' width={24} height={24} alt='Reddit' />
                  </Tooltip>
                </Link>
              </GridItem>
              <GridItem>
                <Link href={EXTERNAL_ROUTES.REDDIT} target='_blank'>
                  <Tooltip hasArrow label='Reddit' aria-label='Discord' bg='brand.500'>
                    <Image src='/images/reddit.svg' width={24} height={24} alt='Reddit' />
                  </Tooltip>
                </Link>
              </GridItem>
              <GridItem>
                <Link href={EXTERNAL_ROUTES.MEDIUM} target='_blank'>
                  <Tooltip hasArrow label='Medium' aria-label='Discord' bg='brand.500'>
                    <Image src='/images/medium.svg' width={24} height={24} alt='Reddit' />
                  </Tooltip>
                </Link>
              </GridItem>
              <GridItem>
                <Link href={EXTERNAL_ROUTES.YOUTUBE} target='_blank'>
                  <Tooltip hasArrow label='Youtube' aria-label='Discord' bg='brand.500'>
                    <Image src='/images/youtube.svg' width={24} height={24} alt='Reddit' />
                  </Tooltip>
                </Link>
              </GridItem>
              <GridItem>
                <Link href={EXTERNAL_ROUTES.LINKEDIN} target='_blank'>
                  <Tooltip hasArrow label='Linkedin' aria-label='Discord' bg='brand.500'>
                    <Image src='/images/linkedin.svg' width={24} height={24} alt='Reddit' />
                  </Tooltip>
                </Link>
              </GridItem>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </Box>
  )
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Center>
        <VStack h='100%' p={1} pt={4} display='flex' flexDir='column'>
          <Header />
          {children}
        </VStack>
      </Center>
      <Footer />
    </Box>
  )
}
