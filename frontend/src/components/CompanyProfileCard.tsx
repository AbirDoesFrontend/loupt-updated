import { useState, ChangeEvent } from "react";
import {
  Box,
  Text,
  Progress,
  Button,
  VStack,
  HStack,
  Avatar,
  Icon,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  keyframes,
  Image,
} from "@chakra-ui/react";
import {
  FaMoneyBill,
  FaShare,
  FaBuilding,
  FaMapMarkerAlt,
  FaLink,
} from "react-icons/fa";
import styles from "./styles/CompanyProfileCardStyles";
import AppleImg from "../assets/apple.jpg";
import { Company } from "../api";

const CompanyProfileCard: React.FC<Company> = ({
  //companyId,
  //name,
  logo,
  //banner,
  //bio,
  //shortBio,
  //partners,
  //website,
  valuation,
  minimumInvestment,
  sharePrice,
  sharesOutstanding,
  //location,
  //_id,
  //createdAt,
  //updatedAt,
  //__v,
}) => {
  const [fundRaised, setFundRaised] = useState<number>(50000);
  const [investment, setInvestment] = useState<string | number>(""); // can be a string initially due to the empty input field
  const totalValuation: number = valuation;
  const progress: number = (fundRaised / totalValuation) * 100;

  const addFunds = (): void => {
    const newFund: number = fundRaised + Number(investment);
    if (newFund <= totalValuation) {
      setFundRaised(newFund);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInvestment(e.target.value);
  };

  return (
    <Box sx={styles.profileCard}>
      {/* Logo at the top center */}
      <Flex justifyContent="center" alignItems="center" h="20px">
        <Box sx={styles.profileBox}>
          <Avatar src={logo} size="full" position="absolute" top={0} />
        </Box>
      </Flex>
      <VStack spacing={5} align="start">
        <Progress
          value={progress}
          colorScheme="purple"
          sx={styles.progressBar}
        />

        <HStack>
          <Icon sx={styles.icon} as={FaMoneyBill} />
          <Flex gap={2} fontSize={18}>
            <Text as="b">Company Valuation:</Text> <Text> ${valuation}</Text>
          </Flex>
        </HStack>

        <HStack>
          <Icon sx={styles.icon} as={FaShare} />
          <Flex gap={2} fontSize={18}>
            <Text as="b">Minimum Investment: </Text>{" "}
            <Text> ${minimumInvestment}</Text>
          </Flex>
        </HStack>

        <HStack>
          <Icon sx={styles.icon} as={FaBuilding} />
          <Flex gap={2} fontSize={18}>
            <Text as="b">Share Price: </Text> <Text>${sharePrice}</Text>
          </Flex>
        </HStack>

        <HStack>
          <Icon sx={styles.icon} as={FaMapMarkerAlt} />
          <Flex gap={2} fontSize={18}>
            <Text as="b">Share Outstanding: </Text>{" "}
            <Text>${sharesOutstanding}</Text>
          </Flex>
        </HStack>

        <HStack>
          <Icon sx={styles.icon} as={FaLink} />
          <Flex gap={2} fontSize={18}>
            <Text as="b">Fund Raised: </Text> <Text>${fundRaised}</Text>
          </Flex>
        </HStack>

        {/* Input for investment amount */}
        <InputGroup size={"lg"} sx={styles.investmentGroup}>
          <Input
            padding="1rem"
            type="number"
            placeholder="$ Invest Amount"
            onChange={(e) => setInvestment(e.target.value)}
          />
          <InputRightElement width="6.5rem">
            <Button
              height={"36px"}
              bg={"brand.100"}
              color={"white"}
              onClick={addFunds}
            >
              $ Invest
            </Button>
          </InputRightElement>
        </InputGroup>
      </VStack>
    </Box>
  );
};

export default CompanyProfileCard;
