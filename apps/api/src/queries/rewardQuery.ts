import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';
import { $Enums, Coupon, Point, Promotion } from '@prisma/client';

class RewardQuery {
  public async getPromotion(
    type: $Enums.PromotionType,
    date: Date,
    eventId?: number,
  ): Promise<Promotion | null> {
    try {
      const promotion = await prisma.promotion.findFirst({
        where: {
          type: type,
          eventId: eventId,
          startedAt: {
            lte: date,
          },
          finishedAt: {
            gte: date,
          },
        },
      });

      return promotion;
    } catch (err) {
      throw new HttpException(505, "Can't find promotion");
    }
  }

  public async createPoint(
    userId: number,
    value: number,
    createdAt: Date,
    expiredAt: Date,
  ): Promise<Point> {
    try {
      const point = await prisma.point.create({
        data: {
          userId,
          value,
          createdAt,
          expiredAt,
        },
      });

      return point;
    } catch (err) {
      throw new HttpException(505, "Can't create point");
    }
  }

  public async createCoupon(
    userId: number,
    promotionId: number,
    createdAt: Date,
    expiredAt: Date,
  ): Promise<Coupon> {
    try {
      const coupon = await prisma.coupon.create({
        data: {
          userId,
          promotionId,
          createdAt,
          expiredAt,
        },
      });

      return coupon;
    } catch (err) {
      throw new HttpException(505, "Can't create coupon");
    }
  }

  public async getCouponsByUserId(userId: number): Promise<Array<Coupon>> {
    try {
      const now = new Date();

      const coupons = await prisma.coupon.findMany({
        where: {
          userId,
          expiredAt: {
            gte: now,
          },
          status: $Enums.CouponStatus.UNUSED,
        },
        include: {
          promotion: {
            select: {
              name: true,
              description: true,
              rewardType: true,
              rewardValue: true,
              rewardQuota: true,
            },
          },
        },
      });

      return coupons;
    } catch (err) {
      throw err;
    }
  }

  public async getPointsByUserId(userId: number): Promise<Array<Point>> {
    try {
      const now = new Date();

      const points = await prisma.point.findMany({
        where: {
          userId,
          expiredAt: {
            gte: now,
          },
        },
      });

      const availablePoints = points.filter(
        (point) => point.used < point.value,
      );

      return availablePoints;
    } catch (err) {
      throw err;
    }
  }
}

export default new RewardQuery();
