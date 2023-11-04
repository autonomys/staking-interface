export const formatAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-6)}`

export const formatNumber = (number: number, decimals = 4) =>
  (Math.round(number * 100) / 100).toFixed(decimals).toLocaleString()

export const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

export const hexToNumber = (hex: string) => parseInt(hex, 16) / 10 ** 16

export const hexToFormattedNumber = (hex: string, decimals = 4) => formatNumber(hexToNumber(hex), decimals)
