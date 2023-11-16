import { Box, HStack, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { ROUTES, headingStyles, tHeadStyles, tableStyles, textStyles } from '../constants'
import { useExtension } from '../states/extension'
import { formatAddress, hexToFormattedNumber } from '../utils'
import { Actions } from './actions'

interface OperatorsListProps {
  operatorOwner?: string
}

export const OperatorsList: React.FC<OperatorsListProps> = ({ operatorOwner }) => {
  const stakingConstants = useExtension((state) => state.stakingConstants)
  const subspaceAccount = useExtension((state) => state.subspaceAccount)

  const operators = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.operators.filter((_, key) => stakingConstants.operatorIdOwner[key] === operatorOwner)
    return stakingConstants.operators
  }, [operatorOwner, stakingConstants.operatorIdOwner, stakingConstants.operators])

  const isOneOfTheOperators = useMemo(
    () => subspaceAccount && stakingConstants.operatorIdOwner.includes(subspaceAccount),
    [stakingConstants.operatorIdOwner, subspaceAccount]
  )

  return (
    <Box>
      <Box mt='6'>
        <HStack mb='6'>
          <Heading {...headingStyles.paragraph}>Information across operators</Heading>
          {operatorOwner && (
            <Heading {...headingStyles.paragraphExtra}>on Account {formatAddress(operatorOwner)}</Heading>
          )}
        </HStack>
      </Box>
      <TableContainer>
        <Table {...tableStyles}>
          <Thead {...tHeadStyles}>
            <Tr>
              <Th isNumeric>DomainID</Th>
              <Th>OperatorID</Th>
              <Th>Signing key</Th>
              <Th>Operator Account</Th>
              <Th isNumeric>NominatorTax</Th>
              <Th isNumeric>Min Nominator Stake</Th>
              <Th isNumeric>Funds in stake</Th>
              {isOneOfTheOperators && <Th>Actions</Th>}
            </Tr>
          </Thead>
          {operators.length === 0 ? (
            <Tbody>
              {[0, 1, 2, 3].map((_, key) => (
                <Tr key={key}>
                  <Td {...textStyles.text} isNumeric>
                    {key}
                  </Td>
                  <Td {...textStyles.text}></Td>
                  <Td {...textStyles.text}></Td>
                  <Td {...textStyles.text}></Td>
                  <Td {...textStyles.text} isNumeric></Td>
                  <Td {...textStyles.text} isNumeric></Td>
                  <Td {...textStyles.text} isNumeric></Td>
                  {isOneOfTheOperators && <Td {...textStyles.text}></Td>}
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Tbody>
              {operators.map((operator, key) => (
                <Tr key={key}>
                  <Td {...textStyles.text} isNumeric>
                    {operator.operatorDetail.currentDomainId}
                  </Td>
                  <Td {...textStyles.text} isNumeric>
                    {operator.operatorId}
                  </Td>
                  <Td {...textStyles.text}>{formatAddress(operator.operatorDetail.signingKey)}</Td>
                  <Td {...textStyles.link}>
                    <Link href={`${ROUTES.OPERATOR_STATS}/${operatorOwner ?? stakingConstants.operatorIdOwner[key]}`}>
                      {formatAddress(operatorOwner ?? stakingConstants.operatorIdOwner[key])}
                    </Link>
                  </Td>
                  <Td {...textStyles.text} isNumeric>
                    {operator.operatorDetail.nominationTax}%
                  </Td>
                  <Td {...textStyles.text} isNumeric>
                    {hexToFormattedNumber(operator.operatorDetail.minimumNominatorStake)}
                  </Td>
                  <Td {...textStyles.text} isNumeric>
                    {hexToFormattedNumber(operator.operatorDetail.currentTotalStake)}
                  </Td>
                  {isOneOfTheOperators &&
                    subspaceAccount &&
                    stakingConstants.operatorIdOwner[
                      stakingConstants.operators.findIndex((o) => o.operatorId === operator.operatorId)
                    ] === subspaceAccount && (
                      <Td {...textStyles.text}>
                        <Actions operatorId={operator.operatorId} />
                      </Td>
                    )}
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
    </Box>
  )
}
