'use client';
import { keepLogin } from '@/_middlewares/authMiddleware';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import PageWrapper from '@/views/global/component/pageWrapper';
import {
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useRouter } from 'next/navigation';

export default function OrganizerHomeView() {
  const isMdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  });

  if (!isMounted) {
    return null;
  }

  return (
    <PageWrapper sx={{ backgroundColor: 'secondary.light' }}>
      <Container>
        <Stack direction={{ xs: 'column', md: 'row' }} height="500px">
          <Box
            sx={{
              // marginTop: '1rem',
              padding: '2rem',
              paddingTop: '6rem',
              backgroundColor: 'primary.main',
            }}
          >
            <Typography
              variant="h2"
              fontSize={isMdUp ? '56px' : '45px'}
              sx={{ textAlign: 'start', color: 'secondary.light' }}
            >
              Kick off the creation of your dream event!
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ marginTop: '20px' }}
            >
              <Button
                sx={{
                  backgroundColor: 'secondary.main',
                  borderRadius: '20px',
                  '&:hover': {
                    bgcolor: 'secondary.light', // Hover color
                  },
                }}
                onClick={() => {
                  router.push('/organizer/create-event');
                }}
              >
                <AddCircleIcon />
                <Typography
                  variant={isMdUp ? 'h5' : 'h6'}
                  sx={{
                    padding: '0.5rem',
                    paddingLeft: '1rem',
                    paddingRight: '0.5rem',
                  }}
                >
                  Create Event
                </Typography>
              </Button>
            </Stack>
            <Stack
              direction="row"
              alignItems="center"
              sx={{ marginTop: '20px' }}
            >
              <Button
                onClick={() => {
                  router.push('organizer/dashboard');
                }}
              >
                <Typography
                  sx={{
                    color: 'white',
                    '&:hover': {
                      color: 'secondary.main',
                    },
                  }}
                >
                  Go to dashboard
                </Typography>

                <KeyboardDoubleArrowRightIcon
                  sx={{
                    color: 'white',
                  }}
                />
              </Button>
            </Stack>
          </Box>{' '}
          {isMdUp && (
            <Box
              sx={{
                height: '500px',
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <img
                src="/login-photo.jpg"
                alt="Description"
                style={{
                  height: '100%',
                  width: 'auto',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            </Box>
          )}
        </Stack>
      </Container>
    </PageWrapper>
  );
}
