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
        "glass-effect rounded-[2rem] p-6 transition-all duration-300",
        hover && "hover:scale-[1.02] hover:bg-white/50 dark:hover:bg-black/50 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;