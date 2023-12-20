import React, { useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
} from '@chakra-ui/react';
import { convertToLocalTimeAndFormat } from './utils/time';

const EditableTable = ({ data, updateData }) => {

  const handleEdit = (e, index, field) => {
    console.log("handleEdit", e.target.value, index, field, data)
    const newData = [...data];
    newData[index][field] = e.target.value;
    updateData(newData)
  };

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Date</Th>
          <Th>Start Time</Th>
          <Th>End Time</Th>
          <Th>Type</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((row, index) => (
          <Tr key={index}>
            <Td>{convertToLocalTimeAndFormat(row.date)}</Td>
            <Td>
              <Input 
                value={row.start_time} 
                onChange={(e) => handleEdit(e, index, 'start_time')} 
              />
            </Td>
            <Td>
              <Input 
                value={row.end_time} 
                onChange={(e) => handleEdit(e, index, 'end_time')} 
              />
            </Td>
            <Td>{row.type}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default EditableTable;