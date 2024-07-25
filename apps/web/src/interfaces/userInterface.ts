import { Role } from '@/views/register/types';

export interface IUsers {
  email: string;
  password: string;
  avatar?: File | null;
}

export type User = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  isVerified: boolean;
  role: Role;
  avatar: string;
};
