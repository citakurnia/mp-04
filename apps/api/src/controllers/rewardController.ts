import rewardAction from '@/actions/rewardAction';
import { User } from '@/types/express';
import { Request, Response, NextFunction } from 'express';

export class RewardController {
  public async getCoupons(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.user as User;
    const result = await rewardAction.getCoupons(id);

    res.status(200).json({
      message: 'Get coupons success',
      data: result,
    });
  }

  public async getTotalPoints(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.user as User;
    const result = await rewardAction.getPoints(id);
    let totalPoint = 0;

    result.forEach((result) => {
      totalPoint += result.value - result.used;
    });

    res.status(200).json({
      message: 'Get total points success',
      data: totalPoint,
    });
  }

  public async getPoints(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const { id } = req.user as User;
    const result = await rewardAction.getPoints(id);

    res.status(200).json({
      message: 'Get points details success',
      data: result,
    });
  }
}
