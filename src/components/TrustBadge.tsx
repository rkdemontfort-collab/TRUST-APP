import React from 'react';
import { Badge } from '@/components/ui/badge';

interface TrustBadgeProps {
  balance: number;
}

const TrustBadge = ({ balance }: TrustBadgeProps) => {
  const getRating = (val: number) => {
    if (val >= 800) return { label: '🌟 Excellent', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
    if (val >= 700) return { label: '👍 Good', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' };
    if (val >= 600) return { label: '😐 Fair', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
    if (val >= 500) return { label: '⚠️ Poor', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
    return { label: '❗ Very Poor', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  };

  const rating = getRating(balance);

  return (
    <Badge variant="outline" className={rating.color}>
      {rating.label}
    </Badge>
  );
};

export default TrustBadge;