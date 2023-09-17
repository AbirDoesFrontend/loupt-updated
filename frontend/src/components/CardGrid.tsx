import { useState, useEffect } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import Card from "./Card";
import userImg from "../assets/user.png";

import { getAllCompanies, Company } from "../api";
import { useAuth0 } from "@auth0/auth0-react";

const CardGrid = () => {
  const [allCompanies, setAllCompanies] = useState([] as Company[]);

  const { user, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading && user) {
      getAllCompanies().then((response) => {
        setAllCompanies(response);
      });
    }
  }, [isLoading, user]);

  console.log("All Companies : ", allCompanies);

  return (
    <SimpleGrid columns={[1, null, 3]} spacing="40px" mt={15}>
      {allCompanies.slice(0, 6).map((company, index) => (
        <Card key={index} userName={""} {...company} /> //add userName="" to fix error
      ))}
    </SimpleGrid>
  );
};

export default CardGrid;
