import React, { ReactNode } from 'react';
import { Box, SxProps, Theme } from '@mui/system';

import Navbar from './navbar';

const PageWrapper = ({
  children,
  sx,
}: Readonly<{
  children: ReactNode;
  sx?: SxProps<Theme>;
}>) => {
  return (
    <Box sx={sx} minHeight="100vh" minWidth="100vw">
      <Navbar />
      {children}
    </Box>
  );
};

export default PageWrapper;
