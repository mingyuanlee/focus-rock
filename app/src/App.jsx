import React, { useState, useEffect } from "react";
import { Box, Button, Flex, VStack } from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react';

const App = () => {
  const [started, setStarted] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [startTime, setStartTime] = useState(null);
  // const [endTime, setEndTime] = useState(null);
  const [type, setType] = useState(1);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const toast = useToast();

  const getStartTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const roundedMinutes = 10 * Math.floor(minutes / 10);
    const formattedTime = `${hours.toString().padStart(2, '0')}:${roundedMinutes.toString().padStart(2, '0')}`;
    return formattedTime;
  }

  const getEndTime = () => {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    // Round up to the next multiple of 10 for minutes
    minutes = Math.ceil(minutes / 10) * 10;

    // Adjust hours and minutes if minutes are 60
    if (minutes >= 60) {
      minutes = 0;
      hours = (hours + 1) % 24; // Adjust for 24-hour format
    }

    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    return formattedTime;
  }

  const changeType = () => {
    if (type === 1) {
      setType(2);
    } else {
      setType(1);
    }
  }

  const readData = async () => {
    try {
      const result = await new Promise((resolve, reject) => {
        window.dataApi.receiveReadData(
          (event, result, data) => {
            console.log("receiveReadData", result, data)
            if (result === 0) {
              resolve(data);
            } else {
              reject(data);
            }
          });
          window.dataApi.reqReadData();
      });

      setData(JSON.parse(result))
    } catch (error) {
        setError(error);
        // Note: can't use error directly in description, because it's an object, will throw error
        toast({
            title: 'Error',
            description: 'Something bad happend in the backend',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
    }
  }; 

  // write to json file
  const writeData = (endTime) => {
    const today = new Date();
    console.log("data:", data)
    data.push({
        date: today.toISOString().substring(0, 10),
        start_time: startTime,
        end_time: endTime,
        type: type
    });
    window.dataApi.reqWriteData(data);
  }

  const onClick = () => {
    if (!started) {
      setStarted(true);
      const startTime = getStartTime();
      console.log("start time", startTime)
      setStartTime(startTime);
      return
    }
    // end
    console.log(timeElapsed);
    const endTime = getEndTime();
    console.log("end time", endTime)
    writeData(endTime);
    setTimeElapsed(0);
    setStarted(false);
  }

  useEffect(() => {
    let interval = null;

    if (started) {
      interval = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000); // Update time every second
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [started])

  useEffect(() => {
    readData();
  }, []);

  return (
      <Flex
        height="100vh" // Full height of the viewport
        alignItems="center" // Vertically centers content in the container
        justifyContent="center" // Horizontally centers content in the container
      >
        <VStack>
          <Button width="100px" colorScheme="blue" onClick={changeType}>
            { type }
          </Button>
          <Button width="100px" colorScheme="blue" onClick={onClick}>
            { started ? `${Math.floor(timeElapsed / 60)} mins` : "Start"}
          </Button>
        </VStack>
        
      </Flex>
  )
};


export default App