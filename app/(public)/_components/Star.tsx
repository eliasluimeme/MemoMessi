interface StarProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

const sizeClasses = {
  small: 'h-[2px] w-[2px]',
  medium: 'h-[3px] w-[3px]',
  large: 'h-[4px] w-[4px]',
};

export function Star({ className, size = 'small' }: StarProps) {
  return (
    <div
      className={`absolute rounded-full bg-white ${sizeClasses[size]} animate-star-float ${className}`}
    />
  );
}
