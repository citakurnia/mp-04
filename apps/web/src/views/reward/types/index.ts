import { RewardType } from '@/views/organizer/createPromotion/types';

export interface PointItems {
  id: number;
  userId: number;
  value: number;
  used: number;
  createdAt: Date;
  expiredAt: Date;
}

export interface CouponItems {
  id: number;
  userId: number;
  promotionId: number;
  createdAt: Date;
  expiredAt: Date;
  promotion: Promotion;
}

interface Promotion {
  name: string;
  description: string;
  rewardType: RewardType;
  rewardValue: number;
  rewardQuota: number;
}
