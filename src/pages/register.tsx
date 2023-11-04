import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { ConnectWallet, FormButton } from '../components/buttons'
import { Intro } from '../components/intro'
import { SYMBOL } from '../constants'
import { useOnchainData } from '../hooks/useOnchainData'
import { useRegister } from '../hooks/useRegister'
import { useWallet } from '../hooks/useWallet'
import { useRegistration } from '../states/registration'

const Page: React.FC = () => {
  const { extension, handleConnect } = useWallet()
  const { domainsOptions, handleChange, handleDomainChange, handleMaxAmountToStake, handleSubmit } = useRegister()
  const { handleOnchainData } = useOnchainData()
  const { currentRegistration, isErrorsField } = useRegistration((state) => state)
  const { domainId, amountToStake, signingKey, minimumNominatorStake, nominatorTax } = currentRegistration

  useEffect(() => {
    handleOnchainData()
  }, [handleOnchainData])

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
              <Box mt='6'>
                <Select
                  name='domainId'
                  value={domainsOptions.find((option) => option.value.toString() === domainId)}
                  onChange={handleDomainChange}
                  options={domainsOptions}
                />
              </Box>
              {isErrorsField['domainId'] ? (
                <FormErrorMessage h='10'>The Domain ID you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorsField['amountToStake']}>
              <FormLabel>Amount to stake, {SYMBOL}</FormLabel>
              <InputGroup size='md' mt='4'>
                <Input name='amountToStake' value={amountToStake} onChange={handleChange} />
                <InputRightElement>
                  <Button m={1} onClick={handleMaxAmountToStake}>
                    Max
                  </Button>
                </InputRightElement>
              </InputGroup>
              {isErrorsField['amountToStake'] ? (
                <FormErrorMessage h='10'>The amount to stake you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorsField['signingKey']}>
              <FormLabel>Signing Key</FormLabel>
              <Input name='signingKey' value={signingKey} onChange={handleChange} mt='4' />
              {isErrorsField['signingKey'] ? (
                <FormErrorMessage h='10'>The signing key you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
          </GridItem>
          <GridItem w='100%'>
            <FormControl isInvalid={isErrorsField['minimumNominatorStake']}>
              <FormLabel>Minimum Nominator Stake, {SYMBOL}</FormLabel>
              <Input name='minimumNominatorStake' value={minimumNominatorStake} onChange={handleChange} mt='4' />
              {isErrorsField['minimumNominatorStake'] ? (
                <FormErrorMessage h='10'>The minimum nominator stake you enter is not valid</FormErrorMessage>
              ) : (
                <FormHelperText h='10'></FormHelperText>
              )}
            </FormControl>
            <FormControl isInvalid={isErrorsField['nominatorTax']}>
              <FormLabel>Nomination Tax, %</FormLabel>
              <Input name='nominatorTax' value={nominatorTax} onChange={handleChange} mt='4' />
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

        {extension.data ? (
          <FormButton onClick={handleSubmit}>Next</FormButton>
        ) : (
          <Box mt='8'>
            <ConnectWallet onClick={handleConnect} />
          </Box>
        )}
      </Box>
    </Box>
  )
}

export async function getStaticProps() {
  return { props: { title: 'Subspace Staking Interface - Register' } }
}

export default Page
