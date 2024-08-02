import { HttpException } from '@/errors/httpException';
import {
  TicketSeatCategoryItems,
  TransactionItems,
} from '@/interfaces/orderInterface';
import prisma from '@/prisma';
import { SeatCategory, Ticket, Transaction } from '@prisma/client';
import eventQuery from './eventQuery';
import { format, startOfWeek, endOfWeek, startOfYear } from 'date-fns';

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
    pageSize: number = 15,
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
    eventId: string,
    sortBy: string,
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

      let eventIds = events.map((event) => event.id);
      if (eventId !== 'None') {
        eventIds = [Number(eventId)];
      }

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
          createdAt: sortBy == 'desc' ? 'desc' : 'asc',
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

  public async getAggregatedDataTransaction(period: string, userId: number) {
    const formatDate = (date: Date, period: string) => {
      switch (period) {
        case 'daily':
          return format(date, 'MM-dd');
        case 'weekly':
          return (
            format(startOfWeek(date, { weekStartsOn: 1 }), 'MM-dd') +
            ' to ' +
            format(endOfWeek(date, { weekStartsOn: 1 }), 'MM-dd')
          );
        case 'yearly':
          return format(startOfYear(date), 'yyyy');
        default:
          throw new Error('Invalid period');
      }
    };
    console.log(period);

    // Retrieve all transactions
    const transactions = await prisma.transaction.findMany({
      where: {
        tickets: {
          some: {
            seatCategory: {
              eventId: {
                in: (
                  await prisma.event.findMany({
                    where: {
                      organizerId: userId,
                    },
                    select: {
                      id: true,
                    },
                  })
                ).map((event) => event.id),
              },
            },
          },
        },
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
      },
    });

    const aggregatedData: {
      [key: string]: { totalAmount: number; totalTransactions: number };
    } = {};

    transactions.forEach((transaction) => {
      const date = new Date(transaction.createdAt);
      let periodKey: string;

      switch (period) {
        case 'daily':
          periodKey = formatDate(date, 'daily');
          break;
        case 'weekly':
          periodKey = formatDate(date, 'weekly');
          break;
        case 'yearly':
          periodKey = formatDate(date, 'yearly');
          break;
        default:
          throw new Error('Invalid period');
      }

      if (!aggregatedData[periodKey]) {
        aggregatedData[periodKey] = { totalAmount: 0, totalTransactions: 0 };
      }

      aggregatedData[periodKey].totalAmount += transaction.paidAmount;
      aggregatedData[periodKey].totalTransactions += 1;
    });

    const labels = Object.keys(aggregatedData);
    const dataAmount = labels.map((label) => aggregatedData[label].totalAmount);
    const dataCount = labels.map(
      (label) => aggregatedData[label].totalTransactions,
    );

    return {
      totalAmount: {
        labels,
        datasets: [
          {
            label: 'Total Amount',
            data: dataAmount,
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      },
      totalTransactions: {
        labels,
        datasets: [
          {
            label: 'Total Transactions',
            data: dataCount,
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
          },
        ],
      },
    };
  }
}

export default new OrderQuery();
