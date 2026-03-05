'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { useToast } from '@/components/ui/toast-context';

interface UseSignupReturn {
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useSignup(): UseSignupReturn {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    if (data.password !== data.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
          phoneNumber: data.phonenumber,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) throw new Error(responseData.message || 'An error occurred during signup');

      toast({
        title: 'Success',
        description: responseData.message || 'Signup successful!',
        variant: 'success',
      });

      router.push('/dashboard');
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
