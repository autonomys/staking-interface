import { Grid, GridItem } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useRegistration } from '../states/registration'
import { formatNumber } from '../utils'
import { TextElement, TextElementFontWeight } from './text'

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
        <TextElement fontWeight={TextElementFontWeight.TITLE}>Funds in Stake, tSSC</TextElement>
        <TextElement fontWeight={TextElementFontWeight.VALUE}>{formatNumber(totalFundsInStake)}</TextElement>

        <TextElement fontWeight={TextElementFontWeight.TITLE} mt='8'>
          Number of Nominators
        </TextElement>
        <TextElement fontWeight={TextElementFontWeight.VALUE}>{formatNumber(totalNominators)}</TextElement>
      </GridItem>
      <GridItem w='100%'>
        <TextElement fontWeight={TextElementFontWeight.TITLE}>Available for withdrawal, tSSC</TextElement>
        <TextElement fontWeight={TextElementFontWeight.VALUE}>{formatNumber(totalFundsInStake)}</TextElement>

        <TextElement fontWeight={TextElementFontWeight.TITLE} mt='8'>
          Nominator’s funds, tSSC
        </TextElement>
        <TextElement fontWeight={TextElementFontWeight.VALUE}>{formatNumber(totalFundsInStake)}</TextElement>
      </GridItem>
    </Grid>
  )
}
