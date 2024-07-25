'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  useMediaQuery,
  Theme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useAppSelector, useAppDispatch } from '@/libs/hooks';
import { logout } from '@/_middlewares/authMiddleware';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Role } from '@/views/register/types';

const NavbarWrapper = styled(Box)(() => ({
  minHeight: '100%',
}));

function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, status } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMdUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'));

  const avatarUrl = `${process.env.IMAGE_URL}/avatars/${user?.avatar}`;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    await logout()(dispatch);
    router.push('/');
  };

  const participantMenuItems = [
    { name: 'Point', href: '/point' },
    { name: 'Ticket', href: '/ticket' },
    { name: 'Order', href: '/order' },
    { name: 'Account', href: '/account' },
  ];

  const organizerMenuItems = [
    { name: 'Create Event', href: '/organizer/create-event' },
    { name: 'My Event', href: '/organizer/dashboard' },
    { name: 'Order', href: '/organizer/dashboard/orders' },
    { name: 'Report', href: '/organizer/dashboard/reports' },
    { name: 'Account', href: '/account' },
  ];

  const menuItems = pathname.startsWith('/organizer')
    ? organizerMenuItems
    : participantMenuItems;

  return (
    <NavbarWrapper>
      <Box
        sx={{
          margin: 'auto',
          paddingLeft: '1rem',
          paddingRight: { xs: '1rem', md: '2rem' },
          backgroundColor: 'secondary.main',
        }}
      >
        <Box
          display="flex"
          sx={{
            height: '4rem',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box
            display="flex"
            sx={{
              alignItems: 'center',
            }}
          >
            <Button
              onClick={() => {
                if (user.role == Role.PARTICIPANT || !status.isLogin) {
                  router.push('/');
                } else {
                  router.push('/organizer');
                }
              }}
            >
              <Image
                alt="image"
                src="/logo-eventcreate.png"
                width={140}
                height={30}
              />
            </Button>
          </Box>
          {status.isLogin == false ? (
            <>
              <Stack direction="row" spacing={2}>
                {isMdUp && (
                  <Button
                    onClick={handleLogin}
                    style={{ borderRadius: '20px' }}
                  >
                    <Typography sx={{ fontSize: '14px', fontWeight: '700' }}>
                      Sign in
                    </Typography>
                  </Button>
                )}
                <Button
                  onClick={handleRegister}
                  sx={{ backgroundColor: 'primary.light' }}
                  style={{ borderRadius: '20px' }}
                >
                  <Avatar sx={{ width: 24, height: 24 }} />
                  <Typography
                    sx={{ fontSize: '14px', fontWeight: '700' }}
                    style={{ marginLeft: '8px', paddingRight: '6px' }}
                  >
                    Sign Up
                  </Typography>
                </Button>
              </Stack>
            </>
          ) : (
            <>
              <Stack direction="row" spacing={3} alignItems="center">
                {isMdUp && !pathname.startsWith('/organizer') && (
                  <IconButton>
                    <ConfirmationNumberIcon
                      sx={{ fontSize: '32px', color: 'primary.dark' }}
                    />
                  </IconButton>
                )}
                {user.role === Role.ORGANIZER && isMdUp && (
                  <Button
                    variant="outlined"
                    sx={{
                      borderRadius: '20px',
                      padding: '8px',
                      borderWidth: '1.5px',
                    }}
                    onClick={() => {
                      router.push('/organizer/create-event');
                    }}
                  >
                    <AddCircleIcon
                      sx={{
                        color: 'primary.main',
                        paddingRight: '0.3rem',
                      }}
                    />
                    <Typography sx={{ fontSize: '14px', fontWeight: '00' }}>
                      Create Event
                    </Typography>
                  </Button>
                )}

                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ backgroundColor: 'primary.light' }}
                  style={{ borderRadius: '20px' }}
                >
                  <Avatar src={avatarUrl} sx={{ width: 28, height: 28 }} />
                  <Typography style={{ marginLeft: '10px', fontWeight: '700' }}>
                    {user.firstname + ' ' + user.lastname}
                  </Typography>
                  <ArrowDropDownIcon />
                </IconButton>
              </Stack>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                sx={{
                  '& .MuiPaper-root': {
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Adjust the box-shadow here
                  },
                  marginTop: '5px',
                }}
              >
                {pathname.startsWith('/organizer') ? (
                  <MenuItem
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '10rem',
                      paddingTop: '0px',
                    }}
                    onClick={() => {
                      router.push('/');
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'secondary.dark',
                      }}
                    >
                      Switch to Attending
                    </Typography>
                  </MenuItem>
                ) : (
                  <MenuItem
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      width: '10rem',
                      paddingTop: '0px',
                    }}
                    onClick={() => {
                      router.push('/organizer');
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'secondary.dark',
                      }}
                    >
                      Manage Event
                    </Typography>
                  </MenuItem>
                )}
                <Divider
                  sx={{ backgroundColor: 'secondary.light' }}
                  style={{ margin: '2px', padding: '0.5px' }}
                />
                {menuItems.map((item) => (
                  <MenuItem
                    onClick={() => {
                      router.push(item.href);
                    }}
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {item.name}
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    fontSize: '16px',
                    paddingBottom: '0px',
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Box>
    </NavbarWrapper>
  );
}

export default Navbar;
