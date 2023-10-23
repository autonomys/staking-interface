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
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorMode
} from '@chakra-ui/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FormButton } from '../components/buttons'
import { Wallet } from '../components/icons'
import { useRegistration } from '../states/registration'

const Page: React.FC = () => {
  const [clientSide, setClientSide] = useState(false)
  const { colorMode, toggleColorMode } = useColorMode()
  const registration = useRegistration((state) => state.registration)
  const isErrorsField = useRegistration((state) => state.isErrorsField)

  useEffect(() => {
    setClientSide(true)
  }, [])

  useEffect(() => {
    if (colorMode === 'dark') toggleColorMode()
  }, [colorMode, toggleColorMode])

  if (!clientSide) return null

  return (
    <Box minW='60vw' maxW='60vw' mt='10' p='4' border='0'>
      <HStack>
        <Wallet />
        <Heading ml='2'>Manage the stake</Heading>
      </HStack>
      <Box mt='6'>
        <HStack mb='6'>
          <Heading size='lg' fontWeight='500' fontSize='40px' ml='2' color='#5B5252'>
            Information across operators
          </Heading>
          <Heading size='lg' fontWeight='500' fontSize='24px' ml='2' mt='16px' color='#5B5252'>
            on SigningKey st9450943...04953
          </Heading>
        </HStack>
      </Box>
      <TableContainer>
        <Table borderColor='#B9B9B9' border='1' variant='striped' size='sm'>
          <Thead bg='rgba(0, 0, 0, 0.06)'>
            <Tr>
              <Th isNumeric>DomainID</Th>
              <Th>OperatorID</Th>
              <Th isNumeric>NominatorTax</Th>
              <Th isNumeric>Min Nominator Stake</Th>
              <Th isNumeric>Funds in stake</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td isNumeric>{registration.domainId}</Td>
              <Td>{registration.signingKey}</Td>
              <Td isNumeric>{registration.nominatorTax}</Td>
              <Td isNumeric>{registration.minimumNominatorStake}</Td>
              <Td isNumeric>{registration.amountToStake}</Td>
            </Tr>
            <Tr>
              <Td isNumeric>3</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
            <Tr>
              <Td isNumeric>4</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
            <Tr>
              <Td isNumeric>4</Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
              <Td></Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
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
              pb='7px'>
              De-register
            </Button>
          </HStack>
        </Box>
      </Flex>
      <Box>
        <HStack mb='6'>
          <Heading size='lg' fontWeight='500' fontSize='40px' ml='2' color='#5B5252'>
            Aggregated data
          </Heading>
          <Heading size='lg' fontWeight='500' fontSize='24px' ml='2' mt='16px' color='#5B5252'>
            on SigningKey st9450943...04953
          </Heading>
        </HStack>
        <Grid templateColumns='repeat(2, 1fr)' gap={6} mt='12'>
          <GridItem w='100%'>
            <Text fontWeight='500' fontSize='30px' color='#5B5252'>
              Funds in Stake, tSSC
            </Text>
            <Text fontWeight='700' fontSize='30px' color='#5B5252'>
              1000.00
            </Text>

            <Text fontWeight='500' fontSize='30px' color='#5B5252' mt='8'>
              Number of Nominators
            </Text>
            <Text fontWeight='700' fontSize='30px' color='#5B5252'>
              1000
            </Text>
          </GridItem>
          <GridItem w='100%'>
            <Text fontWeight='500' fontSize='30px' color='#5B5252'>
              Available for withdrawal, tSSC
            </Text>
            <Text fontWeight='700' fontSize='30px' color='#5B5252'>
              1000.00
            </Text>

            <Text fontWeight='500' fontSize='30px' color='#5B5252' mt='8'>
              Nominator’s funds, tSSC
            </Text>
            <Text fontWeight='700' fontSize='30px' color='#5B5252'>
              1000.00
            </Text>
          </GridItem>
        </Grid>
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
                placeholder='Amount, tSSC'
                _placeholder={{ color: '#7D7D7D' }}
              />
              {isErrorsField['amount'] ? (
                <FormErrorMessage h='10'>The amount you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <Link href='/manage'>
              <FormButton>Add more funds</FormButton>
            </Link>
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
                placeholder='Amount, tSSC'
                _placeholder={{ color: '#7D7D7D' }}
              />
              {isErrorsField['amount'] ? (
                <FormErrorMessage h='10'>The amount you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <Link href='/manage'>
              <FormButton>Submit</FormButton>
            </Link>
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
