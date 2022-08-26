import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { ChakraProvider } from '@chakra-ui/react'
import { Web3ReactProvider } from '@web3-react/core'

import { getLibrary } from '../config/web3'

import MainLayout from '../layouts/main'

function MyApp({ Component, pageProps }: AppProps) {  

  return (
    <ChakraProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </Web3ReactProvider>
    </ChakraProvider>
  )
}

export default MyApp
