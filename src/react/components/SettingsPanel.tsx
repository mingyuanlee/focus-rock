import { Box, Button, Card, CardBody, CardHeader, Heading, Select, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { AppStatus } from "../App";
import { Store } from "../persistence/Store";
import { checkConflicts, mergeStreams } from "../utils/sync";

interface SettingsPanelProps {
    appStatus: AppStatus;
    wrappedSetAppStatus: (appStatus: AppStatus) => void;
}

const SettingsPanel = ({ appStatus, wrappedSetAppStatus }: SettingsPanelProps) => {
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importOption, setImportOption] = useState("Merge");

    const toast = useToast();

    const handleImportFile = (file: File) => {
        // Read file contents here
        console.log("Reading file contents:", file);
        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result as string;
            try {
                const store: Store = JSON.parse(content);
    
                if (!Array.isArray(store.curr_streams) || !Array.isArray(store.archived_streams)) {
                    throw new Error('Invalid format');
                }
    
                if (importOption === "Replace") {
                    const newAppStatus: AppStatus = {
                        curr_streams: store.curr_streams,
                        archived_streams: store.archived_streams,
                        curr_epoch: appStatus.curr_epoch
                    }
                    wrappedSetAppStatus(newAppStatus);
                }

                if (importOption === "Merge") {
                    // check if there are any conflicted epochs
                    const hasConflicts = checkConflicts(appStatus.curr_streams, store.curr_streams)
                    || checkConflicts(appStatus.archived_streams, store.archived_streams);

                    if (hasConflicts) {
                        toast({
                            title: 'Error',
                            description: 'There are conflicting epochs.',
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                        });
                        return;
                    }
                
                    const merged_curr_streams = mergeStreams(appStatus.curr_streams, store.curr_streams);
                    const merged_archived_streams = mergeStreams(appStatus.archived_streams, store.archived_streams);

                    const newAppStatus: AppStatus = {
                        curr_streams: merged_curr_streams,
                        archived_streams: merged_archived_streams,
                        curr_epoch: appStatus.curr_epoch
                    }
                    wrappedSetAppStatus(newAppStatus);
                }
                
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'The format of the file content is wrong.',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }
        };
    
        reader.onerror = () => {
            toast({
                title: 'Error',
                description: 'An error occurred while reading the file.',
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        };
    
        reader.readAsText(file);
        // try {
        //     const store: Store = JSON.parse(content);
    
        //     if (!Array.isArray(store.curr_streams) || !Array.isArray(store.archived_streams)) {
        //         throw new Error('Invalid format');
        //     }
    
        //     setAppStatus(prevStatus => ({
        //         ...prevStatus,
        //         curr_streams: store.curr_streams,
        //         archived_streams: store.archived_streams,
        //     }));
        // } catch (error) {
        //     toast({
        //         title: 'Error',
        //         description: 'The format of the file content is wrong.',
        //         status: 'error',
        //         duration: 9000,
        //         isClosable: true,
        //     });
        // }
    };

    const handleImportOptionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setImportOption(event.target.value);
    };

    const handleImportButtonClick = () => {
        if (importFile) {
            handleImportFile(importFile);
        }
    };

    const handleExportButtonClick = () => {
        const data: Store = {
            curr_streams: appStatus.curr_streams,
            archived_streams: appStatus.archived_streams
        };

        const json = JSON.stringify(data);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "data.json";
        link.click();
    };

    const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        setImportFile(file);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    return (
        <Card w="800px" mt="20px">
            <CardHeader>
            <Heading size='md'>Data Imports & Exports</Heading>
            </CardHeader>
            <CardBody>
            <Box>
                <Heading mb="20px" size="md">Imports</Heading>

                
                    
                    <Box mt={2}>
                        <Box
                            border="2px dashed gray"
                            borderRadius="md"
                            width="100%"
                            onDrop={handleFileDrop}
                            onDragOver={handleDragOver}
                            h="160px"
                            textAlign={"center"}
                            lineHeight={"160px"}
                        >
                            {importFile ? importFile.name : "Drag and drop a JSON file here"}
                        </Box>
                        <Box display="flex" alignItems="center" mt={6}>
                    <Select value={importOption} onChange={handleImportOptionChange} w="160px">
                        <option value="Merge">Merge</option>
                        <option value="Replace">Replace</option>
                    </Select>

                    <Button colorScheme={"blue"} onClick={handleImportButtonClick} ml={4} disabled={!importFile}>
                        Import
                    </Button>
                </Box>
                    </Box>

                    
            </Box>

            <Box mt={"20px"}>
                <Heading size="md">Exports</Heading>

                <Button colorScheme={"blue"} onClick={handleExportButtonClick} mt={"20px"}>
                    Export
                </Button>
            </Box>
            </CardBody>
        </Card>
    );
};

export default SettingsPanel;
