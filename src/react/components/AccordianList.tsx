import React, { useEffect } from 'react';
import { Stream } from '../models/Stream';
import { DeleteIcon, EditIcon, AddIcon, PlusSquareIcon, ArrowForwardIcon, RepeatIcon } from "@chakra-ui/icons";
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Input, Button, useToast, Box, Card, CardHeader, CardBody, Tag, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Tooltip, FormControl, FormLabel, Select, Flex } from "@chakra-ui/react";
import { AppStatus } from "../App";
import { useState } from "react";
import { EndStatus, Epoch } from "../models/Epoch";
import { isototime, makeISOString } from '../utils/time';

interface AccordionListProps {
  streams: Stream[];
  appStatus: AppStatus;
  setAppStatus: (appStatus: AppStatus) => void;
  wrappedSetAppStatus: (appStatus: AppStatus) => void;
  type: "active" | "archived";
}

const AccordionList: React.FC<AccordionListProps> = ({ streams, appStatus, setAppStatus, wrappedSetAppStatus, type }) => {
  // Your component logic here

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [partitionName, setPartitionName] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [newEpoch, setNewEpoch] = useState<Epoch>({ target: null, start: '', end: '', endStatus: EndStatus.FINISHED });
  const [existingEpoch, setExistingEpoch] = useState<Epoch>({ target: null, start: '', end: '', endStatus: EndStatus.FINISHED });
  const { isOpen: isEpochModalOpen, onOpen: onEpochModalOpen, onClose: onEpochModalClose } = useDisclosure();
  const { isOpen: isExistingEpochModalOpen, onOpen: onExistingEpochModalOpen, onClose: onExistingEpochModalClose } = useDisclosure();

  const [selectedDate, setSelectedDate] = useState<string>("");

  const [addBtnPartition, setAddBtnPartition] = useState<string>("");
  const [addBtnStream, setAddBtnStream] = useState<string>("");

  const [editBtnPartition, setEditBtnPartition] = useState<string>("");
  const [editBtnStream, setEditBtnStream] = useState<string>("");
  const [editBtnEpochBeforeChange, setEditBtnEpochBeforeChange] = useState<Epoch>(null);

  const toast = useToast();

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
        curr_epoch: appStatus.curr_epoch,
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
            case 'todo':
                  return 'green';
            case 'unfinished':
                return 'yellow';
            case 'interrupted':
                return 'red';
            default:
                return 'gray';
        }
    }

    const removeEpoch = (streamTopic: string, partitionName: string, epochTarget: string, start: string, end: string) => {
      const streamIndex = streams.findIndex(stream => stream.topic === streamTopic);
      const partitionIndex = streams[streamIndex].partitions.findIndex(partition => partition.name === partitionName);
      const updatedEpochs = streams[streamIndex].partitions[partitionIndex].epochs.filter(epoch => (epoch.target !== epochTarget || epoch.start !== start || epoch.end !== end));
      streams[streamIndex].partitions[partitionIndex].epochs = updatedEpochs;
      const newStatus = {
        curr_streams: type === "active" ? streams : appStatus.curr_streams,
        archived_streams: type === "archived" ? streams : appStatus.archived_streams,
        curr_epoch: appStatus.curr_epoch
      }
      setAppStatus(newStatus);
    };

    const startEpoch = (streamTopic: string, partitionName: string, epochTarget: string) => {
      const newAppStatus: AppStatus = {
        curr_streams: appStatus.curr_streams,
        archived_streams: appStatus.archived_streams,
        curr_epoch: {
          target: epochTarget,
          start: new Date().toISOString(),
          end: null,
          endStatus: null,
        } as Epoch,
        selectedStream: streamTopic,
        selectedPartition: partitionName,
        needToReplace: true
      }
      setAppStatus(newAppStatus)

      toast({
        title: "Epoch started.",
        description: `Epoch has started for stream ${streamTopic} and partition ${partitionName}.`,
        status: "success",
        duration: 9000,
        isClosable: true,
    });
    }

    const resumeEpoch = (streamTopic: string, partitionName: string, epochTarget: string) => {
      const newAppStatus: AppStatus = {
        curr_streams: appStatus.curr_streams,
        archived_streams: appStatus.archived_streams,
        curr_epoch: {
          target: epochTarget,
          start: new Date().toISOString(),
          end: null,
          endStatus: null,
        } as Epoch,
        selectedStream: streamTopic,
        selectedPartition: partitionName
      }
      setAppStatus(newAppStatus)

      toast({
        title: "Epoch started.",
        description: `Epoch has started for stream ${streamTopic} and partition ${partitionName}.`,
        status: "success",
        duration: 9000,
        isClosable: true,
    });
    }

  const handleAddEpoch = () => {
    const streamTopic = addBtnStream;
    const partitionName = addBtnPartition;


    const stream = appStatus.curr_streams.find((stream) => stream.topic === streamTopic);
    // Find the correct partition
    const partition = stream.partitions.find((partition) => partition.name === partitionName);

    // TODO: add checks: start time <= end time, target not empty, date not empty, all the fields not empty
    
    // Add the new epoch to the partition's epochs array
    const epochToAdd: Epoch = {
      target: newEpoch.target,
      start: makeISOString(selectedDate, newEpoch.start),
      end: makeISOString(selectedDate, newEpoch.end),
      endStatus: newEpoch.endStatus
    }
    partition.epochs.push(epochToAdd);


    
    console.log("updating appstatus:", partition)


    // Update the application status
    const newAppStatus: AppStatus = {
      curr_streams: appStatus.curr_streams,
      archived_streams: appStatus.archived_streams,
      curr_epoch: appStatus.curr_epoch
    }
    wrappedSetAppStatus(newAppStatus);

    setNewEpoch({ target: "", start: '', end: '', endStatus: EndStatus.FINISHED });
    setSelectedDate("");

    onEpochModalClose();
  }


  const saveEpochChanges = () => {
    const stream = streams.find((stream) => stream.topic === editBtnStream);
    const partition = stream.partitions.find((partition) => partition.name === editBtnPartition);
    const epochToAdd: Epoch = {
      target: existingEpoch.target,
      start: makeISOString(selectedDate, existingEpoch.start),
      end: makeISOString(selectedDate, existingEpoch.end),
      endStatus: existingEpoch.endStatus
    }
    partition.epochs = partition.epochs.map((epoch) => (epoch.target === editBtnEpochBeforeChange.target && epoch.start === editBtnEpochBeforeChange.start && epoch.end === editBtnEpochBeforeChange.end) ? epochToAdd : epoch);
    const newStatus = {
      curr_streams: type === "active" ? streams : appStatus.curr_streams,
      archived_streams: type === "archived" ? streams : appStatus.archived_streams,
      curr_epoch: appStatus.curr_epoch
    }
    setAppStatus(newStatus);
    onExistingEpochModalClose();
  }


  useEffect(() => {
    for (const stream of streams) {
      for (const partition of stream.partitions) {
        partition.epochs.sort((a, b) => {
          if (a.start === null) return -1;
          if (a.start < b.start) {
            return -1;
          }
          if (a.start > b.start) {
            return 1;
          }
          return 0;
        })
      }
    }
  }, []);

  return (
    <div>
      <Accordion defaultIndex={[]} allowMultiple>
                
        {/* Render the current streams */}
        {streams.length === 0 && <Box>No {type} streams yet.</Box>}
        {streams.map((stream, i) => (
          <AccordionItem key={i}>
          <h3>
          <Flex justifyContent="space-between" alignItems="center">
          <AccordionButton>
          Stream: {stream.topic}
          </AccordionButton>
          
          {
            type === "active" && <Flex direction="row" justifyContent="flex-end">
            <Tooltip label="Add Partition" aria-label="A tooltip">
    <Button
        size="sm"
        colorScheme="blue"
        width="60px"
        onClick={() => clickCreatePartition(stream.topic)}
    >
        <AddIcon />
    </Button>
</Tooltip>
<Tooltip label="Archive" aria-label="A tooltip">
    <Button
        size="sm"
        colorScheme="yellow"
        marginLeft="2"
        width="60px"
        onClick={() => archiveStream(stream.topic)}
    >
        <PlusSquareIcon />
    </Button>
</Tooltip>
          </Flex>
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
          
            </Flex>
          
          
          </h3>
<AccordionPanel paddingEnd={0}>
{/* Render the partitions for each stream */}
{stream.partitions.map((partition, j) => (
<AccordionItem key={j}>
  <h3>
  <Flex justifyContent="space-between" alignItems="center">
    <AccordionButton>
      {/* <AccordionIcon /> */}
      Partiton: {partition.name} {/* Replace with the actual property name */}
    </AccordionButton>

    <Tooltip label="Add Epoch" aria-label="A tooltip">
      <Button size="sm" colorScheme="blue" onClick={() => {
        onEpochModalOpen();
        setAddBtnPartition(partition.name);
        setAddBtnStream(stream.topic);
      }} width="60px">
        <AddIcon />
      </Button>
    </Tooltip>
  </Flex>
  </h3>
  <AccordionPanel paddingEnd={0}>
    {/* Render the epochs for each partition */}
    {partition.epochs.map((epoch, i) => (
      <AccordionItem key={i}>
        <Box fontSize={"15px"} p="5px" display="flex" justifyContent="space-between" alignItems="center">
          <Box width="270px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{epoch.target}</Box>
          <Box width="170px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
            { epoch.start && <span>
            {new Date(epoch.start).toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false })} {" - "} 
            {epoch.end ? new Date(epoch.end).toLocaleString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : 'Ongoing'}</span> }
            { !epoch.start && "scheduled"}
          </Box>
          <Box width="220px" display={"flex"} justifyContent={"right"} overflow="hidden" textAlign={"right"} alignItems="center" textOverflow="ellipsis" whiteSpace="nowrap">
            <Tag variant='solid' colorScheme={getColor(EndStatus[epoch.endStatus].toLowerCase())}>
              {EndStatus[epoch.endStatus].toLowerCase()}
            </Tag>
          {
            (epoch.endStatus === EndStatus.UNFINISHED || epoch.endStatus === EndStatus.INTERRUPTED) &&
<Tooltip label="Resume" aria-label="A tooltip">
        <Button size="sm" colorScheme="blue" marginLeft="2" onClick={() => resumeEpoch(stream.topic, partition.name, epoch.target)}>
            <RepeatIcon />
        </Button>
    </Tooltip>
          }
            
    {
      epoch.endStatus === EndStatus.TODO &&
      <Tooltip label="Start" aria-label="A tooltip">
              <Button size="sm" colorScheme="blue" marginLeft="2" onClick={() => startEpoch(stream.topic, partition.name, epoch.target)}>
                  <ArrowForwardIcon />
              </Button>
          </Tooltip>
    }
            <Tooltip label="Edit" aria-label="A tooltip">
            <Button size="sm" colorScheme="blue" marginLeft="2" onClick={() => {
              setExistingEpoch({
                target: epoch.target,
                start: isototime(epoch.start),
                end: isototime(epoch.end),
                endStatus: epoch.endStatus
              })
              setSelectedDate(new Date(epoch.start).toISOString().split('T')[0]);
              setEditBtnPartition(partition.name);
        setEditBtnStream(stream.topic);
        setEditBtnEpochBeforeChange({...epoch})
              onExistingEpochModalOpen()
            }}><EditIcon /></Button>
              </Tooltip>
            <Tooltip label="Remove" aria-label="A tooltip">
            <Button size="sm" colorScheme="red" marginLeft="2" onClick={() => removeEpoch(stream.topic, partition.name, epoch.target, epoch.start, epoch.end)}><DeleteIcon /></Button>
              </Tooltip>
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
    <Modal isOpen={isEpochModalOpen} onClose={onEpochModalClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Add Epoch</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl>
                    <FormLabel>Epoch Target</FormLabel>
                    <Input value={newEpoch.target} onChange={(e) => setNewEpoch({ ...newEpoch, target: e.target.value })} />
                </FormControl>
                <FormControl>
                    <FormLabel>Date</FormLabel>
                    <Input type="date" value={selectedDate} onChange={(e) => { console.log(e.target.value);
                      setSelectedDate(e.target.value)}}
                       />
                </FormControl>
                <FormControl>
                    <FormLabel>Start Time</FormLabel>
                    <Input type="time" value={newEpoch.start} onChange={(e) => {
                      console.log(e.target.value)
                      setNewEpoch({ ...newEpoch, start: e.target.value })}
                     } />
                </FormControl>
                <FormControl>
                    <FormLabel>End Time</FormLabel>
                    <Input type="time" value={newEpoch.end} onChange={(e) => setNewEpoch({ ...newEpoch, end: e.target.value })} />
                </FormControl>
                <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select value={EndStatus[newEpoch.endStatus]} onChange={(e) => {
                      console.log("end status:", e.target.value)
                      setNewEpoch({ ...newEpoch, endStatus: EndStatus[e.target.value as keyof typeof EndStatus] })
                    }}>
        {Object.values(EndStatus)
            .filter((status) => isNaN(Number(status))) // Filter out numeric values
            .filter((status) => status !== EndStatus[EndStatus.TODO]) // Filter out the "todo" status
            .map((status, index) => (
                <option key={index} value={status}>{status}</option>
            ))}
    </Select>
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={() => handleAddEpoch()}>
                    Add
                </Button>
                <Button variant="ghost" onClick={onEpochModalClose}>Cancel</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
    <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add a new partition</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
              <form onSubmit={(e) => { e.preventDefault(); addPartition(); }}>
                <Input placeholder="Partition name" value={partitionName} onChange={(e) => setPartitionName(e.target.value)} />
                <ModalFooter>
                <Button colorScheme="blue" mr={3} type="submit">
                  Add
                </Button>
                <Button variant="ghost" onClick={onClose}>Cancel</Button>
              </ModalFooter>
              </form>
              </ModalBody>

              
              
            </ModalContent>
    </Modal>
    <Modal isOpen={isExistingEpochModalOpen} onClose={onExistingEpochModalClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Edit Existing Epoch</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
    <FormControl>
        <FormLabel>Goal</FormLabel>
        <Input value={existingEpoch.target} onChange={(e) => setExistingEpoch({ ...existingEpoch, target: e.target.value })} />
      </FormControl>
      <FormControl>
        <FormLabel>Date</FormLabel>
        <Input type="date" value={selectedDate} onChange={(e) => { console.log(e.target.value);
                      setSelectedDate(e.target.value)}}
                       />
      </FormControl>
      <FormControl>
        <FormLabel>Start Time</FormLabel>
        <Input type="time" value={existingEpoch.start} onChange={(e) => setExistingEpoch({ ...existingEpoch, start: e.target.value })} />
      </FormControl>
      <FormControl>
        <FormLabel>End Time</FormLabel>
        <Input type="time" value={existingEpoch.end} onChange={(e) => setExistingEpoch({ ...existingEpoch, end: e.target.value })} />
      </FormControl>
      <FormControl>
        <FormLabel>Status</FormLabel>
        <Select value={EndStatus[existingEpoch.endStatus]} onChange={(e) => setExistingEpoch({ ...existingEpoch, endStatus: EndStatus[e.target.value as keyof typeof EndStatus] })}>
          {Object.values(EndStatus)
            .filter((status) => isNaN(Number(status))) // Filter out numeric values
            .map((status, index) => (
              <option key={index} value={status}>{status}</option>
            ))}
        </Select>
      </FormControl>
      {/* Add other fields as necessary */}
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={onExistingEpochModalClose}>
        Close
      </Button>
      <Button onClick={saveEpochChanges} variant="ghost">Save Changes</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </div>
  );
};

export default AccordionList;
