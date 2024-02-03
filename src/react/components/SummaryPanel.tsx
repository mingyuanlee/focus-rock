import { Box } from "@chakra-ui/react";
import { AppStatus } from "../App";
import TimeChart, { TimeInterval } from "./TimeChart";
import { useEffect, useState } from "react";

type SummaryPanelProps = {
  appStatus: AppStatus;
};

const SummaryPanel: React.FC<SummaryPanelProps> = ({ appStatus }) => {

  const [data, setData] = useState<{ [key: string]: TimeInterval[] }>({});

  const makeData = () => {
    const newData: { [key: string]: TimeInterval[] } = {};
  
    // Assuming appStatus.curr_streams and appStatus.archived_streams are arrays
    const allStreams = [...appStatus.curr_streams, ...appStatus.archived_streams];
  
    allStreams.forEach(stream => {
      stream.partitions.forEach(partition => {
        partition.epochs.forEach(epoch => {
          const startDate = new Date(epoch.start).toLocaleString().split(',')[0];
  
          const interval: TimeInterval = {
            start: epoch.start,
            end: epoch.end,
            stream: stream.topic,
            goal: epoch.target,
          };
  
          // Assuming the same date is used for start and end
          if (newData[startDate]) {
            newData[startDate].push(interval);
          } else {
            newData[startDate] = [interval];
          }
        });
      });
    });
  
    setData(newData);
  };

  useEffect(() => {
    makeData();
  }, [appStatus]);

  return (
    <Box>
      <TimeChart data={data} />
    </Box>
  )
}

export default SummaryPanel;