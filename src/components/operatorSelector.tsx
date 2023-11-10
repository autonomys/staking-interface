import { ChakraStylesConfig, Select, SingleValue } from 'chakra-react-select'
import React from 'react'
import { ActionType } from '../constants'
import { useManage } from '../hooks/useManage'
import { Option } from '../types'

interface OperatorSelectorProps {
  actionType: ActionType
}

export const OperatorSelector: React.FC<OperatorSelectorProps> = ({ actionType }) => {
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
      value={operatorsOptions.find((option) => option.value.toString() === operatorId(actionType))}
      onChange={(newValue: unknown) => handleChangeOperatorId(actionType, newValue as SingleValue<Option<number>>)}
      options={operatorsOptions}
      chakraStyles={chakraStyles}
    />
  )
}
