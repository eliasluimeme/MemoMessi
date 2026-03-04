'use client';

import { useState } from 'react';

import useUserStore from '@/store/user';

import { useToast } from '@/components/ui/toast-context';

interface UseSigninReturn {
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useSignin(): UseSigninReturn {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();
      if (response.status === 401 && responseData.redirectUrl) {
        window.location.href = responseData.redirectUrl;
        return;
      }
      if (!response.ok) throw new Error(responseData.message || 'Invalid credentials');

      toast({
        title: 'Success',
        description: 'Login successful!',
        variant: 'success',
      });

      setUser(responseData.user);
      // Hard redirect — clears router cache, ensures proxy + layout run fresh
      // with the newly set auth cookies
      window.location.href = responseData.redirectUrl;
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: (error as Error).message || 'An error occurred. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return {
    isLoading,
    handleSubmit,
  };
}
