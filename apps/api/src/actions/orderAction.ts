import {
  TicketSeatCategoryItems,
  TransactionItems,
} from '@/interfaces/orderInterface';
import orderQuery from '@/queries/orderQuery';
import { Transaction } from '@prisma/client';

class OrderAction {
  public async getTickets(
    eventId: number,
  ): Promise<Array<TicketSeatCategoryItems>> {
    try {
      const result =
        await orderQuery.getTicketPerSeatCategoryByEventId(eventId);

      return result;
    } catch (err) {
      throw err;
    }
  }

  public async getAllTransactions(
    eventId: number,
  ): Promise<Array<Transaction>> {
    try {
      const result = await orderQuery.getTransactionsForEvent(eventId);

      return result;
    } catch (err) {
      throw err;
    }
  }

  public async getPaginatedAllTransactions(
    userId: number,
    page: number,
    pageSize: number,
    eventId: string,
    sortBy: string,
  ): Promise<
    Array<{
      transaction: TransactionItems;
      eventId: number;
    }>
  > {
    try {
      const result = await orderQuery.getPaginatedAllTransactionsForUser(
        userId,
        page,
        pageSize,
        eventId,
        sortBy,
      );

      return result;
    } catch (err) {
      throw err;
    }
  }

  public async getPaginatedEventTransactions(
    eventId: number,
    page: number,
    pageSize: number,
  ): Promise<Array<TransactionItems>> {
    try {
      const result = await orderQuery.getPaginatedTransactionsForEvent(
        Number(eventId),
        page,
        pageSize,
      );

      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default new OrderAction();
