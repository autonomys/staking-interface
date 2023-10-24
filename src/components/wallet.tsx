import {
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure
} from '@chakra-ui/react'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

type TExtensionState = {
  loading: boolean
  data?: {
    accounts: InjectedAccountWithMeta[]
    defaultAccount: InjectedAccountWithMeta
  }
  error: null | Error
}

const initialExtensionState: TExtensionState = {
  loading: false,
  data: undefined,
  error: null
}

export const ConnectWallet = () => {
  const [state, setState] = useState(initialExtensionState)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const finalRef = useRef(null)

  const handleConnect = useCallback(() => {
    setState({ ...initialExtensionState, loading: true })

    web3Enable('subspace-staking-interface')
      .then((injectedExtensions) => {
        if (!injectedExtensions.length) return Promise.reject(new Error('NO_INJECTED_EXTENSIONS'))

        return web3Accounts()
      })
      .then((accounts) => {
        if (!accounts.length) return Promise.reject(new Error('NO_ACCOUNTS'))

        setState({
          error: null,
          loading: false,
          data: {
            accounts: accounts,
            defaultAccount: accounts[0]
          }
        })
      })
      .catch((error) => {
        console.error('Error with connect', error)
        setState({ error, loading: false, data: undefined })
      })
  }, [])

  const handleSelectWallet = useCallback(
    (source: string) => {
      const mainAccount = state.data?.accounts.find((account) => account.meta.source === source)
      console.log('mainAccount', mainAccount)
      if (mainAccount && state.data)
        setState({
          ...state,
          data: {
            ...state.data,
            defaultAccount: mainAccount
          }
        })
      onClose()
    },
    [onClose, state]
  )

  const handleClick = useCallback(() => {
    handleConnect()
    onOpen()
  }, [handleConnect, onOpen])

  useEffect(() => {
    handleConnect()
  }, [handleConnect])

  const formatAddress = useCallback((address: string) => `${address.slice(0, 4)}...${address.slice(-6)}`, [])

  return (
    <>
      <Button
        bgGradient='linear(to-r, #EA71F9, #4D397A)'
        color='#FFFFFF'
        borderRadius='0'
        pl='16px'
        pr='16px'
        pt='8px'
        pb='7px'
        isLoading={state.loading}
        onClick={handleClick}
        _hover={{
          bgGradient: 'linear(to-r, #4D397A, #EA71F9)'
        }}>
        {state.data?.defaultAccount ? formatAddress(state.data.defaultAccount.address) : 'Connect Wallet'}
      </Button>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect your wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <VStack>
                <Heading size='lg' fontWeight='500' fontSize='30px' ml='2' color='#5B5252'>
                  Select your wallet provider
                </Heading>
                <Grid templateColumns='repeat(1, 1fr)' gap={6} p='6'>
                  <GridItem>
                    <Button
                      variant='outline'
                      w='200px'
                      borderColor='brand'
                      onClick={() => handleSelectWallet('polkadot-js')}>
                      <Image src={'/images/polkadot-dot.svg'} width={20} height={20} alt={'metamask'} />
                      <Text ml='2'>Polkadot.js</Text>
                    </Button>
                  </GridItem>
                  <GridItem>
                    <Button
                      variant='outline'
                      w='200px'
                      borderColor='brand'
                      onClick={() => handleSelectWallet('subwallet-js')}>
                      <Image src={'/images/subwallet.svg'} width={20} height={20} alt={'metamask'} />
                      <Text ml='2'>SubWallet</Text>
                    </Button>
                  </GridItem>
                  {/* Uncomment when metamask snap is ready */}
                  {/* <GridItem>
                    <Button variant='outline' w='200px' borderColor='brand' onClick={() => handleSelectWallet('')}>
                      <Image src={'/images/metamask.svg'} width={20} height={20} alt={'metamask'} />
                      <Text ml='2'>MetaMask Snap</Text>
                    </Button>
                  </GridItem> */}
                </Grid>
              </VStack>
            </Center>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='brand' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
