import { Heading, Input, Button, useToast, Box, Card, CardHeader, CardBody, Switch, FormControl, FormLabel } from "@chakra-ui/react";
import { AppStatus } from "../App";
import { useState } from "react";
import { Stream } from "../models/Stream";
import AccordianList from "./AccordionList";
import { GlobalConfig } from "../GlobalConfig";


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
    const [hideButtons, setHideButtons] = useState(false);

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

    const sortEpochs = (streams: Stream[]) => {
        for (const stream of streams) {
          for (const partition of stream.partitions) {
            partition.epochs.sort((a, b) => {
              if (a.start === null) return -1;
              if (b.start === null) return 1;
              const dateA = new Date(a.start);
              const dateB = new Date(b.start);
              if (dateA > dateB) {
                return -1;
              }
              if (dateA < dateB) {
                return 1;
              }
              return 0;
            })
          }
        }
        return streams;
      }

    return (
        <Card w={GlobalConfig.panelWidth} mt="20px">
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
            
            <FormControl display="flex" alignItems="center" my="40px">
                
                <Switch isChecked={hideButtons} onChange={(e) => setHideButtons(e.target.checked)} />
                <FormLabel ml="15px" mb="0">Hide Buttons</FormLabel>
            </FormControl>

            <Heading size="sm" mb="18px">Active Streams</Heading>
            <AccordianList hideButtons={hideButtons} streams={sortEpochs(appStatus.curr_streams)} appStatus={appStatus} setAppStatus={setAppStatus} wrappedSetAppStatus={setAppStatus} type="active" />

            <Heading size="sm" my="18px">Archived Streams</Heading>
            <AccordianList hideButtons={hideButtons} streams={sortEpochs(appStatus.archived_streams)} appStatus={appStatus} setAppStatus={setAppStatus} wrappedSetAppStatus={setAppStatus} type="archived" />
        </CardBody>
        </Card>
    );
};

export default StreamPanel;
