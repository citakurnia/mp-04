import referralQuery from '@/queries/referralQuery';

class ReferralAction {
  public async getReferral(referralCode: string): Promise<number> {
    try {
      const referrerId = await referralQuery.getReferrerId(referralCode);

      return referrerId;
    } catch (err) {
      throw err;
    }
  }
}

export default new ReferralAction();
