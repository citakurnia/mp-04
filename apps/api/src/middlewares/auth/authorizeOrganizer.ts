import { Request, Response, NextFunction } from 'express';
import { HttpException } from '@/errors/httpException';
import { User } from '@/types/express';
import { $Enums } from '@prisma/client';

export async function authorizeOrganizerRole(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const { role } = req.user as User;

    if (role != $Enums.Role.ORGANIZER) {
      throw new HttpException(501, 'This user is not an organizer');
    }

    next();
  } catch (err) {
    next(err);
  }
}
