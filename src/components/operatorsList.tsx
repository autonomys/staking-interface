import { Box, HStack, Heading, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { encodeAddress } from '@polkadot/keyring'
import Link from 'next/link'
import React, { useMemo } from 'react'
import { ROUTES, SUBSPACE_ACCOUNT_FORMAT, headingStyles, tHeadStyles, tableStyles, textStyles } from '../constants'
import { useExtension } from '../states/extension'
import { formatAddress, hexToFormattedNumber } from '../utils'
import { Actions } from './actions'

interface OperatorsListProps {
  operatorOwner?: string
}

export const OperatorsList: React.FC<OperatorsListProps> = ({ operatorOwner }) => {
  const extension = useExtension((state) => state.extension)
  const stakingConstants = useExtension((state) => state.stakingConstants)
  const subspaceAccount = useExtension((state) => state.subspaceAccount)

  const operators = useMemo(() => {
    if (operatorOwner) return stakingConstants.operators.filter((operator) => operator.operatorOwner === operatorOwner)
    return stakingConstants.operators
  }, [operatorOwner, stakingConstants.operators])

  const isOneOfTheOperators = useMemo(
    () => subspaceAccount && stakingConstants.operators.find((operator) => operator.operatorOwner === subspaceAccount),
    [stakingConstants.operators, subspaceAccount]
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
              {[0].map((_, key) => (
                <Tr key={key}>
                  <Td {...textStyles.text} colSpan={isOneOfTheOperators ? 7 : 6}>
                    <Text>No operators found</Text>
                    {subspaceAccount === operatorOwner && (
                      <Text>
                        If you recently register a operator, it may take up to 10 minutes for the operator to be added.
                      </Text>
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Tbody>
              {operators.map((operator, key) => {
                const findMatchingAccount =
                  extension.data &&
                  extension.data.accounts.find(
                    (a) => encodeAddress(a.address, SUBSPACE_ACCOUNT_FORMAT) === operator.operatorOwner
                  )
                const accountLabel =
                  findMatchingAccount && findMatchingAccount.meta.name
                    ? `(${findMatchingAccount.meta.name}) ${formatAddress(operatorOwner ?? operator.operatorOwner)}`
                    : formatAddress(operatorOwner ?? operator.operatorOwner)
                return (
                  <Tr key={key}>
                    <Td {...textStyles.text} isNumeric>
                      {operator.operatorId}
                    </Td>
                    <Td {...textStyles.text}>{formatAddress(operator.operatorDetail.signingKey)}</Td>
                    <Td {...textStyles.link}>
                      <Link href={`${ROUTES.OPERATOR_STATS}/${operatorOwner ?? operator.operatorOwner}`}>
                        {accountLabel}
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
                    {isOneOfTheOperators && subspaceAccount && operator.operatorOwner === subspaceAccount && (
                      <Td {...textStyles.text}>
                        <Actions operatorId={operator.operatorId} />
                      </Td>
                    )}
                  </Tr>
                )
              })}
            </Tbody>
          )}
        </Table>
      </TableContainer>
    </Box>
  )
}
