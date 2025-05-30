import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export const Card = ({
  children,
  className,
  padding = 'md',
  hover = false,
  onClick,
}: CardProps) => {
  const Component = onClick ? 'button' : 'div';

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <Component
      className={clsx(
        'bg-white rounded-lg shadow-sm',
        hover && 'hover:shadow-lg transition-shadow duration-200',
        paddings[padding],
        onClick && 'cursor-pointer w-full text-left',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </Component>
  );
}; 