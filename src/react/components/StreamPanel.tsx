import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Input, Button, useToast, Box, Card, CardHeader, CardBody, Tag } from "@chakra-ui/react";
import { AppStatus } from "../App";
import { useState } from "react";
import { Stream } from "../models/Stream";
import { EndStatus } from "../models/Epoch";


interface StreamPanelProps {
    appStatus: AppStatus;
    setAppStatus: (appStatus: AppStatus) => void;
}

const StreamPanel: React.FC<StreamPanelProps> = ({ 
    appStatus,
    setAppStatus
}) => {

    const [showCreate, setShowCreate] = useState(false);
    const [newTopic, setNewTopic] = useState("");
    const toast = useToast();

    const handleCreateStream = () => {
        if (newTopic.trim() === "") {
            toast({
                title: "Error.",
                description: "Topic can't be empty.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const newStream: Stream = { 
            topic: newTopic,
            epochs: [],
            archived: false
        };
        const newAppStatus: AppStatus = {
            ...appStatus
        };
        newAppStatus.curr_streams.push(newStream);
        setAppStatus(newAppStatus);
        setShowCreate(false);
        setNewTopic("");
    };

    const getColor = (status: string) => {
        switch (status) {
            case 'finished':
                return 'green';
            case 'unfinished':
                return 'yellow';
            case 'interrupted':
                return 'red';
            default:
                return 'gray';
        }
    }

    return (
        <Card w="600px">
        <CardHeader>
            <Heading size='md'>Streams</Heading>
        </CardHeader>
        <CardBody>
            <Box mb="30px">
            {showCreate ? (
                <div>
                    <Input
                        type="text"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Enter a topic"
                        mb="15px"
                    />
                    <Button width="120px" colorScheme={"blue"} onClick={handleCreateStream}>Create</Button>
                </div>
            ) : (
                <Button colorScheme={"blue"} onClick={() => setShowCreate(true)}>Create a Stream</Button>
            )}
            </Box>
            <Accordion defaultIndex={[0]} allowMultiple>
                <AccordionItem>
                    <h2>
                        <AccordionButton>
                            <AccordionIcon />
                            Current Streams
                        </AccordionButton>
                    </h2>
                    <AccordionPanel>
                        {/* Render the current streams */}
                        {appStatus.curr_streams.length === 0 && <Box>No streams yet.</Box>}
                        {appStatus.curr_streams.map((stream, i) => (
                            <AccordionItem key={i}>
                                <h3>
                                    <AccordionButton>
                                        <AccordionIcon />
                                        {stream.topic}
                                    </AccordionButton>
                                </h3>
                                <AccordionPanel>
                                    {/* Render the epochs for each stream */}
                                    {stream.epochs.map((epoch) => (
                                        <AccordionItem key={epoch.target}>
                                        <Box fontSize={"15px"} p="5px" display="flex" justifyContent="space-between">
    <Box width="200px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{epoch.target}</Box>
    <Box width="200px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
        {new Date(epoch.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {" - "} 
        {epoch.end ? new Date(epoch.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Ongoing'}
    </Box>
    <Box width="200px" overflow="hidden" textAlign={"right"} textOverflow="ellipsis" whiteSpace="nowrap">
        <Tag variant='solid' colorScheme={getColor(EndStatus[epoch.endStatus].toLowerCase())}>
        {EndStatus[epoch.endStatus].toLowerCase()}
    </Tag></Box>
</Box>
                                        </AccordionItem>
                                    ))}
                                </AccordionPanel>
                            </AccordionItem>
                        ))}
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </CardBody>
        </Card>
    );
};

export default StreamPanel;
