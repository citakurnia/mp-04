import { HttpException } from '@/errors/httpException';
import prisma from '@/prisma';

class ReferralQuery {
  public async getReferrerId(referral: string): Promise<number> {
    try {
      const user = await prisma.user.findUnique({
        select: { id: true },
        where: {
          referral,
        },
      });

      if (user == null) {
        throw new HttpException(501, 'Referral code is invalid');
      }

      return user.id;
    } catch (err) {
      throw err;
    }
  }
}

export default new ReferralQuery();
