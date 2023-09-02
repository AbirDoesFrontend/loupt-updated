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
      <Image src={banner} alt="card image" height="300px" width={"100%"} />
      <Flex justifyContent="space-between" p="4">
        <Flex alignItems="center">
          <Image
            src={logo}
            alt="company logo"
            boxSize="70px"
            mr="1"
            color={"brand.100"}
          />
          <Text fontWeight="bold">{name}</Text>
        </Flex>
        <Avatar src={name} />
      </Flex>
      <Box p="4">
        <Text>{bio}</Text>
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
