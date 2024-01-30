import React, { useState, useEffect } from "react";
import { Box, Button, Flex, HStack, VStack, Heading, Editable } from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react';

const App = () => {
  
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