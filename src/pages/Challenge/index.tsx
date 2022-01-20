import {
  Box,
  Text,
  Heading,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react';
import './challenge.css';
import img1 from '../../assets/images/ultra-sound-money/1.jpeg'
import img2 from '../../assets/images/ultra-sound-money/2.jpeg'
import img1Thumbnail from '../../assets/images/ultra-sound-money/1thumbnail.jpeg';
import img2Thumbnail from '../../assets/images/ultra-sound-money/2thumbnail.jpeg';
import ImageExamples from './ImageExamples';
import TimeLeft from '../../molecules/TimeLeft';
import Uploader from './Uploader';

const imgs = [
  {
    thumbnail: img1Thumbnail,
    image: img1,
    imgWidth: 508,
    imgHeight: 491,
  },
  {
    thumbnail: img2Thumbnail,
    image: img2,
    imgWidth: 2702,
    imgHeight: 1514,
  },
];

const Challenge = () => {
  return (
    <Box m="0 10%">
      <Box height={30} />
      <VStack align="start" spacing="0px">
        <Heading
          fontSize="4xl"
          fontWeight="bold"
          fontFamily="'Work Sans', sans-serif;"
        >
          Create an original Ultra Sound Money meme.
        </Heading>
        <Text>
          By: kylekaplan.eth
        </Text>
        {/* <Text>
          🏆 &nbsp; Ξ0.01 ETH
        </Text> */}
      </VStack>
      <Text marginTop="30px" fontSize="2xl">
        The meme must be in favor of the Ultra Sound Money idea and ideally funny and/or educational.
      </Text>
      <Accordion mt={14} mb={10}>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                DETAILS
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
          <VStack fontSize="lg" spacing="5px" align="start">
            <Text>
              🏆 &nbsp; Ξ0.01 ETH
            </Text>
            <Text>
              📅 &nbsp;Jan. 7th - 14th
            </Text>
            <Text>
              ⏳ &nbsp;
              <TimeLeft date={Date.now() + 100000000} />
            </Text>
          </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Text fontSize="2xl">
        <b>Good Examples:</b>
      </Text>
      <ImageExamples imgs={imgs} />
      {/* <VStack marginTop="30px" fontSize="lg" spacing="5px" align="start">
        <Text>
          🏆 &nbsp; Ξ0.01 ETH
        </Text>
        <Text>
          📅 &nbsp;Jan. 7th - 14th
        </Text>
        <Text>
          ⏳ &nbsp;
          <TimeLeft date={Date.now() + 100000000} />
        </Text>
        <Text fontSize="2xl">
          <b>Good Examples:</b>
        </Text>
        <ImageExamples imgs={imgs} />
      </VStack> */}
      <Box height={75} />
      <Uploader />
    </Box>
  );
}

export default Challenge;
