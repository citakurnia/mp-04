import axios, { AxiosInstance } from 'axios';
import { getCookie } from 'cookies-next';

export function instance(): AxiosInstance {
  const token = getCookie('access-token') || '';
  // const token2 = getCookie('refresh-token');
  // console.log(`token access: ${token}, token refresh: ${token2}`);
  return axios.create({
    baseURL: process.env.API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
}

export default instance;
