'use client';

import instance from '@/utils/axiosIntance';
import DashboardPageWrapper from '@/views/global/component/menubar';
import PageWrapper from '@/views/global/component/pageWrapper';
import { Box, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import {
  EventPropsDetail,
  SeatCategoryProps,
  Ticket,
  TicketSeatCategoryItems,
  Transaction,
} from './types';
import EventDetails from './components/eventDetails';
import PieData from './components/pieData';
import TicketTable from './components/ticketTable';
import TransactionData from './components/transactionData';

export default function EventDetailsView({ eventId }: { eventId: string }) {
  const [eventDetails, setEventDetails] = useState<EventPropsDetail | null>(
    null,
  );
  const [ticketsPerCategory, setTicketsPerCategory] =
    useState<TicketSeatCategoryItems | null>(null);
  const [transactions, setTransactions] = useState<Array<Transaction> | null>(
    null,
  );
  const [isMounted, setIsMounted] = useState(false);

  const combinedTickets: Array<Ticket & { seatCategoryName: string }> =
    eventDetails?.seatCategory.flatMap((category) => {
      const tickets = ticketsPerCategory?.get(category.id);
      if (tickets) {
        return tickets.map((ticket) => ({
          ...ticket,
          seatCategoryName: category.name,
        }));
      }
      return [];
    }) || [];

  async function fetchData() {
    try {
      const eventResult = await instance().get(
        `${process.env.API_URL}/events/detail/${eventId}`,
      );
      setEventDetails(eventResult.data.data);

      const transactionResult = await instance().get(
        `${process.env.API_URL}/orders/transactions/all/${eventId}`,
      );
      setTransactions(transactionResult.data.data);
      console.log(transactionResult.data.data);

      const resultSeatCategory = await instance().get(
        `${process.env.API_URL}/orders/ticket/${eventId}`,
      );

      const resultSeatCategoryProps: Array<
        SeatCategoryProps & { ticket: Ticket[] }
      > = resultSeatCategory.data.data;

      const ticketsMap = new Map<number, Ticket[]>(
        resultSeatCategoryProps.map((seatCategory) => [
          seatCategory.id,
          seatCategory.ticket,
        ]),
      );

      setTicketsPerCategory(ticketsMap);
      setIsMounted(true);
    } catch (err: any) {
      console.log('Data is not fetched');
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <PageWrapper sx={{ backgroundColor: 'primary.main' }}>
      <DashboardPageWrapper>
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack
            direction="column"
            sx={{ backgroundColor: 'secondary.light', borderRadius: '20px' }}
            padding={4}
            paddingTop={1}
            maxWidth={300}
          >
            {eventDetails && <EventDetails eventDetails={eventDetails} />}
          </Stack>
          <Stack
            direction="column"
            sx={{ backgroundColor: 'secondary.light', borderRadius: '20px' }}
            padding={4}
            paddingTop={1}
            maxWidth={300}
          >
            {ticketsPerCategory && eventDetails && (
              <PieData
                ticketsPerCategory={ticketsPerCategory}
                seatCategories={eventDetails?.seatCategory}
              />
            )}
            {transactions && <TransactionData transactions={transactions} />}
          </Stack>
        </Stack>
        <Box marginTop={2}>
          <TicketTable combinedTickets={combinedTickets} />
        </Box>
      </DashboardPageWrapper>
    </PageWrapper>
  );
}
