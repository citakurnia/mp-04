import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@/errors/httpException';
import { API_KEY } from '@/config';
import type { User } from '@/types/express';

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token == undefined) {
      throw new HttpException(500, 'Token invalid');
    }

    try {
      const verifyUser = verify(token, String(API_KEY));
      req.user = verifyUser as User;
    } catch (err) {
      throw new HttpException(500, 'Unauthorized');
    }

    next();
  } catch (err) {
    next(err);
  }
}
