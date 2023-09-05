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
  Text,
  VStack,
  SimpleGrid,
  Avatar,
  Image,
  AvatarBadge,
  Button,
  HStack,
  Spacer,
  Flex,
  Center,
  Divider,
  Stack,
  Grid,
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

const ProfilePage = () => {
  const [user, setUser] = useState({} as User);
  const [suggestedUser, setSuggestedUser] = useState<User[]>([]);
  const [connectedUsers, setConnectedUsers] = useState([] as User[]);
  // const [allCompanies, setAllCompanies] = useState([] as Company[]);
  const [connectedCompanies, setConnectedCompanies] = useState([] as Company[]);
  const [showEditButton, setShowEditButton] = useState(false)
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

          getUser().then((response) => {
            console.log("User:");
            console.log(response);
            if (response) setUser(response);
          });

          getConnectedCompanies().then((response) => {
            console.log("Connected Companies:");
            console.log(response);
            setConnectedCompanies(response);
          });

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

  useEffect(() => {
    getSuggestedUsers().then((response: User[]) => {
      console.log("Suggested Users:", response);
      response.filter((user) => {
        if (user._id === id) {
          setUser(user);
          setShowEditButton(false);
          console.log(user);
          // setConnectedUsers(user);
        }
      });
    });
  }, [id]);

  return (
    <>
      <Box maxW={"7xl"} mx={"auto"}>
        {/* Banner */}
        <Box sx={styles.banner}>
          <Image
            src={user.banner}
            w={"100%"}
            h={"100%"}
            borderRadius={8}
            opacity={0.6}
          />
          {auth0User && (
            <Button sx={styles.editButton} leftIcon={<FaEdit />}>
              Edit Profile
            </Button>
          )}
        </Box>
        {/* Profile Details */}
        <VStack align="left" spacing={0} position="relative">
          {/* Profile Picture */}
          <Flex
            justifyContent="start"
            alignItems="center"
            h="0px"
            marginLeft={5}
          >
            <Box
              sx={styles.profileBox}
              border={"4px solid"}
              borderRadius={100}
              borderColor={"brand.200"}
            >
              <Avatar
                src={user.profilePic}
                size="full"
                padding={"4px"}
                bg={"brand.100"}
                position="absolute"
                top={0}
              />
            </Box>
          </Flex>

          <HStack justifyContent={"space-between"}>
            <Box marginLeft={"80px"}>
              <Text sx={styles.name}>{user.legalName}</Text>
              <HStack sx={styles.connectionInfo}>
                <Text>{user.connections?.length}+ Connections</Text>
                {user.connections?.slice(0, 8).map((connection, index) => (
                  <Image
                    key={index}
                    borderRadius="full"
                    boxSize="40px"
                    src={bannerImg}
                    alt="Connection"
                    marginRight={"-20px"}
                  />
                ))}
              </HStack>
            </Box>
            <HStack gap={10} fontSize={18}>
              <Text>
                <EmailIcon sx={styles.icon} /> {user.email}
              </Text>
              <Text>
                <PhoneIcon sx={styles.icon} /> {user.phoneNumber}
              </Text>
            </HStack>
          </HStack>

          <Grid templateColumns={"1fr 2fr"} gap={8} margin={"50px 0"}>
            {/* ABOUT / BIO */}
            <Box
              // margin={"0 10px"}
              alignItems={"start"}
              borderRadius={"8px"}
              padding={"20px"}
              background={"brand.200"}
            >
              <Text fontSize="2xl" mb={4} fontWeight="bold">
                About
              </Text>
              <Text>{user.bio}</Text>
            </Box>

            {/* NETWORK SUGGESTIONS  */}
            <Box
              borderRadius={"8px"}
              padding={"30px"}
              border={"1px solid"}
              borderColor={"brand.200"}
            >
              <Heading mb={6}>Network Suggestions</Heading>
              <NetworkCard></NetworkCard>
            </Box>

            {/* CONTACT INFORMATION */}
            <VStack
              spacing={6}
              alignItems={"start"}
              borderRadius={"8px"}
              padding={"20px"}
              background={"brand.200"}
            >
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
                <Text sx={styles.iconText}>Studied at {user.education}</Text>
              </HStack>
            </VStack>

            {/* MY INVESTMENT  */}
            <Box
              p={4}
              borderRadius={"8px"}
              padding={"30px"}
              border={"1px solid"}
              borderColor={"brand.200"}
            >
              <Heading mb={10}>My Investments</Heading>
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                spacing={10}
                justifyItems={"start"}
                alignItems={"start"}
                height={"100%"}
              >
                <FeatureCard title={"Lifetime Support"} />
                <FeatureCard title={"Unlimited Donations"} />
                <FeatureCard title={"Instant Delivery"} />
              </SimpleGrid>
            </Box>

            {/* ABOUT COMPANY  */}
            <Box
              p={4}
              borderRadius={"8px"}
              padding={"30px"}
              // border={"1px solid"}
              backgroundColor={"brand.200"}
            >
              <Heading fontSize={24}>About Company</Heading>
            </Box>

            {/* CONNECTED COMPANY  */}
            <Box
              p={4}
              borderRadius={"8px"}
              padding={"30px"}
              border={"1px solid"}
              borderColor={"brand.200"}
            >
              <Heading mb={10}>Connected Company</Heading>
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                spacing={10}
                justifyItems={"start"}
                alignItems={"start"}
                height={"100%"}
              >
                {
                  connectedCompanies.map((company , index) => (
                    <FeatureCard {...company} key={index} />
                  ))
                }
              </SimpleGrid>
            </Box>
          </Grid>
        </VStack>
      </Box>
    </>
  );
};

export default ProfilePage;
