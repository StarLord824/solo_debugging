'use client';
import React from 'react';
import { Ghost } from '@/store/useGhostStore';
import { motion } from 'motion/react';

interface GhostParticleProps {
  ghost: Ghost;
  onClick?: () => void;
  isClickable?: boolean;
}

export const GhostParticle: React.FC<GhostParticleProps> = ({ ghost, onClick, isClickable }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`absolute ${isClickable ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'}`}
      style={{
        left: ghost.x,
        top: ghost.y,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
      whileHover={isClickable ? { scale: 1.5 } : undefined}
      whileTap={isClickable ? { scale: 0.8 } : undefined}
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
        className={`relative w-3 h-3 rounded-full mix-blend-screen ${isClickable ? 'ring-2 ring-white/30' : ''}`}
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

      {/* Click hint for Shadow Strike */}
      {isClickable && (
        <motion.div
          className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white font-bold whitespace-nowrap bg-black/80 px-2 py-0.5 rounded"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          STRIKE
        </motion.div>
      )}
    </motion.div>
  );
};
