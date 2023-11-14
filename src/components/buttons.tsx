import { Button, ButtonProps } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

const Connect = dynamic(() => import('./wallet').then((m) => m.ConnectWallet), {
  ssr: false
})

export const FormButton: React.FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <Button
      bgGradient='linear(to-r, #846F87, #4D397A)'
      color='#FFFFFF'
      borderRadius='0'
      mt='8'
      pl='16px'
      pr='16px'
      pt='8px'
      pb='7px'
      w='228px'
      onClick={onClick}
      _hover={{
        bgGradient: 'linear(to-r, #4D397A, #846F87)'
      }}>
      {children}
    </Button>
  )
}

export const ConnectWallet: React.FC<ButtonProps> = ({ onClick }) => {
  const [clientSide, setClientSide] = useState(false)

  useEffect(() => {
    setClientSide(true)
  }, [])

  if (!clientSide)
    return (
      <Button
        bgGradient='linear(to-r, #EA71F9, #4D397A)'
        color='#FFFFFF'
        borderRadius='0'
        pl='16px'
        pr='16px'
        pt='8px'
        pb='7px'
        minW='140px'
        onClick={onClick}
        _hover={{
          bgGradient: 'linear(to-r, #4D397A, #EA71F9)'
        }}>
        Connect Wallet
      </Button>
    )

  return <Connect />
}
