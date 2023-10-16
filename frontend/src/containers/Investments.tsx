import { useEffect, useState } from "react";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    VStack,
    InputLeftAddon,
    Heading,
    Select,
    HStack,
    Divider,
    Checkbox,
    InputGroup,
    Text,
    Grid,
    Flex,
    Center,
    useBreakpointValue,
    Avatar
} from "@chakra-ui/react";
import {
    getUser,
    getConnectedUsers,
    getAllCompanies,
    getConnectedCompanies,
    Company,
    User,
    getCompany,
    getPaymentMethod,
    executeTrade,
} from "../api";
// import styles from "./styles/CheckoutStyles";
import { useLocation } from "react-router-dom";
import { useParams, Link } from "react-router-dom";
import { useAuth0, Auth0Context } from "@auth0/auth0-react";
import { PaymentMethod } from "../api";
import { useLouptAuth } from "../contexts/LouptAuthProvider";

function Investments() {
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
    const [userInvestmentCompanies, setUserInvestmentCompanies] = useState<Company[]>([]);
    // // FOR USER PROFILE ROUTE
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
        if (id) {
            getUser(encodeURIComponent(id)).then((response: any) => {
                console.log("User:");
                console.log(response);
                if (response) {
                    setUser(response);
                    setListOfUsersConnection(response.connections);



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
                    getUser().then(async (response: any) => {
                        console.log("User:");
                        console.log(response);
                        if (response) {
                            setUser(response);
                            setListOfUsersConnection(response.connections);
                            console.log("User Connections:", response.connections);
                            console.log("User Followers:", response.followers);
                            setUserFollowers(response.followers);
                            console.log("User Following:", response.following);
                            setUserInvestmentArray(response.investments);
                            console.log("User Investments:", response.investments);
                            console.log("User Investments", userInvestmentArray)
                            const companyIds = response.investments.map(
                                (investment: { companyId: any }) => investment.companyId
                            );
                            setUserInvestmentCompanyIds(companyIds);
                            console.log("All Company Ids:", companyIds);

                            // Getting Id of an individual connected companies from user
                            setUserConnectedCompanyID(response.companies);
                            await fetchAllCompanies(companyIds);
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


    const fetchAllCompanies = async (companyIDs: string[]) => {
        try {
            const companyPromises = companyIDs.map(id => getCompany(id)); // Map over IDs to create array of promises
            const companies = await Promise.all(companyPromises); // Wait for all promises to resolve
            setUserInvestmentCompanies(companies); // Set the resulting companies to state
            console.log("companies", companies);
        } catch (error) {
            console.error("Error fetching companies:", error);
        }
    }
    const uniqueCompanies = [...new Set(userInvestmentArray.map(investment => investment.companyId))];

    // Sum all counts (assuming each investment object has a count property)
    const totalCount = userInvestmentArray.reduce((acc, investment) => acc + (investment.shareCount || 0), 0);

    // Sum all amounts
    const totalAmount = userInvestmentArray.reduce((acc, investment) => acc + (investment.amount || 0), 0);
    return (
        <>
            <Heading
                my={4}
                pl={[0, 0, 10, 10]}
                color={"#8764FF"}
                fontSize={[40, 40, 50, 60]}
                textAlign={["center", "center", "start", "start"]}
            >
                Investments
            </Heading>

            <Divider borderColor={"#8764FF"} borderWidth={'2px'} />

            {userInvestmentArray.length === 0 ? (
                <Text fontSize={34} textAlign="center" m={8}>
                    No Investments
                </Text>
            ) : (

                <Flex flexWrap="wrap" justifyContent="center">
                    <VStack w={['100%', '100%', '50%', '45%']} spacing={6} mr={[0, 0, 4, 4]} alignItems={["center", "start"]}>
                        <Heading mt={8} textAlign={"start"} fontSize={36}>Statistics</Heading>

                        <Box
                            bg="white"
                            w="100%"
                            h="608px"
                            borderRadius={25}
                            borderStyle={'solid'}
                            borderColor={'#707070'}
                            borderWidth="1px"
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            mb={8}
                        >
                            {/* First section */}
                            <Box flex="1" display="flex" alignItems="center" justifyContent="center">
                                <VStack>
                                    <Text fontSize={64}>{uniqueCompanies.length}</Text>
                                    <Text fontSize={32} color={"#8764FF"}> No. of Companies</Text>
                                </VStack>
                            </Box>

                            {/* First Divider */}
                            <Center>
                                <Divider borderColor={"#C7C7C7"} borderWidth={'1px'} w="70%" />
                            </Center>

                            {/* Second section */}
                            <Box flex="1" display="flex" alignItems="center" justifyContent="center">
                                <VStack>
                                    <Text fontSize={64}> {totalCount} </Text>
                                    <Text fontSize={32} color={"#8764FF"}> No. of Shares</Text>
                                </VStack>
                            </Box>

                            {/* Second Divider */}
                            <Center>
                                <Divider borderColor={"#C7C7C7"} borderWidth={'1px'} w="70%" />
                            </Center>

                            {/* Third section */}
                            <Box flex="1" display="flex" alignItems="center" justifyContent="center">
                                <VStack>
                                    <Text fontSize={64}> ${totalAmount}</Text>
                                    <Text fontSize={32} color={"#8764FF"}> Total Capital Invesment</Text>
                                </VStack>
                            </Box>
                        </Box>
                    </VStack>

                    <VStack w={['100%', '100%', '50%', '45%']} spacing={6} alignItems={["center", "start"]}>
                        <Heading mt={8} textAlign="start" fontSize={36}>Investment Status</Heading>

                        {
                            userInvestmentArray.slice(0, 4).map((investment, index) => {
                                // Find the company from userInvestmentCompanies using companyId
                                const company = userInvestmentCompanies.find(comp => comp.companyId === investment.companyId);

                                return (
                                    <Box
                                        key={index}
                                        bg="white"
                                        w="100%"
                                        h={['auto', 'auto', '134px']}
                                        p="4"
                                        borderRadius={25}
                                        display="flex"
                                        justifyContent="center"
                                        alignItems="center"
                                        borderStyle={'solid'}
                                        borderColor={'#707070'}
                                        borderWidth="1px"
                                        mb={2}
                                    >
                                        <Flex direction={["column", "column", "row"]} justifyContent={["center", "space-between"]} alignItems="center" width="100%">
                                            <Flex direction="column" mb={["4", "4", "0"]} alignItems={["center", "center", "flex-start"]}>
                                                <Text fontSize="14px">Company Name</Text>
                                                <HStack mt={2} alignItems="flex-start">
                                                    <Avatar src={company?.logo}></Avatar>
                                                    <Text fontSize="24px">{company ? company.name : 'Not Found'}</Text>
                                                </HStack>
                                            </Flex>
                                            <Flex direction="column" mb={["4", "4", "0"]} alignItems={["center", "center", "flex-start"]}>
                                                <Text fontSize="14px">Amount</Text>
                                                <Text fontSize="24px">${investment.amount}</Text>
                                            </Flex>
                                            <Flex direction="column" alignItems={["center", "center", "flex-start"]}>
                                                <Text fontSize="14px">Status</Text>
                                                <Text fontSize="24px">{'Pending'}</Text>
                                            </Flex>
                                        </Flex>
                                    </Box>


                                );
                            })
                        }
                    </VStack>
                </Flex>
            )
            }
        </>
    );
}

export default Investments;