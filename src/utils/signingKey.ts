import { hexToU8a, isHex } from '@polkadot/util'

export const isValidSr25519PublicKey = (publicKeyHex: string) => {
  // Check if the string is a valid hexadecimal representation
  if (!isHex(publicKeyHex)) {
    return false
  }

  // Convert the hexadecimal string to a Uint8Array
  const publicKeyBytes = hexToU8a(publicKeyHex)

  // Check the length of the public key
  return publicKeyBytes.length === 32
}
