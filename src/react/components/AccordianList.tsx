import React from 'react';
import { Stream } from '../models/Stream';

import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Input, Button, useToast, Box, Card, CardHeader, CardBody, Tag, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react";
import { AppStatus } from "../App";
import { useState } from "react";
import { EndStatus } from "../models/Epoch";

interface AccordionListProps {
  streams: Stream[];
  appStatus: AppStatus;
  setAppStatus: (appStatus: AppStatus) => void;
  type: "active" | "archived";
}

const AccordionList: React.FC<AccordionListProps> = ({ streams, appStatus, setAppStatus, type }) => {
  // Your component logic here

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [partitionName, setPartitionName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");

  const clickCreatePartition = (topic: string) => {
    onOpen();
// Save the topic in state
setSelectedTopic(topic);
}

const addPartition = () => {
    // Find the topic and insert the partition
    const topic = streams.find(stream => stream.topic === selectedTopic);
    topic.partitions.push({ name: partitionName, epochs: [] });
    setAppStatus(appStatus);
    // Close the modal
    onClose();
    setSelectedTopic("");
  };

  const archiveStream = (topic: string) => {
    // Find the stream to archive
    const streamToArchive = streams.find(stream => stream.topic === topic);
  
    // Remove the stream from curr_streams
    const updatedCurrStreams = streams.filter(stream => stream.topic !== topic);
  
    // Add the stream to archived_streams
    const updatedArchivedStreams = appStatus.archived_streams.concat(streamToArchive);
  
    const newAppStatus: AppStatus = {
        curr_streams: updatedCurrStreams,
        archived_streams: updatedArchivedStreams,
        curr_epoch: appStatus.curr_epoch
    };

    // Update the state
    setAppStatus(newAppStatus);
  };

  const restoreStream = (topic: string) => {
    // Find the stream to restore
    const streamToRestore = appStatus.archived_streams.find(stream => stream.topic === topic);
  
    // Remove the stream from archived_streams
    const updatedArchivedStreams = appStatus.archived_streams.filter(stream => stream.topic !== topic);
  
    // Add the stream back to curr_streams
    const updatedCurrStreams = appStatus.curr_streams.concat(streamToRestore);
  
    const newAppStatus: AppStatus = {
      curr_streams: updatedCurrStreams,
      archived_streams: updatedArchivedStreams,
      curr_epoch: appStatus.curr_epoch
    };
  
    // Update the state
    setAppStatus(newAppStatus);
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
    <div>
      <Accordion defaultIndex={[]} allowMultiple>
                
        {/* Render the current streams */}
        {streams.length === 0 && <Box>No active streams yet.</Box>}
        {streams.map((stream, i) => (
          <AccordionItem key={i}>
          <h3>
          <AccordionButton>
          <AccordionIcon />
          {stream.topic}
          {
            type === "active" && <Box marginLeft="auto">
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => clickCreatePartition(stream.topic)}
            >
              Add Partition
            </Button>
            <Button
              size="sm"
              colorScheme="yellow"
              marginLeft="4"
              onClick={() => archiveStream(stream.topic)}
            >
              Archive
            </Button>
          </Box>
          }
          {
            type === "archived" && <Box marginLeft="auto">
            <Button
              size="sm"
              colorScheme="green"
              onClick={() => restoreStream(stream.topic)}
            >
              Restore
            </Button>
            </Box>
          }
          </AccordionButton>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add a new partition</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Input placeholder="Partition name" value={partitionName} onChange={(e) => setPartitionName(e.target.value)} />
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={addPartition}>
                  Add
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          </h3>
<AccordionPanel>
{/* Render the partitions for each stream */}
{stream.partitions.map((partition, j) => (
<AccordionItem key={j}>
  <h3>
    <AccordionButton>
      <AccordionIcon />
      {partition.name} {/* Replace with the actual property name */}
    </AccordionButton>
  </h3>
  <AccordionPanel>
    {/* Render the epochs for each partition */}
    {partition.epochs.map((epoch) => (
      <AccordionItem key={epoch.target}>
        <Box fontSize={"15px"} p="5px" display="flex" justifyContent="space-between">
          <Box width="280px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{epoch.target}</Box>
          <Box width="180px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            {new Date(epoch.start).toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })} {" - "} 
            {epoch.end ? new Date(epoch.end).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Ongoing'}
          </Box>
          <Box width="140px" overflow="hidden" textAlign={"right"} textOverflow="ellipsis" whiteSpace="nowrap">
            <Tag variant='solid' colorScheme={getColor(EndStatus[epoch.endStatus].toLowerCase())}>
              {EndStatus[epoch.endStatus].toLowerCase()}
            </Tag>
          </Box>
        </Box>
      </AccordionItem>
    ))}
  </AccordionPanel>
</AccordionItem>
))}
</AccordionPanel>
</AccordionItem>
))}
    </Accordion>
    </div>
  );
};

export default AccordionList;
