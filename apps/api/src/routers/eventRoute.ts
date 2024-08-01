import { EventController } from '@/controllers/eventController';
import { uploader } from '@/libs/uploader';
import { upload } from '@/libs/uploader';
import { authenticateToken } from '@/middlewares/auth/authenticateToken';
import { authorizeOrganizerRole } from '@/middlewares/auth/authorizeOrganizer';
import { Router } from 'express';
import type { RouteItems } from '@/interfaces/routesInterface';

export class EventRoute implements RouteItems {
  readonly router: Router;
  readonly path: string;
  private readonly event: EventController;

  constructor() {
    this.router = Router();
    this.path = '/events';
    this.event = new EventController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // create event (including seat category)
    this.router.post(
      `${this.path}/create`,
      uploader('event', 2000, '/events').single('file'),
      authenticateToken,
      authorizeOrganizerRole,
      this.event.createEvent,
    );
    // create promotion for particular event
    this.router.post(
      `${this.path}/promotion/:eventId`,
      upload.none(),
      authenticateToken,
      authorizeOrganizerRole,
      this.event.createPromotions,
    );
    // fetch all events (include filter and pagination), show: name, photo, time, city, category
    this.router.get(`${this.path}/`);
    // fetch all events from userId
    this.router.get(
      `${this.path}/:userId`,
      authenticateToken,
      authorizeOrganizerRole,
      this.event.getEvents,
    );
    // single event details for front-end
    this.router.get(`${this.path}/detail/:eventId`, this.event.getEvent);
    this.router.delete(`${this.path}/:eventId`);
  }
}
