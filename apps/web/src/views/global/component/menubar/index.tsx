'use client';
import {
  Grid,
  Box,
  SxProps,
  Theme,
  MenuItem,
  Typography,
  Divider,
  Stack,
  Avatar,
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { useAppSelector } from '@/libs/hooks';
import instance from '@/utils/axiosIntance';

export default function DashboardPageWrapper({
  children,
}: Readonly<{
  children: ReactNode;
  sx?: SxProps<Theme>;
}>) {
  const isMdDown = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down('md'),
  );
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const [isMounted, setIsMounted] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  async function fetchData() {
    try {
      const result = await instance().get(
        `${process.env.API_URL}/rewards/totalpoints`,
      );
      setTotalPoints(result.data.data);
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

  const dashboardMenuItems = [
    { name: 'My Event', href: '/organizer/dashboard' },
    { name: 'Order', href: '/organizer/dashboard/order' },
    { name: 'Report', href: '/organizer/dashboard/report' },
    { name: 'Account', href: '/organizer/dashboard/account' },
  ];

  const participantMenuItems = [
    { name: 'Reward', href: '/reward' },
    { name: 'Ticket', href: '/ticket' },
    { name: 'Order', href: '/order' },
    { name: 'Account', href: '/account' },
  ];

  const menuItems = pathname.startsWith('/organizer')
    ? dashboardMenuItems
    : participantMenuItems;

  const avatarUrl = `${process.env.IMAGE_URL}/avatars/${user?.avatar}`;

  return (
    <Grid
      container
      px={{ xs: '1.5rem', sm: '5rem', md: '7rem', xl: '10rem' }}
      sx={{
        height: '100vh',
        backgroundColor: 'primary.main',
      }}
    >
      {!isMdDown && (
        <Grid
          item
          xs={3}
          sx={{
            height: '100%',
            overflowY: 'auto',
            bgcolor: 'secondary.light',
          }}
        >
          <Box sx={{ p: 2 }}>
            <Stack
              direction="row"
              spacing={1}
              // justifyContent="center"
              alignItems="center"
              p={2.5}
            >
              {pathname.startsWith('/organizer') ? (
                <>
                  <AssessmentIcon sx={{ fontSize: '28px' }} />
                  <Typography variant="h5" fontWeight="700">
                    DASHBOARD
                  </Typography>
                </>
              ) : (
                <Box minWidth="100%">
                  <Stack justifyContent="center" alignItems="center">
                    <Avatar
                      src={avatarUrl}
                      sx={{ width: 70, height: 70, marginBottom: '10px' }}
                    />
                    <Typography
                      style={{ marginLeft: '10px', fontWeight: '700' }}
                    >
                      {user.firstname + ' ' + user.lastname}
                    </Typography>
                    <Typography fontSize="14px">{user.email}</Typography>
                    <Box height="10px" />
                    <Typography
                      fontSize="14px"
                      sx={{
                        backgroundColor: 'secondary.main',
                        borderRadius: '10px',
                      }}
                      padding={0.8}
                    >
                      Points: {totalPoints}
                    </Typography>
                    <Box height="8px" />
                    <Typography fontSize="14px">
                      Referral Code: <b>{user.referral.toUpperCase()}</b>
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
            <Divider
              sx={{ backgroundColor: 'secondary.light' }}
              style={{ margin: '2px', padding: '0.5px' }}
            />
            {menuItems.map((item) => (
              <Box key={item.name}>
                <MenuItem
                  onClick={() => {
                    router.push(item.href);
                  }}
                  sx={{
                    p: '1.5rem',
                    display: 'flex',
                    // justifyContent: 'center',
                  }}
                >
                  <Typography fontSize="18px" fontWeight="500">
                    {item.name}
                  </Typography>
                </MenuItem>
                <Divider
                  sx={{ backgroundColor: 'secondary.light' }}
                  style={{ margin: '2px', padding: '0.5px' }}
                />
              </Box>
            ))}
          </Box>
        </Grid>
      )}
      <Grid
        item
        xs={isMdDown ? 12 : 9} // Full width when md up, otherwise 5/7
        sx={{ height: '100%', overflowY: 'auto', bgcolor: 'primary.main' }}
      >
        <Box sx={{ p: 2 }}>{children}</Box>
      </Grid>
    </Grid>
  );
}
