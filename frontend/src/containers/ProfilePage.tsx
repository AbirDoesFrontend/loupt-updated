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
/*   getUserToken,
 */  getSuggestedUsers,
} from "../api";

import bannerImg from "../../src/assets/bannerImg.png";
import { useAuth0, Auth0Context } from "@auth0/auth0-react";
import styles from "./styles/ProfileStyles";
import { MdBorderColor } from "react-icons/md";
import NetworkCard from "../components/NetworkCard";
import FeatureCard from "../components/FeatureCard";
import { getCompany } from "../api";
import FollowBackCard from "../components/FollowBackCard";
import { useLouptAuth } from "../contexts/LouptAuthProvider";

type Investment = {
  investmentId: string;
  userId: string;
  companyId: string;
  amount: number;
  shareCount: number;
  _id: string;
};

const ProfilePage = () => {
  const [user, setUser] = useState({} as User);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [listOfUsersConnection, setListOfUsersConnection] = useState([]);
  const [userConnectedCompanyID, setUserConnectedCompanyID] = useState<
    string[]
  >([]);
  const [userConnectedCompany, setUserConnectedCompany] = useState([]);
  const [connectedConnection, setConnectedConnection] = useState(true);
  const [suggestedUser, setSuggestedUser] = useState<User[]>([]);
  const [connectedUsers, setConnectedUsers] = useState([] as User[]);
  const [connectedCompanies, setConnectedCompanies] = useState([] as Company[]);
  const [userId, setUserId] = useState("");
  const [showEditButton, setShowEditButton] = useState(false);
  const [userInvestmentCompanyIds, setUserInvestmentCompanyIds] = useState<
    User[]
  >([]);
  const [userInvestmentArray, setUserInvestmentArray] = useState<Company[]>([]);
  const [userDetails, setUserDetails] = useState<(User | undefined)[]>([]);
  const [userFollowers, setUserFollowers] = useState<User[]>([]);
  const [followerDetails, setFollowerDetails] = useState<User[]>([]);
  // // FOR USER PROFILE ROUTE
  const params = useParams();
  const id = params.id;
  const navigate = useNavigate();
  
  const {
    isAuthenticated,
    isLoading,
    authenticate,
    showLogin,
    logout,
    getUserJwt,
    getUserSub,
  } = useLouptAuth();

  //const 


  useEffect(() => {
    if (id) {
      getUser(encodeURIComponent(id)).then((response: any) => {
        console.log("User:");
        console.log(response);
        if (response) {
          setUser(response);
          setListOfUsersConnection(response.connections);
          console.log("User Connections:", response.connections);


          const companyIds = response.investments.map(
            (investment: { companyId: any }) => investment.companyId
          );
          setUserInvestmentCompanyIds(companyIds);
          console.log("All Company Ids:", companyIds);

          setUserConnectedCompanyID(response.companies);
        }
      });
    }

    //wait for auth0 to be done loading and make sure we have our user data
    else if (!isLoading) {
      setShowEditButton(true);
      //get the auth0 sub and the JWT from auth0. this will be verified by our backend
      authenticate().then((authenticated) => {
        //is we get a success (we are authenticated), execute this logic
        if (authenticated) {
          console.log("authenticated!");
          console.log("id: " + id);
          getUser().then((response: any) => {
            console.log("User:");
            console.log(response);
            if (response) {
              setUser(response);
              setListOfUsersConnection(response.connections);
              console.log("User Connections:", response.connections);
              console.log("User Followers:", response.followers);
              setUserFollowers(response.followers);
              console.log("User Following:", response.following);
              const companyIds = response.investments.map(
                (investment: { companyId: any }) => investment.companyId
              );
              setUserInvestmentCompanyIds(companyIds);
              console.log("All Company Ids:", companyIds);

              // Getting Id of an individual connected companies from user
              setUserConnectedCompanyID(response.companies);
            }
          });
          getConnectedUsers().then((response) => {
            setConnectedUsers(response);
          });
        } else {
          showLogin();
          console.log("Profile: not authenticated..");
        }
      });
    }
    //if we are not authenticated
  }, [isLoading, id]);

  // Suggested Users
  useEffect(() => {
    getSuggestedUsers().then((response: User[]) => {
      // console.log("Suggested Users:", response);
      response.filter((user) => {
        if (user.userId == id) {
          setShowEditButton(false);
          console.log("userId:", user.userId);
          console.log("id:", id);
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
  }, [user, id]);

  // Add User Connection (only for Accept Connection Btn)
  const addConnectionButton = (id: any) => {
    addConnection(id).then((response) => {
      if (response) {
        console.log("Connection Added", id);
        setConnectedConnection(false);
      }
    });
  };

  useEffect(() => {
    if (userInvestmentCompanyIds && userInvestmentCompanyIds.length > 0) {
      const fetchCompanies = async () => {
        try {
          const companyPromises = userInvestmentCompanyIds.map((id) =>
            getCompany(id)
          );
          const companies = await Promise.all(companyPromises);
          setUserInvestmentArray(companies);
          console.log("User Investment Array:", userInvestmentArray);
          console.log("All Companies:", companies);
        } catch (error) {
          console.error("Error fetching companies:", error);
        }
      };

      fetchCompanies();
    }
  }, [userInvestmentCompanyIds, id]);

  useEffect(() => {
    if (user.connections && user.connections.length > 0) {
      const promises = user.connections.map((connectionId) =>
        getUser(connectionId)
      );

      Promise.all(promises)
        .then((responses) => {
          setUserDetails(responses);
          console.log("User Details:", userDetails);
        })
        .catch((error) => {
          console.error("Error fetching user connections:", error);
        });
    }
  }, [user.connections, id]);



  useEffect(() => {
    const fetchFollowerDetails = async () => {
      const details = await Promise.all(user.followers.map(id => getUser(id)));
      setFollowerDetails(details.filter((detail): detail is User => detail !== undefined) as User[]);
    };

    fetchFollowerDetails();
  }, [user.followers]);

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
              {user.banner ? (
                <Image src={user.banner} sx={styles.bannerImg} />
              ) : (
                <Image
                  src={
                    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAA1BMVEVmaGeV0p8cAAAASElEQVR4nO3BgQAAAADDoPlTX+AIVQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwDcaiAAFXD1ujAAAAAElFTkSuQmCC"
                  }
                  sx={styles.bannerImg}
                />
              )}
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
                    {userDetails
                      .filter(
                        (userDetail): userDetail is User =>
                          userDetail !== undefined
                      )
                      .slice(0, 6)
                      .map((userDetail, index) => (
                        <Image
                          key={index}
                          src={userDetail.profilePic}
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
                  {user.phoneNumber ? (
                    <Text>
                      <PhoneIcon sx={styles.icon} /> {user.phoneNumber}
                    </Text>
                  ) : (
                    ""
                  )}
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
                      <Text>
                        {user.bio ? user.bio : "User don't have any bio yet!"}
                      </Text>
                    </Box>
                    <Box>
                      <Heading fontSize={20} mt={6}>
                        Fund Balance
                      </Heading>
                      <Text mt={3} fontSize={20}>
                        ${user.fundsBalance ? user.fundsBalance : 0}
                      </Text>
                    </Box>
                  </Flex>
                </Box>

                {/* NETWORK SUGGESTIONS  */}
                {user.followers && user.followers.length > 0 ? (
                  <Box sx={styles.networkSuggestions}>
                    <Heading mb={10} fontSize={30}>
                      Follow Requests
                    </Heading>
                    <Center>
                    {followerDetails.slice(0, 5).map(follower =>
                      <FollowBackCard key={follower.userId} user={follower} />
                      )}
                      </Center>
                  </Box>
                ) : (
                  <Box sx={styles.networkSuggestions}>
                    <Heading mb={10} fontSize={30}>
                      Network Suggestions
                    </Heading>
                    <NetworkCard></NetworkCard>
                  </Box>
                )}
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
                  <Heading mb={10} fontSize={24} textTransform={"capitalize"}>
                    My Investments
                  </Heading>

                  {userInvestmentArray.length ? (
                    <SimpleGrid
                      sx={styles.investmentGridCard}
                      columns={{ base: 1, md: 2 }}
                      spacing={8}
                    >
                      {userInvestmentArray.map((investment) => (
                        <FeatureCard
                          // Using the array index as a key, but preferably use a unique identifier if available
                          logo={investment.logo} // Using the company's logo for the card
                          name={investment.name} // Using the company's name for the card
                          companyId={investment.companyId} // Using the company's companyId or any other info you want to display
                        />
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Heading
                      fontSize={18}
                      fontWeight={"medium"}
                      color={"gray.500"}
                      pl={1}
                    >
                      No Investments Found!
                    </Heading>
                  )}
                </Box>

                {/* ABOUT COMPANY  */}
                <Box sx={styles.aboutCompany}>
                  <Heading fontSize={24} mb={4}>
                    About Company
                  </Heading>
                  <Text>No Information found ...</Text>
                </Box>

                {/* TODO: Change from "connected company" to invested companies */}
                <Box sx={styles.connectedCompany}>
                  <HStack
                    justifyContent={"space-between"}
                    alignItems={"flex-start"}
                  >
                    <Heading mb={10}>Companies invested</Heading>
                    <Link to={"/connected-companies"}>
                      <Button bg={"brand.100"} color={"white"}>
                        View All
                      </Button>
                    </Link>
                  </HStack>
                  {userConnectedCompany.length ? (
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
                  ) : (
                    <Heading
                      fontSize={18}
                      fontWeight={"medium"}
                      color={"gray.500"}
                      pl={1}
                    >
                      No Company Found!
                    </Heading>
                  )}
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
