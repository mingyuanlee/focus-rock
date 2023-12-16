import { Box, Grid, GridItem, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

const TimeTable = ({ data }) => {
  const [matrix, setMatrix] = useState(null);
  const [dates, setDates] = useState(null);

  const intervalsPerDay = 24 * 6; // 24 hours * 6 intervals per hour
  const startingHour = 6; // 6:00 AM

  const gridItemStyle = {
    h: "3px",
    w: "80px"
  };

  const convertToMatrix = (data) => {
    const intervalsPerHour = intervalsPerDay / 24;
    const dates = [...new Set(data.map(entry => entry.date))]; // Unique dates
  
    // Initialize matrix with false
    const matrix = Array.from({ length: intervalsPerDay }, () =>
      Array(dates.length).fill(false)
    );
  
    const timeToIndex = (time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * intervalsPerHour + Math.floor(minutes / 10);
    };
  
    data.forEach(entry => {
      const columnIndex = dates.indexOf(entry.date);
      const startIndex = timeToIndex(entry.start_time);
      const endIndex = timeToIndex(entry.end_time);
  
      for (let i = startIndex; i < endIndex; i++) {
        matrix[i][columnIndex] = true;
      }
    });
  
    console.log("matrix:", matrix);

    return matrix;
  };

  function convertToLocalTimeAndFormat(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    console.log("data:", data);
    if (data) {
      setDates([...new Set(data.map(entry => convertToLocalTimeAndFormat(entry.date)))]);
      setMatrix(convertToMatrix(data));
    }
  }, [data]);

  if (!matrix) return (
    <Box width="800px" height="600px" overflow="auto">
      { !matrix && <Text>Loading...</Text> }
      </Box>
  )

  return (
    <Box width="800px" height="600px" overflow="auto">
      <Grid templateColumns={`repeat(${matrix[0].length + 1}, max-content)`} gap="0px 20px">
        {/* Header Row for Dates */}
        <GridItem />
        {dates.map(date => (
          <GridItem key={date}>
            <Text>{date}</Text> {/* Display the date */}
          </GridItem>
        ))}

        {/* Time Interval Rows */}
        {Array.from({ length: intervalsPerDay }, (_, index) => {
          const hour = Math.floor(index / 6);
          if (index / 6 < startingHour) return null; // Skip hours before startingHour
          return (
            <React.Fragment key={index}>
              { index % 12 === 0 && <GridItem borderTop={"1px solid black"} rowSpan={12} textAlign="right">
                <Text>{`${hour % 24}:00`}</Text> {/* Display the hour */}
              </GridItem> }
              {matrix[index].map(item => (
                <GridItem key={index} backgroundColor={ item ? "green": "transparent"} {...gridItemStyle}>
                  {/* This is where your interval data would go */}
                </GridItem>
              ))}
            </React.Fragment>
          )
        })}
      </Grid>
    </Box>
  );
};

export default TimeTable;