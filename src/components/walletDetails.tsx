import { HStack, Text, Tooltip } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { DECIMALS, SYMBOL } from '../constants'
import { useExtension } from '../states/extension'
import { formatNumber, hexToNumber } from '../utils'
import { TokenBalance, TokenStaked } from './icons'

const TokenBalanceSection: React.FC = () => {
  const {subspaceAccount, accountDetails} = useExtension((state) => state)

  const accountBalance = useMemo(
    () => formatNumber(accountDetails ? parseInt(accountDetails.data.free) / 10 ** DECIMALS : 0, 2),
    [accountDetails]
  )

  return (
    <HStack w='6vw' h='8vh' display='flex' flexDir='row'>
      {subspaceAccount && (
        <>
          <TokenBalance />
          <Tooltip hasArrow label='Account balance' aria-label='Account balance' placement='bottom'>
            <Text whiteSpace='nowrap'>
              {accountBalance} {SYMBOL}
            </Text>
          </Tooltip>
        </>
      )}
    </HStack>
  )
}

const TokenStakedSection: React.FC = () => {
  const subspaceAccount = useExtension((state) => state.subspaceAccount)
  const {subspaceAccount, stakingConstants} = useExtension((state) => state)

  const accountBalanceStaked = useMemo(() => {
    return formatNumber(
      stakingConstants.operators
        .filter((operator) => operator.operatorOwner === subspaceAccount)
        .reduce((acc, operator) => acc + hexToNumber(operator.operatorDetail.currentTotalStake), 0),
      2
    )
  }, [subspaceAccount, stakingConstants.operators])

  return (
    <HStack w='6vw' h='8vh' display='flex' flexDir='row'>
      {subspaceAccount && (
        <>
          <TokenStaked />
          <Tooltip hasArrow label='Account balance staked' aria-label='Account balance staked' placement='bottom'>
            <Text whiteSpace='nowrap'>
              {accountBalanceStaked} {SYMBOL}
            </Text>
          </Tooltip>
        </>
      )}
    </HStack>
  )
}

export const WalletDetails: React.FC = () => {
  return (
    <HStack w='15vw' h='8vh' display='flex' flexDir='row'>
      <TokenBalanceSection />
      <TokenStakedSection />
    </HStack>
  )
}
