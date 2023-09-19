import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
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
  getCompany,
  updateCompany,
} from "../api";
import { useNavigate, useParams } from "react-router-dom";

interface FormData {
  companyName: string;
  legalPartners: string;
  sharePrice: any;
  aboutCompany: string;
  corporateZipCode: string;
  valuationCap: any;
  corporateCountry: string;
  minInvestment: any;
  maxInvestment: string;
  fundingGoal: any;
  corporateAddress: string;
  lastDate: string;
  highlights: string[];
  documents: any;
  corporateState: string;
  industries: string[];
  website: string;
  sharesOutstanding: any;
}

const EditCompanyPage = () => {
  const [user, setUser] = useState({} as User);
  const [connectedUsers, setConnectedUsers] = useState([] as User[]);
  const [allCompanies, setAllCompanies] = useState([] as Company[]);
  const [connectedCompanies, setConnectedCompanies] = useState([] as Company[]);
  const [company, setCompany] = useState({} as Company);

  const navigate = useNavigate();

  const [highlights, setHighlights] = useState<string[]>([""]);
  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    corporateZipCode: "",
    sharePrice: 0,
    legalPartners: "",
    aboutCompany: "",
    valuationCap: 0,
    corporateCountry: "",
    corporateAddress: "",
    minInvestment: 0,
    corporateState: "",
    maxInvestment: "",
    fundingGoal: 10000,
    lastDate: "",
    documents: "",
    highlights: [""],
    industries: [""],
    website: "",
    sharesOutstanding: 0,
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

  const params = useParams();
  // console.log(params);
  const id = params.id;
  //console.log(id);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(formData);

    const name = formData.companyName;
    const bio = formData.aboutCompany;
    const website = formData.website;
    const valuation = formData.valuationCap;
    const minimumInvestment = formData.minInvestment;
    const sharePrice = formData.sharePrice;
    const sharesOutstanding = formData.sharesOutstanding;
    const location = formData.corporateAddress;

    const updatedCompany = {
      name: name,
      bio: bio,
      website: website,
      valuation: valuation,
      minimumInvestment: minimumInvestment,
      sharePrice: sharePrice,
      sharesOutstanding: sharesOutstanding,
      location: location,
    };

    if (!id) {
      console.log("No id param found to edit company.");
      return;
    }

    updateCompany(id, updatedCompany).then((response) => {
      if(response) {
        toast.success("Company has been updated!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        toast.error('Something went wrong!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      setTimeout(() => {
        navigate(`/company/${id}`);
      }, 3000);
      console.log("Updated Company : ", response);
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

    // getConnectedUsers().then((response) => {
    //   console.log("Connected Users:");
    //   console.log(response);
    //   setConnectedUsers(response);
    // });

    // getAllCompanies().then((response) => {
    //   console.log("All Companies:");
    //   console.log(response);
    //   setAllCompanies(response);
    // });

    // getConnectedCompanies().then((response) => {
    //   console.log("Connected Companies:");
    //   console.log(response);
    //   setConnectedCompanies(response);
    // });

    getCompany(id).then((response) => {
      console.log("Single Company : ", response);
      setCompany(response);
    });
  }, [id]);

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
        {/* <Heading>{company.name}</Heading> */}
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          companyName: e.target.value,
                        })
                      }
                      defaultValue={company.name}
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Share Price:</FormLabel>
                    <Input
                      type="number"
                      placeholder="E.g. $50000"
                      defaultValue={company.sharePrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sharePrice: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Corporate Address</FormLabel>
                    <Input
                      placeholder="e.g. 903 Mill Road Kennett Square"
                      defaultValue={company.location}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          corporateAddress: e.target.value,
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
                      defaultValue={company.bio}
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
                        defaultValue={company.valuation}
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
                        defaultValue={"United States"}
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
                    <FormLabel>Industries:</FormLabel>
                    <InputGroup>
                      <Input
                        defaultValue={"United States"}
                        // onChange={(e) =>
                        //   setFormData({
                        //     ...formData,
                        //     industries: e.target.value,
                        //   })
                        // }
                      />
                    </InputGroup>
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Corporate Zip Code</FormLabel>
                    <Input
                      placeholder="e.g 19348"
                      defaultValue={"United States"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          corporateZipCode: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Website</FormLabel>
                    <Input
                      defaultValue={company.website}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          website: e.target.value,
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
                        defaultValue={company.minimumInvestment}
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
                    <FormLabel>Industries</FormLabel>
                    <Input
                      placeholder="e.g PA"
                      defaultValue={company.industry}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          corporateState: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                  <FormControl mb={4}>
                    <FormLabel>Shares Outstanding:</FormLabel>
                    <Input
                      placeholder="E.g. $50000"
                      defaultValue={company.sharesOutstanding}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          sharesOutstanding: e.target.value,
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ToastContainer />
    </>
  );
};
export default EditCompanyPage;
