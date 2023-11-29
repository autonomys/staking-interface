import { Tooltip } from '@chakra-ui/react'
import React from 'react'
import { SYMBOL } from '../constants'

interface TooltipAmountProps {
  children: React.ReactNode
  amount: number | string
  symbol?: string
}

export const TooltipAmount: React.FC<TooltipAmountProps> = ({ children, amount, symbol = SYMBOL }) => {
  return (
    <Tooltip
      hasArrow
      label={`${amount} ${symbol}`}
      aria-label={`${amount} ${symbol}`}
      placement='bottom'
      bg='brand.500'>
      {children}
    </Tooltip>
  )
}
