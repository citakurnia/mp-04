export interface CreatePromotionValues {
  name: string;
  description: string;
  startedAt?: Date;
  finishedAt?: Date;
  type: PromotionType;
  discount: number;
  rewardType: RewardType;
  rewardQuota?: number;
}

export interface CreatePromotionsValues {
  promotions: Array<CreatePromotionValues>;
}

export interface CreatePromotionsProps {
  promotions: Array<CreatePromotionProps>;
}

export enum PromotionType {
  'Attendee Referral' = 'ATTENDEE_REFERRAL',
  'Time-based' = 'TIME_BASED_DISCOUNT',
}

export enum RewardType {
  'Coupon Percent' = 'COUPON_PERCENT',
  'Coupon Flat' = 'COUPON_FLAT',
}

export interface CreatePromotionProps {
  initialName?: string;
  initialDescription?: string;
  initialStartedAt?: Date;
  initialFinishedAt?: Date;
  initialType: PromotionType;
  initialDiscount: number;
  initialRewardType: RewardType;
  initialRewardQuota?: number;
}
