import { useState, useEffect, useContext } from "react";
import {
  getCompany,
  getUser,
  User,
  Company,
  getAllCompanies,
  getConnectedCompanies,
  getUserToken,
} from "../api";
import { useAuth0, Auth0Context } from "@auth0/auth0-react";
import {
  Flex,
  Text,
  Box,
  Stack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  HStack,
  useBreakpointValue,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Button,
  Spacer,
} from "@chakra-ui/react";
import { SearchIcon, HamburgerIcon } from "@chakra-ui/icons";
import logo from "../assets/Loupt app logo 4.png";
import { Link, useNavigate as navigate, useNavigate } from "react-router-dom";

// import avatar from '../assets/avatar.png';

// Custom Header Styles
import {
  FlexStyle,
  LogoStyle,
  LogoText,
  NavItem,
  NavItemHover,
  NavLink,
  HambugerIconHover,
} from "./styles/HeaderStyles";

const Header = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const breakpoint = useBreakpointValue({ base: "base", md: "md", lg: "lg" });

  //const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [userData, setUserData] = useState({} as User);
  const [searchResults, setSearchResults] = useState([]);
  const [companyData, setCompanyData] = useState({} as Company[]);
  const [avatar, setAvatar] = useState("" as string);
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    isLoading,
  } = useAuth0();
  //const auth0 = useContext(Auth0Context);

  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });

  useEffect(() => {
    if (!isLoading && user) {
      getUserToken(user, getAccessTokenSilently).then((result) => {
        if (result.isAuthenticated) {
          console.log("authenticated!");

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
      });
    }
  }, [isLoading]);

  // const filteredCompanies = companyData.filter(company =>
  //   company.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );
  // console.log(filteredCompanies)
  const search = async () => {
    try {
      const response = await fetch(
        `https://api.investloupt.com/search?q=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data);
      // Navigate to results page with data
      navigate("/results", { state: { data: data } });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };
  return (
    <Box bg={"brand.100"} maxWidth={"100%"}>
      <Flex sx={FlexStyle}>
        <Flex alignItems="center">
          <Link to="/">
            <Image
              src={logo} // Insert your logo url here
              alt="Logo"
              sx={LogoStyle}
              display={["block", "none", "block"]}
            />
          </Link>
          <Link to="/">
            <Text sx={LogoText}>Loupt</Text>
          </Link>
        </Flex>
        {breakpoint === "lg" ? (
          <>
            <Flex alignItems="center">
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<SearchIcon color="white" />}
                />
                <Input
                  color="white"
                  placeholder="Search"
                  width={{ base: "200px", md: "200px", lg: "250px" }}
                  // onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Flex>
            <Spacer />
            <Flex alignItems="center">
              <Stack direction="row" spacing={6}>
                <Text sx={NavItem}>
                  <Link to="/">
                    <Text _hover={NavItemHover} sx={NavLink}>
                      Invest
                    </Text>
                  </Link>
                </Text>
                <Text sx={NavItem}>
                  <Link to="/about">
                    <Text _hover={NavItemHover} sx={NavLink}>
                      About
                    </Text>
                  </Link>
                </Text>
                <Text sx={NavItem}>
                  <Link to="/raise-capital">
                    <Text _hover={NavItemHover} sx={NavLink}>
                      Raise Capital
                    </Text>
                  </Link>
                </Text>
                <Text sx={NavItem}>
                  {user && (
                    <a href="/profile">
                      <Text _hover={NavItemHover} sx={NavLink}>
                        Profile
                      </Text>
                    </a>
                  )}
                </Text>
              </Stack>

              {/* If User is Logged Out / Signed Out  */}

              {!isAuthenticated && (
                <Button
                  id="qsLoginBtn"
                  ml={8}
                  onClick={() => loginWithRedirect({})}
                >
                  Log in / SignUp
                </Button>
              )}

              {/* If User is Signed In / Logged In  */}

              {isAuthenticated && (
                <HStack
                  justifyContent="center"
                  alignItems="center"
                  spacing={3}
                  pl={16}
                >
                  <Avatar
                    borderRadius="9999px"
                    bg="#A0AEC0"
                    name="Avatar"
                    src={userData.profilePic}
                  />
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    //block
                    onClick={() => logoutWithRedirect()}
                  >
                    Log Out
                  </Button>
                </HStack>
              )}
              {/* isAuthenticated && console.log(user) */}
            </Flex>
          </>
        ) : (
          <>
            <InputGroup ml={8}>
              <InputLeftElement
                pointerEvents="none"
                children={<SearchIcon color="white" />}
              />
              <Input color="white" placeholder="Search" width="240px" />
            </InputGroup>
            <IconButton
              aria-label="open menu"
              icon={<HamburgerIcon />}
              onClick={onOpen}
              variant="outline"
              color="white"
              // _hover={HamburgerIcon}
            />
          </>
        )}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>
                <Avatar
                  borderRadius="9999px"
                  bg="#A0AEC0"
                  name="Avatar"
                  src={userData.profilePic}
                />
              </DrawerHeader>
              <DrawerBody>
                <Stack spacing={4}>
                  <Link to="/invest">Invest</Link>
                  <Link to="/about">About</Link>
                  <Link to="/">Setting</Link>
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </Flex>
    </Box>
  );
};

export default Header;
