import { PromotionType, RewardType } from '../../createPromotion/types';

export type TicketSeatCategoryItems = Map<number, Array<Ticket>>;

export interface Ticket {
  id: number;
  seatCategoryId: number;
  transactionId: number | null;
  userId: number;
  name: string;
  status: TicketStatus;
  attendance: boolean | null;
}

enum TicketStatus {
  PENDING = 'PENDING',
  ISSUED = 'ISSUED',
}

export interface Transaction {
  id: number;
  payerId: number;
  paidAmount: number;
  createdAt: Date;
  status: TransactionStatus;
}

enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface EventPropsDetail {
  id: number;
  organizerId: number;
  name: string;
  type: EventType;
  categoryId: number;
  cityId: number;
  description: string;
  photoPoster: string;
  address: string;
  eventTime: string;
  maxBuy: number;
  createdAt: Date;
  cancelled: boolean;
  seatCategory: Array<SeatCategoryProps>;
  organizer: OrganizerItems;
  city: CityItem;
  promotions: Array<PromotionProps>;
}

export interface SeatCategoryProps {
  id: number;
  name: string;
  maxSeats: number;
  price: number;
}

interface OrganizerItems {
  firstname: string;
  lastname: string;
  isVerified: boolean;
}

interface CityItem {
  name: string;
}

export interface PromotionProps {
  name: string;
  description: string;
  startedAt?: Date;
  finishedAt?: Date;
  type: PromotionType;
  discount: number;
  rewardType: RewardType;
  rewardQuota?: number;
}

enum EventType {
  PAID = 'PAID',
  FREE = 'FREE',
}
