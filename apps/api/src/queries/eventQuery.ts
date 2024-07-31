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
        let attendeeCount = 0;
        const timeBasedStartAt: Array<Date> = [];
        const timeBasedFinishAt: Array<Date> = [];

        function checkOverlap(date: Date, index: number) {
          if (
            date > timeBasedStartAt[index] &&
            date < timeBasedFinishAt[index]
          ) {
            throw new HttpException(
              502,
              'Invalid date, time-based timeline overlap',
            );
          }
        }

        const createdPromotions = await Promise.all(
          promotions.map(async (promotion): Promise<Promotion> => {
            if (promotion.type == $Enums.PromotionType.ATTENDEE_REFERRAL) {
              attendeeCount++;
            }

            if (attendeeCount > 1) {
              throw new HttpException(
                502,
                "Can't add more than 1 attendee promotion",
              );
            }

            if (promotion.startedAt >= promotion.finishedAt) {
              throw new HttpException(
                505,
                'Start date is greater or equal to finish date',
              );
            }

            if (
              (promotion.type == $Enums.PromotionType.SIGN_UP_BONUS_REFEREE ||
                promotion.type ==
                  $Enums.PromotionType.SIGN_UP_BONUS_REFERRER) &&
              organizerId !== 1
            ) {
              throw new HttpException(
                502,
                "You're not allowed to add on this type of promotion",
              );
            }

            if (promotion.type == $Enums.PromotionType.TIME_BASED_DISCOUNT) {
              timeBasedStartAt.map((_, index) => {
                checkOverlap(promotion.startedAt, index);
                checkOverlap(promotion.finishedAt, index);
              });

              timeBasedStartAt.push(promotion.startedAt);
              timeBasedFinishAt.push(promotion.finishedAt);
            }

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

  public async checkPromotionsByEventId(
    eventId: number,
  ): Promise<Array<{ id: number }>> {
    try {
      const promotions = await prisma.promotion.findMany({
        where: {
          eventId: eventId,
        },
        select: {
          id: true,
        },
      });

      return promotions;
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
