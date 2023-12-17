import { HamburgerIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Grid,
  GridItem,
  HStack,
  Heading,
  Spacer,
  StackDivider,
  Text,
  Tooltip,
  VStack,
  useDisclosure,
  useMediaQuery
} from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useMemo } from 'react'
import { EXTERNAL_ROUTES, ROUTES, layoutStyles, textStyles } from '../constants'
import { useView } from '../states/view'
import { ConnectWallet } from './buttons'
import { Subspace } from './icons'
import { TransactionsSpotter } from './transactionsSpotter'
import { WalletDetails } from './walletDetails'

interface LayoutProps {
  children: React.ReactNode
}

export const MobileMenu: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { setIsMobile } = useView()

  const [isLargerThan800] = useMediaQuery('(min-width: 800px)', { ssr: true, fallback: false })

  useEffect(() => {
    setIsMobile(!isLargerThan800)
  }, [isLargerThan800, setIsMobile])

  return (
    <>
      <Button colorScheme='brand' variant='outline' onClick={onOpen} rightIcon={<HamburgerIcon />} />
      <Drawer placement='right' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px'>
            <Link href={ROUTES.HOME}>
              <Subspace />
            </Link>
          </DrawerHeader>
          <DrawerBody>
            <VStack {...layoutStyles} divider={<StackDivider borderColor='gray.200' />} spacing={4} align='stretch'>
              <Box>
                <Link href={ROUTES.REGISTER}>
                  <Button
                    bg='#241235'
                    color='#FFF'
                    borderRadius='9999'
                    pl='16px'
                    pr='16px'
                    pt='8px'
                    pb='7px'
                    onClick={onClose}>
                    Stake as a pool operator
                  </Button>
                </Link>
              </Box>
              <Box>
                <Link href={ROUTES.MANAGE}>
                  <Button
                    bg='#241235'
                    color='#FFF'
                    borderRadius='9999'
                    pl='16px'
                    pr='16px'
                    pt='8px'
                    pb='7px'
                    onClick={onClose}>
                    Manage your stake
                  </Button>
                </Link>
              </Box>
              <Box>
                <Link href={ROUTES.STATS}>
                  <Button
                    bg='#241235'
                    color='#FFF'
                    borderRadius='9999'
                    pl='16px'
                    pr='16px'
                    pt='8px'
                    pb='7px'
                    onClick={onClose}>
                    Stats
                  </Button>
                </Link>
              </Box>
              <ConnectWallet />
              <WalletDetails />
            </VStack>
          </DrawerBody>
          <DrawerFooter>
            <TransactionsSpotter />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export const Header: React.FC = () => {
  const { isMobile } = useView()

  return isMobile ? (
    <HStack {...layoutStyles} w='90vw' h='10vh' flexDir='row' m='auto' align='center'>
      <Spacer />
      <Spacer />
      <ConnectWallet />
      <MobileMenu />
    </HStack>
  ) : (
    <HStack {...layoutStyles} w='90vw' h='10vh' flexDir='row' m='auto' align='center'>
      <Spacer />
      <Link href={ROUTES.HOME}>
        <Subspace />
      </Link>
      <Spacer />
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
      <Link href={ROUTES.OPERATORS}>
        <Button bg='#241235' color='#FFF' borderRadius='9999' pl='16px' pr='16px' pt='8px' pb='7px'>
          Operators
        </Button>
      </Link>
      <Spacer />
      <ConnectWallet />
      <Spacer maxW='18px' />
      <WalletDetails />
      <Spacer maxW='18px' />
      <TransactionsSpotter />
    </HStack>
  )
}

export const Footer: React.FC = () => {
  const { isMobile } = useView()

  const links = useMemo(
    () => (
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
    ),
    []
  )

  const socials = useMemo(
    () => (
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
    ),
    []
  )

  return (
    <Box bg='#F0f0f0' w='100%' h='200px'>
      <Box {...layoutStyles} w='60vw' p={1} pt={4} flexDir='column' m='auto'>
        <Grid templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)', 'repeat(3, 1fr)']} gap={6}>
          {links}
          {!isMobile && <Box w='100%' h='100%'></Box>}
          {socials}
        </Grid>
      </Box>
    </Box>
  )
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box>
      <Center>
        <VStack {...layoutStyles} h='100%' p={1} pt={4} flexDir='column'>
          <Header />
          {children}
        </VStack>
      </Center>
      <Footer />
    </Box>
  )
}
