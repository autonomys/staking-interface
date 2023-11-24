import { DECIMALS } from '../constants'

export const formatAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-6)}`

export const formatNumber = (number: number | string, decimals = 4) => {
  if (typeof number === 'string') number = number.includes('.') ? parseFloat(number) : parseInt(number)
  return (Math.round(number * 100) / 100).toFixed(decimals).toLocaleString()
}

export const parseNumber = (number: string, decimals: number = DECIMALS) =>
  (parseFloat(number) * 10 ** decimals).toString()

export const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

export const hexToNumber = (hex: string, decimals: number = DECIMALS) => parseInt(hex, 16) / 10 ** decimals

export const hexToFormattedNumber = (hex: string, decimals = 4) => formatNumber(hexToNumber(hex), decimals)
