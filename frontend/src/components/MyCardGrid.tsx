import { useState, useEffect } from "react";
import { SimpleGrid, Box, Text } from "@chakra-ui/react";
import Card from "./Card";
// import CompanyImg1 from "../assets/companyImg.png";
// import CompanyImg2 from "../assets/companyImg2.png";
// import CompanyImg3 from "../assets/companyImg3.png";
import userImg from "../assets/user.png";

import { getAllCompanies, Company, getConnectedCompanies } from "../api";
import { useAuth0 } from "@auth0/auth0-react";

const CardGrid = () => {
  const [connectedCompanies, setConnectedCompanies] = useState([] as Company[]);
  const [allCompanies, setAllCompanies] = useState([] as Company[]);

  const { user, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading /* && user */) {
      getConnectedCompanies().then((response) => {
        console.log("All Companies :: ", response);
        setConnectedCompanies(response);
      });
    }
  }, [isLoading]);

  return (
    <>
      {connectedCompanies.length !== 0 ? (
        <SimpleGrid columns={[1, null, 3]} spacing="40px" mx={10} mt={0}>
          {connectedCompanies.slice(0, 6).map((company, index) => (
            <Card key={index} userName={""} {...company} /> // It's better to use a unique ID rather than an index as the key if possible.
          ))}
        </SimpleGrid>
      ) : (
        <Box padding={"20px"} borderRadius={"10px"} mx={10} mt={10}>
          <Text fontSize={"16px"} fontWeight="bold" textAlign="center">
            You have no companies in your network.
          </Text>
        </Box>
      )}
    </>
  );
};

export default CardGrid;
