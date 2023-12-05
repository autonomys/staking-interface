import { HStack, Text, Tooltip } from '@chakra-ui/react'
import React, { useMemo } from 'react'
import { useExtension } from '../states/extension'
import { formatNumber, hexToNumber } from '../utils'
import { TokenBalance, TokenStaked } from './icons'

const TokenBalanceSection: React.FC = () => {
  const { subspaceAccount, accountDetails, chainDetails } = useExtension((state) => state)
  const { tokenDecimals, tokenSymbol } = chainDetails

  const accountBalance = useMemo(
    () => formatNumber(accountDetails ? parseInt(accountDetails.data.free) / 10 ** tokenDecimals : 0, 2),
    [accountDetails, tokenDecimals]
  )

  return (
    <HStack w='6vw' h='8vh' maxW='120px' display='flex' flexDir='row'>
      {subspaceAccount && (
        <>
          <TokenBalance />
          <Tooltip hasArrow label='Account balance' aria-label='Account balance' placement='bottom' bg='brand.500'>
            <Text whiteSpace='nowrap'>
              {accountBalance} {tokenSymbol}
            </Text>
          </Tooltip>
        </>
      )}
    </HStack>
  )
}

const TokenStakedSection: React.FC = () => {
  const { subspaceAccount, stakingConstants, chainDetails } = useExtension((state) => state)
  const { tokenDecimals, tokenSymbol } = chainDetails

  const accountBalanceStaked = useMemo(() => {
    return formatNumber(
      stakingConstants.nominators
        .filter((nominator) => nominator.nominatorOwner === subspaceAccount)
        .reduce((acc, nominator) => acc + hexToNumber(nominator.shares, tokenDecimals), 0),
      2
    )
  }, [stakingConstants.nominators, subspaceAccount, tokenDecimals])

  return (
    <HStack w='6vw' h='8vh' maxW='120px' display='flex' flexDir='row'>
      {subspaceAccount && (
        <>
          <TokenStaked />
          <Tooltip
            hasArrow
            label='Account balance staked or nominated'
            aria-label='Account balance staked or nominated'
            placement='bottom'>
            <Text whiteSpace='nowrap'>
              {accountBalanceStaked} {tokenSymbol}
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
