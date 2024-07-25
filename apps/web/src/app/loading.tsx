import { ReactNode } from 'react';
import { CircularProgress } from '@mui/material';

export default function Loading(): ReactNode {
  return (
    <div className="flex justify-center items-center h-screen">
      <CircularProgress />
    </div>
  );
}
