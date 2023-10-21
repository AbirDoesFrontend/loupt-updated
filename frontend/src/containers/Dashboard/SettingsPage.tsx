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

import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";

const SettingsPage = () => {
  return (
    <>
      <Stack>
        <Box my={10} mx={10} fontSize={35}>
          <Text as={"h2"}>Settings</Text>
        </Box>
      </Stack>

      <Stack maxW={"7xl"} mx={"auto"} my={20}>
        <Tabs>
          <Grid templateColumns={"1fr 2fr"}>
            <Box>
              <TabList>
                <Flex flexDirection={"column"} gap={5}>
                  <Tab>
                    <Text as={"p"} fontSize={20}>
                      Personal Info
                    </Text>
                  </Tab>
                  <Tab>
                    <Text as={"p"} fontSize={20}>
                      Contact Information
                    </Text>
                  </Tab>
                  <Tab>
                    <Text as={"p"} fontSize={20}>
                      Payment Methods
                    </Text>
                  </Tab>
                  <Tab>
                    <Text as={"p"} fontSize={20}>
                      Investors Settings
                    </Text>
                  </Tab>
                  <Tab>
                    <Text as={"p"} fontSize={20}>
                      Privacy
                    </Text>
                  </Tab>
                  <Tab>
                    <Text as={"p"} fontSize={20}>
                      Security
                    </Text>
                  </Tab>
                  <Tab>
                    <Text as={"p"} fontSize={20}>
                      Notifications
                    </Text>
                  </Tab>
                  <Tab>
                    <Text as={"p"} fontSize={20}>
                      Password
                    </Text>
                  </Tab>
                </Flex>
              </TabList>
            </Box>
            <TabPanels>
              {/* Personal Info */}
              <TabPanel>
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
                        pr={"5%"}
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
                    <Button
                      type="submit"
                      bgColor={"brand.100"}
                      color={"white"}
                      my={5}
                    >
                      Update
                    </Button>
                  </Box>

                  <Box>
                    <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                      Identity Verification
                    </Text>
                    <Text my={5}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut
                    </Text>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut tempor incididunt ut labore et dolore magna
                      aliqua. Ut.{" "}
                    </Text>

                    <Button bgColor={"brand.100"} color={"white"} my={5}>
                      Verify Identity
                    </Button>
                  </Box>
                </Box>
              </TabPanel>

              {/* Contact Info */}
              <TabPanel>
                <Box>
                  <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                    Contact Information
                  </Text>
                  <Box>
                    <form>
                      <Flex
                        gap={{ base: 5, md: 20 }}
                        mt={10}
                        flexDirection={{ base: "column", md: "row" }}
                        pr={"5%"}
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
                    <Button
                      type="submit"
                      bgColor={"brand.100"}
                      color={"white"}
                      my={5}
                    >
                      Update
                    </Button>
                  </Box>

                  <Box>
                    <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                      Identity Verification
                    </Text>
                    <Text my={5}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut
                    </Text>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut tempor incididunt ut labore et dolore magna
                      aliqua. Ut.{" "}
                    </Text>

                    <Button bgColor={"brand.100"} color={"white"} my={5}>
                      Verify Identity
                    </Button>
                  </Box>
                </Box>
              </TabPanel>

              {/* Payment Methods */}
              <TabPanel>
                <Box>
                  <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                    Payment Methods
                  </Text>
                  <Box>
                    <form>
                      <Flex
                        gap={{ base: 5, md: 20 }}
                        mt={10}
                        flexDirection={{ base: "column", md: "row" }}
                        pr={"5%"}
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
                    <Button
                      type="submit"
                      bgColor={"brand.100"}
                      color={"white"}
                      my={5}
                    >
                      Update
                    </Button>
                  </Box>

                  <Box>
                    <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                      Identity Verification
                    </Text>
                    <Text my={5}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut
                    </Text>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut tempor incididunt ut labore et dolore magna
                      aliqua. Ut.{" "}
                    </Text>

                    <Button bgColor={"brand.100"} color={"white"} my={5}>
                      Verify Identity
                    </Button>
                  </Box>
                </Box>
              </TabPanel>

              {/* Investor Settings */}
              <TabPanel>
                <Box>
                  <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                    Investor Settings
                  </Text>
                  <Box>
                    <form>
                      <Flex
                        gap={{ base: 5, md: 20 }}
                        mt={10}
                        flexDirection={{ base: "column", md: "row" }}
                        pr={"5%"}
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
                    <Button
                      type="submit"
                      bgColor={"brand.100"}
                      color={"white"}
                      my={5}
                    >
                      Update
                    </Button>
                  </Box>

                  <Box>
                    <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                      Identity Verification
                    </Text>
                    <Text my={5}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut
                    </Text>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut tempor incididunt ut labore et dolore magna
                      aliqua. Ut.{" "}
                    </Text>

                    <Button bgColor={"brand.100"} color={"white"} my={5}>
                      Verify Identity
                    </Button>
                  </Box>
                </Box>
              </TabPanel>

              {/* Privacy */}
              <TabPanel>
                <Box>
                  <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                    Privacy
                  </Text>
                  <Box>
                    <form>
                      <Flex
                        gap={{ base: 5, md: 20 }}
                        mt={10}
                        flexDirection={{ base: "column", md: "row" }}
                        pr={"5%"}
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
                    <Button
                      type="submit"
                      bgColor={"brand.100"}
                      color={"white"}
                      my={5}
                    >
                      Update
                    </Button>
                  </Box>

                  <Box>
                    <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                      Identity Verification
                    </Text>
                    <Text my={5}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut
                    </Text>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut tempor incididunt ut labore et dolore magna
                      aliqua. Ut.{" "}
                    </Text>

                    <Button bgColor={"brand.100"} color={"white"} my={5}>
                      Verify Identity
                    </Button>
                  </Box>
                </Box>
              </TabPanel>

              {/* Security */}
              <TabPanel>
                <Box>
                  <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                    Security
                  </Text>
                  <Box>
                    <form>
                      <Flex
                        gap={{ base: 5, md: 20 }}
                        mt={10}
                        flexDirection={{ base: "column", md: "row" }}
                        pr={"5%"}
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
                    <Button
                      type="submit"
                      bgColor={"brand.100"}
                      color={"white"}
                      my={5}
                    >
                      Update
                    </Button>
                  </Box>

                  <Box>
                    <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                      Identity Verification
                    </Text>
                    <Text my={5}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut
                    </Text>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut tempor incididunt ut labore et dolore magna
                      aliqua. Ut.{" "}
                    </Text>

                    <Button bgColor={"brand.100"} color={"white"} my={5}>
                      Verify Identity
                    </Button>
                  </Box>
                </Box>
              </TabPanel>

              {/* Notifications */}
              <TabPanel>
                <Box>
                  <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                    Notifications
                  </Text>
                  <Box>
                    <form>
                      <Flex
                        gap={{ base: 5, md: 20 }}
                        mt={10}
                        flexDirection={{ base: "column", md: "row" }}
                        pr={"5%"}
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
                    <Button
                      type="submit"
                      bgColor={"brand.100"}
                      color={"white"}
                      my={5}
                    >
                      Update
                    </Button>
                  </Box>

                  <Box>
                    <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                      Identity Verification
                    </Text>
                    <Text my={5}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut
                    </Text>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut tempor incididunt ut labore et dolore magna
                      aliqua. Ut.{" "}
                    </Text>

                    <Button bgColor={"brand.100"} color={"white"} my={5}>
                      Verify Identity
                    </Button>
                  </Box>
                </Box>
              </TabPanel>

              {/* Password */}
              <TabPanel>
                <Box>
                  <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                    Password
                  </Text>
                  <Box>
                    <form>
                      <Flex
                        gap={{ base: 5, md: 20 }}
                        mt={10}
                        flexDirection={{ base: "column", md: "row" }}
                        pr={"5%"}
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
                    <Button
                      type="submit"
                      bgColor={"brand.100"}
                      color={"white"}
                      my={5}
                    >
                      Update
                    </Button>
                  </Box>

                  <Box>
                    <Text as={"h2"} fontWeight={"bold"} fontSize={40}>
                      Identity Verification
                    </Text>
                    <Text my={5}>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut
                    </Text>
                    <Text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut tempor incididunt ut labore et dolore magna
                      aliqua. Ut.{" "}
                    </Text>

                    <Button bgColor={"brand.100"} color={"white"} my={5}>
                      Verify Identity
                    </Button>
                  </Box>
                </Box>
              </TabPanel>
            </TabPanels>
          </Grid>
        </Tabs>
      </Stack>
    </>
  );
};

export default SettingsPage;
