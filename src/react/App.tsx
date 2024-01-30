import React, { useState, useEffect } from "react";
import { Box, Button, Flex, HStack, VStack, Heading, Editable } from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react';
import { Stream } from "./models/Stream";
import { Epoch } from "./models/Epoch";

interface AppStatus {
  curr_streams: Stream[];
  archived_streams: Stream[];
  curr_epoch: Epoch | null;
}

const App = () => {
  const [AppStatus, setAppStatus] = useState<AppStatus>({
    curr_streams: [],
    archived_streams: [],
    curr_epoch: null,
  });

  const toast = useToast();

  const fetchAppStatus = async () => {
    const response = await fetch("/api/status");
    const data = await response.json();
    setAppStatus(data);
  };

  useEffect(() => {
    // 1. fetch stored data from backend
    // 2. update app status
  }, []);
  
  return (
      <Flex
        // height="100vh" // Full height of the viewport
        alignItems="center" // Vertically centers content in the container
        justifyContent="center" // Horizontally centers content in the container
      >
        <VStack>
        <Heading as="h3" size="l" textAlign={"left"}>
          In Progress
        </Heading>
        <HStack py="50px">
          
        </HStack>
        <Heading as="h3" size="l" textAlign={"left"}>
          Streams
        </Heading>
        <Box>
          
        </Box>
        </VStack>
      </Flex>
  )
};


export default App