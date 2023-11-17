import { Box, Grid, GridItem, HStack, Heading, Text } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { SYMBOL, headingStyles, textStyles } from '../constants'
import { useExtension } from '../states/extension'
import { formatAddress, formatNumber, hexToNumber } from '../utils'

interface OperatorsTotalProps {
  operatorOwner?: string
}

export const OperatorsTotal: React.FC<OperatorsTotalProps> = ({ operatorOwner }) => {
  const stakingConstants = useExtension((state) => state.stakingConstants)

  const totalFundsInStake = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.operators
        .filter((operator) => operator.operatorOwner === operatorOwner)
        .reduce((acc, operator) => acc + hexToNumber(operator.operatorDetail.currentTotalStake), 0)
    return stakingConstants.operators.reduce(
      (acc, operator) => acc + hexToNumber(operator.operatorDetail.currentTotalStake),
      0
    )
  }, [operatorOwner, stakingConstants.operators])

  // To-Do: Implement this
  const totalFundsInStakeAvailable = useMemo(() => {
    return totalFundsInStake
  }, [totalFundsInStake])

  // To-Do: Implement this
  const totalNominators = useMemo(() => {
    return 0
  }, [])

  // To-Do: Implement this
  const totalNominatorsStake = useMemo(() => {
    return 0
  }, [])

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
          <Text style={textStyles.heading}>Funds in Stake, {SYMBOL}</Text>
          <Text style={textStyles.value}>{formatNumber(totalFundsInStake)}</Text>

          <Text style={textStyles.heading} mt='8'>
            Number of Nominators
          </Text>
          <Text style={textStyles.value}>{totalNominators}</Text>
        </GridItem>
        <GridItem w='100%'>
          <Text style={textStyles.heading}>Available for withdrawal, {SYMBOL}</Text>
          <Text style={textStyles.value}>{formatNumber(totalFundsInStakeAvailable)}</Text>

          <Text style={textStyles.heading} mt='8'>
            Nominator’s funds, {SYMBOL}
          </Text>
          <Text style={textStyles.value}>{formatNumber(totalNominatorsStake)}</Text>
        </GridItem>
      </Grid>
    </Box>
  )
}
