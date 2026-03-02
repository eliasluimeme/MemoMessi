'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';

import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';

import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  radius?: number;
  error?: string;
  inputSize?: 'sm' | 'default' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, radius = 100, error, inputSize = 'default', ...props }, ref) => {
    const [visible, setVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({
      currentTarget,
      clientX,
      clientY,
    }: React.MouseEvent<HTMLDivElement>) {
      const { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    const inputSizes = {
      sm: 'h-8 px-2 py-1 text-xs',
      default: 'h-10 px-3 py-2 text-sm',
      lg: 'h-12 px-4 py-3 text-base',
    };

    return (
      <div className="w-full">
        <motion.div
          style={{
            background: useMotionTemplate`
          radial-gradient(
            ${visible ? radius + 'px' : '0px'} circle at ${mouseX}px ${mouseY}px,
            var(--blue-500),
            transparent 80%
          )
        `,
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
          className={cn(
            'group/input rounded-lg p-[2px] transition duration-300',
            isFocused && 'ring-2 ring-neutral-500 dark:ring-neutral-800',
          )}
        >
          <input
            type={type}
            className={cn(
              `dark:placeholder-text-neutral-600 duration-400 flex w-full rounded-md border border-input bg-gray-50 text-black shadow-input transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 group-hover/input:shadow-none dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_var(--neutral-700)]`,
              inputSizes[inputSize],
              error && 'border-2 border-solid border-destructive',
              className,
            )}
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
        </motion.div>
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';

export { Input };
