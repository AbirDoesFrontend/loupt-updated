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
  Avatar,
  chakra,
  FormHelperText,
  GridItem,
  Icon,
  InputGroup,
  InputLeftAddon,
  SimpleGrid,
  VisuallyHidden,
} from "@chakra-ui/react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";

import PreviewImg from "../assets/preview.png";

const TeaserPage = () => {
  return (
    <>
      <Divider></Divider>
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

      {/* ABOUT COMPANY FORM  */}
      <Box maxW={"800px"} mx={["20px", "20px", "auto"]} my={10} padding={10}>
        <Heading mb={10} textAlign={"center"}>
          About your company
        </Heading>
        <Divider mb={7}></Divider>
        <Flex justify="center" p={4} maxW="850px" mx={"auto"}>
          <Box
            w={"100%"}
            border={"2px solid"}
            borderRadius={"10px"}
            borderColor={"brand.200"}
          >
            {/* FROM BODY  */}
            <chakra.form
              rounded={[null, "md"]}
              overflow={{
                sm: "hidden",
              }}
            >
              <Stack
                px={4}
                py={5}
                bg="white"
                _dark={{
                  bg: "#141517",
                }}
                spacing={6}
                p={{
                  sm: 6,
                }}
              >
                <SimpleGrid columns={3} spacing={6}>
                  <FormControl as={GridItem} colSpan={[6, 3]}>
                    <FormLabel
                      htmlFor="company_name"
                      fontSize="sm"
                      fontWeight="md"
                      color="gray.700"
                      _dark={{
                        color: "gray.50",
                      }}
                    >
                      Company Name
                    </FormLabel>
                    <Input
                      type="text"
                      name="company_name"
                      id="company_name"
                      autoComplete="given-name"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                    />
                  </FormControl>

                  <FormControl as={GridItem} colSpan={[6, 3]}>
                    <FormLabel
                      htmlFor="industry"
                      fontSize="sm"
                      fontWeight="md"
                      color="gray.700"
                      _dark={{
                        color: "gray.50",
                      }}
                    >
                      Industry
                    </FormLabel>
                    <Input
                      type="text"
                      name="industry"
                      id="industry"
                      autoComplete="family-name"
                      mt={1}
                      focusBorderColor="brand.400"
                      shadow="sm"
                      size="sm"
                      w="full"
                      rounded="md"
                    />
                  </FormControl>
                </SimpleGrid>

                <div>
                  <FormControl id="email" mt={1}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="md"
                      color="gray.700"
                      _dark={{
                        color: "gray.50",
                      }}
                    >
                      Summary
                    </FormLabel>
                    <Textarea
                      placeholder="you@example.com"
                      mt={1}
                      rows={3}
                      shadow="sm"
                      focusBorderColor="brand.400"
                      fontSize={{
                        sm: "sm",
                      }}
                    />
                    <FormHelperText>
                      Brief description. URLs are hyperlinked.
                    </FormHelperText>
                  </FormControl>
                </div>

                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{
                      color: "gray.50",
                    }}
                  >
                    Logo
                  </FormLabel>
                  <Flex alignItems="center" mt={1}>
                    <Avatar
                      boxSize={12}
                      bg="gray.100"
                      _dark={{
                        bg: "gray.800",
                      }}
                      icon={
                        <Icon
                          as={FaUser}
                          boxSize={9}
                          mt={3}
                          rounded="full"
                          color="gray.300"
                          _dark={{
                            color: "gray.700",
                          }}
                        />
                      }
                    />
                    <Button
                      type="button"
                      ml={5}
                      variant="outline"
                      size="sm"
                      fontWeight="medium"
                      _focus={{
                        shadow: "none",
                      }}
                    >
                      Change
                    </Button>
                  </Flex>
                </FormControl>

                <FormControl>
                  <FormLabel
                    fontSize="sm"
                    fontWeight="md"
                    color="gray.700"
                    _dark={{
                      color: "gray.50",
                    }}
                  >
                    Cover photo
                  </FormLabel>
                  <Flex
                    mt={1}
                    justify="center"
                    px={6}
                    pt={5}
                    pb={6}
                    borderWidth={2}
                    _dark={{
                      color: "gray.500",
                    }}
                    borderStyle="dashed"
                    rounded="md"
                  >
                    <Stack spacing={1} textAlign="center">
                      <Icon
                        mx="auto"
                        boxSize={12}
                        color="gray.400"
                        _dark={{
                          color: "gray.500",
                        }}
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Icon>
                      <Flex
                        fontSize="sm"
                        color="gray.600"
                        _dark={{
                          color: "gray.400",
                        }}
                        alignItems="baseline"
                      >
                        <chakra.label
                          htmlFor="file-upload"
                          cursor="pointer"
                          rounded="md"
                          fontSize="md"
                          color="brand.600"
                          _dark={{
                            color: "brand.200",
                          }}
                          pos="relative"
                          _hover={{
                            color: "brand.400",
                            _dark: {
                              color: "brand.300",
                            },
                          }}
                        >
                          <span>Upload a file</span>
                          <VisuallyHidden>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                            />
                          </VisuallyHidden>
                        </chakra.label>
                        <Text pl={1}>or drag and drop</Text>
                      </Flex>
                      <Text
                        fontSize="xs"
                        color="gray.500"
                        _dark={{
                          color: "gray.50",
                        }}
                      >
                        PNG, JPG, GIF up to 10MB
                      </Text>
                    </Stack>
                  </Flex>
                </FormControl>
              </Stack>
              <Box
                px={{
                  base: 4,
                  sm: 6,
                }}
                py={3}
                bg="gray.50"
                _dark={{
                  bg: "#121212",
                }}
                textAlign="right"
              >
                <Button
                  type="submit"
                  background={"brand.100"}
                  color={"white"}
                  _focus={{
                    shadow: "",
                  }}
                  fontWeight="md"
                >
                  Save
                </Button>
              </Box>
            </chakra.form>

            {/* PREVIEW BOX  */}

            <Box my={10} px={20}>
              <Text as={"b"} color={"black"} fontSize={30} my={10}>
                Preview
              </Text>
              <Flex
                flex={1}
                alignItems={"center"}
                justifyContent={"start"}
                mt={10}
              >
                <Image
                  alt={"Login Image"}
                  objectFit={"cover"}
                  height={"390px"}
                  borderRadius={10}
                  src={PreviewImg}
                />
              </Flex>
            </Box>

            {/* DISCLOSURES  */}
            <Box px={20}>
              <Text as="b" fontSize={30} my={10}>
                Disclosures
              </Text>
              <Text as={"p"} my={5} fontWeight={"light"}>
                Available under rule 206 of Regulation CF: A “reservation”
                involves no obligation or commitment of any kind; No money or
                other consideration, is being solicited and if sent will not be
                accepted; No investment commitments can be accepted and no funds
                can be received unless files a Form C with the SEC and starts
                accepting investments through Republic.
              </Text>
              <Text as={"p"} color={"black"} fontWeight={"light"} fontSize={15}>
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
                padding={"24px 30px"}
                bg="brand.100"
                color={"white"}
                my={10}
                type="submit"
                fontSize={20}
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
