import { useEffect, useState } from "react";
import { MdLocalShipping } from "react-icons/md";

import {
  Box,
  Flex,
  Avatar,
  Progress,
  SimpleGrid,
  ListItem,
  List,
  Input,
  StackDivider,
  Container,
  useColorModeValue,
  Stack,
  Text,
  VStack,
  useTheme,
  Button,
  useMediaQuery,
  Center,
  Spacer,
  Image,
  HStack,
  Divider,
  Heading,
  InputLeftElement,
  InputGroup,
} from "@chakra-ui/react";
import { Icon, InfoIcon, CheckIcon } from "@chakra-ui/icons";
import { MdDiscount } from "react-icons/md";
import {
  getUser,
  getConnectedUsers,
  getAllCompanies,
  getConnectedCompanies,
  Company,
  User,
  getCompany,
} from "../api";
import { useParams, Link } from "react-router-dom";
import styles from "./styles/CompanyStyles";
import CompanyProfileCard from "../components/CompanyProfileCard";
// import borderImg from '../assets/Rectangle 17.jpg';
// import appleLogo from '../assets/Ellipse 14.jpg';
const CompanyDetailPage = () => {
  const [user, setUser] = useState({} as User);
  const [connectedUsers, setConnectedUsers] = useState([] as User[]);
  const [allCompanies, setAllCompanies] = useState([] as Company[]);
  const [connectedCompanies, setConnectedCompanies] = useState([] as Company[]);
  const [company, setCompany] = useState({} as Company);

  const params = useParams();
  console.log(params);
  const id = params.id;
  console.log(id);

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

    getCompany(id).then((response) => {
      console.log("Single Company : ", response);
      setCompany(response);
    });
  }, [id]);

  // Highlights Dummy Data
  const highlights = Array.apply(null, Array(6)).map(function (x, i) {
    return {
      id: i,
      title: "Lorem ipsum dolor sit amet",
      text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam.",
    };
  });

  return (
    <>
      <Container maxW={"7xl"}>
        <SimpleGrid sx={styles.grid}>
          <Flex>
            <Box
              w={"100%"}
              bgGradient="linear(to-l, brand.200, brand.100)"
              borderRadius={8}
              marginBottom={10}
            >
              <Image
                rounded={"md"}
                alt={company.name}
                src={
                  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                }
                sx={styles.banner}
              />
            </Box>
          </Flex>
          <Box sx={styles.card}>
            <CompanyProfileCard {...company}></CompanyProfileCard>
          </Box>
          <Stack spacing={{ base: 6, md: 10 }} marginTop={[10, 10, 0]}>
            <Box as={"header"} textAlign={["center", "center", "left"]}>
              <Heading
                lineHeight={1.1}
                fontWeight={600}
                fontSize={{ base: "2xl", sm: "4xl", lg: "5xl" }}
              >
                {company.name}
              </Heading>
              <Text
                color={useColorModeValue("gray.900", "gray.400")}
                fontWeight={300}
                fontSize={"2xl"}
              >
                Valuation: ${company.valuation}
              </Text>
            </Box>

            <Stack
              spacing={{ base: 4, sm: 6 }}
              direction={"column"}
              maxW={"3xl"}
              divider={<StackDivider borderColor={"brand.200"} />}
            >
              <Text fontSize={"lg"} textAlign={["center", "center", "left"]}>
                {company.bio}
              </Text>

              <Box p={4}>
                <Stack
                  spacing={4}
                  as={Container}
                  maxW={"3xl"}
                  textAlign={"left"}
                >
                  <Heading fontSize={"3xl"}>Our Highlights</Heading>
                </Stack>

                <Container maxW={"6xl"} mt={10}>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={10}>
                    {highlights.map((feature) => (
                      <HStack key={feature.id} align={"top"}>
                        <Box color={"brand.100"} px={2}>
                          <Icon as={CheckIcon} />
                        </Box>
                        <VStack align={"start"}>
                          <Text fontWeight={600}>{feature.title}</Text>
                          <Text color={"gray.600"}>{feature.text}</Text>
                        </VStack>
                      </HStack>
                    ))}
                  </SimpleGrid>
                </Container>
              </Box>
            </Stack>

            <Button sx={styles.button}>INVEST NOW</Button>

            <Stack
              direction="row"
              alignItems="center"
              justifyContent={"center"}
            >
              <MdLocalShipping />
              <Text>Grow Fast With Us!</Text>
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </>
  );
};
export default CompanyDetailPage;
