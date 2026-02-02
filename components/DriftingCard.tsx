import React from 'react';
import { motion, useAnimation } from 'motion/react';
import { useSystemStore } from '@/store/useSystemStore';

interface DriftingCardProps {
  children: React.ReactNode;
  className?: string;
}

export const DriftingCard: React.FC<DriftingCardProps> = ({ children, className = "" }) => {
  const stability = useSystemStore((state) => state.stability);
  
  // Drift logic starts when stability < 40
  const isDrifting = stability < 40;

  return (
    <motion.div
      className={className}
      animate={isDrifting ? {
        x: [0, (Math.random() - 0.5) * (100 - stability) * 20],
        y: [0, (Math.random() - 0.5) * (100 - stability) * 20],
        rotate: [0, (Math.random() - 0.5) * (40 - stability)],
      } : { x: 0, y: 0, rotate: 0 }}
      transition={{
        duration: isDrifting ? Math.max(0.2, stability / 20) : 0.5,
        repeat: isDrifting ? Infinity : 0,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};
