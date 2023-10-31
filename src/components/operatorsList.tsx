import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import React from 'react'
import { useRegistration } from '../states/registration'

export const OperatorsList: React.FC = () => {
  const registrations = useRegistration((state) => state.registrations)

  return (
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
        {registrations.length === 0 ? (
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
            {registrations.map((registration, key) => (
              <Tr key={key}>
                <Td isNumeric>{registration.domainId}</Td>
                <Td>{registration.signingKey}</Td>
                <Td isNumeric>{registration.nominatorTax}</Td>
                <Td isNumeric>{registration.minimumNominatorStake}</Td>
                <Td isNumeric>{registration.amountToStake}</Td>
              </Tr>
            ))}
          </Tbody>
        )}
      </Table>
    </TableContainer>
  )
}
