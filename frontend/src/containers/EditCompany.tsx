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
  Textarea,
  InputLeftAddon,
  Stack,
  Center,
  Heading,
  InputGroup,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  IconButton,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import {
  getUser,
  getConnectedUsers,
  getAllCompanies,
  getConnectedCompanies,
  Company,
  User,
} from "../api";

interface FormData {
  companyName: string;
  legalPartners: string;
  numberOfShares: string;
  aboutCompany: string;
  corporateZipCode: string;
  valuationCap: string;
  corporateCountry: string;
  minInvestment: string;
  maxInvestment: string;
  fundingGoal: any;
  corporateAddress: string;
  lastDate: string;
  highlights: string[];
  documents: any;
  corporateState: string;
}

const EditCompanyPage = () => {
  const [user, setUser] = useState({} as User);
  const [connectedUsers, setConnectedUsers] = useState([] as User[]);
  const [allCompanies, setAllCompanies] = useState([] as Company[]);
  const [connectedCompanies, setConnectedCompanies] = useState([] as Company[]);

  const [highlights, setHighlights] = useState<string[]>([""]);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    corporateZipCode: "",
    numberOfShares: "",
    legalPartners: "",
    aboutCompany: "",
    valuationCap: "",
    corporateCountry: "",
    corporateAddress: "",
    minInvestment: "",
    corporateState: "",
    maxInvestment: "",
    fundingGoal: 10000,
    lastDate: "",
    documents: "",
    highlights: [""],
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
    console.log(formData);
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
          <Heading mb={10}>Edit Company Profile</Heading>
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
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
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
                    <FormLabel>Corporate Address</FormLabel>
                    <Input
                      placeholder="e.g. 903 Mill Road Kennett Square"
                      value={formData.corporateAddress}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          corporateAddress: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>About the Company:</FormLabel>
                    <Textarea
                      value={formData.aboutCompany}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          aboutCompany: e.target.value,
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
                        value={formData.valuationCap}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            valuationCap: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl mb={4}>
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
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Minimum Investment:</FormLabel>
                    <InputGroup>
                      <InputLeftAddon>$</InputLeftAddon>
                      <Input
                        placeholder="Minimum Investment"
                        value={formData.minInvestment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minInvestment: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Maximum Investment:</FormLabel>
                    <InputGroup>
                      <InputLeftAddon>$</InputLeftAddon>
                      <Input
                        placeholder="Maximum Investment"
                        value={formData.maxInvestment}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maxInvestment: e.target.value,
                          })
                        }
                      />
                    </InputGroup>
                  </FormControl>
                  {/* ... (more right column fields) */}
                </Box>
              </Flex>
              <Flex direction={{ base: "column", md: "row" }}>
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
              </Flex>
              <FormControl mb={4}>
                <FormLabel>Funding Goals:</FormLabel>
                <InputGroup>
                  <InputLeftAddon>$</InputLeftAddon>
                  <Input
                    placeholder="Maximum Investment"
                    value={formData.fundingGoal}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        fundingGoal: value,
                      })
                    }
                  />
                </InputGroup>
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Last Date:</FormLabel>
                <Input
                  type="date"
                  value={formData.lastDate}
                  onChange={(e) =>
                    setFormData({ ...formData, lastDate: e.target.value })
                  }
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Upload Documents:</FormLabel>
                <Input
                  type="file"
                  onChange={(e) =>
                    setFormData({ ...formData, documents: e.target.files })
                  }
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
                  Update Company Profile
                </Button>
              </Center>
            </form>
          </Box>
        </Flex>
      </Box>
    </>
  );
};
export default EditCompanyPage;
