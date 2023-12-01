import { InfoOutlineIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Text
} from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { textStyles } from '../constants'
import { useExtension } from '../states/extension'
import { hexToFormattedNumber, hexToNumber } from '../utils'
import { TooltipAmount } from './tooltipAmount'

interface ActionsProps {
  operatorId: string
}

export const FundsInStake: React.FC<ActionsProps> = ({ operatorId }) => {
  const { chainDetails, stakingConstants } = useExtension((state) => state)

  const operator = useMemo(
    () => stakingConstants.operators.find((operator) => operator.operatorId === operatorId),
    [stakingConstants.operators, operatorId]
  )

  const nominatorsStake = useMemo(
    () =>
      operator &&
      stakingConstants.nominators
        .filter(
          (nominator) => nominator.operatorId === operatorId && nominator.nominatorOwner != operator.operatorOwner
        )
        .reduce((acc, nominator) => acc + hexToNumber(nominator.shares), 0),
    [operator, stakingConstants.nominators, operatorId]
  )

  const operatorStake = useMemo(
    () => operator && nominatorsStake && hexToNumber(operator.operatorDetail.currentTotalStake) - nominatorsStake,
    [operator, nominatorsStake]
  )

  if (!operator) return null

  return (
    <Popover>
      <PopoverTrigger>
        <Button rightIcon={<InfoOutlineIcon />} colorScheme='brand' variant='outline' size='sm' pl={1} ml={2} />
      </PopoverTrigger>
      <Portal>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader {...textStyles.heading}>Funds in Stake</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Box mb={2}>
              {operatorStake && (
                <>
                  <Text>Operator stake:</Text>
                  <TooltipAmount amount={operatorStake}>
                    <Text {...textStyles.text}>
                      {operatorStake} {chainDetails.tokenSymbol}
                    </Text>
                  </TooltipAmount>
                </>
              )}
              {nominatorsStake && (
                <>
                  <Text>Nominators stake:</Text>
                  <TooltipAmount amount={nominatorsStake}>
                    <Text {...textStyles.text}>
                      {nominatorsStake} {chainDetails.tokenSymbol}
                    </Text>
                  </TooltipAmount>
                </>
              )}
            </Box>
          </PopoverBody>
          <PopoverFooter>
            <Text>Total stake:</Text>
            <TooltipAmount amount={hexToNumber(operator.operatorDetail.currentTotalStake)}>
              <Text {...textStyles.text}>
                {hexToFormattedNumber(operator.operatorDetail.currentTotalStake)} {chainDetails.tokenSymbol}
              </Text>
            </TooltipAmount>
            <Text>Total shares:</Text>
            <TooltipAmount amount={hexToNumber(operator.operatorDetail.totalShares)}>
              <Text {...textStyles.text}>
                {hexToFormattedNumber(operator.operatorDetail.totalShares)} {chainDetails.tokenSymbol}
              </Text>
            </TooltipAmount>
          </PopoverFooter>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
