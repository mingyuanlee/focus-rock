import { Box } from "@chakra-ui/react";
import { AppStatus } from "../App";
import TimeChart from "./TimeChart";

type SummaryPanelProps = {
  appStatus: AppStatus;
};

const SummaryPanel: React.FC<SummaryPanelProps> = ({ appStatus }) => {

  let data = {
    "2020-01-02": [
      { start: "2020-01-02T09:17:00", end: "2020-01-02T11:00:00", stream: "stream1", goal: "goal1" },
      { start: "2020-01-02T12:00:00", end: "2020-01-02T12:22:00", stream: "stream2", goal: "goal2" },
    ],
    "2020-01-01": [
      { start: "2020-01-01T10:00:00", end: "2020-01-01T11:00:00", stream: "stream1", goal: "goal1" },
      { start: "2020-01-01T12:00:00", end: "2020-01-01T13:00:00", stream: "stream2", goal: "goal2" },
    ]
  };
  
  for (let i = 2; i < 15; i++) {
    const date = new Date(2020, 0, 2 - i); // subtract i days from 2020-01-02
    const dateString = date.toISOString().split('T')[0]; // format date as "YYYY-MM-DD"
  
    data[dateString as keyof typeof data] = [
      { start: `${dateString}T09:17:00`, end: `${dateString}T11:00:00`, stream: `stream${i+1}`, goal: `goal${i+1}` },
      { start: `${dateString}T12:00:00`, end: `${dateString}T12:22:00`, stream: `stream${i+1}`, goal: `goal${i+1}` },
    ];
  }

  return (
    <Box>
      <TimeChart data={data} />
    </Box>
  )
}

export default SummaryPanel;