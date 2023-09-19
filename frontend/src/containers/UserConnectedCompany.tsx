import { useEffect, useState } from "react";
import { User, getAllCompanies, getUser, getUserToken } from "../api";
import { useAuth0 } from "@auth0/auth0-react";
import Card from "../components/Card";
import { Container, SimpleGrid } from "@chakra-ui/react";

const UserConnectedCompany = () => {
  const [user, setUser] = useState({} as User);
  const [userConnectedCompanyID, setUserConnectedCompanyID] = useState([]);
  const [userConnectedCompany, setUserConnectedCompany] = useState([]);
  const { getAccessTokenSilently, isLoading, user: auth0User } = useAuth0();

  useEffect(() => {
    //wait for auth0 to be done loading and make sure we have our user data
    if (!isLoading && auth0User) {
      //get the auth0 sub and the JWT from auth0. this will be verified by our backend
      getUserToken(auth0User, getAccessTokenSilently).then((result) => {
        //is we get a success (we are authenticated), execute this logic
        if (result.isAuthenticated) {
          console.log("authenticated!");
          getUser().then((response: any) => {
            console.log("User:", response);
            console.log(response);
            if (response) {
              setUser(response);
              // Getting Id of an individual connected companies from user
              setUserConnectedCompanyID(response.companies);
            }
          });
        } else {
          console.log("User Connected Page: not authenticated..");
        }
      });
    }
  }, [isLoading]);

  useEffect(() => {
    getAllCompanies().then((response: any) => {
      const allCompanies = response;
      const filteredCompanies = allCompanies.filter((company: any) =>
        userConnectedCompanyID.includes(company.companyId)
      );
      setUserConnectedCompany(filteredCompanies);
    });
  }, [user]);

  console.log(userConnectedCompany);

  return (
    <>
      <Container maxWidth={'7xl'} py={'10'}>
        <SimpleGrid columns={[1, null, 3]} spacing="40px" mx={10} mt={0}>
          {userConnectedCompany.map((company, index) => (
            <Card
              key={index}
              userName={""}
              banner={company.banner}
              bio={company.bio}
              logo={company.logo}
              name={company.name}
              minimumInvestment={company.minimumInvestment}
              companyId={company.companyId}
            /> //add userName="" to fix error
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};

export default UserConnectedCompany;
