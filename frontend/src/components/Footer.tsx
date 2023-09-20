import {
  Box,
  Stack,
  Text,
  Container,
  useColorModeValue,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FooterContainer } from "./styles/FooterStyles";

const Footer = () => {
  return (
    <Box bg={"brand.100"} color={"white"}>
      <Container sx={FooterContainer}>
        <Flex justifyContent={"space-between"}>
          <Text>© 2023 Loupt. All rights reserved</Text>
          <Stack direction={"row"} spacing={6}>
            <Link to="/">
              <Text>Invest</Text>
            </Link>
            <Link to="/about">
              <Text>About</Text>
            </Link>
            <Link to="/raise-capital">
              <Text>Raise Capital</Text>
            </Link>
          </Stack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
