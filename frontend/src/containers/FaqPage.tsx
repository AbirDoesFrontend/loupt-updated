import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
} from "@chakra-ui/react";

import styles from "./styles/HomeStyles";

const FaqPage = () => {
  return (
    <>
      <Stack background={"brand.100"}>
        <Stack
          minH={"600px"}
          direction={{ base: "column", md: "row" }}
          background={"brand.100"}
          maxW={"8xl"}
          mx={"auto"}
        >
          {/* HERO CONTENT  */}
          <Flex p={8} flex={1} align={"center"} justify={"start"}>
            <Stack spacing={6} w={"full"} maxW={"6xl"}>
              <Heading fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}>
                <Text as={"span"} color={"white"}>
                  Have any Questions? We would love to help!
                </Text>
              </Heading>
              <Center>
                <Flex alignItems="center">
                  <InputGroup>
                    <Button color={"transparent"} mx={2}>
                      <InputLeftElement
                        pointerEvents="none"
                        children={<SearchIcon color="#8764FF" />}
                      />
                    </Button>
                    <Input
                      color="white"
                      placeholder="Search"
                      width={{ base: "200px", md: "200px", lg: "350px" }}
                    />
                  </InputGroup>
                </Flex>
              </Center>
              <Center>
                <Text fontSize={{ base: "lg", lg: "xl" }} color={"gray.100"}>
                  Still have additional questions? Email us at
                  louptsupport@gmail.com
                </Text>
              </Center>
            </Stack>
          </Flex>
        </Stack>
      </Stack>

      <Center>
        <HStack spacing={4} justify="center" py={10}>
          <Button sx={styles.buttonLarge}>Founders FAQ</Button>

          <Button sx={styles.buttonLarge}>Investors FAQ</Button>
        </HStack>
      </Center>

      <Center>
        <HStack
          flexDirection={["column", "column", "column", "row"]}
          justifyContent={"space-between"}
          alignItems={["start", "start", "center"]}
          my={10}
        >
          <Grid templateColumns={["1fr", "1fr", "0.5fr 2fr"]}>
            {/* ABOUT / BIO */}
            <Box my={2}>
              <Flex justifyContent={"space-between"} flexDirection={"column"}>
                <Box>
                  <Text fontSize="2xl" mb={1} fontWeight="bold">
                    Directory
                  </Text>
                  <Text textDecoration={"underline"} fontSize={20}>
                    What is Loupt?
                  </Text>
                  <Text textDecoration={"underline"} fontSize={20}>
                    What is Loupt?
                  </Text>
                  <Text textDecoration={"underline"} fontSize={20}>
                    What is Loupt?
                  </Text>
                  <Text textDecoration={"underline"} fontSize={20}>
                    What is Loupt?
                  </Text>
                  <Text textDecoration={"underline"} fontSize={20}>
                    What is Loupt?
                  </Text>
                  <Text textDecoration={"underline"} fontSize={20}>
                    What is Loupt?
                  </Text>
                  <Text textDecoration={"underline"} fontSize={20}>
                    What is Loupt?
                  </Text>
                  <Text textDecoration={"underline"} fontSize={20}>
                    What is Loupt?
                  </Text>
                  <Text textDecoration={"underline"} fontSize={20}>
                    What is Loupt?
                  </Text>
                </Box>
              </Flex>
            </Box>

            {/* CONTACT INFORMATION */}
            <Stack>
              <Box my={2}>
                <Heading fontSize={24}>What is Loupt?</Heading>
                <Text maxW={{ lg: "3xl", sm: "sm" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Convallis posuere morbi leo urna molestie at elementum eu
                  facilisis. Blandit aliquam etiam erat velit scelerisque in
                  dictum non. Arcu odio ut sem nulla pharetra diam sit amet
                  nisl. Sed egestas egestas fringilla phasellus faucibus
                  scelerisque eleifend. Varius sit amet mattis vulputate enim
                  nulla. Justo donec enim diam vulputate ut pharetra. Elit
                  scelerisque mauris pellentesque pulvinar pellentesque habitant
                  morbi tristique. Lobortis mattis aliquam faucibus purus in
                  massa
                </Text>
              </Box>
              <Box my={2}>
                <Heading fontSize={24}>What is Loupt?</Heading>
                <Text maxW={{ lg: "3xl", sm: "sm" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Convallis posuere morbi leo urna molestie at elementum eu
                  facilisis. Blandit aliquam etiam erat velit scelerisque in
                  dictum non. Arcu odio ut sem nulla pharetra diam sit amet
                  nisl. Sed egestas egestas fringilla phasellus faucibus
                  scelerisque eleifend. Varius sit amet mattis vulputate enim
                  nulla. Justo donec enim diam vulputate ut pharetra. Elit
                  scelerisque mauris pellentesque pulvinar pellentesque habitant
                  morbi tristique. Lobortis mattis aliquam faucibus purus in
                  massa
                </Text>
              </Box>
              <Box my={2}>
                <Heading fontSize={24}>What is Loupt?</Heading>
                <Text maxW={{ lg: "3xl", sm: "sm" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Convallis posuere morbi leo urna molestie at elementum eu
                  facilisis. Blandit aliquam etiam erat velit scelerisque in
                  dictum non. Arcu odio ut sem nulla pharetra diam sit amet
                  nisl. Sed egestas egestas fringilla phasellus faucibus
                  scelerisque eleifend. Varius sit amet mattis vulputate enim
                  nulla. Justo donec enim diam vulputate ut pharetra. Elit
                  scelerisque mauris pellentesque pulvinar pellentesque habitant
                  morbi tristique. Lobortis mattis aliquam faucibus purus in
                  massa
                </Text>
              </Box>
              <Box my={2}>
                <Heading fontSize={24}>What is Loupt?</Heading>
                <Text maxW={{ lg: "3xl", sm: "sm" }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Convallis posuere morbi leo urna molestie at elementum eu
                  facilisis. Blandit aliquam etiam erat velit scelerisque in
                  dictum non. Arcu odio ut sem nulla pharetra diam sit amet
                  nisl. Sed egestas egestas fringilla phasellus faucibus
                  scelerisque eleifend. Varius sit amet mattis vulputate enim
                  nulla. Justo donec enim diam vulputate ut pharetra. Elit
                  scelerisque mauris pellentesque pulvinar pellentesque habitant
                  morbi tristique. Lobortis mattis aliquam faucibus purus in
                  massa
                </Text>
              </Box>
            </Stack>
          </Grid>
        </HStack>
      </Center>
    </>
  );
};

export default FaqPage;
