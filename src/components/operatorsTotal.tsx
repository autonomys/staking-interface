import { Box, Grid, GridItem, HStack, Heading, Text } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { headingStyles, textStyles } from '../constants'
import { useExtension } from '../states/extension'
import { formatAddress, formatNumber, hexToNumber } from '../utils'
import { TooltipAmount } from './tooltipAmount'

interface OperatorsTotalProps {
  operatorOwner?: string
}

export const OperatorsTotal: React.FC<OperatorsTotalProps> = ({ operatorOwner }) => {
  const { stakingConstants, chainDetails } = useExtension((state) => state)
  const { tokenDecimals, tokenSymbol } = chainDetails

  const totalFundsInStake = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.operators
        .filter((operator) => operator.operatorOwner === operatorOwner)
        .reduce((acc, operator) => acc + hexToNumber(operator.operatorDetail.currentTotalStake, tokenDecimals), 0)
    return stakingConstants.operators.reduce(
      (acc, operator) => acc + hexToNumber(operator.operatorDetail.currentTotalStake, tokenDecimals),
      0
    )
  }, [operatorOwner, stakingConstants.operators, tokenDecimals])

  // To-Do: Implement this
  const totalFundsInStakeAvailable = useMemo(() => {
    return totalFundsInStake
  }, [totalFundsInStake])

  const totalNominators = useMemo(() => {
    return stakingConstants.nominators.reduce((acc) => acc + 1, 0)
  }, [stakingConstants.nominators])

  const totalNominatorsStake = useMemo(() => {
    return stakingConstants.nominators.reduce((acc, nominator) => acc + hexToNumber(nominator.shares), 0)
  }, [stakingConstants.nominators])

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
      <Grid templateColumns='repeat(2, 1fr)' gap={6} mt='12'>
        <GridItem w='100%'>
          <Text style={textStyles.heading}>Funds in Stake, {tokenSymbol}</Text>
          <Text style={textStyles.value}>
            <TooltipAmount amount={totalFundsInStake}>{formatNumber(totalFundsInStake)}</TooltipAmount>
          </Text>

          <Text style={textStyles.heading} mt='8'>
            Number of Nominators
          </Text>
          <Text style={textStyles.value}>{totalNominators}</Text>
        </GridItem>
        <GridItem w='100%'>
          <Text style={textStyles.heading}>Available for withdrawal, {tokenSymbol}</Text>
          <Text style={textStyles.value}>
            <TooltipAmount amount={totalFundsInStakeAvailable}>
              {formatNumber(totalFundsInStakeAvailable)}
            </TooltipAmount>
          </Text>

          <Text style={textStyles.heading} mt='8'>
            Nominator’s funds, {tokenSymbol}
          </Text>
          <Text style={textStyles.value}>
            <TooltipAmount amount={totalNominatorsStake}>{formatNumber(totalNominatorsStake)}</TooltipAmount>
          </Text>
        </GridItem>
      </Grid>
    </Box>
  )
}
