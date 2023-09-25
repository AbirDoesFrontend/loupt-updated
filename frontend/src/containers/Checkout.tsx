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



function Checkout() {
  const location = useLocation();
  const receivedFormData = location.state?.formData;
  const [investAmount, setInvestAmount] = useState<number>(0);
  const [user, setUser] = useState({} as User);
  const [currentUserId, setUserId] = useState("");
  const { getAccessTokenSilently, isLoading, user: auth0User } = useAuth0();
  const [ stripeUrl, setStripeUrl ] = useState<string>("");


  const [ cardType, setCardType ] = useState<string>("");
  const [ cardNumber, setCardNumber ] = useState<string>("");


  const totalCost = investAmount + investAmount * 0.1;

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    if (!isLoading && auth0User) {
    getUser().then((response) => {
      if (response) {
        console.log("User:");
        console.log(response);
        setUser(response);
        // Extracting the user ID and setting it to the state variable
        if (response.userId) {
          setUserId(response.userId);
          console.log("User ID: ", response.userId);

          getPaymentMethod().then((response) => {
            if (response) {
              console.log("Payment Method:");
              console.log(response); // Log the data of the response

              const payment = response as PaymentMethod; // Cast the data as PaymentMethod
          
              if (payment.stripeURL) {
                console.log("Stripe URL: ", payment.stripeURL);
                setStripeUrl(payment.stripeURL);
              } else if (payment.details) {
                setCardNumber(payment.details.creditCardNumber);
                setCardType(payment.details.cardType);
              }
            }
          });

/*           getInvestment().then((response) => {

          } */
          

        } else {
          console.error("No user ID found in the response");
        }
      } else {
        // handle the scenario when user is not returned
        console.error("No user returned");
        //setUser({} as User); this is default value anyways
      }
    });
  }},[isLoading]);

const handleButtonClick = () => {
  if(!id){
    console.log("Button clicked, but no company ID")
  }
  else{
    executeTrade(id).then((response) => {
      console.log(response)
  })
}
}

  return (
    <Box p={10} maxW={"7xl"} mx={"auto"} height={"100vh"}>
      <Heading mb={6} textTransform={"uppercase"}>
        CHECKOUT
      </Heading>
      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={10}>
        <Box
          border={"1px solid"}
          p={4}
          borderColor={"gray.200"}
          borderRadius={8}
        >
          <VStack spacing={6} align="stretch">

          {stripeUrl ? (
    // If there is a stripeUrl, display the iframe
            <iframe
              src={stripeUrl}
              hidden={false}
              style={{ width: '100%', height: '50vh', border: 'none' }}
            ></iframe>
          ) : (
            // If there's no stripeUrl, display card details
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                Card Details:
              </Text>
              <VStack align="start" spacing={3}>
                <Text>Card Type: {cardType}</Text>
                <Text>Card Number: {cardNumber}</Text>
              </VStack>
            </Box>
          )}

            <Box
              border={"1px solid"}
              p={4}
              borderColor={"gray.200"}
              borderRadius={8}
            >
              {" "}
              <Text fontSize={"lg"} fontWeight={"bold"}>
                3. Legal Stuff
              </Text>
              <Checkbox size="lg" mt={4}>
                Accept Terms and Conditions
              </Checkbox>
              <Text fontSize="lg" mt={3}>
                By using the services provided by Revolution with Loupt ("the
                Platform"), you ("User") agree to comply with and be bound by
                these Terms of Use. Please review them carefully before creating
                a campaign, donating to a campaign, or otherwise using the
                Platform.Accessing or using this Platform constitutes acceptance
                of these Terms. If you do not agree with these Terms, please
                refrain from using the Platform.
              </Text>
            </Box>
            <Button background={"brand.100"} color={"white"} size="lg" mt={4} onClick={
              handleButtonClick
            }>
              Confirm investment
            </Button>
          </VStack>
        </Box>
        <Box
          border={"1px solid"}
          p={8}
          borderRadius={8}
          background={"#f6fafc"}
          borderColor={"brand.200"}
        >
          <VStack spacing={4} align="stretch">
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
}

export default Checkout;
