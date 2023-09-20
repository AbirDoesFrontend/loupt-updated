import React, { useState } from "react";
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Link as ChakraLink,
  Button,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";

interface SearchResult {
  title: string;
  type: string;
  url: string;
}

function ResultsPage() {
  const location = useLocation();
  const results = location.state?.data || [];
  const [filter, setFilter] = useState("All");

  const filteredResults =
    filter === "All"
      ? results
      : results.filter((result: { type: string }) => result.type === filter);

  return (
    <Box p={4}>
      <Box mb={4}>
        <Button onClick={() => setFilter("All")}>All</Button>
        <Button ml={2} onClick={() => setFilter("Company")}>
          Company
        </Button>
        <Button ml={2} onClick={() => setFilter("User")}>
          User
        </Button>
      </Box>

      {filteredResults.map((result: SearchResult, index: number) => (
        <Card key={index} mb={4} p={4} shadow="sm">
          <CardBody>
            <Heading size="md" mb={2}>
              {result.title}
            </Heading>
            <Text>Type: {result.type}</Text>
            <ChakraLink href={result.url} isExternal>
              Go to URL
            </ChakraLink>
          </CardBody>
        </Card>
      ))}
    </Box>
  );
}

export default ResultsPage;
