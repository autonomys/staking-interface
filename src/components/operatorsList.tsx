import { Box, HStack, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { headingStyles, tHeadStyles, tableStyles, textStyles } from '../constants'
import { useExtension } from '../states/extension'
import { formatAddress, hexToFormattedNumber } from '../utils'

interface OperatorsListProps {
  operatorOwner?: string
}

export const OperatorsList: React.FC<OperatorsListProps> = ({ operatorOwner }) => {
  const stakingConstants = useExtension((state) => state.stakingConstants)

  const operators = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.operators.filter((_, key) => stakingConstants.operatorIdOwner[key] === operatorOwner)
    return stakingConstants.operators
  }, [operatorOwner, stakingConstants.operatorIdOwner, stakingConstants.operators])

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
              <Th>Operator Account</Th>
              <Th isNumeric>NominatorTax</Th>
              <Th isNumeric>Min Nominator Stake</Th>
              <Th isNumeric>Funds in stake</Th>
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
                  <Td {...textStyles.text} isNumeric></Td>
                  <Td {...textStyles.text} isNumeric></Td>
                  <Td {...textStyles.text} isNumeric></Td>
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
                  <Td {...textStyles.link}>
                    <Link href={`/operatorStats/${stakingConstants.operatorIdOwner[key]}`}>
                      {formatAddress(stakingConstants.operatorIdOwner[key])}
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
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
    </Box>
  )
}
