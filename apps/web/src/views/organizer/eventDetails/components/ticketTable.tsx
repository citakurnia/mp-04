import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from '@mui/material';
import { Ticket, TicketSeatCategoryItems, EventPropsDetail } from '../types'; //

interface Column {
  id: 'transactionId' | 'name' | 'seatCategoryName' | 'status' | 'attendance';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center';
}

const columns: readonly Column[] = [
  {
    id: 'transactionId',
    label: 'Transaction ID',
    minWidth: 100,
    align: 'center',
  },
  { id: 'name', label: 'Name', minWidth: 170, align: 'center' },
  {
    id: 'seatCategoryName',
    label: 'Seat Category',
    minWidth: 100,
    align: 'center',
  },
  { id: 'status', label: 'Status', minWidth: 100, align: 'center' },
  { id: 'attendance', label: 'Attendance', minWidth: 80, align: 'center' },
];

export default function TicketTable({
  combinedTickets,
}: {
  combinedTickets: Array<Ticket & { seatCategoryName: string }>;
}) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  sx={{
                    backgroundColor: 'secondary.main',
                    fontWeight: '600',
                  }}
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {combinedTickets
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((ticket) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={ticket.id}>
                    {columns.map((column) => {
                      const value = ticket[column.id];
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{ backgroundColor: 'primary.light' }}
                        >
                          {column.id == 'attendance' && value === true ? (
                            <>Yes</>
                          ) : column.id == 'attendance' && value === false ? (
                            <>No</>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={combinedTickets.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
