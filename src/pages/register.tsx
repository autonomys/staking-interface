import {
  Box,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  Text,
  useColorMode
} from '@chakra-ui/react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FormButton } from '../components/buttons'
import { Intro } from '../components/intro'
import { useRegistration } from '../states/registration'

const Page: React.FC = () => {
  const [clientSide, setClientSide] = useState(false)
  const { colorMode, toggleColorMode } = useColorMode()
  const registration = useRegistration((state) => state.registration)
  const isErrorsField = useRegistration((state) => state.isErrorsField)
  const saveRegistration = useRegistration((state) => state.saveRegistration)
  const setErrorsField = useRegistration((state) => state.setErrorsField)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    saveRegistration({ ...registration, [name]: value })
    setErrorsField(name, detectError(name, value))
  }

  const detectError = (key: string, value: string) => {
    // To do: Improve the validation
    switch (key) {
      case 'domainId':
        return value.length < 1
      case 'minimumNominatorStake':
        return value.length < 1
      case 'amountToStake':
        return value.length < 1
      case 'nominatorTax':
        return value.length < 1
      case 'signingKey':
        return value.length < 1
      default:
        return false
    }
  }

  useEffect(() => {
    setClientSide(true)
  }, [])

  useEffect(() => {
    if (colorMode === 'dark') toggleColorMode()
  }, [colorMode, toggleColorMode])

  if (!clientSide) return null

  return (
    <Box minW='60vw' maxW='60vw' mt='10' p='4' border='0'>
      <Intro />
      <Box>
        <Heading size='lg' fontWeight='700' fontSize='30px' ml='2' mt='66px'>
          2. Register
        </Heading>
        <Grid templateColumns='repeat(2, 1fr)' gap={6} mt='12'>
          <GridItem w='100%'>
            <FormControl isInvalid={isErrorsField['domainId']}>
              <FormLabel>Domain ID</FormLabel>
              <Input name='domainId' value={registration.domainId} onChange={handleChange} mt='4' />
              {isErrorsField['domainId'] ? (
                <FormErrorMessage h='10'>The Domain ID you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorsField['amountToStake']}>
              <FormLabel>Amount to stake, tSSC</FormLabel>
              <Input name='amountToStake' value={registration.amountToStake} onChange={handleChange} mt='4' />
              {isErrorsField['amountToStake'] ? (
                <FormErrorMessage h='10'>The amount to stake you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorsField['signingKey']}>
              <FormLabel>Signing Key</FormLabel>
              <Input name='signingKey' value={registration.signingKey} onChange={handleChange} mt='4' />
              {isErrorsField['signingKey'] ? (
                <FormErrorMessage h='10'>The signing key you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
          </GridItem>
          <GridItem w='100%'>
            <FormControl isInvalid={isErrorsField['minimumNominatorStake']}>
              <FormLabel>Minimum Nominator Stake, tSCC</FormLabel>
              <Input
                name='minimumNominatorStake'
                value={registration.minimumNominatorStake}
                onChange={handleChange}
                mt='4'
              />
              {isErrorsField['minimumNominatorStake'] ? (
                <FormErrorMessage h='10'>The minimum nominator stake you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorsField['nominatorTax']}>
              <FormLabel>Nomination Tax, %</FormLabel>
              <Input name='nominatorTax' value={registration.nominatorTax} onChange={handleChange} mt='4' />
              {isErrorsField['nominatorTax'] ? (
                <FormErrorMessage h='10'>The nominator tax you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <Box mt='8'>
              <Link href='/learnMore'>
                <Text textDecoration='underline' color='#4524C1'>
                  Need help? Check the docs
                </Text>
              </Link>
            </Box>
          </GridItem>
        </Grid>
        <Link href='/manage'>
          <FormButton>Next</FormButton>
        </Link>
      </Box>
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Register' } }
}

export default Page
