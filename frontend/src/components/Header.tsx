import { useState, useEffect, useContext } from "react";
import {
  getCompany,
  getUser,
  User,
  Company,
  getAllCompanies,
  getConnectedCompanies,
} from "../api";
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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { SearchIcon, HamburgerIcon, ChevronDownIcon } from "@chakra-ui/icons";
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
import { useLouptAuth } from "../contexts/LouptAuthProvider";

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
      authenticate().then((authenticated) => {
        if (authenticated) {
          //TODO: user state should be handles in auth0provider (instead of fetching on every page)
          getUser().then((response: any) => {
            if (response) {
              setUserData(response);
              console.log("User:", response);
              console.log(userData.profilePic);
            }
          })
        }
      });
    }
  }, [isLoading]);


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
                <Button color={"transparent"} onClick={() => search()}>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<SearchIcon color="#8764FF" />}
                  />
                </Button>
                <Input
                  color="white"
                  placeholder="Search"
                  width={{ base: "200px", md: "200px", lg: "250px" }}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyUp={(e) => {
                    if (e.key === "Enter") search();
                  }}
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
                  {userData && (
                    <Link to="/profile">
                      <Text _hover={NavItemHover} sx={NavLink}>
                        Profile
                      </Text>
                    </Link>
                  )}
                </Text>
              </Stack>

              {/* If User is Logged Out / Signed Out  */}

              {!isAuthenticated && (
                <Button
                  id="qsLoginBtn"
                  ml={8}
                  onClick={() => showLogin()}
                >
                  Log in / Sign up
                </Button>
              )}

              {/* If User is Signed In / Logged In  */}

              {isAuthenticated && (
                <HStack justifyContent="center" alignItems="center" spacing={3} pl={16}>
                  <Menu>
                    {() => (
                      <>
                        <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon color="white" boxSize={6} />}
                        variant="unstyled"
                        size="lg"
                        color="white"
                      >
                          <Avatar
                            borderRadius="9999px"
                            bg="#A0AEC0"
                            name="Avatar"
                            src={userData.profilePic}
                          />
                        </MenuButton>
                        <MenuList>
                        <MenuItem as={Link} to="/messaging">Messaging</MenuItem>
                        <MenuItem as={Link} to="/my-investments">My Investments</MenuItem>
                        <MenuItem as={Link} to="/settings">Settings</MenuItem>
                        </MenuList>
                      </>
                    )}
                  </Menu>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    onClick={() => logout()}
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
                <Menu>
                  {() => (
                    <>
                      <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon color="black" boxSize={6} />}
                        variant="unstyled"
                        size="lg"
                        color="white"
                      >
                        <Avatar
                          borderRadius="9999px"
                          bg="#A0AEC0"
                          name="Avatar"
                          src={userData.profilePic}
                        />
                      </MenuButton>
                      <MenuList>
                        <MenuItem as={Link} to="/messaging">Messaging</MenuItem>
                        <MenuItem as={Link} to="/my-investments">My Investments</MenuItem>
                        <MenuItem as={Link} to="/settings">Settings</MenuItem>
                      </MenuList>
                    </>
                  )}
                </Menu>
              </DrawerHeader>
              <DrawerBody>
                <Stack spacing={4}>
                  <Link to="/">Invest</Link>
                  <Link to="/about">About</Link>
                  <Link to="/profile">Profile</Link>
                  <Button
                    id="qsLoginBtn"
                    color="primary"
                    onClick={() => logout()}
                  >
                    Log Out
                  </Button>
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
