import { useState } from "react";
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
// import styles from "./styles/CheckoutStyles";
import { useLocation } from "react-router-dom";

function Checkout() {
  const location = useLocation();
  const receivedFormData = location.state?.formData;
  const [investAmount, setInvestAmount] = useState<number>(0);

  const totalCost = investAmount + investAmount * 0.1;

  return (
    <Box p={10} maxW={"7xl"} mx={"auto"} height={"90vh"}>
      <Heading mb={6} textTransform={"uppercase"}>
        Invest in Company
      </Heading>
      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={10}>
        <Box
          border={"1px solid"}
          p={4}
          borderColor={"gray.200"}
          borderRadius={8}
        >
          <VStack spacing={6} align="stretch">
            <Box>
              <Text fontSize="2xl" fontWeight="bold" color={"gray.500"}>
                Invest {receivedFormData?.amount}
              </Text>
              <InputGroup size="md" mt={4}>
                <InputLeftAddon children="$" />
                <Input
                  type="number"
                  placeholder="Amount"
                  onChange={(e) => setInvestAmount(parseFloat(e.target.value))}
                />
              </InputGroup>
            </Box>

            <Box>
              <Text fontSize="2xl" fontWeight="bold" color={"gray.500"}>
                Investor Info
              </Text>
              <Divider my={4}></Divider>
              <Text fontSize="lg" fontWeight="normal">
                Full Name: {receivedFormData?.firstName}{" "}
              </Text>
              <Input placeholder="Name" my={4} />
              <Text fontSize="lg" fontWeight="normal">
                Address: {receivedFormData?.primAddress1}
              </Text>
              <Input placeholder="Address" mt={4} my={4} />
              <Text fontSize="lg" fontWeight="normal">
                Investing As:
              </Text>
              <Select placeholder="Myself" mt={4}>
                <option value="me">Myself</option>
              </Select>
            </Box>

            <Box
              border={"1px solid"}
              p={4}
              borderColor={"gray.200"}
              borderRadius={8}
            >
              <Text fontSize="lg" fontWeight="bold">
                2. Payment
              </Text>
              <HStack mt={4} spacing={4}>
                <Button bg={"black"} color="white">
                  Apple Pay
                </Button>
                <Button bg={"black"} color="white">
                  Google Pay
                </Button>
                <Button bg={"black"} color="white">
                  Paypal{" "}
                </Button>
              </HStack>
            </Box>

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
            <Button background={"brand.100"} color={"white"} size="lg" mt={4}>
              Place Order
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
            <Heading size="lg">Investment Summary</Heading>
            <Divider />
            <Box>
              <Text>Total Investment:</Text>
              <Text fontWeight="bold">${investAmount}</Text>
            </Box>
            <Box>
              <Text>Fees: </Text>
              <Text fontWeight="bold">${investAmount * 0.1}</Text>
            </Box>
            <Divider />
            <Box>
              <Text fontSize={24} fontWeight={"bold"}>
                Total Cost: ${totalCost}
              </Text>
            </Box>

            <Box
              border={"1px solid"}
              p={8}
              borderRadius={8}
              background={"gray.100"}
              borderColor={"brand.200"}
            >
              <Text fontSize="xl" fontWeight="bold">
                FAQ
              </Text>
              <VStack align="start" spacing={2} mt={4}>
                <Text>1. Question 1?</Text>
                <Text>2. Question 2?</Text>
                <Text>3. Question 3?</Text>
                <Text>4. Question 4?</Text>
                <Text>5. Question 5?</Text>
              </VStack>
            </Box>

            <Box
              border={"1px solid"}
              p={8}
              borderRadius={8}
              background={"gray.100"}
              borderColor={"brand.200"}
            >
              <Text fontSize="xl" fontWeight="bold">
                Deal Terms
              </Text>
              <VStack align="start" spacing={2} mt={4}>
                <Text>Deal Amount: $1,000,000</Text>
                <Text>Deadline: 31st December 2023</Text>
              </VStack>
            </Box>

            <Box
              border={"1px solid"}
              p={8}
              borderRadius={8}
              background={"gray.100"}
              borderColor={"brand.200"}
            >
              <Text fontSize="xl" fontWeight="bold">
                Contract PDF
              </Text>
              <Button background="black" color={"white"} mt={4}>
                Download
              </Button>
            </Box>
          </VStack>
        </Box>
      </Grid>
    </Box>
  );
}

export default Checkout;
