import { RouteItems } from '@/interfaces/routesInterface';
import { Router } from 'express';

export class OrderRoute implements RouteItems {
  readonly router: Router;
  readonly path: string;
  // private readonly order: OrderController

  constructor() {
    this.router = Router();
    this.path = '/order';
  }

  private initializeRoutes() {
    // POST tickets as array of ticket data; ticketStatus = pending
    // UPDATE ticket(s) from particular transactionId; all ticketStatus = issued
  }
}
