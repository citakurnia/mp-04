'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Stack } from '@mui/material';

import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { keepLogin } from '@/_middlewares/authMiddleware';
import PageWrapper from '../global/component/pageWrapper';

const HomeView = () => {
  const { status, user } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);

  const avatarUrl = `${process.env.IMAGE_URL}/avatars/${user.avatar}`;

  useEffect(() => {
    setIsMounted(true);
  });

  if (!isMounted) {
    return null;
  }
  return (
    <PageWrapper sx={{ backgroundColor: 'primary.main' }}>
      <Container>
        <Box
          sx={{
            marginTop: '1rem',
            padding: '1rem',
            backgroundColor: 'secondary.light',
            borderRadius: '20px',
          }}
        >
          <Typography sx={{ textAlign: 'start' }}>
            {status.isLogin
              ? `Welcome back, ${user.firstname} ${user.lastname}`
              : ''}
          </Typography>
        </Box>
        <Box
          display="flex"
          sx={{
            marginTop: '1rem',
            padding: '1rem',
            justifyContent: 'center',
            backgroundColor: 'secondary.light',
            borderRadius: '20px',
          }}
        >
          <Stack spacing={8}>
            <Typography variant="h5" fontWeight={700}>
              Find your desired event here!
            </Typography>
          </Stack>
        </Box>
      </Container>
    </PageWrapper>
  );
};

export default HomeView;
