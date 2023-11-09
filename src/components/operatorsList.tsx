import { Box, HStack, Heading, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { useExtension } from '../states/extension'
import { formatAddress, hexToFormattedNumber } from '../utils'

interface OperatorsListProps {
  operatorOwner?: string
}

export const OperatorsList: React.FC<OperatorsListProps> = ({ operatorOwner }) => {
  const stakingConstants = useExtension((state) => state.stakingConstants)

  const operators = useMemo(() => {
    if (operatorOwner)
      return stakingConstants.operators
        .filter((_, key) => stakingConstants.operatorIdOwner[key] === operatorOwner)
        .map((_, key) => stakingConstants.operators[key])
    return stakingConstants.operators
  }, [operatorOwner, stakingConstants.operatorIdOwner, stakingConstants.operators])

  return (
    <Box>
      <Box mt='6'>
        <HStack mb='6'>
          <Heading size='lg' fontWeight='500' fontSize='40px' ml='2' color='#5B5252'>
            Information across operators
          </Heading>
          {operatorOwner && (
            <Heading size='lg' fontWeight='500' fontSize='24px' ml='2' mt='16px' color='#5B5252'>
              on Account {formatAddress(operatorOwner)}
            </Heading>
          )}
        </HStack>
      </Box>
      <TableContainer>
        <Table borderColor='#B9B9B9' border='1' variant='striped' size='sm'>
          <Thead bg='rgba(0, 0, 0, 0.06)'>
            <Tr>
              <Th isNumeric>DomainID</Th>
              <Th>OperatorID</Th>
              <Th isNumeric>NominatorTax</Th>
              <Th isNumeric>Min Nominator Stake</Th>
              <Th isNumeric>Funds in stake</Th>
            </Tr>
          </Thead>
          {operators.length === 0 ? (
            <Tbody>
              {[0, 1, 2, 3].map((_, key) => (
                <Tr key={key}>
                  <Td isNumeric>{key}</Td>
                  <Td></Td>
                  <Td isNumeric></Td>
                  <Td isNumeric></Td>
                  <Td isNumeric></Td>
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Tbody>
              {operators.map((operator, key) => (
                <Tr key={key}>
                  <Td isNumeric>{operator.currentDomainId}</Td>
                  <Td>
                    <Link href={`/operatorStats/${stakingConstants.operatorIdOwner[key]}`}>
                      {formatAddress(stakingConstants.operatorIdOwner[key])}
                    </Link>
                  </Td>
                  <Td isNumeric>{operator.nominationTax}%</Td>
                  <Td isNumeric>{hexToFormattedNumber(operator.minimumNominatorStake)}</Td>
                  <Td isNumeric>{hexToFormattedNumber(operator.currentTotalStake)}</Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </TableContainer>
    </Box>
  )
}
