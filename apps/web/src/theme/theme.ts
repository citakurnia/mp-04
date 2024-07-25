'use client';
import { createTheme } from '@mui/material/styles';

import { lato } from '@/app/layout';

const theme = createTheme({
  palette: {
    primary: {
      main: '#022033', // black blue
      light: 'rgb(211, 47, 35, 0.2)', // red
      dark: '#d32f23',
    },
    secondary: {
      main: '#ffae4b', // orange
      light: '#fac584',
    },
    background: {
      default: '#f1efe7',
    },
    info: {
      main: '#107faa', // blue
      light: '#d9f8ff',
    },
  },
  typography: {
    allVariants: {
      fontFamily: lato.style.fontFamily,
    },
    button: {
      textTransform: 'none',
    },
  },
});

export default theme;
