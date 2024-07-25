import { HttpException } from '@/errors/httpException';
import rewardQuery from '@/queries/rewardQuery';
import { $Enums, Coupon, Point, Promotion } from '@prisma/client';

class RewardAction {
  public async createReferralReward(
    referrerId: number,
    refereeId: number,
  ): Promise<void> {
    try {
      const [promotionReferrer, promotionReferee] = await Promise.all([
        this.findAvailablePromotion(
          $Enums.PromotionType.SIGN_UP_BONUS_REFERRER,
        ),
        this.findAvailablePromotion($Enums.PromotionType.SIGN_UP_BONUS_REFEREE),
      ]);

      if (promotionReferee !== null && promotionReferrer !== null) {
        await Promise.all([
          this.createPoint(
            referrerId,
            promotionReferrer.rewardValue,
            promotionReferrer.rewardDurationSeconds,
          ),
          this.createCoupon(
            refereeId,
            promotionReferee.id,
            promotionReferee.rewardDurationSeconds,
          ),
        ]);
      } else {
        throw new HttpException(505, 'Referral promotion not found');
      }
    } catch (err) {
      throw err;
    }
  }

  public async findAvailablePromotion(
    type: $Enums.PromotionType,
    eventId?: number,
  ): Promise<Promotion | null> {
    const now = new Date();
    return await rewardQuery.getPromotion(type, now, eventId);
  }

  public async getTimeBasedReward() {}

  // coupon for PromotionType other than time-based
  public async createCoupon(
    userId: number,
    promotionId: number,
    duration: number | null,
    finishedAt?: Date,
  ): Promise<Coupon> {
    try {
      const now = new Date();
      let expiredAt: Date | null = null;

      if (duration !== null && duration !== undefined) {
        expiredAt = new Date(now.getTime() + duration * 1000);
      } else if (finishedAt) {
        expiredAt = finishedAt;
      }

      if (expiredAt != null) {
        const coupon = await rewardQuery.createCoupon(
          userId,
          promotionId,
          now,
          expiredAt,
        );

        return coupon;
      }
      throw new HttpException(505, 'Expiration date is invalid');
    } catch (err) {
      throw err;
    }
  }

  private async createPoint(
    userId: number,
    value: number | null,
    duration: number | null,
  ): Promise<Point> {
    try {
      const now = new Date();
      let expiredAt: Date | null = null;

      if (duration !== null && value !== null) {
        expiredAt = new Date(now.getTime() + duration * 1000);

        const point = await rewardQuery.createPoint(
          userId,
          value,
          now,
          expiredAt,
        );

        return point;
      }
      throw new HttpException(501, 'Point duration and/or value invalid');
    } catch (err) {
      throw err;
    }
  }

  public async getCoupons(userId: number): Promise<Array<Coupon>> {
    try {
      const coupons = await rewardQuery.getCouponsByUserId(userId);

      return coupons;
    } catch (err) {
      throw err;
    }
  }

  public async getPoints(userId: number): Promise<Array<Point>> {
    try {
      const points = await rewardQuery.getPointsByUserId(userId);

      return points;
    } catch (err) {
      throw err;
    }
  }
}

export default new RewardAction();
