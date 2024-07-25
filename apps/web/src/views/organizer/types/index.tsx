export interface EventProps {
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
}

enum EventType {
  PAID = 'PAID',
  FREE = 'FREE',
}
