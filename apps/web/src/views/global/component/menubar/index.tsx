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
} from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import AssessmentIcon from '@mui/icons-material/Assessment';

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

  const dashboardMenuItems = [
    { name: 'My Event', href: '/organizer/dashboard' },
    { name: 'Order', href: '/organizer/dashboard/order' },
    { name: 'Report', href: '/organizer/dashboard/report' },
    { name: 'Account', href: '/organizer/dashboard/account' },
  ];

  const participantMenuItems = [
    { name: 'Point', href: '/point' },
    { name: 'Ticket', href: '/ticket' },
    { name: 'Order', href: '/order' },
    { name: 'Account', href: '/account' },
  ];

  const menuItems = pathname.startsWith('/organizer')
    ? dashboardMenuItems
    : participantMenuItems;

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
              <AssessmentIcon sx={{ fontSize: '28px' }} />
              <Typography variant="h5" fontWeight="700">
                DASHBOARD
              </Typography>
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
