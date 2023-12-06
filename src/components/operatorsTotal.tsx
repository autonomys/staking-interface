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

  const totalPendingDeposits = useMemo(() => {
    if (!stakingConstants.pendingDeposits || stakingConstants.pendingDeposits.length === 0) return 0
    if (operatorOwner)
      return stakingConstants.pendingDeposits
        .filter((deposit) => deposit.operatorOwner === operatorOwner)
        .reduce((acc, deposit) => acc + parseInt(deposit.amount) / 10 ** tokenDecimals, 0)
    return stakingConstants.pendingDeposits.reduce(
      (acc, deposit) => acc + parseInt(deposit.amount) / 10 ** tokenDecimals,
      0
    )
  }, [operatorOwner, stakingConstants.pendingDeposits, tokenDecimals])

  const totalFundsInStake = useMemo(() => {
    if (operatorOwner)
      return (
        stakingConstants.operators
          .filter((operator) => operator.operatorOwner === operatorOwner)
          .reduce((acc, operator) => acc + hexToNumber(operator.operatorDetail.currentTotalStake), 0) +
        totalPendingDeposits
      )
    return (
      stakingConstants.operators.reduce(
        (acc, operator) => acc + hexToNumber(operator.operatorDetail.currentTotalStake),
        0
      ) + totalPendingDeposits
    )
  }, [operatorOwner, stakingConstants.operators, totalPendingDeposits])

  const totalFundsInStakeAvailable = useMemo(() => {
    const minOperatorStake = Number(BigInt(stakingConstants.minOperatorStake) / BigInt(10 ** tokenDecimals))
    if (operatorOwner)
      return stakingConstants.operators
        .filter((operator) => operator.operatorOwner === operatorOwner)
        .reduce((acc, operator) => {
          const amount = hexToNumber(operator.operatorDetail.currentTotalStake, tokenDecimals)
          if (amount <= minOperatorStake) return acc
          return acc + amount - minOperatorStake
        }, 0)
    return stakingConstants.operators.reduce((acc, operator) => {
      const amount = hexToNumber(operator.operatorDetail.currentTotalStake, tokenDecimals)
      if (amount <= minOperatorStake) return acc
      return acc + amount - minOperatorStake
    }, 0)
  }, [operatorOwner, stakingConstants.minOperatorStake, stakingConstants.operators, tokenDecimals])

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
      <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(2, 1fr)']} gap={[2, 4, 6]} mt={[2, 10, 12]}>
        <GridItem w='100%'>
          <Text {...textStyles.heading}>Funds in Stake, {tokenSymbol}</Text>
          <Text {...textStyles.value}>
            <TooltipAmount amount={totalFundsInStake}>{formatNumber(totalFundsInStake)}</TooltipAmount>
          </Text>
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
