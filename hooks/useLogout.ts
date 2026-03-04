'use client';

import useUserStore from '@/store/user';

import { useToast } from '@/components/ui/toast-context';

export const useLogout = () => {
  const { toast } = useToast();
  const setUser = useUserStore((state) => state.setUser);

  const logout = async ({ redirectUrl }: { redirectUrl?: string }) => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Logout failed');
      setUser(null);
      // Hard redirect to clear Next.js router cache and force a full page reload
      window.location.href = redirectUrl || '/';
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
