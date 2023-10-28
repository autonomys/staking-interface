import { Grid, GridItem, Text } from '@chakra-ui/react'
import React, { useMemo } from 'react'
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
        <Text fontWeight='500' fontSize='30px' color='#5B5252'>
          Funds in Stake, tSSC
        </Text>
        <Text fontWeight='700' fontSize='30px' color='#5B5252'>
          {formatNumber(totalFundsInStake)}
        </Text>

        <Text fontWeight='500' fontSize='30px' color='#5B5252' mt='8'>
          Number of Nominators
        </Text>
        <Text fontWeight='700' fontSize='30px' color='#5B5252'>
          {formatNumber(totalNominators)}
        </Text>
      </GridItem>
      <GridItem w='100%'>
        <Text fontWeight='500' fontSize='30px' color='#5B5252'>
          Available for withdrawal, tSSC
        </Text>
        <Text fontWeight='700' fontSize='30px' color='#5B5252'>
          {formatNumber(totalFundsInStake)}
        </Text>

        <Text fontWeight='500' fontSize='30px' color='#5B5252' mt='8'>
          Nominator’s funds, tSSC
        </Text>
        <Text fontWeight='700' fontSize='30px' color='#5B5252'>
          {formatNumber(totalFundsInStake)}
        </Text>
      </GridItem>
    </Grid>
  )
}
