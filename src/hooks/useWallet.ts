import { useRouter } from 'next/navigation'
import { ROUTES } from '../constants'
import { useExtension } from '../states/extension'

export const useWallet = () => {
  const { push } = useRouter()
  const { extension } = useExtension()

  const handleConnect = () => push(ROUTES.REGISTER)

  return {
    extension,
    handleConnect
  }
}
