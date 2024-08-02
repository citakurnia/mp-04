import { Role } from '@/views/register/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type User = {
  id: number | null;
  email: string;
  firstname: string;
  lastname: string;
  isVerified: boolean;
  avatar: string;
  role: Role | null;
  referral: string;
};

type Status = {
  isLogin: boolean;
};

interface Auth {
  user: User;
  status: Status;
}

const initialState: Auth = {
  user: {
    id: null,
    email: '',
    isVerified: false,
    avatar: '',
    lastname: '',
    firstname: '',
    role: null,
    referral: '',
  },
  status: {
    isLogin: false,
  },
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginState: (state: Auth, action: PayloadAction<User>) => {
      const user = action.payload;
      state.user = user;
      state.status.isLogin = true;
    },
    logoutState: (state: Auth) => {
      state.user = initialState.user;
      state.status = initialState.status;
    },
  },
});

export const { loginState, logoutState } = authSlice.actions;

export default authSlice.reducer;
