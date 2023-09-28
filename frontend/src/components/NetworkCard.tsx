import {
  Box,
  Text,
  Image,
  HStack,
  Button,
  Spacer,
  Center,
  VStack,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { User, addConnection, getSuggestedUsers } from "../api";
import { Link, useNavigate } from "react-router-dom";

const NetworkCard = () => {
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // if (isAuthenticated) return;
    getSuggestedUsers().then((response) => {
      if (response) {
        setSuggestedUsers(response);
      }
    });
  }, []);

  const addConnectionButton = (id: any) => {
    addConnection(id).then((response) => {
      if (response) {
        console.log("Connection Added", id);
        navigate(0);
        localStorage.setItem(id, id);
      }
    });
  };

  return (
    <>
      <Flex
        wrap={["wrap", "wrap", "nowrap"]}
        justifyContent={"center"}
        gap={["10px", "10px", "4px"]}
      >
        {/* FOR PROFILE PAGE*/}
        {suggestedUsers.length !== 0 ? (
          suggestedUsers.slice(0, 5).map((suggestedUser, index) => (
            <Box
              key={index} // Don't forget to include a key when mapping in React
              padding={"20px 20px"}
              // margin={"0px"}
              marginRight={"20px"}
              borderRadius={"10px"}
              boxShadow={"0px 4px 15px 0px rgba(0, 0, 0, 0.07)"}
              position="relative"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="#ffff"
                color="brand.100"
                style={{
                  position: "absolute",
                  top: "3px",
                  right: "3px",
                }}
              >
                <path
                  d="M9.72266 17.8458L17.8466 9.72412M9.72266 9.72412L17.8466 17.8458"
                  stroke="purple"
                  strokeWidth="1.72312"
                  strokeLinecap="round"
                />
              </svg>

              <Center h="full">
                <VStack>
                  <Link to={`/user-profile/${suggestedUser.userId}`}>
                    <Image
                      src={suggestedUser.profilePic}
                      boxSize="60px"
                      borderRadius="63px"
                      border="1px solid var(--main-purple, #9583F4)"
                      bg="lightgray"
                      objectFit="cover"
                      boxShadow="0px 4px 15px 0px rgba(0, 0, 0, 0.07)"
                    />
                  </Link>
                  <Text fontSize={"14px"}>
                    {suggestedUser.legalName.slice(0, 9)}..
                  </Text>
                  <Button
                    h={"24px"}
                    w={"100%"}
                    color={"white"}
                    bg={"brand.100"}
                    onClick={() => {
                      addConnectionButton(suggestedUser.userId);
                    }}
                  >
                    Follow
                  </Button>
                </VStack>
              </Center>
            </Box>
          ))
        ) : (
          <Box>
            <Text
              fontSize={20}
              color={"gray.500"}
              bg={"gray.100"}
              p={5}
              borderRadius={6}
            >
              No suggestions found..{" "}
            </Text>
          </Box>
        )}
      </Flex>
    </>
  );
};

export default NetworkCard;
