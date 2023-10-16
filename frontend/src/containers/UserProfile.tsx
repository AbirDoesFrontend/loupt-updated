import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
/*   getUserToken, */
  getSuggestedUsers,
} from "../api";

import bannerImg from "../../src/assets/bannerImg.png";
import { useAuth0, Auth0Context } from "@auth0/auth0-react";
import styles from "./styles/ProfileStyles";
import { MdBorderColor } from "react-icons/md";
import NetworkCard from "../components/NetworkCard";
import FeatureCard from "../components/FeatureCard";
import { getCompany } from "../api";
import FollowerCard from "../components/FollowerCard";
import { useLouptAuth } from "../contexts/LouptAuthProvider";

type Investment = {
  investmentId: string;
  userId: string;
  companyId: string;
  amount: number;
  shareCount: number;
  _id: string;
};

const UserProfile = () => {
  const [user, setUser] = useState({} as User);

  const [loggedInUser, setLoggedInUser] = useState({} as User);
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [userFollower, setUserFollower] = useState<User[]>([]);
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
/*   const { getAccessTokenSilently, isLoading, user: auth0User } = useAuth0();
 */  const [userInvestmentCompanyIds, setUserInvestmentCompanyIds] = useState<
    User[]
  >([]);
  const [userInvestmentArray, setUserInvestmentArray] = useState<Company[]>([]);
  const [userDetails, setUserDetails] = useState<(User | undefined)[]>([]);
  const [userFollowersArray, setUserFollowersArray] = useState(true);
  const [loggedInUserFollowersArray, setLoggedInUserFollowersArray] = useState(Boolean);
  const [userConnectedConnection, setUserConnectedConnection] = useState(Boolean);
  // FOR USER PROFILE ROUTE
  const params = useParams();
  const id = params.id;

  const {
    isAuthenticated,
    isLoading,
    authenticate,
    showLogin,
    logout,
    getUserJwt,
    getUserSub,
  } = useLouptAuth();


  
  useEffect(() => {
    if (!isLoading) {
      //get the auth0 sub and the JWT from auth0. this will be verified by our backend
     authenticate().then((authenticated) => {
        //is we get a success (we are authenticated), execute this logic
        if (authenticated) {
          getUser().then((response: any) => {
            setLoggedInUserId(response.userId);
          }
          );
        }
      }
      );
    }

  
      if(id){
        console.log("get profile user: " + id)
        getUser(id).then((response: User | undefined) => {
          if(response){
            setUser(response);
            console.log("currentUserFollowers", response.followers);
          }
        });
      }

    // Fetching all companies and filtering based on user connection
    getAllCompanies().then((response: any) => {
      setCompanies(response);
      const filteredCompanies = response.filter((company: any) => userConnectedCompanyID.includes(company.companyId));
      setUserConnectedCompany(filteredCompanies);
    });

    // Fetching companies based on user investments
    if (userInvestmentCompanyIds && userInvestmentCompanyIds.length > 0) {
      const fetchCompanies = async () => {
        const companyPromises = userInvestmentCompanyIds.map((id) => getCompany(id));
        const companies = await Promise.all(companyPromises);
        setUserInvestmentArray(companies);
      };
      fetchCompanies();
    }

    // Fetching user connections
    if (user.connections && user.connections.length > 0) {
      const promises = user.connections.map((connectionId) => getUser(connectionId));
      Promise.all(promises).then(setUserDetails).catch(console.error);
    }

  }, [/* id */]);


  useEffect(() => {
    // Checking if logged-in user is a follower of the user
    const isFollower = user.followers && Array.isArray(user.followers) && user.followers.includes(loggedInUserId);
    setUserFollowersArray(isFollower);

    // Checking if user is followed by logged-in user
    const isFollowed = loggedInUser.followers && Array.isArray(loggedInUser.followers) && loggedInUser.followers.includes(user.userId);
    setLoggedInUserFollowersArray(isFollowed);

    // Checking if user is connected to logged-in user
    const isConnected = user.connections && Array.isArray(user.connections) && user.connections.includes(loggedInUserId);
    setUserConnectedConnection(isConnected);

  }, [loggedInUser, user, loggedInUserId]);
  
  const addConnectionButton = (id: any) => {
    addConnection(id).then((response) => {
      if (response) {
        toast.success(`You now follow: ${user.legalName}!`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setConnectedConnection(false);
/*         navigate(0); */

        //update user
        if(id){
          getUser(id).then((response: User | undefined) => {
            if(response){
              setUser(response);
              console.log("currentUserFollowers", response.followers);
            }
          });
        }
      }
    });
  };

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
                    "https://louptimageassets.s3.amazonaws.com/2z76gexx9bc042jn27yzovr"
                  }
                  sx={styles.bannerImg}
                />
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
                  {
                    userConnectedConnection ? (
                      <Button mt={4} bg={"brand.100"} color={"white"}>
                        Connected!
                      </Button>
                    ) : userFollowersArray ? (
                      <Button mt={4} bg={"brand.100"} color={"white"}>
                        Following
                      </Button>
                    ) : loggedInUserFollowersArray ? (
                      <Button
                        mt={4}
                        bg={"brand.100"}
                        color={"white"}
                        onClick={() => addConnectionButton(user.userId)}
                      >
                        Follow Back
                      </Button>
                    ) : (
                      <Button
                        mt={4}
                        bg={"brand.100"}
                        color={"white"}
                        onClick={() => addConnectionButton(user.userId)}
                        type="submit"
                      >
                        Follow
                      </Button>
                    )
                  }

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

                {/* Follow requests  */}
                <Box sx={styles.networkSuggestions}>
                  <Heading mb={10} fontSize={30}>
                    {user.legalName}'s Followers
                  </Heading>
                  <>
                    <Flex
                      wrap={["wrap", "wrap", "nowrap"]}
                      justifyContent={"center"}
                      gap={["10px", "10px", "4px"]}
                    >
                      {userFollower.length ? (
                        userFollower
                          .slice(0, 5)
                          .map((user, index) => (
                            <FollowerCard user={user} key={index} />
                          ))
                      ) : (
                        <Box>
                          <Text
                            fontSize={20}
                            color={"gray.500"}
                            bg={"gray.100"}
                            p={5}
                            borderRadius={6}
                          >
                            {user.legalName} Has no followers! {" "}
                          </Text>
                        </Box>
                      )}
                    </Flex>
                  </>
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
                  <Heading mb={10} fontSize={24} textTransform={"capitalize"}>
                    {user.legalName ? user.legalName : ""}'s Investments
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

                {/* CONNECTED COMPANY  */}
                <Box sx={styles.connectedCompany}>
                  <HStack
                    justifyContent={"space-between"}
                    alignItems={"flex-start"}
                  >
                    <Heading mb={10} fontSize={30}>
                      {user.legalName}'s Companies
                    </Heading>
                    {userConnectedCompany.length ? (
                      <Link to={"/connected-companies"}>
                        <Button bg={"brand.100"} color={"white"}>
                          View All
                        </Button>
                      </Link>
                    ) : (
                      ""
                    )}
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

export default UserProfile;
