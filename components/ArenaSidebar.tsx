'use client';
import React from 'react';
import { useGhostStore, ERROR_DOMAINS } from '@/store/useGhostStore';
import { Skull, Swords, Trophy, Zap, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';

export const ArenaSidebar: React.FC = () => {
  const activeDomain = useGhostStore((s) => s.activeDomain);
  const setDomain = useGhostStore((s) => s.setDomain);
  const currentWave = useGhostStore((s) => s.currentWave);
  const isWaveActive = useGhostStore((s) => s.isWaveActive);
  const startWave = useGhostStore((s) => s.startWave);
  const shadowCount = useGhostStore((s) => s.shadowCount);
  const playerLevel = useGhostStore((s) => s.playerLevel);
  const playerXP = useGhostStore((s) => s.playerXP);
  const stability = useGhostStore((s) => s.stability);
  const reset = useGhostStore((s) => s.reset);
  const isCollapsed = useGhostStore((s) => s.isCollapsed);

  const domains = Object.values(ERROR_DOMAINS);
  const currentDomainData = ERROR_DOMAINS[activeDomain];

  // XP progress for current level
  const xpForCurrentLevel = Math.floor(100 * Math.pow(1.5, playerLevel - 1));
  const xpForNextLevel = Math.floor(100 * Math.pow(1.5, playerLevel));
  const xpProgress = ((playerXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <div className="flex flex-col gap-6 p-4 border-r border-necro-purple/30 bg-black/60 backdrop-blur-xl min-w-[260px] max-w-[280px] relative z-20">
      {/* Title */}
      <div className="flex items-center gap-3">
        <Skull className="text-necro-purple w-8 h-8" />
        <div>
          <h1 className="text-xl font-black tracking-wider text-necro-light">SOLO_DEBUGGER</h1>
          <span className="text-[10px] tracking-[0.3em] text-necro-purple/70">SHADOW MONARCH</span>
        </div>
      </div>

      {/* Domain Selection */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold tracking-widest text-necro-purple/80 flex items-center gap-2">
          <Swords size={14} /> SELECT DOMAIN
        </span>
        <div className="grid grid-cols-2 gap-2">
          {domains.map((domain) => (
            <motion.button
              key={domain.id}
              onClick={() => setDomain(domain.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-3 text-xs font-bold uppercase tracking-wide border transition-all duration-200 ${
                activeDomain === domain.id
                  ? 'border-current bg-current/20 shadow-[0_0_20px_currentColor]'
                  : 'border-necro-purple/30 bg-black/40 hover:border-current hover:bg-current/10'
              }`}
              style={{ color: domain.color }}
            >
              <span className="text-lg">{domain.icon}</span>
              <div className="mt-1">{domain.name}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Wave Info */}
      <div className="flex flex-col gap-2 p-3 border border-necro-purple/20 bg-black/40">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold tracking-widest text-necro-purple/80">WAVE</span>
          <span className="text-2xl font-black text-necro-light">{currentWave}</span>
        </div>
        <motion.button
          onClick={startWave}
          disabled={isWaveActive || isCollapsed}
          whileHover={{ scale: isWaveActive ? 1 : 1.02 }}
          whileTap={{ scale: isWaveActive ? 1 : 0.98 }}
          className={`w-full py-3 text-sm font-black uppercase tracking-widest transition-all duration-300 ${
            isWaveActive || isCollapsed
              ? 'bg-necro-purple/10 text-necro-purple/50 border-necro-purple/20 cursor-not-allowed'
              : 'bg-necro-purple/20 text-necro-light border-necro-purple hover:bg-necro-purple hover:text-black shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]'
          } border`}
        >
          {isCollapsed ? '👑 MONARCH STATE' : isWaveActive ? '⚔️ WAVE IN PROGRESS' : '🗡️ INITIATE HUNT'}
        </motion.button>
      </div>

      {/* Player Stats */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold tracking-widest text-necro-purple/80 flex items-center gap-2">
          <Trophy size={14} /> HUNTER STATS
        </span>

        {/* Level */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-necro-purple/70">LEVEL</span>
          <span className="text-xl font-black text-necro-light">{playerLevel}</span>
        </div>

        {/* XP Bar */}
        <div className="w-full h-2 bg-necro-void border border-necro-purple/30 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-necro-purple to-necro-light"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, Math.min(100, xpProgress))}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-[10px] text-necro-purple/50 text-right">{playerXP} XP</div>

        {/* Shadow Count */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-necro-purple/70">SHADOWS</span>
          <span className="text-xl font-black" style={{ color: currentDomainData.color }}>
            {shadowCount}
          </span>
        </div>

        {/* Stability */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-necro-purple/70">STABILITY</span>
          <span className={`text-xl font-black ${stability < 30 ? 'text-red-500 animate-pulse' : 'text-necro-light'}`}>
            {stability.toFixed(0)}%
          </span>
        </div>
        <div className="w-full h-1 bg-necro-void border border-necro-purple/30 overflow-hidden">
          <motion.div
            className={`h-full ${stability < 30 ? 'bg-red-500' : 'bg-necro-purple'}`}
            animate={{ width: `${stability}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={reset}
        className="mt-auto flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-widest text-necro-purple/50 hover:text-necro-light border border-necro-purple/20 hover:border-necro-purple/50 transition-all"
      >
        <RotateCcw size={14} /> REBOOT SYSTEM
      </button>
    </div>
  );
};
