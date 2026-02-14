import React from 'react';
import { motion } from 'framer-motion';

interface TrustLevelCircleProps {
  score: number;
  size?: number;
}

const TrustLevelCircle = ({ score, size = 120 }: TrustLevelCircleProps) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score - 300) / 600;
  const offset = circumference - progress * circumference;

  const getColor = (val: number) => {
    if (val >= 800) return '#10b981';
    if (val >= 700) return '#3b82f6';
    if (val >= 600) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-muted/20"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor(score)}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black">{score}</span>
        <span className="text-[8px] uppercase tracking-widest opacity-40">Score</span>
      </div>
    </div>
  );
};

export default TrustLevelCircle;