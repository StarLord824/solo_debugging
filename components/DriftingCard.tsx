import React from 'react';
import { motion, useAnimation } from 'motion/react';
import { useEntropyStore } from '@/store/useEntropyStore';

interface DriftingCardProps {
  children: React.ReactNode;
  className?: string;
}

export const DriftingCard: React.FC<DriftingCardProps> = ({ children, className = "" }) => {
  const stability = useEntropyStore((state) => state.stability);
  
  const isDrifting = stability < 20;
  const isVibrating = stability < 50 && !isDrifting;

  return (
    <motion.div
      className={className}
      animate={
        isDrifting ? {
            x: [0, (Math.random() - 0.5) * (100 - stability) * 20],
            y: [0, (Math.random() - 0.5) * (100 - stability) * 20],
            rotate: [0, (Math.random() - 0.5) * (40 - stability)],
        } : isVibrating ? {
            x: [0, -2, 2, -2, 2, 0],
            y: [0, 1, -1, 0],
        } : { x: 0, y: 0, rotate: 0 }
      }
      transition={{
        duration: isDrifting ? Math.max(0.2, stability / 20) : 0.1,
        repeat: (isDrifting || isVibrating) ? Infinity : 0,
        repeatType: isDrifting ? "reverse" : "loop",
        ease: "linear"
      }}
    >
      {children}
    </motion.div>
  );
};
