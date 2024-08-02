'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/libs/store';
import AuthProvider from '@/_provider/authProvider';

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // const storeRef = useRef<AppStore>();
  // if (!storeRef.current) {
  //   storeRef.current = makeStore();
  // }

  return (
    <Provider store={makeStore()}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
