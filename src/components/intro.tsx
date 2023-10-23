import { Box, HStack, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { Wallet } from './icons'

export const Intro: React.FC = () => {
  return (
    <Box>
      <HStack mb='6'>
        <Wallet />
        <Heading ml='2'>Staking as a pool operator</Heading>
      </HStack>
      <Text>
        tSSC holders (Gemini 3h tesntet network only) can stake their tSSC to add more security to the protocol and earn{' '}
        <u>Staking Incentives.</u>
      </Text>
      <Text>
        Currently Staking Wars is active, please read this{' '}
        <u>
          <Link href='/information'>information</Link>
        </u>{' '}
        on how to participate and earn even more rewards!
      </Text>
      <Link href='/learnMore'>
        <Text textDecoration='underline'>Learn more about risks involved.</Text>
      </Link>
    </Box>
  )
}
