export interface FormValues {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: Role;
  referralCode?: string;
}

export enum Role {
  PARTICIPANT = 'PARTICIPANT',
  ORGANIZER = 'ORGANIZER',
}

export interface FormProps {
  initialEmail?: string;
  initialPassword?: string;
  initialFirstname?: string;
  initialLastname?: string;
  initialRole?: Role;
  referralCode?: string;
}
