'use client';

import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import DashboardPageWrapper from '@/views/global/component/menubar';
import PageWrapper from '@/views/global/component/pageWrapper';
import { useMediaQuery, Theme, Grid } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { EventProps } from '../types';
import instance from '@/utils/axiosIntance';
import EventCard from './component/card';

export default function DashboardView() {
  const { user } = useAppSelector((state) => state.auth);
  const [events, setEvents] = useState<Array<EventProps>>([]);
  const [isMounted, setIsMounted] = useState(false);

  async function fetchData() {
    try {
      const result = await instance().get(
        `${process.env.API_URL}/events/${user.id}`,
      );
      setEvents(result.data.data);
      setIsMounted(true);
      // console.log(`data: ${result}`);
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
    <>
      <PageWrapper>
        <DashboardPageWrapper>
          <Grid container spacing={2}>
            {events.map((event) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        </DashboardPageWrapper>
      </PageWrapper>
    </>
  );
}
