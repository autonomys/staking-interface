import { useMediaQuery } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useView } from '../states/view'

export const useMobile = () => {
  const { setIsMobile } = useView()
  const [isLargerThan800] = useMediaQuery('(min-width: 800px)', {
    ssr: true,
    fallback: false
  })

  useEffect(() => {
    setIsMobile(!isLargerThan800)
  }, [isLargerThan800, setIsMobile])
}
