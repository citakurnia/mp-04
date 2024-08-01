import { SeatCategory, Ticket, Transaction } from '@prisma/client';

export type TicketSeatCategoryItems = SeatCategory & {
  ticket: Array<Ticket>;
};

export type TransactionItems = Transaction & {
  payer: { email: string; id: number };
};
