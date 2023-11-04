import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Text
} from '@chakra-ui/react'
import React from 'react'
import { FormButton } from '../components/buttons'
import { Wallet } from '../components/icons'
import { OperatorsList } from '../components/operatorsList'
import { OperatorsTotal } from '../components/operatorsTotal'
import { ActionType, SYMBOL } from '../constants'
import { useManage } from '../hooks/useManage'
import { useExtension } from '../states/extension'
import { useRegistration } from '../states/registration'

const Page: React.FC = () => {
  const isErrorsField = useRegistration((state) => state.isErrorsField)
  const subspaceAccount = useExtension((state) => state.subspaceAccount)
  const { handleChange, handleMaxAmountToAddFunds, handleSubmit } = useManage()

  return (
    <Box minW='60vw' maxW='60vw' mt='10' p='4' border='0'>
      <HStack>
        <Wallet />
        <Heading ml='2'>Manage the stake</Heading>
      </HStack>
      <OperatorsList operatorOwner={subspaceAccount} />
      <Flex>
        <Spacer />
        <Box>
          <HStack mb='2' w='100%' alignItems='flex-end' textAlign='right' alignContent='flex-end'>
            <Text color='#6C6666' pt='2' pb='2'>
              Operator deregistration
            </Text>
            <Input
              placeholder='Operator ID'
              bg='#FFFFFF'
              borderColor='#141414'
              color='#7D7D7D'
              mt='4'
              w='48'
              borderRadius='5'
              pl='16px'
              pr='16px'
              pt='8px'
              pb='7px'
              onChange={(e) => handleChange(ActionType.Deregister, e)}
              _placeholder={{
                color: '#7D7D7D'
              }}
            />
            <Button
              bg='#999393'
              borderColor='#EAEBEF'
              color='#FFFFFF'
              mt='4'
              w='124px'
              borderRadius='0'
              pl='16px'
              pr='16px'
              pt='8px'
              pb='7px'
              onClick={() => handleSubmit(ActionType.Deregister)}>
              De-register
            </Button>
          </HStack>
        </Box>
      </Flex>
      <Box>
        <OperatorsTotal operatorOwner={subspaceAccount} />
        <Grid templateColumns='repeat(2, 1fr)' gap={6} mt='12' mb='24'>
          <GridItem w='100%'>
            <FormControl isInvalid={isErrorsField['operatorId']}>
              <FormLabel fontWeight='500' fontSize='40px' color='#5B5252'>
                Add more funds
              </FormLabel>
              <Input
                name='operatorId'
                mt='4'
                borderColor='#141414'
                border='1px'
                w='479px'
                placeholder='Operator ID'
                onChange={(e) => handleChange(ActionType.AddFunds, e)}
                _placeholder={{ color: '#7D7D7D' }}
              />
              {isErrorsField['operatorId'] ? (
                <FormErrorMessage h='10'>The operator id you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorsField['amount']}>
              <InputGroup size='md' mt='4'>
                <Input
                  name='amount'
                  borderColor='#141414'
                  border='1px'
                  w='479px'
                  placeholder={`Amount, ${SYMBOL}`}
                  onChange={(e) => handleChange(ActionType.AddFunds, e)}
                  _placeholder={{ color: '#7D7D7D' }}
                />
                <InputRightElement>
                  <Button m={1} onClick={handleMaxAmountToAddFunds}>
                    Max
                  </Button>
                </InputRightElement>
              </InputGroup>
              {isErrorsField['amount'] ? (
                <FormErrorMessage h='10'>The amount you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormButton onClick={() => handleSubmit(ActionType.AddFunds)}>Add more funds</FormButton>
          </GridItem>
          <GridItem w='100%'>
            <FormControl isInvalid={isErrorsField['operatorId']}>
              <FormLabel fontWeight='500' fontSize='40px' color='#5B5252'>
                Initiate a withdrawal
              </FormLabel>
              <Input
                name='operatorId'
                mt='4'
                borderColor='#141414'
                border='1px'
                w='479px'
                placeholder='Operator ID'
                onChange={(e) => handleChange(ActionType.Withdraw, e)}
                _placeholder={{ color: '#7D7D7D' }}
              />
              {isErrorsField['operatorId'] ? (
                <FormErrorMessage h='10'>The operator id you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorsField['amount']}>
              <Input
                name='amount'
                borderColor='#141414'
                border='1px'
                w='479px'
                placeholder={`Amount, ${SYMBOL}`}
                onChange={(e) => handleChange(ActionType.Withdraw, e)}
                _placeholder={{ color: '#7D7D7D' }}
              />
              {isErrorsField['amount'] ? (
                <FormErrorMessage h='10'>The amount you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormButton onClick={() => handleSubmit(ActionType.Withdraw)}>Submit</FormButton>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Manage Stake' } }
}

export default Page
