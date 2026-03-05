'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { cn } from '@/lib/utils';

interface TokenImageProps {
  token: string;
  variant?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function TokenImage({ token, className, variant = 'md' }: TokenImageProps) {
  const tokenLower = token.toLowerCase();
  const imageUrl = `https://assets.coincap.io/assets/icons/${tokenLower}@2x.png`;
  const fallbackUrl = `https://s2.coinmarketcap.com/static/img/coins/64x64/${tokenLower}.png`;

  return (
    <Avatar
      // className={cn(
      //   'bg-transparent ring-1 ring-white/10',
      //   {
      //     'h-6 w-6': variant === 'sm',
      //     'h-8 w-8': variant === 'md',
      //     'h-12 w-12': variant === 'lg',
      //   },
      //   className,
      // )}
    >
      <AvatarImage
        src={imageUrl}
        alt={`${token} icon`}
        onError={(e) => {
          e.currentTarget.src = fallbackUrl;
        }}
      />
      <AvatarFallback>{token.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
