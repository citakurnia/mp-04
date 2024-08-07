import { Dispatch } from '@reduxjs/toolkit';
import { IUsers, User } from '@/interfaces/userInterface';
import parseJWT from '@/utils/parseJwt';
import instance from '@/utils/axiosIntance';
import { deleteCookie, getCookie } from 'cookies-next';
import { loginState, logoutState } from '@/libs/features/auth/authSlice';
import { AxiosError } from 'axios';

export const login = ({ email, password }: IUsers) => {
  return async (dispatch: Dispatch) => {
    try {
      await instance().post('/auth/login', {
        email,
        password,
      });
      const access_token = getCookie('access-token') || '';

      if (access_token) {
        const user: User = parseJWT(access_token);
        dispatch(loginState(user));
      }

      return;
    } catch (err) {
      if (err instanceof AxiosError) {
        deleteCookie('access-token');
        deleteCookie('refresh-token');
        throw new Error(`${err.response?.data.message}`);
      }
      throw new Error('Login failed');
    }
  };
};

export const logout = () => {
  return async (dispatch: Dispatch) => {
    try {
      deleteCookie('access-token');
      deleteCookie('refresh-token');
      dispatch(logoutState());

      return {
        success: true,
        message: 'success',
      };
    } catch (err) {
      if (err instanceof Error) {
        return err.message;
      }
    }
  };
};

export const keepLogin = () => {
  return async (dispatch: Dispatch) => {
    try {
      const token = getCookie('access-token');

      if (token == undefined) {
        deleteCookie('refresh-token');
        dispatch(logoutState());
        throw new Error('Token not found');
      }

      const user = parseJWT(token) as User;

      if (user.email) {
        dispatch(loginState(user));
      }

      return {
        success: true,
        message: 'success',
      };
    } catch (err) {
      if (err instanceof Error) {
        return err.message;
      }
    }
  };
};
