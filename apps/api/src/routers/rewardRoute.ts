import { RewardController } from '@/controllers/rewardController';
import { RouteItems } from '@/interfaces/routesInterface';
import { authenticateToken } from '@/middlewares/auth/authenticateToken';
import { Router } from 'express';

export class RewardRoute implements RouteItems {
  readonly router: Router;
  readonly path: string;
  private readonly reward: RewardController;

  constructor() {
    this.router = Router();
    this.path = '/rewards';
    this.reward = new RewardController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `${this.path}/coupons`,
      authenticateToken,
      this.reward.getCoupons,
    );
    this.router.get(
      `${this.path}/points`,
      authenticateToken,
      this.reward.getPoints,
    );
  }
}
