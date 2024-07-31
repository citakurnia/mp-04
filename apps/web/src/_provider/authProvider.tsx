'use client';

import React, { useEffect } from 'react';
import { useAppDispatch } from '@/libs/hooks';
import { keepLogin } from '@/_middlewares/authMiddleware';

export default function AuthProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  async function fetchUser() {
    await keepLogin()(dispatch);
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return children;
}
