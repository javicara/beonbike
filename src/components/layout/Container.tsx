import React from 'react';
import clsx from 'clsx';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container = ({ children, className }: ContainerProps) => {
  return (
    <div
      className={clsx(
        'container mx-auto px-4 mobile:px-6 tablet:px-8 desktop:px-12',
        className
      )}
    >
      {children}
    </div>
  );
}; 