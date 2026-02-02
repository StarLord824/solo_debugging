'use client';
import React from 'react';
import { Ghost } from '@/store/useGhostStore';
import { motion } from 'motion/react';

interface GhostParticleProps {
  ghost: Ghost;
}

export const GhostParticle: React.FC<GhostParticleProps> = ({ ghost }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute pointer-events-none"
      style={{
        left: ghost.x,
        top: ghost.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full blur-lg opacity-50"
        style={{
          width: 24,
          height: 24,
          backgroundColor: ghost.color || '#a855f7',
          transform: 'translate(-50%, -50%)',
        }}
      />
      
      {/* Core particle */}
      <div
        className="relative w-3 h-3 rounded-full mix-blend-screen"
        style={{
          backgroundColor: ghost.color || '#a855f7',
          boxShadow: `0 0 10px ${ghost.color || '#a855f7'}, 0 0 20px ${ghost.color || '#a855f7'}`,
        }}
      />
      
      {/* Error code whisper */}
      <div
        className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] font-mono opacity-30 whitespace-nowrap"
        style={{ color: ghost.color || '#a855f7' }}
      >
        {ghost.errorMsg.slice(0, 12)}
      </div>
    </motion.div>
  );
};
