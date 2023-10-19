import { Box, Flex, Image, Stack, Text, useTheme } from "@chakra-ui/react";
import styles from "./styles/ProfileStyles";

const AnalyticsPage = () => {
  const theme = useTheme();
  const mainPurple = theme.colors.mainPurple ?? "#8764FF";

  return (
    <>
      <Stack borderBottom={"solid"} borderColor={mainPurple}>
        <Box>
          <Text as={"h2"} py={10} color={"brand.100"} fontSize={35}>
            My Analytics
          </Text>
        </Box>
      </Stack>

      {/* Company */}
      <Stack maxW={"8xl"} mx={"auto"}>
        <Box sx={styles.aboutBio} my={20}>
          <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            flexDirection={{ base: "column", sm: "column", md: "row" }}
            gap={10}
          >
            {/* Company Info */}
            <Box
              display={"flex"}
              alignItems={"center"}
              gap={7}
              flexDirection={{ base: "column", sm: "column", md: "row" }}
            >
              <Image
                src={
                  "data:image/png;base64,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"
                }
                border={"solid"}
                borderColor={mainPurple}
                borderRadius={50}
                boxSize={95}
              />
              <Box textAlign={{ base : 'center' , md : 'start' }}>
                <Text as={"p"} fontSize={20}>
                  Your Company
                </Text>
                <Text
                  as="h2"
                  fontSize={{ base: "30", md: "40" }}
                  fontWeight="semibold"
                >
                  CodemanBD
                </Text>
              </Box>
            </Box>

            {/* Found Round Detail */}
            <Box textAlign={{ base : 'center' , sm : 'center' , md : 'end' }}>
              <Text fontSize={17}>Active Funding Round</Text>
              <Text fontSize={35} color={mainPurple}>
                28 Days Left
              </Text>
            </Box>
          </Flex>
        </Box>
      </Stack>
    </>
  );
};

export default AnalyticsPage;
