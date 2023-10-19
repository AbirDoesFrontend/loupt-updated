import {
  Box,
  Button,
  Flex,
  Grid,
  Input,
  Stack,
  Text,
  useTheme,
} from "@chakra-ui/react";

const SettingsPage = () => {
  const theme = useTheme();
  const mainPurple = theme.colors.mainPurple ?? "#8764FF";
  return (
    <>
      <Stack>
        <Box my={10} mx={10} fontSize={35}>
          <Text as={"h2"}>Settings</Text>
        </Box>
      </Stack>

      <Stack maxW={"7xl"} mx={"auto"} my={20}>
        <Grid templateColumns={"1fr 2fr"}>
          <Box mt={10}>
            <Flex flexDirection={"column"} gap={5}>
              <Text as={"p"} fontSize={20}>
                Personal Info
              </Text>
              <Text as={"p"} fontSize={20}>
                Personal Info
              </Text>
              <Text as={"p"} fontSize={20}>
                Personal Info
              </Text>
              <Text as={"p"} fontSize={20}>
                Personal Info
              </Text>
              <Text as={"p"} fontSize={20}>
                Personal Info
              </Text>
            </Flex>
          </Box>
          <Box>
            <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
              Personal Info
            </Text>
            <Box>
              <form>
                <Flex
                  gap={{ base: 5, md: 20 }}
                  mt={10}
                  flexDirection={{ base: "column", md: "row" }}
                  pr={'5%'}
                >
                  <Box>
                    <Text>First Name</Text>
                    <Input
                      type="text"
                      placeholder="Enter Your Name"
                      name="name"
                    />
                  </Box>
                  <Box>
                    <Text>Last Name</Text>
                    <Input
                      type="text"
                      placeholder="Enter Your Name"
                      name="name"
                    />
                  </Box>
                </Flex>
              </form>
              <Text width={"60%"} mt={5}>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                Expedita ipsam neque repellendus quidem sit rerum voluptas
                consequuntur
              </Text>
              <Button type="submit" bgColor={mainPurple} color={"white"} my={5}>
                Update
              </Button>
            </Box>

            <Box>
              <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                Identity Verification
              </Text>
              <Text my={5}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                tempor incididunt ut labore et dolore magna aliqua. Ut.{" "}
              </Text>

              <Button bgColor={mainPurple} color={"white"} my={5}>
                Verify Identity
              </Button>
            </Box>
          </Box>
        </Grid>
      </Stack>
    </>
  );
};

export default SettingsPage;
