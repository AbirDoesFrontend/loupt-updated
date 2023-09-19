import { useState, useEffect } from "react";
import { SimpleGrid } from "@chakra-ui/react";
import Card from "./Card";
// import CompanyImg1 from "../assets/companyImg.png";
// import CompanyImg2 from "../assets/companyImg2.png";
// import CompanyImg3 from "../assets/companyImg3.png";
import userImg from "../assets/user.png";

import { getAllCompanies, Company } from "../api";
import { useAuth0 } from "@auth0/auth0-react";

const CardGrid = () => {
  const [allCompanies, setAllCompanies] = useState([] as Company[]);

  const { user, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading /* && user */) {
      getAllCompanies().then((response) => {
        console.log("All Companies :: ", response);
        setAllCompanies(response);
      });
    }
  }, [isLoading]);

  return (
    <SimpleGrid columns={[1, null, 3]} spacing="40px" mx={10} mt={0}>
      {allCompanies.slice(0, 6).map((company, index) => (
        <Card key={index} userName={""} {...company} /> //add userName="" to fix error
      ))}
    </SimpleGrid>
  );
};

export default CardGrid;
