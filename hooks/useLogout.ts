'use client';

import { useRouter } from 'next/navigation';

import useUserStore from '@/store/user';

import { useToast } from '@/components/ui/toast-context';

export const useLogout = () => {
  const router = useRouter();
  const { toast } = useToast();
  const setUser = useUserStore((state) => state.setUser);

  const logout = async ({ redirectUrl }: { redirectUrl?: string }) => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Logout failed');
      setUser(null);
      router.push(redirectUrl || '/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: 'Error',
        description: 'Failed to logout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return { logout };
};
