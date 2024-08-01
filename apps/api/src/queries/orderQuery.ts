import { HttpException } from '@/errors/httpException';
import {
  TicketSeatCategoryItems,
  TransactionItems,
} from '@/interfaces/orderInterface';
import prisma from '@/prisma';
import { SeatCategory, Ticket, Transaction } from '@prisma/client';
import eventQuery from './eventQuery';

class OrderQuery {
  public async getTicketPerSeatCategoryByEventId(
    eventId: number,
  ): Promise<Array<TicketSeatCategoryItems>> {
    try {
      const seatCategoriesAndTickets =
        await this.getSeatCategoriesByEventId(eventId);

      return seatCategoriesAndTickets;
    } catch (err) {
      throw new HttpException(503, 'Unable to get ticket details');
    }
  }

  private async getSeatCategoriesByEventId(
    eventId: number,
  ): Promise<Array<TicketSeatCategoryItems>> {
    try {
      const seatCategories = await prisma.seatCategory.findMany({
        where: {
          eventId: eventId,
        },
        include: {
          ticket: true,
        },
      });

      return seatCategories;
    } catch (err) {
      throw new HttpException(503, 'Unable to get seat categories data');
    }
  }

  public async getTransactionsForEvent(
    eventId: number,
  ): Promise<Array<Transaction>> {
    try {
      const transactions = await prisma.transaction.findMany({
        distinct: ['id'],
        where: {
          tickets: {
            some: {
              seatCategory: {
                eventId: eventId,
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return transactions;
    } catch (err) {
      throw new HttpException(503, 'Unable to get transactions for the event');
    }
  }

  public async getPaginatedTransactionsForEvent(
    eventId: number,
    page: number = 1,
    pageSize: number = 12,
  ): Promise<Array<TransactionItems>> {
    try {
      const skip = (page - 1) * pageSize;

      const transactions = await prisma.transaction.findMany({
        distinct: ['id'],
        where: {
          tickets: {
            some: {
              seatCategory: {
                eventId: eventId,
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: skip,
        take: pageSize,
        include: {
          payer: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      return transactions;
    } catch (err) {
      throw new HttpException(
        503,
        'Unable to get paginated transactions for the event',
      );
    }
  }

  public async getPaginatedAllTransactionsForUser(
    userId: number,
    page: number = 1,
    pageSize: number = 12,
  ): Promise<
    Array<{
      transaction: TransactionItems;
      eventId: number;
    }>
  > {
    try {
      const events = await prisma.event.findMany({
        where: {
          organizerId: userId,
        },
        select: {
          id: true,
        },
      });

      const eventIds = events.map((event) => event.id);

      const transactions = await prisma.transaction.findMany({
        where: {
          tickets: {
            some: {
              seatCategory: {
                eventId: {
                  in: eventIds,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          tickets: {
            include: {
              seatCategory: {
                select: {
                  eventId: true,
                },
              },
            },
          },
          payer: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
      });

      const result = transactions.map((transaction) => {
        const eventId = transaction.tickets[0].seatCategory.eventId;

        return {
          transaction,
          eventId,
        };
      });

      return result;
    } catch (err) {
      throw new HttpException(
        503,
        'Unable to get all transactions for the user',
      );
    }
  }
}

export default new OrderQuery();
