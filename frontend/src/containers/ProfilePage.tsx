import { useState, useEffect } from "react";
import {
  getUser,
  Company,
  User,
  getConnectedCompanies,
  updateUser,
  addConnection,
} from "../api";

import { Link, useNavigate, useParams } from "react-router-dom";
import { FcAssistant, FcDonate, FcInTransit } from "react-icons/fc";
import {
  Box,
  Heading,
  useDisclosure,
  Container,
  Text,
  VStack,
  SimpleGrid,
  Avatar,
  Image,
  AvatarBadge,
  Spinner,
  Button,
  HStack,
  Spacer,
  Flex,
  Center,
  Divider,
  Stack,
  Grid,
  ScaleFade,
} from "@chakra-ui/react";
import { Icon, PhoneIcon, EmailIcon, ArrowForwardIcon } from "@chakra-ui/icons";

import {
  FaMapMarkerAlt,
  FaVenusMars,
  FaBriefcase,
  FaUniversity,
  FaEdit,
} from "react-icons/fa";

import {
  getConnectedUsers,
  getAllCompanies,
  getUserToken,
  getSuggestedUsers,
} from "../api";

import bannerImg from "../../src/assets/bannerImg.png";
import { useAuth0, Auth0Context } from "@auth0/auth0-react";
import styles from "./styles/ProfileStyles";
import { MdBorderColor } from "react-icons/md";
import NetworkCard from "../components/NetworkCard";
import FeatureCard from "../components/FeatureCard";
import { getCompany } from "../api";

type Investment = {
  investmentId: string;
  userId: string;
  companyId: string;
  amount: number;
  shareCount: number;
  _id: string
};

const ProfilePage = () => {
  const [user, setUser] = useState({} as User);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [listOfUsersConnection, setListOfUsersConnection] = useState([]);
  const [userConnectedCompanyID, setUserConnectedCompanyID] = useState<string[]>([]);
  const [userConnectedCompany, setUserConnectedCompany] = useState([]);
  const [connectedConnection, setConnectedConnection] = useState(true);
  const [suggestedUser, setSuggestedUser] = useState<User[]>([]);
  const [connectedUsers, setConnectedUsers] = useState([] as User[]);
  const [connectedCompanies, setConnectedCompanies] = useState([] as Company[]);
  const [userId, setUserId] = useState("");
  const [showEditButton, setShowEditButton] = useState(false);
  const { getAccessTokenSilently, isLoading, user: auth0User } = useAuth0();
  const [userInvestmentCompanyIds, setUserInvestmentCompanyIds] = useState<User[]>([]);
  const [userInvestmentArray, setUserInvestmentArray] = useState<Company[]>([]);


  // FOR USER PROFILE ROUTE
  const params = useParams();
  const id = params.id;

  const navigate = useNavigate();

  useEffect(() => {
    //wait for auth0 to be done loading and make sure we have our user data
    if (!isLoading && auth0User) {
      setShowEditButton(true);

      //get the auth0 sub and the JWT from auth0. this will be verified by our backend
      getUserToken(auth0User, getAccessTokenSilently).then((result) => {
        //is we get a success (we are authenticated), execute this logic
        if (result.isAuthenticated) {
          console.log("authenticated!");
          getUser().then((response: any) => {
            console.log("User:");
            console.log(response);
            // console.log(response?.userId);
            // console.log(response?._id);
            if (response) {
              setUser(response);
              setListOfUsersConnection(response.connections);
              console.log("User Connections:", response.connections);
              const companyIds = response.investments.map((investment: { companyId: any; }) => investment.companyId);
              setUserInvestmentCompanyIds(companyIds);
              console.log("All Company Ids:", companyIds);

              // Getting Id of an individual connected companies from user
              setUserConnectedCompanyID(response.companies);
            }
          });

          // getConnectedCompanies().then((response) => {
          //   console.log("Connected Companies:");
          //   console.log(response);
          //   setConnectedCompanies(response);
          // });

          getConnectedUsers().then((response) => {
            // console.log("Connected Users : ");
            // console.log(response);
            setConnectedUsers(response);
          });
        } else {
          console.log("Homepage: not authenticated..");
        }
      });
    }
  }, [isLoading]);

  //   useEffect(() => {
  //   getCompany(userInvestment).then((response) => {
  //     console.log("Single Company : ", response);

  //     console.log(response);
  //   });
  // });

  // Suggested Users
  useEffect(() => {
    getSuggestedUsers().then((response: User[]) => {
      // console.log("Suggested Users:", response);
      response.filter((user) => {
        if (user.userId == id) {
          setUser(user);
          setShowEditButton(false);
          // console.log("filter users:", user);
          // console.log("Suggested User Id:", user.userId);
          // console.log("Suggested User Id:", user._id);
        }
      });
    });
  }, [id]);

  //User Connected Companies
  useEffect(() => {
    getAllCompanies().then((response: any) => {
      const allCompanies = response;
      console.log(response);
      setCompanies(allCompanies);

      const filteredCompanies = allCompanies.filter((company: any) =>
        userConnectedCompanyID.includes(company.companyId)
      );
      setUserConnectedCompany(filteredCompanies);
      console.log("User Connected Companies:", filteredCompanies);
    });
  }, [user]);

  // Add User Connection (only for Accept Connection Btn)
  const addConnectionButton = (id: any) => {
    addConnection(id).then((response) => {
      if (response) {
        console.log("Connection Added", id);
        setConnectedConnection(false);
        navigate("/profile");
        navigate(0);
      }
    });
  };

  useEffect(() => {
    if (userInvestmentCompanyIds && userInvestmentCompanyIds.length > 0) {
      const fetchCompanies = async () => {
        try {
          const companyPromises = userInvestmentCompanyIds.map(id => getCompany(id));
          const companies = await Promise.all(companyPromises);
          setUserInvestmentArray(companies);
          console.log("User Investment Array:", userInvestmentArray)
          console.log("All Companies:", companies);
        } catch (error) {
          console.error("Error fetching companies:", error);
        }
      };

      fetchCompanies();
    }
  }, [userInvestmentCompanyIds]);


  return (
    <>
      {isLoading ? (
        <Container
          w={"100%"}
          height={"100vh"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.100"
            size="xl"
          />
        </Container>
      ) : (
        <ScaleFade initialScale={0.9} in={true}>
          <Box maxW={"7xl"} mx={["10px", "10px", "auto"]}>
            {/* BANNER */}
            <Box sx={styles.banner} mx={["10px", "10px", "auto"]}>
              <Image src={user.banner} sx={styles.bannerImg} />
              {showEditButton && (
                <Link to="/edit-profile">
                  <Button sx={styles.editButton} leftIcon={<FaEdit />}>
                    Edit Profile
                  </Button>
                </Link>
              )}
            </Box>

            {/* PROFILE DETAILS */}

            <VStack align="left" spacing={0} position="relative">
              {/* Profile Picture */}
              <Flex sx={styles.profilePicFlexContainer}>
                <Box sx={styles.profileBox}>
                  <Avatar
                    src={user?.profilePic}
                    sx={styles.userProfileImg}
                    size={"full"}
                  />
                </Box>
              </Flex>

              {/* USER CONNECTIONS  */}

              <HStack
                flexDirection={["column", "column", "row"]}
                justifyContent={"space-between"}
                alignItems={["start", "start", "center"]}
                marginLeft={["0px", "20px", "200px"]}
              >
                <Box marginBottom={"20px"}>
                  <Text sx={styles.name}>{user.legalName}</Text>
                  <HStack sx={styles.connectionInfo}>
                    <Text fontWeight={"semibold"}>
                      {user.connections?.length}+ Connections
                    </Text>
                    {user.connections?.map((_, index) => (
                      <Image
                        key={index}
                        src={bannerImg}
                        sx={styles.connectionImg}
                      />
                    ))}
                  </HStack>
                  {!showEditButton && (
                    <Button
                      mt={4}
                      onClick={() => addConnectionButton(user.userId)}
                    >
                      Accept Connection +{" "}
                    </Button>
                  )}
                </Box>

                {/* DIVIDER  */}

                <Divider maxW={"400px"}></Divider>
                <HStack
                  gap={6}
                  fontSize={16}
                  flexDirection={["column", "column", "row"]}
                  alignItems={"center"}
                >
                  <Text>
                    <EmailIcon sx={styles.icon} /> {user.email}
                  </Text>
                  <Text>
                    <PhoneIcon sx={styles.icon} /> {user.phoneNumber}
                  </Text>
                </HStack>
              </HStack>

              {/* PROFILE GRID CONTAINER  */}

              <Grid
                sx={styles.profileContainer}
                templateColumns={["1fr", "1fr", "2fr 1fr"]}
              >
                {/* ABOUT / BIO */}
                <Box sx={styles.aboutBio}>
                  <Flex
                    justifyContent={"space-between"}
                    flexDirection={"column"}
                  >
                    <Box>
                      <Text fontSize="2xl" mb={4} fontWeight="bold">
                        About
                      </Text>
                      <Text>{user.bio}</Text>
                    </Box>
                    <Box>
                      <Heading fontSize={20} mt={6}>
                        Fund Balance
                      </Heading>
                      <Text mt={3} fontSize={20}>
                        ${user.fundsBalance}
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                {/* NETWORK SUGGESTIONS  */}
                <Box sx={styles.networkSuggestions}>
                  <Heading mb={6}>Network Suggestions</Heading>
                  <NetworkCard></NetworkCard>
                </Box>

                {/* CONTACT INFORMATION */}
                <VStack sx={styles.contactInfo}>
                  <Heading fontSize={24}>Basic Information</Heading>
                  <HStack>
                    <Icon sx={styles.icon} as={FaMapMarkerAlt} />
                    <Text sx={styles.iconText}>Lives In {user.location}</Text>
                  </HStack>
                  <HStack>
                    <Icon sx={styles.icon} as={FaVenusMars} />
                    <Text sx={styles.iconText}>Male</Text>
                  </HStack>
                  <HStack>
                    <Icon sx={styles.icon} as={FaBriefcase} />
                    <Text sx={styles.iconText}>Works at {user.occupation}</Text>
                  </HStack>
                  <HStack>
                    <Icon sx={styles.icon} as={FaUniversity} />
                    <Text sx={styles.iconText}>
                      Studied at {user.education}
                    </Text>
                  </HStack>
                </VStack>

                {/* MY INVESTMENT  */}
                <Box sx={styles.investmentContainer}>
                  {showEditButton ? (
                    <Heading mb={10}>My Investments</Heading>
                  ) : (
                    <Heading mb={10}>{user.legalName}'s Investments</Heading>
                  )}
                  <SimpleGrid
                    sx={styles.investmentGridCard}
                    columns={{ base: 1, md: 2 }}
                    spacing={8}
                  >
                    {userInvestmentArray.map((investment) => (
                      <FeatureCard
                        // Using the array index as a key, but preferably use a unique identifier if available
                        logo={investment.logo}  // Using the company's logo for the card
                        name={investment.name}  // Using the company's name for the card
                        companyId={investment.companyId}  // Using the company's companyId or any other info you want to display
                      />
                    ))}
                  </SimpleGrid>
                </Box>



                {/* ABOUT COMPANY  */}
                <Box sx={styles.aboutCompany}>
                  <Heading fontSize={24} mb={4}>
                    About Company
                  </Heading>
                  <Text>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Deleniti, voluptas. Lorem ipsum dolor sit amet consectetur
                    adipisicing elit. Doloremque, voluptatibus.
                  </Text>
                </Box>

                {/* CONNECTED COMPANY  */}
                <Box sx={styles.connectedCompany}>
                  <HStack
                    justifyContent={"space-between"}
                    alignItems={"flex-start"}
                  >
                    <Heading mb={10}>Connected Company</Heading>
                    <Link to={"/connected-companies"}>
                      <Button bg={"brand.100"} color={"white"}>
                        View All
                      </Button>
                    </Link>
                  </HStack>
                  <SimpleGrid
                    sx={styles.connectedCompanyCard}
                    columns={{ base: 1, md: 3 }}
                    spacing={3}
                  >
                    {userConnectedCompany
                      .slice(0, 6)
                      .map((company: any, index: any) => (
                        <FeatureCard {...company} key={index} />
                      ))}
                  </SimpleGrid>
                </Box>
              </Grid>
            </VStack>
          </Box>
        </ScaleFade>
      )}
    </>
  );
};

export default ProfilePage;
