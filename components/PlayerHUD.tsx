'use client';
import React from 'react';
import { useGhostStore, getNextRank } from '@/store/useGhostStore';
import { motion } from 'motion/react';
import { Skull, Flame, Shield, Zap } from 'lucide-react';

export const PlayerHUD: React.FC = () => {
  const playerLevel = useGhostStore((s) => s.playerLevel);
  const playerXP = useGhostStore((s) => s.playerXP);
  const shadowCount = useGhostStore((s) => s.shadowCount);
  const currentWave = useGhostStore((s) => s.currentWave);
  const stability = useGhostStore((s) => s.stability);
  const isCollapsed = useGhostStore((s) => s.isCollapsed);
  const currentRank = useGhostStore((s) => s.currentRank);

  // XP for level display
  const xpForNextLevel = Math.floor(100 * Math.pow(1.5, playerLevel));
  const xpProgress = (playerXP / xpForNextLevel) * 100;

  const nextRank = getNextRank(currentRank);

  if (isCollapsed) return null; // Hide HUD in Monarch state

  return (
    <div className="fixed top-4 right-4 z-40 flex flex-col gap-2 pointer-events-none">
      {/* Rank Badge */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-3 px-4 py-2 bg-black/70 border backdrop-blur-md"
        style={{ borderColor: `${currentRank.color}50` }}
      >
        <div className="text-2xl">{currentRank.icon}</div>
        <div>
          <div className="text-[10px] uppercase tracking-widest" style={{ color: currentRank.color }}>
            {currentRank.name}
          </div>
          <div className="text-lg font-black text-necro-light leading-none">Lv.{playerLevel}</div>
        </div>
        
        {/* Mini XP bar */}
        <div className="w-16 h-1.5 bg-necro-void border border-necro-purple/30">
          <motion.div
            className="h-full"
            style={{ backgroundColor: currentRank.color }}
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

        {/* Shadows + Progress to next rank */}
        <div className="flex flex-col px-3 py-1 bg-black/70 border backdrop-blur-md" style={{ borderColor: `${currentRank.color}30` }}>
          <div className="flex items-center gap-2">
            <Skull className="w-4 h-4" style={{ color: currentRank.color }} />
            <span className="text-sm font-bold text-necro-light">{shadowCount}</span>
            {nextRank && (
              <span className="text-[10px] text-necro-purple/50">/{nextRank.threshold}</span>
            )}
          </div>
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
