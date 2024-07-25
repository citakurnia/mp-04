import { $Enums } from '@prisma/client';

export interface PromotionCreateItems {
  organizerId: number;
  eventId: number;
  name: string;
  description: string;
  startedAt: Date;
  finishedAt: Date;
  type: $Enums.PromotionType;
  discount?: number;
  rewardType?: $Enums.RewardType;
  rewardValue?: number;
  rewardQuota?: number;
  rewardDurationSeconds?: number;
}

export interface PromotionInput {
  promotions: Array<PromotionCreateItems>;
}

export interface EventInputItems {
  organizerId: number;
  name: string;
  type: EventInputType;
  categoryId: number;
  cityId: number;
  description: string;
  photoPoster: string;
  address: string;
  eventTime: Date | string;
  maxBuy: number;
  seatCategories: Array<SeatCategory>;
}

export interface EventCreateItems {
  organizerId: number;
  name: string;
  type: $Enums.EventType;
  categoryId: number;
  cityId: number;
  description: string;
  photoPoster: string;
  address: string;
  eventTime: Date | string;
  maxBuy: number;
  seatCategories: Array<SeatCategory>;
}

export enum EventInputType {
  PAID_FREE_SEATING = 'PAID_FREE_SEATING',
  PAID_CATEGORY = 'PAID_CATEGORY',
  FREE = 'FREE',
}

export interface SeatCategory {
  name: string;
  price: number;
  maxSeats: number;
}
