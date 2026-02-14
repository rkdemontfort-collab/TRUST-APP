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
        "bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 transition-all duration-300",
        hover && "hover:bg-white/10 hover:border-white/20 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;