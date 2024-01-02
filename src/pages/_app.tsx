import { ColorModeScript } from '@chakra-ui/color-mode'
import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import React from 'react'
import { WagmiConfig, configureChains, createConfig } from 'wagmi'
import { mainnet, optimism } from 'wagmi/chains'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { publicProvider } from 'wagmi/providers/public'
import { Layout } from '../components/layout'
import Header from '../config'
import { useMobile } from '../hooks/useMobile'
import theme from '../styles/theme'

const { chains, publicClient, webSocketPublicClient } = configureChains([mainnet, optimism], [publicProvider()])

const connector = new InjectedConnector({ chains })

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [connector]
})

const App: React.FC<AppProps> = ({ Component, pageProps = { title: 'Subspace Faucet' } }) => {
  useMobile()

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Header title={pageProps.title} />
      <WagmiConfig config={config}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </WagmiConfig>
    </ChakraProvider>
  )
}

export default App
