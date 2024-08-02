import eventAction from '@/actions/eventAction';
import orderAction from '@/actions/orderAction';
import { HttpException } from '@/errors/httpException';
import { User } from '@/types/express';
import { Request, Response, NextFunction } from 'express';

export class OrderController {
  public async getTickets(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { eventId } = req.params;

      const result = await orderAction.getTickets(Number(eventId));

      res.status(200).json({
        message: 'Get tickets success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getAllTransactions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const { eventId } = req.params;

      await eventAction.verifyEventOrganizer(id, Number(eventId));
      const result = await orderAction.getAllTransactions(Number(eventId));

      res.status(200).json({
        message: `Get all transactions success`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getPaginatedTransactions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const { page = 1, pageSize = 15, eventId, sortBy } = req.query;
      const result = await orderAction.getPaginatedAllTransactions(
        id,
        Number(page),
        Number(pageSize),
        String(eventId),
        String(sortBy),
      );

      res.status(200).json({
        message: `Get transactions for page ${page} success`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public async getEventTransactions(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.user as User;
      const { page = 1, pageSize = 15 } = req.query;
      const { eventId } = req.params;

      await eventAction.verifyEventOrganizer(id, Number(eventId));

      const result = await orderAction.getPaginatedEventTransactions(
        Number(eventId),
        Number(page),
        Number(pageSize),
      );

      res.status(200).json({
        message: `Get transactions for page ${page} success`,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
