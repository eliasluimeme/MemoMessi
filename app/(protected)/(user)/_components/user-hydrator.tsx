'use client';

import { useEffect } from 'react';
import useUserStore from '@/store/user';
import { TUser } from '@/types/user';

export function UserHydrator({ user }: { user: TUser }) {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return null;
}
