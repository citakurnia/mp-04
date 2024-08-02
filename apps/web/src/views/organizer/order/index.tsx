'use client';

import DashboardPageWrapper from '@/views/global/component/menubar';
import PageWrapper from '@/views/global/component/pageWrapper';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
  Box,
} from '@mui/material';
import axios from 'axios';
import instance from '@/utils/axiosIntance';
import { TransactionItems } from './types';
import moment from 'moment';
import { useAppSelector } from '@/libs/hooks';
import { EventProps } from '../types';

interface Column {
  id:
    | 'eventId'
    | 'id'
    | 'email'
    | 'paidAmount'
    | 'status'
    | 'createdAtDate'
    | 'createdAtTime';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center';
}

const columns: readonly Column[] = [
  {
    id: 'id',
    label: 'Event ID',
    minWidth: 60,
    align: 'center',
  },
  {
    id: 'id',
    label: 'Transaction ID',
    minWidth: 100,
    align: 'center',
  },
  { id: 'email', label: 'Email', minWidth: 170, align: 'center' },
  {
    id: 'paidAmount',
    label: 'Paid Amount',
    minWidth: 100,
    align: 'center',
  },
  { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
  { id: 'createdAtDate', label: 'Date', minWidth: 80, align: 'center' },
  { id: 'createdAtTime', label: 'Time', minWidth: 80, align: 'center' },
];

interface EventSelectItems {
  id: number;
  name: string;
}

export default function OrderView() {
  const [data, setData] = useState<
    Array<{
      transaction: TransactionItems;
      eventId: number;
    }>
  >([]);
  const [sortEvent, setSortEvent] = useState('None');
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isMounted, setIsMounted] = useState(false);
  const [events, setEvents] = useState<Array<EventSelectItems>>([]);
  const { user } = useAppSelector((state) => state.auth);

  async function fetchData() {
    try {
      const resultTransactions = await instance().get(
        `${process.env.API_URL}/orders/transactions?page=${page + 1}&pageSize=${pageSize}&eventId=${sortEvent}&sortBy=${sortBy}`,
      );
      setData(resultTransactions.data.data);

      const resultEvents = await instance().get(
        `${process.env.API_URL}/events/${user.id}`,
      );
      const resultEventsProps: Array<EventSelectItems> =
        resultEvents.data.data.map((event: EventProps) => ({
          id: event.id,
          name: event.name,
        }));
      setEvents(resultEventsProps);

      setIsMounted(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  useEffect(() => {
    fetchData();
  }, [page, pageSize, sortBy, sortEvent]);

  if (!isMounted) {
    return null;
  }

  function handleChangeSort(event: SelectChangeEvent<string>) {
    const sortByValue = event.target.value as string;
    const value = sortByValue === 'desc' ? 'desc' : 'asc';
    setSortBy(value);
  }

  function handleChangeSortEvent(event: SelectChangeEvent<string>) {
    const sortByValue = event.target.value as string;
    setSortEvent(sortByValue);
  }

  function handleChangePage(event: any, newPage: React.SetStateAction<number>) {
    setPage(newPage);
  }

  function handleChangeRowsPerPage(event: { target: { value: string } }) {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  }

  return (
    <PageWrapper sx={{ backgroundColor: 'primary.main' }}>
      <DashboardPageWrapper>
        <Box sx={{ backgroundColor: 'secondary.light' }}>
          <FormControl sx={{ margin: '12px', marginTop: '20px' }}>
            <InputLabel id="select-sort">Sort By</InputLabel>
            <Select
              labelId="Select Sort By"
              id="select-sort-by"
              value={sortBy}
              label="Sort By"
              onChange={handleChangeSort}
              sx={{ height: '40px' }}
            >
              <MenuItem key="asc" value="asc">
                <Typography fontSize="14px">Ascending</Typography>
              </MenuItem>
              <MenuItem key="desc" value="desc">
                <Typography fontSize="14px">Descending</Typography>
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ margin: '12px', marginTop: '20px' }}>
            <InputLabel id="select-event">Sort By Event</InputLabel>
            <Select
              labelId="Select Sort By Event"
              id="select-sort-by-event"
              value={sortEvent}
              label="Sort By Event"
              onChange={handleChangeSortEvent}
              sx={{ height: '40px', minWidth: '120px', fontSize: '14px' }}
            >
              <MenuItem key="None" value="None">
                None
              </MenuItem>
              {events.map((event) => (
                <MenuItem key={event.id} value={event.id}>
                  {event.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box padding={2} paddingTop={0}>
            <Paper
              sx={{
                width: '100%',
                overflow: 'hidden',
              }}
            >
              <TableContainer sx={{ maxHeight: '100%' }}>
                <Table stickyHeader aria-label="sticky table">
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          sx={{
                            backgroundColor: 'secondary.main',
                            fontWeight: '600',
                          }}
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((item) => (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={item.transaction.id}
                      >
                        <TableCell align="center">{item.eventId}</TableCell>
                        <TableCell align="center">
                          {item.transaction.id}
                        </TableCell>
                        <TableCell align="left">
                          {item.transaction.payer.email}
                        </TableCell>
                        <TableCell align="center">
                          {item.transaction.paidAmount}
                        </TableCell>
                        <TableCell align="center">
                          {item.transaction.status === 'COMPLETED' ? (
                            <Box
                              sx={{
                                backgroundColor: 'lightblue',
                                borderRadius: '20px',
                                padding: '1px',
                              }}
                            >
                              {item.transaction.status}
                            </Box>
                          ) : (
                            <Box
                              sx={{
                                backgroundColor: 'primary.light',
                                borderRadius: '20px',
                                padding: '1px',
                              }}
                            >
                              {item.transaction.status}
                            </Box>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {moment(item.transaction.createdAt).format('L')}
                        </TableCell>
                        <TableCell align="center">
                          {moment(item.transaction.createdAt).format('LT')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component="div"
                count={-1}
                rowsPerPage={pageSize}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        </Box>
      </DashboardPageWrapper>
    </PageWrapper>
  );
}
