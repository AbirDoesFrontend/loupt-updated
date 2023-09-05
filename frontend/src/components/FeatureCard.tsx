import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const FeatureCard = ({ logo, name }: { logo: any; name: any }) => {
  return (
    <>
      <Stack>
        <Flex gap={4}>
          <Image src={logo} boxSize={14} />
          <Box>
            <Text fontWeight={600} fontSize={16}>
              {name}
            </Text>
            <Link to={"/"}>
              <Button background={"transparent"} p={0} color={"brand.100"}>
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
