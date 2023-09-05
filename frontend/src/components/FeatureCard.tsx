import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Apple from "../assets/apple.jpg";

interface FeatureProps {
  title: string;
}

const FeatureCard = ({ title }: FeatureProps) => {
  return (
    <>
      <Stack>
        <Flex gap={4}>
          <Image src={Apple} boxSize={14} />
          <Box>
            <Text fontWeight={600} fontSize={16}>
              {title}
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
