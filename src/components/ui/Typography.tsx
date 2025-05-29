import React from 'react';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body' | 'small';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
  children: React.ReactNode;
}

const variantClasses = {
  h1: 'text-4xl md:text-5xl lg:text-6xl',
  h2: 'text-3xl md:text-4xl lg:text-5xl',
  h3: 'text-2xl md:text-3xl lg:text-4xl',
  h4: 'text-xl md:text-2xl lg:text-3xl',
  h5: 'text-lg md:text-xl lg:text-2xl',
  h6: 'text-base md:text-lg lg:text-xl',
  body: 'text-base md:text-lg',
  small: 'text-sm',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export const Typography = ({
  variant = 'body',
  weight = 'normal',
  className = '',
  children,
}: TypographyProps) => {
  const Component = variant.startsWith('h') ? variant : 'p';
  
  return (
    <Component
      className={`${variantClasses[variant]} ${weightClasses[weight]} ${className}`}
    >
      {children}
    </Component>
  );
};

export default Typography; 