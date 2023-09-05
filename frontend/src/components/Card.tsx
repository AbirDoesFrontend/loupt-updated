import { User } from "@auth0/auth0-react";
import { Box, Image, Flex, Text, Avatar, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Card = ({
  banner,
  logo,
  name,
  bio,
  minimumInvestment,
  companyId,
}: {
  banner: any;
  logo: any;
  userName: any;
  name: any;
  bio: any;
  minimumInvestment: any;
  companyId: any;
}) => {
  return (
    <Box
      bg="white"
      rounded="md"
      boxShadow="md"
      overflow="hidden"
      sx={{
        ":hover": {
          boxShadow: "lg",
        },
      }}
    >
      <Image src={banner} alt="card image" height="200px" width={"100%"} />
      <Flex justifyContent="space-between" p="4">
        <Flex alignItems="center">
          {/* <Image
            src={logo}
            alt="company logo"
            boxSize="60px"
            rounded={100}
            mr="1"
            color={"brand.100"}
          /> */}
          <Text fontWeight="bold" fontSize={20}>
            {name}
          </Text>
        </Flex>
        <Avatar src={logo} />
      </Flex>
      <Box p="4">
        <Text>{bio.split(0, 1)}</Text>
      </Box>
      <Box p="4">
        <Link to={`/company/${companyId}`}>
          <Button bg={"brand.100"} color={"white"}>
            {`Starting From $${minimumInvestment}`}
          </Button>
        </Link>
      </Box>
    </Box>
  );
};

export default Card;
