'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import useUserStore from '@/store/user';

import { useToast } from '@/components/ui/toast-context';

interface UseSigninReturn {
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useSignin(): UseSigninReturn {
  const router = useRouter();
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
        router.push(responseData.redirectUrl);
        return;
      }
      if (!response.ok) throw new Error(responseData.message || 'Invalid credentials');

      toast({
        title: 'Success',
        description: 'Login successful!',
        variant: 'success',
      });

      router.push(responseData.redirectUrl);
      setUser(responseData.user);
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
