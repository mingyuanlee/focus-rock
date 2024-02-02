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
//     const { isOpen, onOpen, onClose } = useDisclosure();
// const [partitionName, setPartitionName] = useState("");
// const [selectedTopic, setSelectedTopic] = useState("");

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



//     const clickCreatePartition = (topic: string) => {
//         onOpen();
//   // Save the topic in state
//   setSelectedTopic(topic);
//     }

//     const addPartition = () => {
//         // Find the topic and insert the partition
//         const topic = appStatus.curr_streams.find(stream => stream.topic === selectedTopic);
//         topic.partitions.push({ name: partitionName, epochs: [] });
//         setAppStatus(appStatus);
//         // Close the modal
//         onClose();
//         setSelectedTopic("");
//       };

//       const archiveStream = (topic: string) => {
//         // Find the stream to archive
//         const streamToArchive = appStatus.curr_streams.find(stream => stream.topic === topic);
      
//         // Remove the stream from curr_streams
//         const updatedCurrStreams = appStatus.curr_streams.filter(stream => stream.topic !== topic);
      
//         // Add the stream to archived_streams
//         const updatedArchivedStreams = appStatus.archived_streams.concat(streamToArchive);
      
//         const newAppStatus: AppStatus = {
//             curr_streams: updatedCurrStreams,
//             archived_streams: updatedArchivedStreams,
//             curr_epoch: appStatus.curr_epoch
//         };

//         // Update the state
//         setAppStatus(newAppStatus);
//       };

    return (
        <Card w="800px" mt="20px">
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
            <Heading size="sm" mb="18px">Active Streams</Heading>
            <AccordianList streams={appStatus.curr_streams} appStatus={appStatus} setAppStatus={setAppStatus} type="active" />

            <Heading size="sm" my="18px">Archived Streams</Heading>
            <AccordianList streams={appStatus.archived_streams} appStatus={appStatus} setAppStatus={setAppStatus} type="archived" />
        </CardBody>
        </Card>
    );
};

export default StreamPanel;
