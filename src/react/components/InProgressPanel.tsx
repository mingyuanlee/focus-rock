import React, { useState, useEffect } from "react";
import { AppStatus } from "../App";
import { EndStatus, Epoch } from "../models/Epoch";
import { Box, Button, Card, Text, CardBody, CardHeader, Heading, Input, Select, HStack, useToast } from "@chakra-ui/react";

type InProgressPanelProps = {
    appStatus: AppStatus;
    setAppStatus: any;
    wrappedSetAppStatus: any;
};

const InProgressPanel: React.FC<InProgressPanelProps> = ({ appStatus, setAppStatus, wrappedSetAppStatus }) => {
    const [selectedStream, setSelectedStream] = useState<string>("");
    const [selectedPartition, setSelectedPartition] = useState<string>("");
    const [target, setTarget] = useState("");
    const [timeUsed, setTimeUsed] = useState(0);
    const [clickedEnd, setClickedEnd] = useState(false);

    const toast = useToast();
    
    useEffect(() => {
        if (appStatus.curr_epoch && appStatus.curr_epoch.start) {
            const interval = setInterval(() => {
                const start = new Date(appStatus.curr_epoch.start);
                const now = new Date();
                setTimeUsed(Math.floor((now.getTime() - start.getTime()) / 60000));
            }, 1000);
    
            return () => clearInterval(interval);
        }
    }, [appStatus.curr_epoch]);

    const handleStart = () => {
        if (selectedStream && target !== "") {
            const newStatus: AppStatus = {
                curr_streams: appStatus.curr_streams,
                archived_streams: appStatus.archived_streams,
                curr_epoch: {
                    target,
                    start: new Date().toISOString(),
                    end: null,
                    endStatus: null,
                } as Epoch,
            }
            setAppStatus(newStatus)
        }
    };

    const handleSchedule = () => {
        if (selectedStream && target !== "") {
            const newEpoch: Epoch = {
                target,
                start: null,
                end: null,
                endStatus: EndStatus.FINISHED,
            }
            const stream = appStatus.curr_streams.find((stream) => stream.topic === selectedStream);
            const partition = stream.partitions.find((partition) => partition.name === selectedPartition);
            partition.epochs.push(newEpoch);
            const newStatus: AppStatus = {
                curr_streams: appStatus.curr_streams,
                archived_streams: appStatus.archived_streams,
                curr_epoch: null,
            }
            wrappedSetAppStatus(newStatus)
            toast({
                title: "Epoch scheduled.",
                description: "A new epoch has been added to the schedule.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }
    }

    const handleEndEpoch = () => {
        setClickedEnd(true);
    };

    const handleRealFinish = (status: EndStatus) => {
        const newEpoch = {
            ...appStatus.curr_epoch,
            end: new Date().toISOString(),
            endStatus: status,
        }

        const streamName = selectedStream ? selectedStream : appStatus.selectedStream;
        const stream = appStatus.curr_streams.find((stream) => stream.topic === streamName);
        const partitionName = selectedPartition ? selectedPartition : appStatus.selectedPartition;
        if (appStatus.needToReplace) {
            const partition = stream.partitions.find((partition) => partition.name === partitionName);
            partition.epochs = partition.epochs.map((epoch) => epoch.target === newEpoch.target ? newEpoch : epoch);
            console.log("replaced:", partition)
        } else {
            stream.partitions.find((partition) => partition.name === partitionName).epochs.push(newEpoch);
        }
        
        const newStatus: AppStatus = {
            curr_streams: appStatus.curr_streams,
            archived_streams: appStatus.archived_streams,
            curr_epoch: null,
        }
        wrappedSetAppStatus(newStatus)

        setTarget("");
        setTimeUsed(0);
        setSelectedStream("");
        setClickedEnd(false);
    }

    useEffect(() => {
    }, [appStatus.curr_epoch]);

    return (
        <Card w="800px">
        <CardHeader>
            <Heading size='md'>In Progress</Heading>
        </CardHeader>
        { appStatus.curr_epoch === null &&
            <CardBody>
                <HStack spacing={3}>
                <Select
                    value={selectedStream}
                    onChange={(e) => {
                        const selectedStreamTopic = e.target.value;
                        console.log({ selectedStreamTopic })
                        setSelectedStream(selectedStreamTopic);
                    }}
                    mb="10px"
                >
                    <option value="">Select a stream</option>
                    {appStatus.curr_streams.map((stream) => (
                        <option key={stream.topic} value={stream.topic}>
                            {stream.topic}
                        </option>
                    ))}
                </Select>
                <Select
  value={selectedPartition}
  onChange={(e) => {
    const selectedPartitionName = e.target.value;
    setSelectedPartition(selectedPartitionName);
  }}
  mb="10px"
>
  <option value="">Select a partition</option>
  {
    appStatus.curr_streams.find(stream => stream.topic === selectedStream)?.partitions.map((partition, i) => (
      <option key={i} value={partition.name}>
        {partition.name}
      </option>
    ))
  }
</Select>
                </HStack>
                <Input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Enter a target"
                    mb="30px"
                />
                <Box display={"flex"} justifyContent={"center"}>
                <Button colorScheme='blue' onClick={handleStart} mb="20px">Start An Epoch</Button>
                <Button colorScheme='yellow' onClick={handleSchedule} ml="10px" mb="20px">Schedule For Later</Button>
                </Box>
                
            </CardBody>
        }
        {
            appStatus.curr_epoch !== null && 
            <CardBody w="600px">
                <Text mb="10px">Target: {appStatus.curr_epoch.target}</Text>
                <Text mb="20px">Time used: {timeUsed} minutes</Text>
                {!clickedEnd ? (
                    <Button colorScheme='blue' onClick={handleEndEpoch}>End Epoch</Button>
                ) : (
                    <>
                        <Button mr="5px" colorScheme='blue' onClick={() => handleRealFinish(EndStatus.FINISHED)}>Finish</Button>
                        <Button mr="5px" colorScheme='blue' onClick={() => handleRealFinish(EndStatus.UNFINISHED)}>Unfinish</Button>
                        <Button colorScheme='blue' onClick={() => handleRealFinish(EndStatus.INTERRUPTED)}>Interrupted</Button>
                    </>
                )}
            </CardBody>
        }
        
        </Card>
    );
};

export default InProgressPanel;

