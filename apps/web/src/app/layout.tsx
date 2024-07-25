import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import StoreProvider from './StoreProvider';

import { ThemeProvider } from '@mui/material/styles';
import theme from '@/theme/theme';

export const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
});

const metadata: Metadata = {
  title: 'Event Create',
  description: 'Mini project purwadhika',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <ThemeProvider theme={theme}>
          <StoreProvider>{children}</StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
