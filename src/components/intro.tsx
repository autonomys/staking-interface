import { Box, HStack, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { EXTERNAL_ROUTES, headingStyles } from '../constants'
import { useExtension } from '../states/extension'
import { Wallet } from './icons'

export const Intro: React.FC = () => {
  const chainDetails = useExtension((state) => state.chainDetails)
  const { tokenSymbol } = chainDetails

  return (
    <Box>
      <HStack mb='6'>
        <Wallet />
        <Heading {...headingStyles.page}>Staking as a pool operator</Heading>
      </HStack>
      <Text>
        {tokenSymbol} holders (Gemini 3g testnet network only) can stake their {tokenSymbol} to add more security to the
        protocol and earn{' '}
        <u>
          <Link href={EXTERNAL_ROUTES.STAKING_INCENTIVES}>Staking Incentives</Link>
        </u>
        .
      </Text>
      <Text>
        Currently Staking Wars is active, please read this{' '}
        <u>
          <Link href={EXTERNAL_ROUTES.STAKING_INFORMATION}>information</Link>
        </u>{' '}
        on how to participate and earn even more rewards!
      </Text>
      <Link href={EXTERNAL_ROUTES.RISK}>
        <Text textDecoration='underline'>Learn more about risks involved.</Text>
      </Link>
    </Box>
  )
}
