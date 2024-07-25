import { $Enums } from '@prisma/client';

export interface UserItems {
  id?: number;
  role: $Enums.Role;
  referral: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  avatarFilename: string;
  referrerId?: number;
  isVerified?: boolean;
  createdAt?: Date | string;
  modifiedAt?: Date | string;
}
