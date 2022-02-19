import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  Textarea,
  VStack,
  useColorMode,
  Grid,
  GridItem,
  NumberInput,
  NumberInputField,
  HStack,
  Button,
} from '@chakra-ui/react'
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useContext, useState } from 'react';
import DatePicker from "react-datepicker";
import { FaEthereum } from 'react-icons/fa';
import client from '../../services/ethers/client';
import StoreContext from '../../store/Store/StoreContext';
import  styles from './styles.module.css';
import Uploader from './Uploader';

const Create = () => {
  const stuff = useWeb3React();
  console.log('library stuff:', stuff);
  const { colorMode } = useColorMode();
  const [appState] = useContext(StoreContext);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [prizeAmount, setPrizeAmount] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const [files, setFiles] = useState<any>([]);

  const [titleInvalid, setTitleInvalid] = useState<boolean>(false);
  const [startDateInvalid, setStartDateInvalid] = useState<boolean>(false);
  const [endDateInvalid, setEndDateInvalid] = useState<boolean>(false);
  const [prizeAmountInvalid, setPrizeAmountInvalid] = useState<boolean>(false);

  const handleChangeStatus = (props: { meta: { id: any; }; }, status: string) => {
    if (status === 'done') {
      setFiles((prevFiles: any) => [...prevFiles, props]);
    } else if (status === 'removed') {
      const newFiles = files.filter((file: any) => file.meta.id !== props.meta.id);
      setFiles([...newFiles]);
    }
  }

  // Methods
	function sleep(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

  const volume = 2;
  const [token, setToken] = useState(appState.tokens[0]);
  const [transactionHash, setTransactionHash] = useState(null);

  async function fundBounty(bountyAddress: any) {
    console.log('in fundBounty');
    console.log('bountyAddress:', bountyAddress);
		// setIsLoading(true);
		const volumeInWei = volume * 10 ** token.decimals;

		if (volumeInWei == 0) {
			// setError({ title: 'Zero Volume Sent', message: 'Must send a greater than 0 volume of tokens.' });
			// setIsLoading(false);
			return;
		}

		const bigNumberVolumeInWei = ethers.BigNumber.from(volumeInWei.toString());

		let approveSucceeded = false;

		try {
			const callerBalance = await appState.client.balanceOf('library', 'account', token.address);

      console.log('callerBalance:', callerBalance);

			if (callerBalance < bigNumberVolumeInWei) {
        console.log('Funds Too Low');
				const title = 'Funds Too Low';
				const message = 'You do not have sufficient funds for this deposit';
				// setError({ message, title });
				// setIsLoading(false);
				// setShowErrorModal(true);
				return;
			}
		} catch (error) {
      console.log('hey error:');
			console.log(error);
			const title = 'Error';
			const message = 'A contract call exception occurred';
			// setError({ message, title });
			// setIsLoading(false);
			// setShowErrorModal(true);
			return;
		}

		try {
			if (token.address != ethers.constants.AddressZero) {
				await appState.client.approve(
					'library',
					bountyAddress,
					token.address,
					bigNumberVolumeInWei
				);
			}
			approveSucceeded = true;
		} catch (error) {
      console.log('yo error:');
			const { message, title } = appState.client.handleError(error, { bountyAddress });
      console.log('message:', message);
      console.log('title:', title);
			// setError({ message, title });
			// setIsLoading(false);
			// setShowErrorModal(true);
		}

    console.log('approveSucceeded:', approveSucceeded);

		if (approveSucceeded) {
			try {
				const fundTxnReceipt = await appState.client.fundBounty(
					'library',
					bountyAddress,
					token.address,
					bigNumberVolumeInWei
				);
        console.log('fundTxnReceipt:', fundTxnReceipt);
				setTransactionHash(fundTxnReceipt.transactionHash);
        console.log(`Successfully funded issue ${bountyAddress} with ${volume} ${token.symbol}!`);
				// setSuccessMessage(
				// 	`Successfully funded issue ${bountyAddress} with ${volume} ${token.symbol}!`
				// );
				// setShowSuccessModal(true);
				// refreshBounty();
				// setIsLoading(false);
			} catch (error) {
        console.log('hi error:', error);
				const { message, title } = appState.client.handleError(error, { bountyAddress });
				// setError({ message, title });
				// setIsLoading(false);
				// setShowErrorModal(true);
			}
		}
	}

  // console.log('library', library);
  async function mintBounty() {
    console.log('minting bounty');
		try {
			// setMintBountyState(TRANSACTION_PENDING());

      // console.log('library', library);
			const { bountyAddress, txnResponse } = await appState.client.mintBounty(
				'library',
				'randomid', // mintBountyState.issueId,
				'randomOrgName', // mintBountyState.orgName
			);

      console.log('bountyAddress:', bountyAddress);

      // const from = txnResponse.from;
      // const nonce = txnResponse.nonce;

      // const realAddress = ethers.utils.getContractAddress({ from, nonce });

      // console.log('realAddress:', realAddress);

      await fundBounty('0xae5f742b45809dacc419b88c6b13859c85567737');
      // await fundBounty(realAddress);

			// let bountyId = null;
			// while (bountyId == 'undefined') {
			// 	const bountyResp = await appState.openQSubgraphClient.getBounty(bountyAddress);
			// 	bountyId = bountyResp?.bountyId;
			// 	console.log('bountyId', bountyId);
			// 	await sleep(500);
			// }

			// await sleep(1000);

      console.log('done')

			// router.push(
			// 	`${process.env.NEXT_PUBLIC_BASE_URL}/bounty/${bountyAddress}`
			// );
		} catch (error) {
			console.log('error in mintboutny', error);
			const { message, title } = appState.client.handleError(error);
      console.log('message', message);
      console.log('title', title);
			// setMintBountyState(TRANSACTION_FAILURE({ message, title }));
		}
	}

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await mintBounty();
    setLoading(true);
    setTitleInvalid(false);
    setStartDateInvalid(false);
    setEndDateInvalid(false);
    setPrizeAmountInvalid(false);
    console.log('endDate', endDate);
    if (title === '' || !startDate || !endDate || !prizeAmount || prizeAmount === '0' ) {
      setLoading(false);
    }
    if (title === '') {
      setTitleInvalid(true);
      return;
    }
    if (!startDate) {
      setStartDateInvalid(true);
      return;
    }
    if (!endDate) {
      setEndDateInvalid(true);
      return;
    }
    if (!prizeAmount || prizeAmount === '0' ) {
      setPrizeAmountInvalid(true);
      return;
    }
    if (startDate && endDate && startDate > endDate) {
      setStartDateInvalid(true);
    }
    const bounty = {
      title,
      description,
      prizeAmount,
      startDate,
      endDate,
    };
    console.log('files', files);
    console.log('bounty', bounty);
    // await mintBounty();
    // let bountyId = null;
    // while (bountyId == 'undefined') {
    //   const bountyResp = await appState.openQSubgraphClient.getBounty(bountyAddress);
    //   bountyId = bountyResp?.bountyId;
    //   console.log('bountyId', bountyId);
    //   await sleep(500);
    // }

    // await sleep(1000);
    console.log('finished submtting');
    setLoading(false);
  };

  // const from = "0x04E7831739bA350b17E36541148368f8541552d6";
  // const from = '0xe5b2c677a667972a8bc48d2de6835dd0e1f4f1ff';
  // const from = '0x5F1c306C70FEE9bD34ED91d862Dc1BA6E268CCBD';
  // const nonce = 18;

  // const realAddress = ethers.utils.getContractAddress({ from, nonce });

  // console.log('realAddress:', realAddress);

  return (
    <Box
      m="0 auto"
      padding={{ base: "30px 5px", md: "30px 40px", lg: "30px 60px", xl: "30px 80px" }}
      maxWidth="1600px"
    >
      <Heading as="h1" size="xl">
        Create a Challenge
      </Heading>
      <VStack spacing={8}>
        <FormControl mt={45} isRequired isInvalid={titleInvalid}>
          <FormLabel>Title:</FormLabel>
          <Input
            id='title'
            placeholder='Good titles are short and sweet'
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />
          {titleInvalid && (
            <FormErrorMessage>Title is required.</FormErrorMessage>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Description:</FormLabel>
          <Textarea
            id='description'
            placeholder='Describe the details of your challenge'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Good Example images:</FormLabel>
          <Uploader handleChangeStatus={handleChangeStatus} />
        </FormControl>

        <Grid
          gap={10}
          templateColumns='repeat(2, 1fr)'
          alignSelf="flex-start"
        >
          <GridItem colSpan={{ base: 2, md: 1 }}>
            <FormControl isRequired isInvalid={startDateInvalid}>
              <FormLabel>Start Date:</FormLabel>
              <DatePicker
                showTimeSelect
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                dateFormat="MMMM d, yyyy h:mm aa z"
                className={colorMode === 'dark' ? styles.darkTheme : styles.lightTheme}
                minDate={new Date()} // limit to right now
                maxDate={new Date(new Date().setDate(new Date().getDate() + 365))} // limit to 1 year from now
              />
              {startDateInvalid && (
                <FormErrorMessage>Start date is required and must be before end date.</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>

          <GridItem colSpan={{ base: 2, md: 1 }}>
            <FormControl isRequired isInvalid={endDateInvalid}>
              <FormLabel>End Date:</FormLabel>
              <DatePicker
                showTimeSelect
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                dateFormat="MMMM d, yyyy h:mm aa z"
                className={colorMode === 'dark' ? styles.darkTheme : styles.lightTheme}
                minDate={startDate} // limit to after start date
                maxDate={new Date(new Date().setDate(new Date().getDate() + 14))} // limit to 2 weeks from now
              />
              {endDateInvalid && (
                <FormErrorMessage>End date is required.</FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
        </Grid>

        <FormControl isRequired isInvalid={prizeAmountInvalid}>
          <FormLabel>Prize Amount:</FormLabel>
          <NumberInput
            id="amount"
            maxW={280}
            min={0}
            value={prizeAmount}
            onChange={(valueString) => setPrizeAmount(valueString)}
          >
            <HStack>
              <FaEthereum />
              <NumberInputField />
            </HStack>
          </NumberInput>
          {!prizeAmountInvalid ? (
            <FormHelperText ml={7}>Amount is denominated in ETH.</FormHelperText>
          ) : (
            <FormErrorMessage>Prize amount is required.</FormErrorMessage>
          )}
        </FormControl>

        <Button
          size="lg"
          mt={3}
          colorScheme='teal'
          // alignSelf="flex-start"
          isLoading={loading}
          disabled={loading}
          type='submit'
          onClick={handleSubmit}
        >
          Create Challenge
        </Button>

      </VStack>
    </Box>
  )
};

export default Create;
