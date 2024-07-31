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
    <PageWrapper>
      <Container>
        <Box
          sx={{
            marginTop: '1rem',
            padding: '1rem',
          }}
        >
          <Typography sx={{ textAlign: 'start' }}>
            {status.isLogin
              ? `Welcome back ${user.firstname} ${user.lastname}`
              : ''}
          </Typography>
          {user.avatar && status.isLogin && (
            <Box>
              <img width="420px" height="240px" src={avatarUrl} />
            </Box>
          )}
        </Box>
        <Box
          display="flex"
          sx={{
            marginTop: '1rem',
            padding: '1rem',
            justifyContent: 'center',
          }}
        >
          <Stack spacing={8}>
            <Typography variant="h4" sx={{ textAlign: 'end' }}>
              Landing page
            </Typography>
          </Stack>
        </Box>
      </Container>
    </PageWrapper>
  );
};

export default HomeView;
