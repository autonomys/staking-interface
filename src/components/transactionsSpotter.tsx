import { CheckIcon, ChevronDownIcon, HamburgerIcon, WarningTwoIcon } from '@chakra-ui/icons'
import { Button, HStack, Menu, MenuButton, MenuItem, MenuList, Spinner, Text, VStack } from '@chakra-ui/react'
import React, { useCallback, useEffect, useMemo } from 'react'
import {
  ActionType,
  DECIMALS,
  MAX_BLOCKS_TO_FETCH_FOR_TRANSACTIONS_SPOTTER,
  SUBSCAN_URL,
  SYMBOL,
  TransactionStatus
} from '../constants'
import { useExtension, useTransactions } from '../states/extension'
import { Transaction } from '../types'
import { capitalizeFirstLetter } from '../utils'

export const TransactionsSpotter: React.FC = () => {
  const api = useExtension((state) => state.api)
  const subspaceAccount = useExtension((state) => state.subspaceAccount)

  const transactions = useTransactions((state) => state.transactions)
  const changeTransactionStatus = useTransactions((state) => state.changeTransactionStatus)

  const userTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.sender === subspaceAccount).reverse(),
    [subspaceAccount, transactions]
  )

  const handleSpotTransactions = useCallback(async () => {
    const firstPendingTransaction = transactions.find((transaction) => transaction.status === TransactionStatus.Pending)
    if (!api || !firstPendingTransaction) return

    const verifyNextBlocks = async (blockNumber: number) => {
      try {
        const header = await api.rpc.chain.getBlockHash(blockNumber)
        const signedBlock = await api.rpc.chain.getBlock(header)

        signedBlock.block.extrinsics.forEach((ex) => {
          const block = ex.toHuman() as { isSigned: boolean }

          if (block.isSigned && ex.hash.toHex() === firstPendingTransaction.extrinsicHash)
            changeTransactionStatus(firstPendingTransaction.extrinsicHash, TransactionStatus.Success)
        })
      } catch (error) {
        console.log('error', error)
      }
    }

    for (
      let i = firstPendingTransaction.fromBlockNumber;
      i < firstPendingTransaction.fromBlockNumber + MAX_BLOCKS_TO_FETCH_FOR_TRANSACTIONS_SPOTTER;
      i++
    ) {
      verifyNextBlocks(i)
    }
  }, [api, changeTransactionStatus, transactions])

  useEffect(() => {
    handleSpotTransactions()
  }, [api, handleSpotTransactions, transactions])

  const transactionStatusIcon = useCallback((transaction: Transaction) => {
    switch (transaction.status) {
      case TransactionStatus.Success:
        return <CheckIcon color='brand.500' />
      case TransactionStatus.Failed:
        return <WarningTwoIcon color='brand.500' />
      default:
        return <Spinner size='sm' color='brand.500' />
    }
  }, [])

  const transactionDetails = useCallback(
    (transaction: Transaction) => {
      switch (transaction.method) {
        case 'registerOperator':
          return (
            <VStack align='left'>
              <Text ml='2'>
                {transactionStatusIcon(transaction)} {capitalizeFirstLetter(transaction.method)}{' '}
                {transaction.parameters &&
                  ` on domain Id ${transaction.parameters[0]} with ${
                    parseInt(transaction.parameters[1]) / 10 ** DECIMALS
                  } ${SYMBOL}`}
              </Text>
            </VStack>
          )
        case 'deregisterOperator':
          return (
            <VStack align='left'>
              <Text ml='2'>
                {transactionStatusIcon(transaction)} {capitalizeFirstLetter(ActionType.Deregister)}
                {transaction.parameters && ` operator Id ${transaction.parameters[0]}`}
              </Text>
            </VStack>
          )
        case 'nominateOperator':
          return (
            <VStack align='left'>
              <Text ml='2'>
                {transactionStatusIcon(transaction)} {capitalizeFirstLetter(ActionType.AddFunds)}
                {transaction.parameters &&
                  ` ${parseInt(transaction.parameters[1]) / 10 ** DECIMALS} ${SYMBOL} from operator Id ${
                    transaction.parameters[0]
                  }`}
              </Text>
            </VStack>
          )
        case 'withdrawStake':
          return (
            <VStack align='left'>
              <Text ml='2'>
                {transactionStatusIcon(transaction)} {capitalizeFirstLetter(ActionType.Withdraw)}
                {transaction.parameters &&
                  ` ${JSON.parse(transaction.parameters[1]).Some / 10 ** DECIMALS} ${SYMBOL} from operator Id ${
                    transaction.parameters[0]
                  }`}
              </Text>
            </VStack>
          )
        default:
          break
      }
    },
    [transactionStatusIcon]
  )

  const transactionsList = useMemo(
    () =>
      userTransactions.length > 0 ? (
        userTransactions.map((transaction) => (
          <MenuItem
            key={transaction.extrinsicHash}
            onClick={() => window.open(`${SUBSCAN_URL}extrinsic/${transaction.extrinsicHash}`, '_blank')}>
            {transactionDetails(transaction)}
          </MenuItem>
        ))
      ) : (
        <MenuItem>
          <VStack align='left'>
            <Text ml='2'>No transactions yet</Text>
          </VStack>
        </MenuItem>
      ),
    [transactionDetails, userTransactions]
  )

  const transactionButton = useMemo(() => {
    if (userTransactions.length === 0) return <HamburgerIcon color='brand.500' />

    const isPending = userTransactions.some((transaction) => transaction.status === TransactionStatus.Pending)
    if (isPending) return <Spinner size='sm' color='brand.500' />

    return <CheckIcon color='brand.500' />
  }, [userTransactions])

  return (
    <HStack w='15vw' h='8vh' display='flex' flexDir='row' color='brand.500'>
      <Menu size='sm'>
        <MenuButton as={Button} rightIcon={<ChevronDownIcon pl='2' />}>
          {transactionButton}
        </MenuButton>
        <MenuList>{transactionsList}</MenuList>
      </Menu>
    </HStack>
  )
}
