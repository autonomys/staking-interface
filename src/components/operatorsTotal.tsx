import { Box, Grid, GridItem, HStack, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { headingStyles, textStyles } from '../constants'
import { useTotal } from '../hooks/useTotal'
import { useExtension } from '../states/extension'
import { formatAddress, formatNumber } from '../utils'
import { TooltipAmount } from './tooltipAmount'

interface OperatorsTotalProps {
  operatorOwner?: string
}

export const OperatorsTotal: React.FC<OperatorsTotalProps> = ({ operatorOwner }) => {
  const {
    chainDetails: { tokenSymbol }
  } = useExtension()
  const {
    totalFundsInStake,
    totalFundsInStakeAvailable,
    totalOperators,
    totalOperatorsStake,
    totalNominators,
    totalNominatorsStake
  } = useTotal(operatorOwner)

  return (
    <Box>
      <Box mt='6'>
        <HStack mb='6'>
          <Heading {...headingStyles.paragraph}>Aggregated data</Heading>
          {operatorOwner && (
            <Heading {...headingStyles.paragraphExtra}>on Account {formatAddress(operatorOwner)}</Heading>
          )}
        </HStack>
      </Box>
      <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(2, 1fr)']} gap={[2, 4, 6]} mt={[2, 10, 12]}>
        <GridItem w='100%'>
          <Text {...textStyles.heading}>Funds in Stake, {tokenSymbol}</Text>
          <Text {...textStyles.value}>
            <TooltipAmount amount={totalFundsInStake}>{formatNumber(totalFundsInStake)}</TooltipAmount>
          </Text>

          <Text {...textStyles.heading} mt={[2, 3, 8]}>
            Number of Operators
          </Text>
          <Text {...textStyles.value}>{totalOperators}</Text>
          <Text {...textStyles.heading} mt={[2, 3, 8]}>
            Number of Nominators
          </Text>
          <Text {...textStyles.value}>{totalNominators}</Text>
        </GridItem>
        <GridItem w='100%'>
          <Text {...textStyles.heading}>Available for withdrawal, {tokenSymbol}</Text>
          <Text {...textStyles.value}>
            <TooltipAmount amount={totalFundsInStakeAvailable}>
              {formatNumber(totalFundsInStakeAvailable)}
            </TooltipAmount>
          </Text>

          <Text {...textStyles.heading} mt={[2, 3, 8]}>
            Operator’s funds, {tokenSymbol}
          </Text>
          <Text {...textStyles.value}>
            <TooltipAmount amount={totalOperatorsStake}>{formatNumber(totalOperatorsStake)}</TooltipAmount>
          </Text>

          <Text {...textStyles.heading} mt={[2, 3, 8]}>
            Nominator’s funds, {tokenSymbol}
          </Text>
          <Text {...textStyles.value}>
            <TooltipAmount amount={totalNominatorsStake}>{formatNumber(totalNominatorsStake)}</TooltipAmount>
          </Text>
        </GridItem>
      </Grid>
    </Box>
  )
}
