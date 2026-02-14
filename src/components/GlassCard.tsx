import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const GlassCard = ({ children, className, hover, onClick }: GlassCardProps) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "glass-effect rounded-[2.5rem] p-8 transition-all duration-500",
        hover && "hover:scale-[1.02] hover:shadow-2xl cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;