import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  hover?: boolean;
  gradient?: boolean;
}

export const Card = ({
  children,
  hover = false,
  gradient = false,
  className = '',
  ...props
}: CardProps) => {
  const baseStyles = 'bg-white rounded-xl shadow-md p-6 border border-gray-200';
  const hoverStyles = hover ? 'transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer' : '';
  const gradientStyles = gradient ? 'bg-gradient-to-br from-white to-gray-50' : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${gradientStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};

