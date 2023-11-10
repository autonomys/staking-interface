import { ChakraStylesConfig, Select, SingleValue } from 'chakra-react-select'
import React from 'react'
import { useManage } from '../hooks/useManage'
import { Option } from '../types'

export const OperatorSelector: React.FC = () => {
  const { operatorsOptions, operatorId, handleChangeOperatorId } = useManage()

  const chakraStyles: ChakraStylesConfig = {
    control: (base) => ({
      ...base,
      bg: '#FFFFFF',
      color: '#7D7D7D',
      borderColor: '#141414',
      borderRadius: '5',
      mt: '4'
    })
  }

  return (
    <Select
      placeholder='Operator ID'
      name='operatorId'
      value={operatorsOptions.find((option) => option.value.toString() === operatorId)}
      onChange={(newValue: unknown) => handleChangeOperatorId(newValue as SingleValue<Option<number>>)}
      options={operatorsOptions}
      chakraStyles={chakraStyles}
    />
  )
}
