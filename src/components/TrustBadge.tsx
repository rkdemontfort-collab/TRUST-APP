import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TrustBadgeProps {
  balance: number;
  className?: string;
}

const TrustBadge = ({ balance, className }: TrustBadgeProps) => {
  const getRating = (val: number) => {
    if (val >= 800) return { label: 'Excellent', color: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
    if (val >= 700) return { label: 'Good', color: 'bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30' };
    if (val >= 600) return { label: 'Fair', color: 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    if (val >= 500) return { label: 'Poor', color: 'bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-500/30' };
    return { label: 'Critical', color: 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30' };
  };

  const rating = getRating(balance);

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border",
        rating.color,
        className
      )}
    >
      {rating.label}
    </Badge>
  );
};

export default TrustBadge;