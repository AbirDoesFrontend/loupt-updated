import {
  Text,
  Stack,
  Heading,
  Flex,
  Box,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Image,
  Button,
  Center,
} from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";

import PreviewImg from "../assets/preview.png";

const TeaserPage = () => {
  return (
    <>
      <Divider />
      <Stack background={"brand.100"}>
        <Stack
          minH={"600px"}
          direction={{ base: "column", md: "row" }}
          background={"brand.100"}
          maxW={"8xl"}
        >
          {/* HERO CONTENT  */}
          <Flex p={8} flex={1} align={"center"} justify={"center"}>
            <Stack spacing={6} w={"full"} maxW={"5xl"}>
              <Heading fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}>
                <Text as={"h2"} color={"white"}>
                  Build a Teaser Page
                </Text>
              </Heading>
              <Text fontSize={{ base: "lg", lg: "xl" }} color={"gray.100"}>
                To be{" "}
                <ChakraLink textDecoration={"underline"}>eligible</ChakraLink>{" "}
                to raise up to $5M in a 12 month period, your company must be a
                U.S.-based C-Corp, LLC, or public benefit corporation. To launch
                an investment campaign, you and your company will need to pass a
                due{" "}
                <ChakraLink textDecoration={"underline"}>
                  diligence process
                </ChakraLink>{" "}
                to evaluate fit, market, team, traction, and reach, including
                the number of followers your Teaser Page attracts. To learn
                more, visit{" "}
                <ChakraLink textDecoration={"underline"}>
                  our FAQ page
                </ChakraLink>
                .
              </Text>
            </Stack>
          </Flex>
        </Stack>
      </Stack>

      <Box maxW={"800px"} mx={["20px", "20px", "auto"]} my={10} padding={10}>
        <Heading mb={10}>About your company</Heading>
        <Divider mb={7}></Divider>
        <Flex justify="center" p={4} maxW="850px" mx={"auto"}>
          <Box w={"100%"}>
            <form>
              <Flex direction={{ base: "column", md: "row" }}>
                <Box flex={1} mb={{ base: 4, md: 0 }} mr={{ base: 0, md: 4 }}>
                  <FormControl mb={4}>
                    <FormLabel fontSize={30}>Company Name</FormLabel>
                    <Input placeholder="Walmart" type="text" />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel fontSize={30}>Industry</FormLabel>
                    <Input placeholder="Walmart" type="text" />
                  </FormControl>
                </Box>
              </Flex>
              <Box flex={1}>
                <Flex
                  justify={"space-around"}
                  gap={30}
                  direction={{ base: "column", md: "row" }}
                >
                  <FormControl mb={4}>
                    <FormLabel fontSize={30}>Logo</FormLabel>
                    <Input type="file" />
                  </FormControl>

                  <FormControl mb={4}>
                    <FormLabel fontSize={30}>Background Image</FormLabel>
                    <Input type="file" />
                  </FormControl>
                </Flex>
              </Box>
              <Box flex={1}>
                <FormControl>
                  <FormLabel fontSize={30}>Summary</FormLabel>
                  <Textarea
                    rows={5}
                    placeholder="What is unique about your company? Why should potential investors be excited for the launch of your investment campaign?"
                  />
                </FormControl>
              </Box>
            </form>
            <Box my={10}>
              <Text as={"b"} color={"black"} fontSize={30} my={10}>
                Preview
              </Text>
              <Flex flex={1} alignItems={"center"} justifyContent={"center"}>
                <Image
                  alt={"Login Image"}
                  objectFit={"cover"}
                  height={"390px"}
                  borderRadius={10}
                  src={PreviewImg}
                />
              </Flex>
            </Box>
            <Box>
              <Text as="b" fontSize={30} my={10}>
                Disclosures
              </Text>
              <Text as={"p"} my={5} fontWeight={"semibold"}>
                Available under rule 206 of Regulation CF: A “reservation”
                involves no obligation or commitment of any kind; No money or
                other consideration, is being solicited and if sent will not be
                accepted; No investment commitments can be accepted and no funds
                can be received unless files a Form C with the SEC and starts
                accepting investments through Republic.
              </Text>
              <Text
                as={"p"}
                color={"black"}
                fontWeight={"semibold"}
                fontSize={15}
              >
                Federal law requires that all communications include the
                following disclaimer: <br />
                <Text as={"span"} display={"inline-block"} my={1}>
                  1. no money or other consideration is being solicited thereby,
                  and if sent in response, will not be accepted,
                </Text>{" "}
                <br />
                <Text as={"span"} display={"inline-block"} my={1}>
                  2. no offer to buy the securities can be accepted and no part
                  of the purchase price can be received until the offering
                  statement is filed and only through a registered
                  intermediary’s platform;{" "}
                </Text>
                <br />
                <Text as={"span"} display={"inline-block"} my={1}>
                  3. an indication of interest is non-binding and involves no
                  obligation or commitment of any kind.
                </Text>
              </Text>
            </Box>
            <Center>
              <Button
                padding={"30px 32px"}
                bg="brand.100"
                color={"white"}
                mt={10}
                type="submit"
                fontSize={25}
              >
                Publish
              </Button>
            </Center>
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default TeaserPage;
