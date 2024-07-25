import { $Enums } from '@prisma/client';

export type User = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  isVerified: boolean;
  role: $Enums.Role;
  avatar: string;
};

declare global {
  namespace Express {
    export interface Request {
      user?: User;
    }
  }
}
