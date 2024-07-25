import referralAction from '@/actions/referralAction';
import { HttpException } from '@/errors/httpException';
import { Request, Response, NextFunction } from 'express';

export class ReferralController {
  public async isReferralValid(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { referralCode } = req.params;
      const result = await referralAction.getReferral(referralCode);

      res.status(200).json({
        message: 'Referral valid',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}
