import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Button,
  Checkbox,
  Text,
} from "@chakra-ui/react";
import { styles } from "./styles/CheckoutStyles";

const Checkout: React.FC = () => {
  const [investAmount, setInvestAmount] = useState<number>(0);

  const totalCost = investAmount + investAmount * 0.1;

  return (
    <HStack spacing={8} p={8} bg="#f8f9fa" minH="100vh">
      {/* First Column */}
      <VStack sx={styles.column} spacing={8}>
        <Box sx={styles.box}>
          <Text fontSize="lg" fontWeight="bold">
            Invest Amount
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

        <Box sx={styles.box}>
          <Text fontSize="lg" fontWeight="bold">
            Investor Info
          </Text>
          <Input placeholder="Name" mt={4} />
          <Input placeholder="Address" mt={4} />
          <Select placeholder="Relation" mt={4}>
            <option value="me">Me</option>
            <option value="company">Company</option>
            <option value="other">Other</option>
          </Select>
        </Box>

        <Box sx={styles.box}>
          <Text fontSize="lg" fontWeight="bold">
            Payment
          </Text>
          <HStack mt={4} spacing={4}>
            <Button sx={styles.button} colorScheme="blue">
              Apple
            </Button>
            <Button sx={styles.button} colorScheme="red">
              Google
            </Button>
            <Button sx={styles.button} colorScheme="yellow">
              Paypal
            </Button>
          </HStack>
        </Box>

        <Box sx={styles.box}>
          <Checkbox size="lg" mt={4}>
            Accept Terms and Conditions
          </Checkbox>
        </Box>

        <Box sx={styles.box}>
          <Text>Total Investment: {investAmount}</Text>
          <Text>Fees: {investAmount * 0.1}</Text>
          <Text>Total Cost: {totalCost}</Text>
        </Box>

        <Button sx={styles.button} colorScheme="teal" size="lg">
          Checkout
        </Button>
      </VStack>

      {/* Second Column */}
      <VStack sx={styles.column} spacing={8}>
        <Box sx={styles.box}>
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

        <Box sx={styles.box}>
          <Text fontSize="xl" fontWeight="bold">
            Deal Terms
          </Text>
          <VStack align="start" spacing={2} mt={4}>
            <Text>Deal Amount: $1,000,000</Text>
            <Text>Deadline: 31st December 2023</Text>
          </VStack>
        </Box>

        <Box sx={styles.box}>
          <Text fontSize="xl" fontWeight="bold">
            Contract PDF
          </Text>
          <Button sx={styles.button} colorScheme="purple" mt={4}>
            Download
          </Button>
        </Box>
      </VStack>
    </HStack>
  );
};

export default Checkout;
