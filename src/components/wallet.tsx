import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Button,
  Center,
  Grid,
  GridItem,
  Heading,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react'
import { ApiPromise } from '@polkadot/api'
import { encodeAddress } from '@polkadot/keyring'
import { WsProvider } from '@polkadot/rpc-provider'
import { enableSubspaceSnap } from '@subspace/metamask-subspace-adapter'
import type { MetamaskSubspaceSnap } from '@subspace/metamask-subspace-adapter/build/snap'
import Image from 'next/image'
import { useCallback, useRef } from 'react'
import { useConnect as useConnectWagmi } from 'wagmi' // , useDisconnect
import { connectWalletButtonStyles } from '../constants'
import { useConnect } from '../hooks/useConnect'
import { useExtension, useLastConnection, useTransactions } from '../states/extension'
import { formatAddress } from '../utils'

interface ExtensionIconProps {
  extension: string
}

export const defaultSnapId = 'local:http://localhost:8081'

const ExtensionIcon: React.FC<ExtensionIconProps> = ({ extension }) => {
  switch (extension) {
    case 'polkadot-js':
      return <Image src={'/images/polkadot-dot.svg'} width={20} height={20} alt={'metamask'} />
    case 'subwallet-js':
      return <Image src={'/images/subwallet.svg'} width={20} height={20} alt={'metamask'} />
    case 'metamask':
      return <Image src={'/images/metamask.svg'} width={20} height={20} alt={'metamask'} />
    default:
      return null
  }
}

export const ConnectWallet = () => {
  const toast = useToast()
  const {
    api,
    extension,
    subspaceAccount,
    chainDetails,
    setSubspaceAccount,
    setMMApi,
    // setInjectedExtension,
    setExtension
  } = useExtension()
  const { setSubspaceAccount: setLastSubspaceAccount } = useLastConnection()
  // const { disconnectAsync } = useDisconnect()
  const { connectors, connectAsync } = useConnectWagmi()
  const { transactions, addTransactionToWatch } = useTransactions()
  const {
    handleSelectFirstWalletFromExtension,
    handleSelectWallet,
    handleDisconnect,
    onConnectOpen,
    isConnectOpen,
    onConnectClose
  } = useConnect()
  const finalRef = useRef(null)
  const { ss58Format } = chainDetails

  const installSubspaceSnap = useCallback(async (): Promise<{
    isSnapInstalled: boolean
    snap?: MetamaskSubspaceSnap
  }> => {
    const snapId = process.env.REACT_APP_SNAP_ID ? process.env.REACT_APP_SNAP_ID : defaultSnapId
    try {
      // try {
      //   disconnectAsync && (await disconnectAsync())
      // } catch (e) {
      //   console.error('e', e)
      // }
      try {
        const connector = connectors.find((c) => c.id === 'metaMask')
        connector && (await connectAsync({ connector }))
      } catch (e) {
        console.error('e', e)
      }
      const snap = await enableSubspaceSnap({ networkName: 'gemini-3g' }, snapId)
      toast({
        title: 'MetaMask Snap installed',
        description: 'You can now use MetaMask Snap to connect to Subspace.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })

      const mmApi = snap.getMetamaskSnapApi()
      const address = await mmApi.getAddress()
      console.log('address', address)
      const balance = await mmApi.getBalance()
      console.log('balance', balance)

      const allTx = await mmApi.getAllTransactions()
      console.log('allTx', allTx)

      if (!api) {
        const wsProvider = new WsProvider(process.env.NEXT_PUBLIC_PROVIDER_URL)
        const api = await ApiPromise.create({ provider: wsProvider })

        const block = await api.rpc.chain.getBlock()
        console.log('block', block)
      } else {
        const block = await api.rpc.chain.getBlock()
        console.log('block', block.toHuman())
      }

      for (const tx of allTx) {
        const isAlreadyWatched = transactions.find((t) => t.extrinsicHash === tx.hash)
        if (!isAlreadyWatched)
          addTransactionToWatch({
            extrinsicHash: tx.hash,
            method: '',
            sender: tx.sender,
            fromBlockNumber: 0
          })
      }

      // const latestBlock = await mmApi.getLatestBlock()
      // console.info('latestBlock:', latestBlock)
      // const pubKey = await mmApi.getPublicKey()
      // console.info('pubKey:', pubKey)

      setSubspaceAccount(address)
      setLastSubspaceAccount(address)

      setMMApi(mmApi)
      setExtension({
        error: null,
        loading: false,
        data: {
          accounts: extension.data
            ? [
                ...extension.data.accounts,
                {
                  address: address,
                  meta: {
                    name: 'MetaMask',
                    source: 'metamask',
                    genesisHash: '0x0000000'
                  },
                  type: 'sr25519'
                }
              ]
            : [
                {
                  address: address,
                  meta: {
                    name: 'MetaMask',
                    source: 'metamask',
                    genesisHash: '0x0000000'
                  },
                  type: 'sr25519'
                }
              ],
          defaultAccount: {
            address: address,
            meta: {
              name: 'MetaMask',
              source: 'metamask',
              genesisHash: '0x0000000'
            },
            type: 'sr25519'
          }
        }
      })
      //   setInjectedExtension({
      //     name: string;
      //     version: string;

      // accounts: InjectedAccounts;
      // metadata?: InjectedMetadata;
      // provider?: InjectedProvider;
      // signer: InjectedSigner;
      //   })

      return { isSnapInstalled: true, snap }
    } catch (err) {
      console.error('SnapConnectorButton-Error:', err)
      return { isSnapInstalled: false }
    }
  }, [
    addTransactionToWatch,
    api,
    connectAsync,
    connectors,
    extension.data,
    setExtension,
    setLastSubspaceAccount,
    setMMApi,
    setSubspaceAccount,
    toast,
    transactions
  ])

  const handleMetaMaskSnap = useCallback(async () => {
    const installed = await installSubspaceSnap()
    console.log('installed', installed)
    if (installed.isSnapInstalled) {
      // enableSnap(address)
      onConnectClose()
    }
  }, [installSubspaceSnap, onConnectClose])

  return (
    <>
      {!extension.data || !subspaceAccount ? (
        <Button {...connectWalletButtonStyles} onClick={onConnectOpen}>
          Connect Wallet
        </Button>
      ) : (
        <Menu>
          <MenuButton {...connectWalletButtonStyles} as={Button} rightIcon={<ChevronDownIcon pl='2' />}>
            {formatAddress(subspaceAccount)}
          </MenuButton>
          <MenuList>
            {extension.data.accounts.map((account) => (
              <MenuItem
                key={`${account.meta.source}-${account.address}`}
                onClick={() => handleSelectWallet(account.address)}
                _hover={{
                  bgGradient: 'linear(to-r, #A28CD2, #F4ABFD)'
                }}>
                <ExtensionIcon extension={account.meta.source} />
                <Text ml='2'>
                  {`${account.meta.name && `(${account.meta.name})`} ${formatAddress(
                    encodeAddress(account.address, ss58Format)
                  )}`}
                </Text>
              </MenuItem>
            ))}
            <MenuDivider />
            <MenuItem
              onClick={handleDisconnect}
              _hover={{
                bgGradient: 'linear(to-r, #A28CD2, #F4ABFD)'
              }}>
              <Image src={'/images/disconnect.svg'} width={20} height={20} alt={'disconnect'} />
              <Text ml='2'>Disconnect</Text>
            </MenuItem>
          </MenuList>
        </Menu>
      )}

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
                      onClick={() => handleSelectFirstWalletFromExtension('polkadot-js')}>
                      <ExtensionIcon extension='polkadot-js' />
                      <Text ml='2'>Polkadot.js</Text>
                    </Button>
                  </GridItem>
                  <GridItem>
                    <Button
                      variant='outline'
                      w='200px'
                      borderColor='brand'
                      onClick={() => handleSelectFirstWalletFromExtension('subwallet-js')}>
                      <ExtensionIcon extension='subwallet-js' />
                      <Text ml='2'>SubWallet</Text>
                    </Button>
                  </GridItem>
                  {/* Uncomment when metamask snap is ready */}
                  <GridItem>
                    <Button variant='outline' w='200px' borderColor='brand' onClick={() => handleMetaMaskSnap()}>
                      <ExtensionIcon extension='metamask' />
                      <Text ml='2'>MetaMask Snap</Text>
                    </Button>
                  </GridItem>
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
