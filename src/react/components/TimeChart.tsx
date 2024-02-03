import { Box, Card, HStack, Heading, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { format, getDay } from 'date-fns';

interface TimeInterval {
    start: string;
    end: string;
    stream: string;
    goal: string;
}

interface TimeChartProps {
    data: { [key: string]: TimeInterval[] };
}

interface ColumnBox {
    height: number;
    color: string;
    hoverText: string;
    showBorder: "bottom" | "top" | "none";
}

interface Column {
    date: string | null;
    boxes: ColumnBox[] | null;
    type: "thin" | "normal";
}

const config = {
    blankBoxColor: "#f7fffb",
    dashlineStyle: "1px dashed #c9c9c9",
    leftTimeStyle: {
        fontSize: "12px",
        color: "#414141"
    },
    dateStyle: {
        fontSize: "14px",
        color: "#414141",
        fontStyle: "italic"
    }
}

const TimeChart: React.FC<TimeChartProps> = ({ data }) => {

    

    /* 
    */
    const [columns, setColumns] = useState<Array<Column>>([
        { date: null, boxes: null, type: "thin" },
        { date: "2020-01-02", boxes: [], type: "normal" },
        { date: null, boxes: null, type: "thin" },
        { date: "2020-01-01", boxes: [], type: "normal" },
    ]);

    function generateBoxes(firstStartInPx: number, config: any) {
        const boxes: ColumnBox[] = [];
        const fullBoxHeight = 480 / 8;
        const fullBoxesCount = Math.floor(firstStartInPx / fullBoxHeight);
        const remainingBoxHeight = firstStartInPx % fullBoxHeight;
    
        // Push full-height boxes
        for (let i = 0; i < fullBoxesCount; i++) {
            boxes.push({
                height: fullBoxHeight,
                color: config.blankBoxColor,
                hoverText: "",
                showBorder: "bottom",
            });
        }
    
        // Push the remaining box
        if (remainingBoxHeight > 0) {
            boxes.push({
                height: remainingBoxHeight,
                color: config.blankBoxColor,
                hoverText: "",
                showBorder: "none",
            });
        }
    
        return boxes;
    }

    const makeBoxesForCol = (date: string) => {
        const intervals = data[date];
        const boxes: ColumnBox[] = [];
        const len = intervals.length;
        // 1. the first blank box
        if (len > 0) {
            const firstStartTime = new Date(intervals[0].start);
            const firstStartInMinutes = firstStartTime.getHours() * 60 + firstStartTime.getMinutes();
            const firstStartInPx = Math.floor(firstStartInMinutes / 3);
            const newBoxes = generateBoxes(firstStartInPx, config);
            boxes.push(...newBoxes);
        }
        // 2. append the duo: time box and blank box
        for (let i = 0; i < len; i++) {
            const interval = intervals[i];
            const startTime = new Date(interval.start);
            const endTime = new Date(interval.end);
            const startInMinutes = startTime.getHours() * 60 + startTime.getMinutes();
            const endInMinutes = endTime.getHours() * 60 + endTime.getMinutes();
            const startInPx = Math.floor(startInMinutes / 3)
            const endInPx = Math.floor(endInMinutes / 3)
            const height = endInPx - startInPx;
            boxes.push({
                height,
                color: "green",
                hoverText: ``,
                showBorder: "none",
            });
            const nextStartInMinutes = i < len - 1 ? new Date(intervals[i + 1].start).getHours() * 60 + new Date(intervals[i + 1].start).getMinutes() : 1440;
            const nextStartInPx = Math.floor(nextStartInMinutes / 3);
            boxes.push(...divideBox(endInPx, nextStartInPx));
        }
        return boxes;
    }

    function divideBox(start_px: number, end_px: number) {
        const boxes: ColumnBox[] = [];
        let currentStart = start_px;
    
        while (currentStart < end_px) {
            const nextMultipleOf60 = Math.ceil((currentStart + 1) / 60) * 60;
            const currentEnd = Math.min(nextMultipleOf60, end_px);
    
            boxes.push({
                height: currentEnd - currentStart,
                color: config.blankBoxColor,
                hoverText: "",
                showBorder: "bottom",
            });
    
            currentStart = currentEnd;
        }
    
        return boxes;
    }
    

    const makeColumns = () => {
        const cols: Column[] = []
        for (const date in data) {
            cols.push({ date: null, boxes: null, type: "thin" });
            cols.push({ date, boxes: makeBoxesForCol(date), type: "normal" });
        }
        setColumns(cols);
    }

    function formatWithOrdinal(date: Date) {
        const day = date.getDate();
        let suffix = 'th';
        if (day % 10 === 1 && day !== 11) {
            suffix = 'st';
        } else if (day % 10 === 2 && day !== 12) {
            suffix = 'nd';
        } else if (day % 10 === 3 && day !== 13) {
            suffix = 'rd';
        }
        return format(date, 'MMM d') + suffix;
    }

    useEffect(() => {
        makeColumns();
    }, [data]);

    // Render the TimeChart component here
    return (<Card py="40px" px="20px" width={"800px"}>
        <Heading as="h3" size="md" textAlign={"center"} mb="40px">Time Usage</Heading>
        <HStack>
            <Box height={"520px"} display="flex">
            <Box width="80px" height={"480px"} bg={"white"}>
                                 { Array.from({ length: 8 }, (_, i) => {

const time = new Date(0, 0, 0, 3 +  3 * i, 0);
const timeString = time.toLocaleTimeString(undefined, { hour: 'numeric', minute: "2-digit", hour12: true });
                    return (<Box 
                        key={i} 
                        width="100%" 
                        height={`${480 / 8}px`} 
                        borderBottom={i !== (9 - 1) ? config.dashlineStyle : "none"} 
                        display="flex"
    flexDirection="column"
    justifyContent="flex-end"
    {...config.leftTimeStyle}
    textAlign={"right"}
                    > {timeString} </Box>)
                                 }) }
                            </Box>
            </Box>
        
        <Box style={{ overflowX: 'auto' }}>
            <Box display="flex">
                {columns.map((column, index) => (
                    <Box key={index}>
                        { column.type === "thin" && (
                            <Box width="20px" height={"480px"} bg={"white"}>
                                 { Array.from({ length: 8 }, (_, i) => (
                    <Box 
                        key={i} 
                        width="100%" 
                        height={`${480 / 8}px`} 
                        borderBottom={i !== (9 - 1) ? config.dashlineStyle : "none"} 
                        bg={column.boxes?.[i]?.color || "transparent"} 
                        title={column.boxes?.[i]?.hoverText || ""}
                    />
                )) }
                            </Box>
                        ) }
                        { column.type === "normal" && (
                            <Box width="80px" height={"520px"} bg="green">
                                {
                                    column.boxes?.map((box, index) => (
                                        <Box 
                                            borderBottom={box.showBorder === "bottom" ? config.dashlineStyle : "none"} 
                                            borderTop={box.showBorder === "top" ? config.dashlineStyle : "none"}
                                            width="100%" key={index} height={`${box.height}px`} bg={box.color} title={box.hoverText}></Box>
                                    ))
                                }
                                {/* <Box {...config.dateStyle} width="100%" height="40px" pt="10px" bg="white" textAlign={"center"}>
                                {new Date(column.date).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit' })}
                                </Box> */}
                                <Box {...config.dateStyle} width="100%" height="40px" pt="10px" bg="white" textAlign={"center"}>
    {formatWithOrdinal(new Date(column.date))}
</Box>
                            </Box>)
                        }
                    </Box>
                ))}
            </Box>
            </Box>
        </HStack>
        
        </Card>);
};

export default TimeChart;