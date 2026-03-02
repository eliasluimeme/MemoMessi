'use client';

import { useState } from 'react';

import { Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast-context';

import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  signalId: string;
  initialFavorited: boolean;
  variant?: 'outline' | 'ghost';
  className?: string;
}

export function FavoriteButton({
  signalId,
  initialFavorited,
  variant = 'ghost',
  className,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const { toast } = useToast();

  const handleFavorite = async () => {
    try {
      const response = await fetch(`/api/user/signals/${signalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to toggle favorite');

      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update favorite status. Please try again.',
      });
    }
  };

  return (
    <Button
      variant={variant}
      size="icon"
      className={cn(`${isFavorited ? 'text-yellow-500' : ''}`, className)}
      onClick={handleFavorite}
    >
      <Star className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
    </Button>
  );
}
