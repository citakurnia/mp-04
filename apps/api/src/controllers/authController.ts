import { Request, Response, NextFunction } from 'express';
import authAction from '@/actions/authAction';
import type { AuthItems } from '@/interfaces/authInterface';
import type { User } from '@/types/express';

export class AuthController {
  public async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { file } = req;
      const {
        email,
        password,
        firstname,
        lastname,
        role,
        referralCode,
      }: AuthItems = req.body;

      const avatarFilename = file?.filename ? file.filename : 'avatarempty.jpg';

      const result = await authAction.registerAction({
        email,
        password,
        role,
        avatarFilename,
        firstname,
        lastname,
        referralCode,
      });

      res.status(200).json({
        message: 'Register success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  public async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password }: AuthItems = req.body;

      const result = await authAction.loginAction(email, password);

      res
        .status(200)
        .cookie('access-token', result)
        .cookie('refresh-token', result)
        .json({
          message: 'Login success',
        });
    } catch (err) {
      next(err);
    }
  }

  public async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.user as User;

      const result = await authAction.refreshTokenAction(email);

      res
        .status(200)
        .cookie('access-token', result)
        .cookie('refresh-token', result)
        .json({
          message: 'Refresh token success',
          access_token: result,
        });
    } catch (err) {
      next(err);
    }
  }

  public async verifyUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email } = req.user as User;
      await authAction.verifyAction(email);

      res.status(200).json({
        message: 'Verify success',
      });
    } catch (err) {
      next(err);
    }
  }
}
