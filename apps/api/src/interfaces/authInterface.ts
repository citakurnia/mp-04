import { $Enums } from '@prisma/client';

export interface AuthItems {
  email: string;
  password: string;
  role: $Enums.Role;
  avatarFilename: string;
  firstname: string;
  lastname: string;
  referralCode?: string;
}
