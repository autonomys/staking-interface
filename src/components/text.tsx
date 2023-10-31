import { Text } from '@chakra-ui/react'
import React from 'react'

export enum TextElementFontWeight {
  TITLE = '500',
  VALUE = '700'
}

interface TextElementProps {
  children: string
  fontWeight: TextElementFontWeight
  mt?: string
}

export const TextElement: React.FC<TextElementProps> = ({ children, fontWeight, mt }) => {
  return (
    <Text fontWeight={fontWeight} fontSize='30px' color='#5B5252' mt={mt}>
      {children}
    </Text>
  )
}
