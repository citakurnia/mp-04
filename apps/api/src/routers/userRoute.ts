import { Router } from 'express';
import type { RouteItems } from '@/interfaces/routesInterface';
import { authenticateToken } from '@/middlewares/auth/authenticateToken';

export class UserRoute implements RouteItems {
  readonly router: Router;
  readonly path: string;

  constructor() {
    this.router = Router();
    this.path = '/user';
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // include total points
    this.router.get(`${this.path}/:id`);
    this.router.get(`${this.path}/points/:id`);
    this.router.get(`${this.path}/rewards/:id`);
    this.router.patch(`${this.path}/:id`);
    this.router.delete(`${this.path}/:id`);
  }
}
