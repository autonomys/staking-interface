import { Box, Center, HStack, Heading, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { ConnectWallet } from '../components/buttons'
import { Wallet } from '../components/icons'
import { OperatorsList } from '../components/operatorsList'
import { OperatorsTotal } from '../components/operatorsTotal'
import { headingStyles, pageStyles } from '../constants'
import { useOnchainData } from '../hooks/useOnchainData'
import { useWallet } from '../hooks/useWallet'
import { useExtension } from '../states/extension'

const Page: React.FC = () => {
  const subspaceAccount = useExtension((state) => state.subspaceAccount)
  const { handleConnect } = useWallet()
  const { handleOnchainData } = useOnchainData()

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData, subspaceAccount])

  return (
    <Box {...pageStyles}>
      <HStack>
        <Wallet />
        <Heading {...headingStyles.page}>Manage the stake</Heading>
      </HStack>
      {subspaceAccount ? (
        <>
          <OperatorsTotal operatorOwner={subspaceAccount} />
          <OperatorsList operatorOwner={subspaceAccount} fromManage />
        </>
      ) : (
        <Box mt='4'>
          <Center>
            <Text color='#6C6666' pt='2' pb='2'>
              Please connect your wallet
            </Text>
          </Center>
          <Center>
            <ConnectWallet onClick={handleConnect} />
          </Center>
        </Box>
      )}
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Manage Stake' } }
}

export default Page
