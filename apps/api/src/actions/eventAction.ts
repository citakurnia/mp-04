import { HttpException } from '@/errors/httpException';
import {
  EventInputItems,
  EventInputType,
  PromotionCreateItems,
  PromotionInput,
  SeatCategory,
} from '@/interfaces/eventInterface';
import eventQuery from '@/queries/eventQuery';
import { Event, EventType, Prisma, Promotion } from '@prisma/client';

class EventAction {
  public async verifyEventOrganizer(userId: number, eventId: number) {
    try {
      const eventOrganizerId =
        await eventQuery.findOrganizerIdbyEventId(eventId);

      if (userId !== eventOrganizerId) {
        throw new HttpException(505, 'Unauthorize event organizer');
      }
    } catch (err) {
      throw err;
    }
  }

  public async createEventAction(event: EventInputItems): Promise<Event> {
    try {
      let seatCategories: Array<SeatCategory> = [];
      let type: EventType = EventType.FREE;

      const seatCategory = event.seatCategories[0];

      if (
        event.type == EventInputType.FREE ||
        event.type == EventInputType.PAID_FREE_SEATING
      ) {
        if (event.seatCategories.length !== 1) {
          throw new HttpException(502, 'Seat category must be one');
        }

        if (event.type == EventInputType.FREE) {
          seatCategories.push({
            name: 'Free',
            price: 0,
            maxSeats: seatCategory.maxSeats,
          });
          type = EventType.FREE;
        } else {
          seatCategories.push({
            name: 'Paid and Free Seating',
            price: seatCategory.price,
            maxSeats: seatCategory.maxSeats,
          });
          type = EventType.PAID;
        }
      } else if (event.type == EventInputType.PAID_CATEGORY) {
        if (event.seatCategories.length < 2) {
          throw new HttpException(
            502,
            'Seat category must at least contain 2 categories',
          );
        }

        event.seatCategories.forEach((seatCategory) => {
          if (seatCategory.price == undefined || seatCategory.price <= 0) {
            throw new HttpException(
              502,
              'Price must not be empty and greater than 0',
            );
          }

          seatCategories = [...event.seatCategories];
        });

        type = 'PAID';
      }

      const result = await eventQuery.createEvent({
        ...event,
        seatCategories,
        type,
      });

      return result;
    } catch (err) {
      throw err;
    }
  }

  public async createPromotions(
    promotions: Array<PromotionCreateItems>,
    eventId: number,
    userId: number,
  ): Promise<Array<Promotion>> {
    try {
      const result = await eventQuery.createPromotions(
        promotions,
        eventId,
        userId,
      );

      return result;
    } catch (err) {
      throw err;
    }
  }

  public async getEventDetails(eventId: number): Promise<Event> {
    try {
      const result = await eventQuery.getEventDetailsById(eventId);

      return result;
    } catch (err) {
      throw err;
    }
  }

  public async getUserEvents(userId: number): Promise<Array<Event>> {
    try {
      const result = await eventQuery.getEventsByUserId(userId);

      return result;
    } catch (err) {
      throw err;
    }
  }
}

export default new EventAction();
