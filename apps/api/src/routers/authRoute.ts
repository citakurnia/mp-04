import { Router } from 'express';
import type { RouteItems } from '@/interfaces/routesInterface';
import { AuthController } from '@/controllers/authController';
import { uploader } from '@/libs/uploader';
import { authenticateToken } from '@/middlewares/auth/authenticateToken';

export class AuthRoute implements RouteItems {
  readonly router: Router;
  readonly path: string;
  private readonly auth: AuthController;

  constructor() {
    this.router = Router();
    this.path = '/auth';
    this.auth = new AuthController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      `${this.path}/register`,
      uploader('avatar', 1024, '/avatars').single('file'),
      this.auth.register,
    );
    this.router.post(`${this.path}/login`, this.auth.login);
    this.router.get(
      `${this.path}/verify`,
      authenticateToken,
      this.auth.verifyUser,
    );
    this.router.get(`${this.path}/`, authenticateToken, this.auth.refreshToken);
  }
}
