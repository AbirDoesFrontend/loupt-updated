import { useEffect, useState, ReactElement } from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  useTheme,
  Button,
  Img,
  Stack,
  useMediaQuery,
  HStack,
  Divider,
  IconButton,
  Container,
  Icon,
  createIcon,
  IconProps,
  Heading,
  useColorModeValue,
  Image,
  Center,
  Link,
  ScaleFade,
  Grid,
  Spinner,
} from "@chakra-ui/react";
import {
  FcAbout,
  FcAssistant,
  FcCollaboration,
  FcDonate,
  FcManager,
} from "react-icons/fc";
import {
  getUser,
  getConnectedUsers,
  getAllCompanies,
  getConnectedCompanies,
  Company,
  User,
} from "../api";
/* import { useAuth0, Auth0Context } from "@auth0/auth0-react";
 */import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import heroBg from "../assets/bg-hero.png";
import heroMan from "../assets/hero-man-img.png";
import styles from "./styles/HomeStyles";
import NetworkCard from "../components/NetworkCard";
import CardGrid from "../components/CardGrid";
import MyCardGrid from "../components/MyCardGrid";
import MyNetworkCard from "../components/MyNetworkCards";
import { color } from "framer-motion";
import TestimonialSection from "../components/TestimonialSection";
import Newsletter from "../components/Newsletter";
import { useLouptAuth } from "../contexts/LouptAuthProvider";

const HomePage = () => {
  const [primarySection, setPrimarySection] = useState("");
  const [secondarySection, setSecondarySection] = useState("");
  const [connectedSection, setConnectedSection] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([] as User[]);
  const [allCompanies, setAllCompanies] = useState([] as Company[]);
  const [connectedCompanies, setConnectedCompanies] = useState([] as Company[]);

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
      authenticate().then(() => {
        if(isAuthenticated)
          console.log("authenticated!")
      });
/*       getUserToken(auth0User, getAccessTokenSilently).then((result) => {
        if (result.isAuthenticated) {
          console.log("authenticated!");
          setIsAuthenticated(true);

          getUser().then((response) => {
            if (response) {
              setUserData(response);
              //setCompanyData({});
              if (userData.companies && userData.companies.length > 0) {
                //set the profile image
                setAvatar(userData.profilePic);

                //if the user is authenticated, show companies they are connected to
                getConnectedCompanies().then((response) => {
                  setCompanyData(response);
                });
              }
            }
          });
        } else console.log("Header: not authenticated..");
        getAllCompanies().then((response) => {
          setCompanyData(response);
        });
      }); */
    }
  }, [isLoading]);

  return (
    <>
      {/* HERO SECTION  */}
      <Container maxW={"100%"}>
        <Container maxW={"7xl"}>
          <Stack
            align={"center"}
            spacing={{ base: 8, md: 10 }}
            py={{ base: 20, md: 28 }}
            direction={{ base: "column", md: "row" }}
          >
            <Stack flex={1} spacing={{ base: 5, md: 10 }} alignItems={"start"}>
              <Text
                mb={{ lg: "-20px" }}
                letterSpacing={"4px"}
                background={"brand.200"}
                display={"inline"}
                px={"5"}
                py={"2"}
                fontSize={16}
                borderRadius={8}
                color={"brand.100"}
              >
                LOUPT
              </Text>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
              >
                <Text
                  as={"span"}
                  position={"relative"}
                  _after={{
                    content: "''",
                    width: "full",
                    height: "10%",
                    position: "absolute",
                    bottom: 1,
                    left: 0,
                    bg: "brand.300",
                    zIndex: -1,
                  }}
                  fontWeight={"semibold"}
                >
                  Crowdfunding Revolution!
                </Text>
                <br />
                <Text as={"span"} color={"brand.100"} fontWeight={"semibold"}>
                  Empower Your Ideas.
                </Text>
              </Heading>
              <Text color={"gray.500"} fontSize={20} maxW={"xl"}>
                To empower individuals and organizations to raise funds
                effortlessly while engaging with a community that genuinely
                cares. We strive to create a reliable, user-friendly environment
                where donors and fundraisers can connect over causes that fuel
                passion and invoke change.
              </Text>
              <Stack
                spacing={{ base: 4, sm: 6 }}
                direction={{ base: "column", sm: "row" }}
              >
                {/* <Button
                  rounded={"lg"}
                  size={"lg"}
                  fontWeight={"normal"}
                  px={6}
                  colorScheme={"red"}
                  bg={"brand.100"}
                  _hover={{ bg: "purple.500", color: "white" }}
                >
                  Get started
                </Button> */}
                {/* <Button
                  rounded={"lg"}
                  size={"lg"}
                  fontWeight={"normal"}
                  px={6}
                  leftIcon={<PlayIcon h={4} w={4} color={"gray.300"} />}
                >
                  How It Works
                </Button> */}
              </Stack>
            </Stack>
            <Flex
              flex={1}
              justify={"center"}
              align={"center"}
              position={"relative"}
              w={"full"}
            >
              <Blob
                w={"150%"}
                h={"150%"}
                position={"absolute"}
                top={"-20%"}
                left={0}
                zIndex={-1}
                color={useColorModeValue("red.50", "red.400")}
              />
              <Box
                position={"relative"}
                height={{ base: "300px", lg: "500px" }}
                rounded={"2xl"}
                boxShadow={"2xl"}
                width={"full"}
                overflow={"hidden"}
              >
                <Image
                  alt={"Hero Image"}
                  fit={"cover"}
                  align={"center"}
                  w={"100%"}
                  h={"100%"}
                  src={
                    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
                  }
                />
              </Box>
            </Flex>
          </Stack>
        </Container>
      </Container>

      {/* SECOND SECTION STARTS  */}
      {/* <Container maxW={"1280px"}>
        <Divider sx={styles.divider} mt={20} mb={20} />
        <Box p={4}>
          <Stack spacing={4} as={Container} maxW={"3xl"} textAlign={"center"}>
            <Heading
              fontSize={{ base: "2xl", sm: "5xl" }}
              fontWeight={"bold"}
              position={"relative"}
              _after={{
                content: "''",
                width: "300px",
                height: "20%",
                position: "absolute",
                bottom: 1,
                left: ["100px", "45px", "220px"],
                bg: "brand.300",
                zIndex: -1,
              }}
            >
              Loupt Solutions
            </Heading>
            <Text color={"gray.600"} fontSize={{ base: "sm", sm: "lg" }}>
              LOUPT TRANSFORMS EQUITY CROWDFUNDING, LEVERAGING SOCIAL MEDIA TO
              BOOST STARTUPS AND DEMOCRATIZE VENTURE CAPITAL FOR ALL.
            </Text>
          </Stack>

          <Container maxW={"8xl"} mt={12}>
            <Flex flexWrap="wrap" gridGap={6} justify="center">
              <Card
                heading={"Customized Portfolios"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                  </svg>
                }
                description={
                  "With us, you're not just another investor. Our platform uses state-of-the-art algorithms to match you with campaigns that align with your interests."
                }
                href={"#"}
              />
              <Card
                heading={"Social Impact Metrics"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605"
                    />
                  </svg>
                }
                description={
                  "Want to know the tangible impact of your investment? We provide you with easy-to-understand social impact metrics that allow you to track the real-world effects."
                }
                href={"#"}
              />
              <Card
                heading={"Perks and Incentives"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
                description={
                  "Invest in campaigns before they go public, giving you a first-mover advantage. From one-time contributions to recurring investments."
                }
                href={"#"}
              />
              <Card
                heading={"Investor Community"}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                    />
                  </svg>
                }
                description={
                  "Join our exclusive investor community where you can network with like-minded individuals, share tips, and discover new opportunities."
                }
                href={"#"}
              />
            </Flex>
          </Container>
        </Box>
      </Container> */}

      {/* TESTIMONIALS  */}
      {/* <Container maxWidth={"100%"} bg={"brand.200"} my={100} py={20}>
        <TestimonialSection></TestimonialSection>
      </Container> */}
      {/* DUAL BUTTONS  */}


      {/* DUAL BUTTONS  */}

      {/* DUAL BUTTONS (My Network & Explore) */}

      {/* Main Buttons: My Network & Explore */}
      <div>
        {/* Main Buttons: My Network & Explore */}
        <HStack spacing={4} justify="center" py={10}>
          <Button
            sx={styles.buttonLarge}
            {...(secondarySection === "network" ? styles.selected : styles.unselected)}
            onClick={() => setSecondarySection("network")}
          >
            My Network
          </Button>

          <Button
            sx={styles.buttonLarge}
            {...(secondarySection === "explore" ? styles.selected : styles.unselected)}
            onClick={() => setSecondarySection("explore")}
          >
            Explore
          </Button>
        </HStack>

        {/* If "My Network" is clicked */}
        {secondarySection === "network" && (
          <>
            {isAuthenticated ? (
              <HStack spacing={4} justify="center" py={10}>
                <Button
                  sx={styles.buttonLarge}
                  {...(primarySection === "connectedUsers" ? styles.selected : styles.unselected)}
                  onClick={() => setPrimarySection("connectedUsers")}
                >
                  Users
                </Button>
                <Button
                  sx={styles.buttonLarge}
                  {...(primarySection === "connectedCompanies" ? styles.selected : styles.unselected)}
                  onClick={() => setPrimarySection("connectedCompanies")}
                >
                  Companies
                </Button>
              </HStack>
            ) : (
              <HStack spacing={4} justify="center" py={10}>
                <Button
                  sx={styles.buttonLarge}
                  color={"brand.100"}
                  onClick={() => showLogin()}
                >
                  Login to View
                </Button>
              </HStack>
            )}

            {/* Content when "My Connections" is clicked */}
            {primarySection === "connectedUsers" && (
              <div>
                <VStack spacing={20} mt={5}>
                  <Box>
                    <Flex
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={10}
                    >
                      <Heading
                        fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
                        fontWeight={"bold"}
                        position={"relative"}
                        _after={{
                          content: "''",
                          width: "300px",
                          height: "20%",
                          position: "absolute",
                          bottom: 1,
                          left: ["10px", "20px", "95px"],
                          bg: "brand.300",
                          zIndex: -1,
                        }}
                        mb={8}
                      >
                        Users in my network:
                      </Heading>
                      <HStack>
                        <MyNetworkCard></MyNetworkCard>
                      </HStack>
                    </Flex>
                  </Box>
                  <Divider sx={styles.divider} />

                  {/* Network Suggestions */}
                  <Box>
                    <Flex
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={10}
                    >
                      <Heading
                        fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
                        fontWeight={"bold"}
                        position={"relative"}
                        _after={{
                          content: "''",
                          width: "300px",
                          height: "20%",
                          position: "absolute",
                          bottom: 1,
                          left: ["10px", "20px", "95px"],
                          bg: "brand.300",
                          zIndex: -1,
                        }}
                        mb={8}
                      >
                        Network Suggestions
                      </Heading>
                      <HStack>
                        <NetworkCard></NetworkCard>
                      </HStack>
                      <div></div>
                    </Flex>
                  </Box>
                </VStack>
              </div>
            )}

            {/* Content when "My Companies" is clicked */}
            {primarySection === "connectedCompanies" && (
              <div>
                <Box m={10} maxW="7xl" mx={"auto"}>
                  <Center>
                    <Heading
                      fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
                      fontWeight={"bold"}
                      position={"relative"}
                      _after={{
                        content: "''",
                        width: "300px",
                        height: "20%",
                        position: "absolute",
                        bottom: 1,
                        left: ["10px", "20px", "95px"],
                        bg: "brand.300",
                        zIndex: -1,
                      }}
                      mb={10}
                    >
                      Companies in my network:
                    </Heading>
                  </Center>
                  <MyCardGrid></MyCardGrid>
                </Box>
              </div>
            )}
          </>
        )}

        {/* If "Explore" is clicked */}
        {secondarySection === "explore" && (
          <div>
            <Box m={10} maxW="7xl" mx={"auto"}>
              <Center>
                <Heading
                  fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
                  fontWeight={"bold"}
                  position={"relative"}
                  _after={{
                    content: "''",
                    width: "300px",
                    height: "20%",
                    position: "absolute",
                    bottom: 1,
                    left: ["10px", "20px", "95px"],
                    bg: "brand.300",
                    zIndex: -1,
                  }}
                  mb={10}
                >
                  Currently Raising
                </Heading>
              </Center>
              <CardGrid></CardGrid>
            </Box>
          </div>
        )}
      </div>



      {/* NEWSLETTER SECTION  */}
      <Newsletter></Newsletter>
    </>
  );
};

export default HomePage;

const PlayIcon = createIcon({
  displayName: "PlayIcon",
  viewBox: "0 0 58 58",
  d: "M28.9999 0.562988C13.3196 0.562988 0.562378 13.3202 0.562378 29.0005C0.562378 44.6808 13.3196 57.438 28.9999 57.438C44.6801 57.438 57.4374 44.6808 57.4374 29.0005C57.4374 13.3202 44.6801 0.562988 28.9999 0.562988ZM39.2223 30.272L23.5749 39.7247C23.3506 39.8591 23.0946 39.9314 22.8332 39.9342C22.5717 39.9369 22.3142 39.8701 22.0871 39.7406C21.86 39.611 21.6715 39.4234 21.5408 39.1969C21.4102 38.9705 21.3421 38.7133 21.3436 38.4519V19.5491C21.3421 19.2877 21.4102 19.0305 21.5408 18.8041C21.6715 18.5776 21.86 18.3899 22.0871 18.2604C22.3142 18.1308 22.5717 18.064 22.8332 18.0668C23.0946 18.0696 23.3506 18.1419 23.5749 18.2763L39.2223 27.729C39.4404 27.8619 39.6207 28.0486 39.7458 28.2713C39.8709 28.494 39.9366 28.7451 39.9366 29.0005C39.9366 29.2559 39.8709 29.507 39.7458 29.7297C39.6207 29.9523 39.4404 30.1391 39.2223 30.272Z",
});

const Blob = (props: IconProps) => {
  return (
    <Icon
      width={"100%"}
      viewBox="0 0 578 440"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M239.184 439.443c-55.13-5.419-110.241-21.365-151.074-58.767C42.307 338.722-7.478 282.729.938 221.217c8.433-61.644 78.896-91.048 126.871-130.712 34.337-28.388 70.198-51.348 112.004-66.78C282.34 8.024 325.382-3.369 370.518.904c54.019 5.115 112.774 10.886 150.881 49.482 39.916 40.427 49.421 100.753 53.385 157.402 4.13 59.015 11.255 128.44-30.444 170.44-41.383 41.683-111.6 19.106-169.213 30.663-46.68 9.364-88.56 35.21-135.943 30.551z"
        fill="#c9c0fa"
      />
    </Icon>
  );
};

interface CardProps {
  heading: string;
  description: string;
  icon: ReactElement;
  href: string;
}

const Card = ({ heading, description, icon /* href */ }: CardProps) => {
  return (
    <Box
      maxW={{ base: "full", md: "275px" }}
      w={"full"}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
      shadow={"lg"}
    >
      <Stack align={"start"} spacing={2}>
        <Flex
          w={12}
          h={12}
          p={2}
          align={"center"}
          justify={"center"}
          color={"white"}
          rounded={"lg"}
          bgGradient="linear(to-l, brand.100, purple.300)"
        >
          {icon}
        </Flex>
        <Box mt={2}>
          <Heading size="md">{heading}</Heading>
          <Text mt={1} my={4} color={"gray.500"} fontSize={14}>
            {description}
          </Text>
        </Box>
        <Button
          background={"transparent"}
          color={"brand.100"}
          p={0}
          size={"sm"}
          _hover={{
            background: "transparent",
            textDecoration: "underline",
          }}
        >
          Learn more
        </Button>
      </Stack>
    </Box>
  );
};
