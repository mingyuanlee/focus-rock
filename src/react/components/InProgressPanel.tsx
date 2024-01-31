import React, { useState, useEffect } from "react";
import { AppStatus } from "../App";
import { EndStatus, Epoch } from "../models/Epoch";
import { Box, Button, Card, Text, CardBody, CardHeader, Heading, Input, Select } from "@chakra-ui/react";

type InProgressPanelProps = {
    appStatus: AppStatus;
    setAppStatus: any;
};

const InProgressPanel: React.FC<InProgressPanelProps> = ({ appStatus, setAppStatus }) => {
    const [selectedStream, setSelectedStream] = useState<string>("");
    const [target, setTarget] = useState("");
    const [timeUsed, setTimeUsed] = useState(0);
    const [epochStatus, setEpochStatus] = useState<EndStatus | null>(null);
    const [clickedEnd, setClickedEnd] = useState(false);
    const [started, setStarted] = useState(false);
    
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
        console.log("handleStart", selectedStream, target)
        if (selectedStream && target !== "") {
            setAppStatus((prevAppStatus: AppStatus) => ({
                ...prevAppStatus,
                curr_epoch: {
                    target,
                    start: new Date().toISOString(),
                    end: null,
                    endStatus: null,
                } as Epoch
            }))
            setStarted(true);
        }
    };

    const handleEndEpoch = () => {
        setClickedEnd(true);
    };

    const handleRealFinish = (status: EndStatus) => {
        const newEpoch = {
            ...appStatus.curr_epoch,
            end: new Date().toISOString(),
            endStatus: status,
        }
        const stream = appStatus.curr_streams.find((stream) => stream.topic === selectedStream);
        stream.epochs.push(newEpoch);
        
        setAppStatus((prevAppStatus: AppStatus) => ({
            ...prevAppStatus,
            curr_epoch: null,
        } as AppStatus))

        setEpochStatus(null);
        setTarget("");
        setTimeUsed(0);
        setSelectedStream("");
    }

    console.log({ appStatus, epochStatus })

    useEffect(() => {
    }, [appStatus.curr_epoch]);

    return (
        <Card w="800px" h="270px">
        <CardHeader>
            <Heading size='md'>In Progress</Heading>
        </CardHeader>
        { appStatus.curr_epoch === null &&
            <CardBody>
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
                <Input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="Enter a target"
                    mb="30px"
                />
                <Box display={"flex"} justifyContent={"center"}>
                <Button colorScheme='blue' onClick={handleStart}>Start An Epoch</Button>
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
