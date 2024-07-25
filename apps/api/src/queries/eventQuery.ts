import { HttpException } from '@/errors/httpException';
import {
  EventCreateItems,
  EventInputItems,
  PromotionCreateItems,
} from '@/interfaces/eventInterface';
import prisma from '@/prisma';
import { $Enums, Event, Prisma, Promotion } from '@prisma/client';

class EventQuery {
  public async createEvent(event: EventCreateItems): Promise<Event> {
    try {
      //   console.log(event.seatCategories);
      const result: Event = await prisma.event.create({
        data: {
          organizerId: event.organizerId,
          name: event.name,
          type: event.type,
          categoryId: event.categoryId,
          cityId: event.cityId,
          description: event.description,
          photoPoster: event.photoPoster,
          address: event.address,
          eventTime: event.eventTime,
          maxBuy: event.maxBuy,
          createdAt: new Date(),
          cancelled: false,
          seatCategory: {
            create: event.seatCategories.map((seatCategory) => ({
              name: seatCategory.name,
              maxSeats: seatCategory.maxSeats,
              price: seatCategory.price,
            })),
          },
        },
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  public async createPromotions(
    promotions: Array<PromotionCreateItems>,
    eventIdNum: number,
    organizerId: number,
  ): Promise<Array<Promotion>> {
    try {
      const result = await prisma.$transaction(async (prisma) => {
        const createdPromotions = await Promise.all(
          promotions.map(async (promotion): Promise<Promotion> => {
            // if promotion type = referral, no no addy
            // if promotion type = attendee, one only, no no addy
            // check date
            // if promotion type = attendee, no isi discount
            // coupon percent, value < 100
            // if promotion type = time_based, discount must, no isi rewardtype, value, quota, duration
            return await prisma.promotion.create({
              data: {
                ...promotion,
                rewardDurationSeconds: Number(promotion.rewardDurationSeconds),
                rewardQuota: Number(promotion.rewardQuota),
                rewardValue: Number(promotion.rewardValue),
                discount: Number(promotion.discount),
                eventId: eventIdNum,
                organizerId: organizerId,
                createdAt: new Date(),
              },
            });
          }),
        );

        return createdPromotions;
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  public async findOrganizerIdbyEventId(eventId: number): Promise<number> {
    try {
      const user = await prisma.event.findFirst({
        where: {
          id: eventId,
        },
        select: {
          organizerId: true,
        },
      });
      if (user == null) {
        throw new HttpException(505, 'Event organizer not found');
      }

      return user.organizerId;
    } catch (err) {
      throw err;
    }
  }

  public async getEventDetailsById(eventId: number): Promise<Event> {
    try {
      const now = new Date();
      const event = await prisma.event.findFirst({
        where: {
          id: eventId,
          eventTime: {
            gte: now,
          },
        },
        include: {
          seatCategory: {
            select: {
              name: true,
              maxSeats: true,
              price: true,
            },
          },
          organizer: {
            select: {
              firstname: true,
              lastname: true,
              isVerified: true,
            },
          },
          city: {
            select: {
              name: true,
            },
          },
          promotions: true,
        },
      });

      if (event == null) {
        throw new HttpException(505, 'Event not found');
      }

      return event;
    } catch (err) {
      throw err;
    }
  }

  public async getEventsByUserId(userId: number): Promise<Array<Event>> {
    try {
      const events: Array<Event> = await prisma.event.findMany({
        where: {
          organizerId: userId,
        },
        orderBy: {
          eventTime: 'desc',
        },
      });
      return events;
    } catch (err) {
      throw err;
    }
  }
}

export default new EventQuery();
