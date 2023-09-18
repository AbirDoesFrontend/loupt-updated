import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const FeatureCard = ({
  logo,
  name,
  _id,
}: {
  logo: any;
  name: any;
  _id: any;
}) => {
  console.log(_id);
  return (
    <>
      <Stack>
        <Flex gap={4}>
          <Image src={logo} boxSize={14} borderRadius={8} />
          <Box>
            <Text fontWeight={600} fontSize={16}>
              {name}
            </Text>
            <Link to={`/company/${_id}`}>
              <Button
                background={"transparent"}
                p={0}
                color={"brand.100"}
                _hover={{
                  background: "transparent",
                  textDecoration: "underline",
                }}
              >
                View
                <ArrowForwardIcon color={"brand.100"} ml={2} />
              </Button>
            </Link>
          </Box>
        </Flex>
      </Stack>
    </>
  );
};

export default FeatureCard;
