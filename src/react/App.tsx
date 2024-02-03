import React, { useState, useEffect } from "react";
import { Box, Button, Flex, HStack, VStack, Heading, Editable, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react';
import { Stream } from "./models/Stream";
import { Epoch } from "./models/Epoch";
import { Store } from "./persistence/Store";
import InProgressPanel from "./components/InProgressPanel";
import StreamPanel from "./components/StreamPanel";
import { read, write } from "original-fs";
import { ChevronDownIcon } from "@chakra-ui/icons";
import SummaryPanel from "./components/SummaryPanel";

export interface AppStatus {
  curr_streams: Stream[];
  archived_streams: Stream[];
  curr_epoch: Epoch | null;
}

declare global {
  interface Window {
    dataApi: any;
  }
}

const App = () => {
  const [appStatus, setAppStatus] = useState<AppStatus>({
    curr_streams: [],
    archived_streams: [],
    curr_epoch: null,
  });
  const [error, setError] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState('Summary');

  const toast = useToast();

  const fetchAppStatus = async () => {
    try {
      const result: string = await new Promise((resolve, reject) => {
        window.dataApi.receiveReadData(
          (event: any, result: any, data: any) => {
            console.log("receiveReadData", result, data)
            if (result === 0) {
              resolve(data);
            } else {
              reject(data);
            }
          });
          window.dataApi.reqReadData();
      });
      const data: Store = JSON.parse(result);
      setAppStatus(
        {
          curr_streams: data.curr_streams || [],
          archived_streams: data.archived_streams || [],
          curr_epoch: null,
        }
      );
    } catch (error) {
        setError(error);
        // Note: can't use error directly in description, because it's an object, will throw error
        toast({title: 'Error',description: 'Something bad happend in the backend',status: 'error',duration: 5000,isClosable: true});
    }
  };

  const wrappedSetStatus = (status: AppStatus) => {
    setAppStatus(status);
    writeAppStatus(status.curr_streams, status.archived_streams);
  }

  const writeAppStatus = async (curr_streams: Stream[], archived_streams: Stream[]) => {
    const store: Store = {
      curr_streams: curr_streams,
      archived_streams: archived_streams,
    };
    console.log("writing:", curr_streams, archived_streams, store)
    window.dataApi.reqWriteData(store);
  }

  const reset = () => {
    setAppStatus({
      curr_streams: [],
      archived_streams: [],
      curr_epoch: null,
    });
    writeAppStatus([], []);
  }


  useEffect(() => {
    fetchAppStatus();
  }, []);
  
  return (
      <Flex
        // height="100vh" // Full height of the viewport
        justifyContent="center" // Horizontally centers content in the container
        className="App"
      >
        
        <VStack py="30px" px="10px">
          <Box width={"800px"} pb="20px">
          <HStack spacing={5} justifyContent="space-between">
      <Menu>
        <MenuButton w="220px" as={Button} rightIcon={<ChevronDownIcon />}>
          {selectedPanel}
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => setSelectedPanel('Streams')}>Streams</MenuItem>
          <MenuItem onClick={() => setSelectedPanel('Summary')}>Summary</MenuItem>
          {/* Add more MenuItem as needed */}
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton w="200px" as={Button} rightIcon={<ChevronDownIcon />}>
          Language
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => {}}>English</MenuItem>
          {/* Add more MenuItem as needed */}
        </MenuList>
        
      </Menu>

      <Menu>
        <MenuButton w="200px" as={Button} rightIcon={<ChevronDownIcon />}>
          Mode
        </MenuButton>
        <MenuList>
          <MenuItem onClick={() => {}}>Light</MenuItem>
          {/* Add more MenuItem as needed */}
        </MenuList>
      </Menu>
      </HStack>
          </Box>
          
          {/* <button onClick={reset}>rest</button> */}
          {
            selectedPanel === "Streams" && 
            <Box>
              <InProgressPanel appStatus={appStatus} setAppStatus={setAppStatus} wrappedSetAppStatus={wrappedSetStatus}/>
          <StreamPanel appStatus={appStatus} setAppStatus={wrappedSetStatus} />
            </Box>
          }
          {
            selectedPanel === "Summary" &&
            <SummaryPanel appStatus={appStatus} />
          }
          
        </VStack>
      </Flex>
  )
};


export default App