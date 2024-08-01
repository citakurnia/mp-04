import { transcode } from 'buffer';
import { Transaction } from '../types';
import { Box, Typography } from '@mui/material';

export default function TransactionData({
  transactions,
}: {
  transactions: Array<Transaction>;
}) {
  const totalAmount = transactions.reduce(
    (sum, transaction) => sum + transaction.paidAmount,
    0,
  );
  return (
    <>
      <Box height={15} />
      <Typography fontSize="18px" fontWeight="600" color="primary.main">
        Total Transaction
      </Typography>
      <Typography>Rp {totalAmount}</Typography>
    </>
  );
}
