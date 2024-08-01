'use client';

import { SeatCategoryProps, TicketSeatCategoryItems } from '../types';
import { Chart } from 'chart.js';
import PieChart from './pieChart';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export default function PieData({
  ticketsPerCategory,
  seatCategories,
}: {
  ticketsPerCategory: TicketSeatCategoryItems;
  seatCategories: Array<SeatCategoryProps>;
}) {
  const seatInformations = seatCategories
    .map((category) => {
      const seatInformation = { id: category.id, name: category.name };
      const bookedTicket = ticketsPerCategory.get(category.id)?.length;
      if (bookedTicket !== undefined) {
        return {
          ...seatInformation,
          available: category.maxSeats - bookedTicket,
          booked: bookedTicket,
        };
      }
      return null;
    })
    // Filter out null or undefined values
    .filter(
      (
        info,
      ): info is {
        available: number;
        booked: number;
        id: number;
        name: string;
      } => info !== null,
    );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    String(seatInformations[0].id),
  );
  const [data, setData] = useState([
    seatInformations[0].booked,
    seatInformations[0].available,
  ]);

  function handleChange(event: SelectChangeEvent<string>) {
    const categoryId = event.target.value as unknown as number;
    const selectedCategoryInfo = seatInformations.find(
      (category) => category.id === categoryId,
    );

    if (selectedCategoryInfo) {
      setSelectedCategory(String(categoryId));
      setData([selectedCategoryInfo.booked, selectedCategoryInfo.available]);
    }
  }

  return (
    <>
      <Box height={10} />
      <Typography fontSize="18px" fontWeight="600" color="primary.main">
        Seat Availability
      </Typography>
      <FormControl sx={{ margin: '12px' }}>
        <InputLabel id="select-category">Category</InputLabel>
        <Select
          labelId="Select Seat Category"
          id="select-seat-category"
          value={selectedCategory}
          label="Seat Availability"
          onChange={handleChange}
        >
          {seatInformations.map((category) => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <PieChart
        data={{
          labels: ['Booked', 'Available'],
          datasets: [
            {
              label: 'Seats',
              data: data,
              backgroundColor: [
                'rgba(255, 99, 132, 0.8)',
                'rgba(19, 60, 108, 0.8)',
              ],
              borderColor: ['rgba(255, 99, 132, 1)', 'rgba(19, 60, 108, 1)'],
              borderWidth: 1,
            },
          ],
        }}
      />
    </>
  );
}
