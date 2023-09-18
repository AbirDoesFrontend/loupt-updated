import { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  InputRightElement,
  InputLeftElement,
  Input,
  Divider,
  Text,
  Textarea,
  InputLeftAddon,
  Stack,
  Center,
  Heading,
  InputGroup,
  Slider,
  useBreakpointValue,
  Image,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  IconButton,
  Container,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  getUser,
  getConnectedUsers,
  getAllCompanies,
  getConnectedCompanies,
  Company,
  User,
  createCompany,
} from "../api";

interface FormData {
  name: string;
  logo: string;
  bio: string;
  partners: string[];
  industry: string[];
  website: string;
  valuation: any;
  minimumInvestment: any;
  sharePrice: any;
  sharesOutstanding: any;
  location: string;
  // fundingGoal: number;
  // corporateAddress: string;
  // lastDate: string;
  // highlights: string[];
  // documents: any;
  // corporateState: string;
}

const RaiseCapital = () => {
  const [user, setUser] = useState({} as User);
  const [connectedUsers, setConnectedUsers] = useState([] as User[]);
  const [allCompanies, setAllCompanies] = useState([] as Company[]);
  const [connectedCompanies, setConnectedCompanies] = useState([] as Company[]);

  const [highlights, setHighlights] = useState<string[]>([""]);
  const [formData, setFormData] = useState<FormData>({
    // companyName: "",
    // corporateZipCode: "",
    // numberOfShares: "",
    // legalPartners: "",
    // aboutCompany: "",
    // valuationCap: "",
    // corporateCountry: "",
    // corporateAddress: "",
    // minInvestment: "",
    // corporateState: "",
    // maxInvestment: "",
    // // fundingGoal: ""
    // lastDate: "",
    // documents: "",
    // highlights: [""],
    name: "",
    logo: "",
    bio: "",
    partners: [""],
    industry: [""],
    website: "",
    valuation: 0,
    minimumInvestment: 0,
    sharePrice: 0,
    sharesOutstanding: 0,
    location: "",
  });

  const handleHighlightsChange = (index: any, value: any) => {
    const updatedHighlights = [...highlights];
    updatedHighlights[index] = value;
    setHighlights(updatedHighlights);
  };

  const handleAddHighlight = () => {
    setHighlights([...highlights, ""]);
  };

  const handleRemoveHighlight = (index: any) => {
    const updatedHighlights = highlights.filter((_, i) => i !== index);
    setHighlights(updatedHighlights);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const logo = formData.logo;
    const name = formData.name;
    const bio = formData.bio;
    const partners = formData.partners;
    const sharePrice = formData.sharePrice;
    const industry = formData.industry;
    const website = formData.website;
    const valuation = formData.valuation;
    const minimumInvestment = formData.minimumInvestment;
    const location = formData.location;
    const sharesOutstanding = formData.sharesOutstanding;
    // const fundingGoal = formData.fundingGoal;

    const newCompany = {
      logo: logo,
      name: name,
      bio: bio,
      partners: partners,
      industry: industry,
      website: website,
      valuation: parseInt(valuation),
      minimumInvestment: parseInt(minimumInvestment),
      sharePrice: parseInt(sharePrice),
      sharesOutstanding: parseInt(sharesOutstanding),
      location: location,
      // fundingGoal: fundingGoal,
    };

    createCompany(newCompany).then((response) => {
      console.log("new company created");
      console.log(response);
    });
  };

  useEffect(() => {
    getUser()
      .then((response) => {
        if (response) {
          console.log("User:");
          console.log(response);
          setUser(response);
        } else {
          // handle the scenario when user is not returned
          console.error("No user returned");
          //setUser({} as User); this is default value anyways
        }
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        //setUser({}); this is default value anyways
      });

    getConnectedUsers().then((response) => {
      console.log("Connected Users:");
      console.log(response);
      setConnectedUsers(response);
    });

    getAllCompanies().then((response) => {
      console.log("All Companies:");
      console.log(response);
      setAllCompanies(response);
    });

    getConnectedCompanies().then((response) => {
      console.log("Connected Companies:");
      console.log(response);
      setConnectedCompanies(response);
    });
  }, []);

  return (
    <>
      <Divider></Divider>
      {/* HERO SECTION  */}
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
            <Stack spacing={6} w={"full"} maxW={"lg"}>
              <Heading fontSize={{ base: "4xl", md: "5xl", lg: "6xl" }}>
                <Text as={"span"} color={"white"} position={"relative"}>
                  Why{" "}
                  <Text
                    as={"span"}
                    _after={{
                      content: "''",
                      width: "70%",
                      height: useBreakpointValue({ base: "20%", md: "30%" }),
                      position: "absolute",
                      bottom: 1,
                      right: 0,
                      bg: "brand.100",
                      zIndex: -1,
                    }}
                  >
                    Raise Funds
                  </Text>
                </Text>
                <br />{" "}
                <Text color={"white"} as={"span"}>
                  With Loupt?
                </Text>{" "}
              </Heading>
              <Text fontSize={{ base: "lg", lg: "xl" }} color={"gray.100"}>
                Loupt gives companies access to investors who are deeply engaged
                with their investments
              </Text>
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={4}
                alignItems={"start"}
              >
                <Button px={10} py={6}>
                  How It Works
                </Button>
              </Stack>
            </Stack>
          </Flex>
          {/* HERO IMAGE  */}
          <Flex flex={1} alignItems={"center"} justifyContent={"center"}>
            <Image
              alt={"Login Image"}
              objectFit={"cover"}
              height={"390px"}
              borderRadius={10}
              src={
                "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              }
            />
          </Flex>
        </Stack>
      </Stack>

      {/* CREATE COMPANY PROFILE */}

      <Box
        border="1px solid"
        borderColor={"brand.100"}
        borderRadius={10}
        maxW={"800px"}
        mx={["20px", "20px", "auto"]}
        my={10}
        padding={10}
      >
        <Center>
          <Heading mb={10}>Create a Company Profile</Heading>
        </Center>
        <Divider mb={7}></Divider>
        <Flex justify="center" p={4} maxW="850px" mx={"auto"}>
          <Box w={"100%"}>
            <form onSubmit={handleFormSubmit}>
              <Flex direction={{ base: "column", md: "row" }}>
                <Box flex={1} mb={{ base: 4, md: 0 }} mr={{ base: 0, md: 4 }}>
                  <FormControl mb={4}>
                    <FormLabel>Name of Company:</FormLabel>
                    <Input
                      placeholder="Walmart"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Number of Shares:</FormLabel>
                    <Input
                      placeholder="E.g. $50000"
                      type={"number"}
                      value={formData.sharesOutstanding}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sharesOutstanding: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Location / Address</FormLabel>
                    <Input
                      placeholder="e.g. 903 Mill Road Kennett Square"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          location: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>About the Company:</FormLabel>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bio: e.target.value,
                        })
                      }
                      rows={5}
                    />
                  </FormControl>
                </Box>
                <Box flex={1}>
                  <FormControl mb={4}>
                    <FormLabel>Valuation Cap:</FormLabel>
                    <InputGroup>
                      <InputLeftElement>
                        <span>$</span>
                      </InputLeftElement>
                      <Input
                        placeholder="Valuation Cap"
                        value={formData.valuation}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            valuation: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </FormControl>
                  {/* <FormControl mb={4}>
                    <FormLabel>Corporate Country:</FormLabel>
                    <InputGroup>
                      <Input
                        placeholder="e.g Chester"
                        value={formData.corporateCountry}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            corporateCountry: e.target.value,
                          })
                        }
                      />
                      <InputRightElement>%</InputRightElement>
                    </InputGroup>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Corporate Zip Code</FormLabel>
                    <Input
                      placeholder="e.g 19348"
                      value={formData.corporateZipCode}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          corporateZipCode: e.target.value,
                        })
                      }
                    />
                  </FormControl> */}
                  <FormControl mb={4}>
                    <FormLabel>Minimum Investment:</FormLabel>
                    <InputGroup>
                      <InputLeftAddon>$</InputLeftAddon>
                      <Input
                        placeholder="Minimum Investment"
                        value={formData.minimumInvestment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minimumInvestment: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </FormControl>
                  {/* <FormControl mb={4}>
                    <FormLabel>Maximum Investment:</FormLabel>
                    <InputGroup>
                      <InputLeftAddon>$</InputLeftAddon>
                      <Input
                        placeholder="Maximum Investment"
                        value={formData.max}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxInvestment: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </FormControl> */}
                  {/* ... (more right column fields) */}
                </Box>
              </Flex>
              {/* <Flex direction={{ base: "column", md: "row" }}>
                <Box flex={1} mb={{ base: 4, md: 0 }} mr={{ base: 0, md: 4 }}>
                  <FormControl mb={4}>
                    <FormLabel>Corporate State</FormLabel>
                    <Input
                      placeholder="e.g PA"
                      value={formData.corporateState}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          corporateState: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Number of Shares:</FormLabel>
                    <Input
                      placeholder="E.g. $50000"
                      value={formData.numberOfShares}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          numberOfShares: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Legal Name(s) of Controlling Partners</FormLabel>
                    <Input
                      placeholder="e.g. Comrie Barr Flinn Jr, Timothy Robert Lunger"
                      value={formData.legalPartners}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          legalPartners: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </Box>
              </Flex> */}
              <FormControl mb={4}>
                <FormLabel>Funding Goals:</FormLabel>
                <InputGroup>
                  <InputLeftAddon>$</InputLeftAddon>
                  <Input
                  // placeholder="Funding Goals"
                  // value={formData.fundingGoal}
                  // onChange={(e) =>
                  //   setFormData({
                  //     ...formData,
                  //     fundingGoal: e.target.value,
                  //   })
                  // }
                  />
                </InputGroup>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Last Date:</FormLabel>
                <Input
                  type="date"
                  // value={formData.lastDate}
                  // onChange={(e) =>
                  //   setFormData({ ...formData, lastDate: e.target.value })
                  // }
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Upload Documents:</FormLabel>
                <Input
                  type="file"
                  // onChange={(e) =>
                  //   setFormData({ ...formData, documents: e.target.files })
                  // }
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Highlights:</FormLabel>
                <Stack spacing={2}>
                  {highlights.map((highlight, index) => (
                    <Flex key={index} align="center">
                      <Input
                        placeholder={`Highlight ${index + 1}`}
                        value={highlight}
                        onChange={(e) =>
                          handleHighlightsChange(index, e.target.value)
                        }
                      />
                      {index > 1 && (
                        <IconButton
                          type="button"
                          onClick={() => handleRemoveHighlight(index)}
                          icon={<CloseIcon />}
                          colorScheme="red"
                          size="sm"
                          aria-label="Remove Highlight"
                          ml={2}
                        />
                      )}
                    </Flex>
                  ))}
                  <Button
                    type="button"
                    onClick={handleAddHighlight}
                    colorScheme="green"
                    size="sm"
                    leftIcon={<AddIcon />}
                  >
                    Add Highlight
                  </Button>
                </Stack>
              </FormControl>
              <Center>
                <Button
                  padding={"30px 32px"}
                  bg="brand.100"
                  color={"white"}
                  mt={10}
                  type="submit"
                >
                  Create Company Profile
                </Button>
              </Center>
            </form>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
export default RaiseCapital;
