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
  VStack
} from '@chakra-ui/react'
import Image from 'next/image'
import { useRef } from 'react'
import { useConnect } from '../hooks/useConnect'
import { useExtension } from '../states/extension'
import { formatAddress } from '../utils'

export const ConnectWallet = () => {
  const extension = useExtension((state) => state.extension)
  const { handleSelectWallet, handleClick, isConnectOpen, onConnectClose } = useConnect()
  const finalRef = useRef(null)

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
        isLoading={extension.loading}
        onClick={handleClick}
        _hover={{
          bgGradient: 'linear(to-r, #4D397A, #EA71F9)'
        }}>
        {extension.data?.defaultAccount ? formatAddress(extension.data.defaultAccount.address) : 'Connect Wallet'}
      </Button>

      <Modal finalFocusRef={finalRef} isOpen={isConnectOpen} onClose={onConnectClose}>
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
            <Button colorScheme='brand' mr={3} onClick={onConnectClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
