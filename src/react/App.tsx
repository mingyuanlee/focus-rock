import React, { useState, useEffect } from "react";
import { Box, Button, Flex, HStack, VStack, Heading, Editable } from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react';
import { Stream } from "./models/Stream";
import { Epoch } from "./models/Epoch";
import { Store } from "./persistence/Store";
import InProgressPanel from "./components/InProgressPanel";
import StreamPanel from "./components/StreamPanel";

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
    writeAppStatus();
  }

  const writeAppStatus = async () => {
    const store: Store = {
      curr_streams: appStatus.curr_streams,
      archived_streams: appStatus.archived_streams,
    };
    window.dataApi.reqWriteData(store);
  }

  const reset = () => {
    wrappedSetStatus(
      {
        curr_streams: [],
        archived_streams: [],
        curr_epoch: null,
      }
    )
  }


  useEffect(() => {
    fetchAppStatus();
  }, []);
  
  return (
      <Flex
        // height="100vh" // Full height of the viewport
        alignItems="center" // Vertically centers content in the container
        justifyContent="center" // Horizontally centers content in the container
        className="App"
      >
        <VStack >
          <button onClick={reset}>rest</button>
          <InProgressPanel appStatus={appStatus} setAppStatus={wrappedSetStatus}/>
          <StreamPanel appStatus={appStatus} setAppStatus={wrappedSetStatus} />
        </VStack>
      </Flex>
  )
};


export default App