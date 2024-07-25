import { Router } from 'express';
import type { RouteItems } from '@/interfaces/routesInterface';
import { ReferralController } from '@/controllers/referralController';

export class ReferralRoute implements RouteItems {
  readonly router: Router;
  readonly path: string;
  private readonly referral: ReferralController;

  constructor() {
    this.router = Router();
    this.path = '/referral';
    this.referral = new ReferralController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // include total points
    this.router.get(
      `${this.path}/:referralCode`,
      this.referral.isReferralValid,
    );
  }
}
