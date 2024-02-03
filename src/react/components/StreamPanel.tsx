import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Input, Button, useToast, Box, Card, CardHeader, CardBody, Tag, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react";
import { AppStatus } from "../App";
import { useState } from "react";
import { Stream } from "../models/Stream";
import { EndStatus } from "../models/Epoch";
import AccordianList from "./AccordianList";


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
            partitions: [],
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

    return (
        <Card w="800px" mt="20px">
        <CardHeader>
            <Heading size='md'>Streams</Heading>
        </CardHeader>
        <CardBody>
            <Box mb="30px">
            {showCreate ? (
                <div>
                    <form onSubmit={(e) => { e.preventDefault(); handleCreateStream(); }}>
                    <Input
                        type="text"
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="Enter a topic"
                        mb="15px"
                    />
                    <Button width="120px" size="sm" colorScheme={"blue"} type="submit">Create</Button>
                    <Button width="120px" size="sm"  colorScheme={"yellow"} marginLeft="4" onClick={() => { setShowCreate(false); setNewTopic("") }}>Cancel</Button>
                    </form>
                </div>
            ) : (
                <Button colorScheme={"blue"} onClick={() => setShowCreate(true)}>Create a Stream</Button>
            )}
            </Box>
            <Heading size="sm" mb="18px">Active Streams</Heading>
            <AccordianList streams={appStatus.curr_streams} appStatus={appStatus} setAppStatus={setAppStatus} type="active" />

            <Heading size="sm" my="18px">Archived Streams</Heading>
            <AccordianList streams={appStatus.archived_streams} appStatus={appStatus} setAppStatus={setAppStatus} type="archived" />
        </CardBody>
        </Card>
    );
};

export default StreamPanel;
