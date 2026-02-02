'use client';
import React from 'react';
import { useGhostStore } from '@/store/useGhostStore';
import { motion } from 'motion/react';
import { Skull, Flame, Shield, Zap } from 'lucide-react';

export const PlayerHUD: React.FC = () => {
  const playerLevel = useGhostStore((s) => s.playerLevel);
  const playerXP = useGhostStore((s) => s.playerXP);
  const shadowCount = useGhostStore((s) => s.shadowCount);
  const currentWave = useGhostStore((s) => s.currentWave);
  const stability = useGhostStore((s) => s.stability);
  const isCollapsed = useGhostStore((s) => s.isCollapsed);

  // XP for level display
  const xpForNextLevel = Math.floor(100 * Math.pow(1.5, playerLevel));
  const xpProgress = (playerXP / xpForNextLevel) * 100;

  if (isCollapsed) return null; // Hide HUD in Monarch state

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col gap-2 pointer-events-none">
      {/* Level Badge */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 px-4 py-2 bg-black/70 border border-necro-purple/50 backdrop-blur-md"
      >
        <div className="flex items-center gap-2">
          <Flame className="text-necro-purple w-5 h-5" />
          <div>
            <div className="text-[10px] text-necro-purple/70 uppercase tracking-widest">Level</div>
            <div className="text-2xl font-black text-necro-light leading-none">{playerLevel}</div>
          </div>
        </div>
        
        {/* Mini XP bar */}
        <div className="w-20 h-1.5 bg-necro-void border border-necro-purple/30">
          <motion.div
            className="h-full bg-gradient-to-r from-necro-purple to-necro-light"
            animate={{ width: `${Math.min(xpProgress, 100)}%` }}
          />
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2"
      >
        {/* Wave */}
        <div className="flex items-center gap-2 px-3 py-2 bg-black/70 border border-necro-purple/30 backdrop-blur-md">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-bold text-necro-light">{currentWave}</span>
        </div>

        {/* Shadows */}
        <div className="flex items-center gap-2 px-3 py-2 bg-black/70 border border-necro-purple/30 backdrop-blur-md">
          <Skull className="w-4 h-4 text-necro-purple" />
          <span className="text-sm font-bold text-necro-light">{shadowCount}</span>
        </div>

        {/* Stability */}
        <div className={`flex items-center gap-2 px-3 py-2 bg-black/70 border backdrop-blur-md ${
          stability < 30 ? 'border-red-500/50' : 'border-necro-purple/30'
        }`}>
          <Shield className={`w-4 h-4 ${stability < 30 ? 'text-red-500 animate-pulse' : 'text-green-500'}`} />
          <span className={`text-sm font-bold ${stability < 30 ? 'text-red-500' : 'text-necro-light'}`}>
            {stability.toFixed(0)}%
          </span>
        </div>
      </motion.div>
    </div>
  );
};
