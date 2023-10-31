export const formatAddress = (address: string) => `${address.slice(0, 4)}...${address.slice(-6)}`

export const formatNumber = (number: number) => (Math.round(number * 100) / 100).toFixed(2).toLocaleString()

export const capitalizeFirstLetter = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)
