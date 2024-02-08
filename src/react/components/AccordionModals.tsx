import React from 'react';
import { Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Heading, Input, Button, useToast, Box, Card, CardHeader, CardBody, Tag, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Tooltip, FormControl, FormLabel, Select, Flex } from "@chakra-ui/react";
import { EndStatus, Epoch } from '../models/Epoch';

type AccordionModalsProps = {
    isEpochModalOpen: boolean;
    onEpochModalClose: () => void;
    isOpen: boolean;
    onClose: () => void;
    partitionName: string;
    setPartitionName: (name: string) => void;
    addPartition: () => void;
    isExistingEpochModalOpen: boolean;
    onExistingEpochModalClose: () => void;
    newEpoch: Epoch;
    setNewEpoch: (epoch: Epoch) => void;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    existingEpoch: Epoch;
    setExistingEpoch: (epoch: Epoch) => void;
    saveEpochChanges: () => void;
    handleAddEpoch: () => void;
    handleRename: () => void;
    setNewName: (name: string) => void;
    isRenameModalOpen: boolean;
    onRenameModalClose: () => void;
};

const AccordionModals: React.FC<AccordionModalsProps> = ({ 
    isEpochModalOpen, 
    onEpochModalClose,
    isOpen,
    onClose,
    partitionName,
    setPartitionName,
    addPartition,
    isExistingEpochModalOpen,
    onExistingEpochModalClose,
    newEpoch,
    setNewEpoch,
    selectedDate,
    setSelectedDate,
    existingEpoch,
    setExistingEpoch,
    saveEpochChanges,
    handleAddEpoch,
    handleRename,
    setNewName,
    isRenameModalOpen,
    onRenameModalClose
 }) => {
    // Your component logic here
    return (
        <div>
          <Modal isOpen={isRenameModalOpen} onClose={onRenameModalClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Rename</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <FormControl>
                    <FormLabel>New Name</FormLabel>
                    <Input value={newEpoch.target} onChange={(e) => setNewName(e.target.value)} />
                </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={() => handleRename()}>
                    Rename
                </Button>
                <Button variant="ghost" onClick={onRenameModalClose}>Cancel</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
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
      {
        existingEpoch.start && existingEpoch.end && (
          <Box>
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
          </Box>)
      }
      
      
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

export default AccordionModals;
