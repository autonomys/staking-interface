import { Box, Card, Grid, GridItem, HStack, Heading, Tag, Text, VStack } from '@chakra-ui/react'
import { encodeAddress } from '@polkadot/keyring'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { ROUTES, headingStyles, textStyles } from '../constants'
import { useOrderedOperators } from '../hooks/useOrderedOperators'
import { useExtension } from '../states/extension'
import { formatAddress, hexToFormattedNumber, hexToNumber } from '../utils'
import { Actions } from './actions'
import { FundsInStake } from './fundsInStake'
import { TooltipAmount } from './tooltipAmount'

interface operatorsCardsProps {
  operatorOwner?: string
  fromManage?: boolean
}

export const OperatorsCards: React.FC<operatorsCardsProps> = ({ operatorOwner, fromManage }) => {
  const [clientSide, setClientSide] = useState(false)
  const { extension, subspaceAccount, chainDetails } = useExtension((state) => state)
  const { ss58Format } = chainDetails

  const { orderedOperators } = useOrderedOperators({ operatorOwner, fromManage })

  useEffect(() => {
    setClientSide(true)
  }, [])

  if (!clientSide) return null

  return (
    <Box>
      <Box mt={[2, 4, 6]}>
        <HStack mb='6'>
          <Heading {...headingStyles.paragraph}>Information across operators</Heading>
          {operatorOwner && (
            <Heading {...headingStyles.paragraphExtra}>on Account {formatAddress(operatorOwner)}</Heading>
          )}
        </HStack>
      </Box>
      <Grid templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)']} gap={1}>
        {orderedOperators.length === 0
          ? [0].map((_, key) => (
              <GridItem key={key} w='100%'>
                <Text {...textStyles.text}>No operators found</Text>
                {subspaceAccount === operatorOwner && (
                  <Text {...textStyles.text}>
                    If you recently register a operator, it may take up to 10 minutes for the operator to be added.
                  </Text>
                )}
              </GridItem>
            ))
          : orderedOperators.map((operator, key) => {
              const findMatchingAccount =
                extension.data &&
                extension.data.accounts.find((a) => encodeAddress(a.address, ss58Format) === operator.operatorOwner)
              const accountLabel =
                findMatchingAccount && findMatchingAccount.meta.name
                  ? `(${findMatchingAccount.meta.name}) ${formatAddress(operatorOwner ?? operator.operatorOwner)}`
                  : formatAddress(operatorOwner ?? operator.operatorOwner)
              return (
                <GridItem key={key} w='100%'>
                  <Card m={2} p={2} border='1px' borderX='#EDECEC' borderY='#DFDCDC' borderStyle='solid'>
                    <VStack>
                      <HStack>
                        <Tag colorScheme='brand' variant='outline'>
                          operatorId #{operator.operatorId}
                        </Tag>
                        <Text {...textStyles.text}>{formatAddress(operator.operatorDetail.signingKey)}</Text>
                      </HStack>
                      <HStack>
                        <Link href={`${ROUTES.OPERATOR_STATS}/${operatorOwner ?? operator.operatorOwner}`}>
                          <Tag colorScheme='brand' variant='solid'>
                            {accountLabel}
                          </Tag>
                        </Link>
                      </HStack>
                      <HStack>
                        <Text {...textStyles.text}>Nominator Tax</Text>
                        <Text {...textStyles.text}>{operator.operatorDetail.nominationTax}%</Text>
                      </HStack>
                      <HStack>
                        <Text {...textStyles.text}>Min Nominator Stake</Text>
                        <TooltipAmount amount={hexToNumber(operator.operatorDetail.minimumNominatorStake)}>
                          <Text {...textStyles.text}>
                            {hexToFormattedNumber(operator.operatorDetail.minimumNominatorStake)}
                          </Text>
                        </TooltipAmount>
                      </HStack>
                      <HStack>
                        <Text {...textStyles.text}>Funds in stake</Text>
                        <TooltipAmount amount={hexToNumber(operator.operatorDetail.currentTotalStake)}>
                          <Text {...textStyles.text}>
                            {hexToFormattedNumber(operator.operatorDetail.currentTotalStake)}
                          </Text>
                        </TooltipAmount>
                      </HStack>
                      <HStack>
                        <FundsInStake operatorId={operator.operatorId} />
                        {subspaceAccount && <Actions operatorId={operator.operatorId} />}
                      </HStack>
                    </VStack>
                  </Card>
                </GridItem>
              )
            })}
      </Grid>
    </Box>
  )
}
