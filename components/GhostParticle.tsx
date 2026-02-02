import React from 'react';
import { motion } from 'motion/react';
import { useGhostStore, Ghost } from '@/store/useGhostStore';

interface GhostParticleProps {
  ghost: Ghost;
}

export const GhostParticle: React.FC<GhostParticleProps> = ({ ghost }) => {
  return (
    <motion.div
      className="absolute pointer-events-none text-xs font-mono font-bold text-necro-purple/70 select-none z-50"
      // Directly animate to the store's position. 
      // Since store updates 60fps (ish), layout=true might be smoother or just `animate`.
      animate={{ 
        x: ghost.x, 
        y: ghost.y,
      }}
      // Fast transition for responsive flocking
      transition={{
        duration: 0.1, 
        ease: "linear"
      }}
      style={{ 
        mixBlendMode: 'screen',
        filter: 'blur(1px)' // Ethereal look
      }}
    >
      {ghost.errorMsg}
    </motion.div>
  );
};
