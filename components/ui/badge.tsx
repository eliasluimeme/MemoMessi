import * as React from 'react';

import { type VariantProps, cva } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground  hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground  hover:bg-destructive/80',
        'destructive-outline':
          'border-destructive bg-destructive/10 text-destructive-foreground  hover:bg-destructive hover:text-destructive-foreground text-destructive',
        outline: 'text-foreground',
        success: 'border-transparent bg-green-400 text-white  hover:bg-green-600',
        'success-outline':
          'border-green-500 bg-green-500/20 hover:bg-green-600 text-green-500 hover:text-white',
        warning: 'border-transparent bg-yellow-500 text-white  hover:bg-yellow-600',
        error: 'border-transparent bg-red-400 text-white  hover:bg-red-600',
      },
      size: {
        sm: 'text-[10px] px-1.5 py-0.5',
        md: 'text-xs px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
