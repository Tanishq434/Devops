import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className, onClick }: CardProps) => {
  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-soft p-6',
        onClick && 'cursor-pointer hover:shadow-medium transition-shadow',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
