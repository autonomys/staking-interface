import { useColorMode } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export const useClientSide = () => {
  const [clientSide, setClientSide] = useState(false)
  const { colorMode, toggleColorMode } = useColorMode()

  useEffect(() => {
    setClientSide(true)
  }, [])

  useEffect(() => {
    if (colorMode === 'dark') toggleColorMode()
  }, [colorMode, toggleColorMode])

  return clientSide
}
