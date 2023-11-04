import { Grid, GridItem, Text } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { SYMBOL, textStyles } from '../constants'
import { useRegistration } from '../states/registration'
import { formatNumber } from '../utils'

export const OperatorsTotal: React.FC = () => {
  const registrations = useRegistration((state) => state.registrations)

  const totalFundsInStake = useMemo(
    () => registrations.reduce((acc, registration) => acc + parseInt(registration.amountToStake), 0),
    [registrations]
  )
  const totalNominators = useMemo(() => registrations.length, [registrations])

  return (
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
        <Text style={textStyles.value}>{formatNumber(totalFundsInStake)}</Text>

        <Text style={textStyles.heading} mt='8'>
          Nominator’s funds, {SYMBOL}
        </Text>
        <Text style={textStyles.value}>{formatNumber(totalFundsInStake)}</Text>
      </GridItem>
    </Grid>
  )
}
