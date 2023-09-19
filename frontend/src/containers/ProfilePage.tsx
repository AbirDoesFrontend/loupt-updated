import { useState, useEffect } from "react";
import {
  getUser,
  Company,
  User,
  getConnectedCompanies,
  updateUser,
} from "../api";

import { Link, useParams } from "react-router-dom";
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

const ProfilePage = () => {
  const [user, setUser] = useState({} as User);
  const [userConnectedCompanyID, setUserConnectedCompanyID] = useState([]);
  const [userConnectedCompany, setUserConnectedCompany] = useState([]);
  const [suggestedUser, setSuggestedUser] = useState<User[]>([]);
  const [connectedUsers, setConnectedUsers] = useState([] as User[]);
  // const [allCompanies, setAllCompanies] = useState([] as Company[]);
  const [connectedCompanies, setConnectedCompanies] = useState([] as Company[]);
  const [showEditButton, setShowEditButton] = useState(false);
  const { getAccessTokenSilently, isLoading, user: auth0User } = useAuth0();

  const params = useParams();
  // console.log(params);
  const id = params.id;
  console.log(id);

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
            console.log("User:", response);
            console.log(response);
            if (response) {
              setUser(response);
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
            console.log("Connected Users : ");
            console.log(response);
            setConnectedUsers(response);
          });
        } else {
          console.log("Homepage: not authenticated..");
        }
      });
    }
  }, [isLoading]);

  // Suggested Users
  useEffect(() => {
    getSuggestedUsers().then((response: User[]) => {
      console.log("Suggested Users:", response);
      response.filter((user) => {
        if (user.userId === id) {
          setUser(user);
          setShowEditButton(false);
          // console.log(user);
          // setConnectedUsers(user);
        }
      });
    });
  }, [id]);

  //User Connected Companies
  useEffect(() => {
    getAllCompanies().then((response: any) => {
      const allCompanies = response;
      const filteredCompanies = allCompanies.filter((company: any) =>
        userConnectedCompanyID.includes(company.companyId)
      );
      setUserConnectedCompany(filteredCompanies);
    });
  }, [user]);

  // console.log(userConnectedCompany);

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
              {auth0User && (
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
                    {user.connections?.slice(0, 6).map((_, index) => (
                      <Image
                        key={index}
                        src={bannerImg}
                        sx={styles.connectionImg}
                      />
                    ))}
                  </HStack>
                </Box>

                {/* DIVIDER  */}

                <Divider maxW={"400px"}></Divider>
                <HStack
                  gap={6}
                  fontSize={16}
                  flexDirection={["column", "column", "row"]}
                  alignItems={"start"}
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
                templateColumns={["1fr", "1fr", "1fr 2fr"]}
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
                  <Heading mb={10}>My Investments</Heading>
                  <SimpleGrid
                    sx={styles.investmentGridCard}
                    columns={{ base: 1, md: 2 }}
                    spacing={8}
                  >
                    <FeatureCard
                      logo={bannerImg}
                      name={"Investment 1"}
                      companyId={""}
                    />
                    <FeatureCard
                      logo={bannerImg}
                      name={"Investment 2"}
                      companyId={""}
                    />
                    <FeatureCard
                      logo={bannerImg}
                      name={"Investment 3"}
                      companyId={""}
                    />
                    <FeatureCard
                      logo={bannerImg}
                      name={"Investment 4"}
                      companyId={""}
                    />
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
                    <Link to={'/connected-companies'}>
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
