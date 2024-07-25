import eventAction from '@/actions/eventAction';
import { HttpException } from '@/errors/httpException';
import {
  PromotionCreateItems,
  PromotionInput,
  SeatCategory,
} from '@/interfaces/eventInterface';
import { User } from '@/types/express';
import { Prisma, Promotion } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

export class EventController {
  public async createEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { file } = req;
      const { id } = req.user as User;
      const {
        name,
        type,
        categoryId,
        cityId,
        description,
        address,
        eventTime,
        maxBuy,
        seatCategoriesString,
      } = req.body;
      console.log(req.body);

      const seatCategories = JSON.parse(seatCategoriesString);
      if (!Array.isArray(seatCategories)) {
        throw new HttpException(501, 'SeatCategories must be an array');
      }

      const seatCategoriesInt: Array<SeatCategory> = seatCategories.map(
        (seatCategory) => ({
          ...seatCategory,
          maxSeats: parseInt(seatCategory.maxSeats),
          price: parseFloat(seatCategory.price),
        }),
      );

      const eventDate = new Date(eventTime);

      const photoPoster = file?.filename ? file.filename : 'eventempty.jpg';
      const result = await eventAction.createEventAction({
        organizerId: id,
        name,
        type,
        categoryId: parseInt(categoryId),
        cityId: parseInt(cityId),
        description,
        address,
        eventTime: eventDate,
        maxBuy: parseInt(maxBuy),
        seatCategories: seatCategoriesInt,
        photoPoster,
      });

      res.status(200).json({
        message: 'Create event success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public async createPromotions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;
      const eventIdNum = Number(eventId);

      await eventAction.verifyEventOrganizer(id, eventIdNum);
      const { promotions } = req.body as PromotionInput;

      const result = await eventAction.createPromotions(
        promotions,
        eventIdNum,
        id,
      );

      res.status(200).json({
        message: 'Create promotions success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getEvent(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { eventId } = req.params;

      const result = await eventAction.getEventDetails(Number(eventId));

      res.status(200).json({
        message: 'Get event details success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getEvents(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { userId } = req.params;

      const result = await eventAction.getUserEvents(Number(userId));

      res.status(200).json({
        message: 'Get all events on this user success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
