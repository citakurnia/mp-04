export interface CreateFormValues {
  name: string;
  type: EventInputType;
  categoryId: EventCategory;
  cityId: City;
  description: string;
  address: string;
  eventTime: Date;
  maxBuy: number;
  seatCategories: Array<SeatCategory>;
}

export interface SeatCategory {
  name: string;
  price: number;
  maxSeats: number;
}

export enum Role {
  PARTICIPANT = 'PARTICIPANT',
  ORGANIZER = 'ORGANIZER',
}

export enum EventInputType {
  'PAID & FREE SEATING' = 'PAID_FREE_SEATING',
  'PAID WITH SEAT CATEGORY' = 'PAID_CATEGORY',
  'FREE' = 'FREE',
}

export enum City {
  JAKARTA = '1',
  BANDUNG = '2',
  SURABAYA = '3',
  PALEMBANG = '4',
  MEDAN = '5',
  PONTIANAK = '6',
  MAKASSAR = '7',
  MANADO = '8',
  PEKANBARU = '9',
  PADANG = '10',
  DENPASAR = '11',
  SURAKARTA = '12',
  MALANG = '13',
  PALU = '14',
  LAMPUNG = '15',
}

export enum EventCategory {
  COOKING = '1',
  MUSIC = '2',
  BUSINESS = '3',
  SPORT = '4',
  COMMUNITY = '5',
  CONFERENCE = '6',
  ART = '7',
}

export interface CreateFormProps {
  intialName?: string;
  initialType?: EventInputType;
  initialCategoryId?: EventCategory;
  initialCityId?: City;
  initialDescription?: string;
  initialAddress?: string;
  initialEventTime?: Date;
  initialMaxBuy?: number;
  initialSeatCategories?: Array<SeatCategory>;
}
