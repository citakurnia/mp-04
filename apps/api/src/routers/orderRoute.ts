import { OrderController } from '@/controllers/orderController';
import { RouteItems } from '@/interfaces/routesInterface';
import { authenticateToken } from '@/middlewares/auth/authenticateToken';
import { authorizeOrganizerRole } from '@/middlewares/auth/authorizeOrganizer';
import { Router } from 'express';

export class OrderRoute implements RouteItems {
  readonly router: Router;
  readonly path: string;
  private readonly order: OrderController;

  constructor() {
    this.router = Router();
    this.path = '/orders';
    this.order = new OrderController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // POST tickets as array of ticket data; ticketStatus = pending
    // UPDATE ticket(s) from particular transactionId; all ticketStatus = issued
    // GET tickets map by seat categories
    this.router.get(`${this.path}/ticket/:eventId`, this.order.getTickets);
    // GET all transaction per user paginated
    this.router.get(
      `${this.path}/transactions`,
      authenticateToken,
      authorizeOrganizerRole,
      this.order.getPaginatedTransactions,
    );
    // GET all transaction per user non paginated
    this.router.get(
      `${this.path}/transactions/all/:eventId`,
      authenticateToken,
      authorizeOrganizerRole,
      this.order.getAllTransactions,
    );
    // GET all transaction per event
    this.router.get(
      `${this.path}/transactions/:eventId`,
      authenticateToken,
      authorizeOrganizerRole,
      this.order.getEventTransactions,
    );
  }
}
