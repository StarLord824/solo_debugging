'use client';
import React from 'react';
import { useGhostStore, ERROR_DOMAINS, getNextRank } from '@/store/useGhostStore';
import { Skull, Swords, Trophy, Zap, RotateCcw, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  const currentRank = useGhostStore((s) => s.currentRank);
  const activateAbility = useGhostStore((s) => s.activateAbility);
  const abilityActive = useGhostStore((s) => s.abilityActive);

  const domains = Object.values(ERROR_DOMAINS);
  const nextRank = getNextRank(currentRank);

  // XP progress for current level
  const xpForCurrentLevel = Math.floor(100 * Math.pow(1.5, playerLevel - 1));
  const xpForNextLevel = Math.floor(100 * Math.pow(1.5, playerLevel));
  const xpProgress = ((playerXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  // Progress to next rank
  const rankProgress = nextRank 
    ? ((shadowCount - currentRank.threshold) / (nextRank.threshold - currentRank.threshold)) * 100
    : 100;

  return (
    <div className="flex flex-col gap-4 p-4 border-r border-necro-purple/30 bg-black/60 backdrop-blur-xl min-w-[260px] max-w-[280px] relative z-20">
      {/* Title */}
      <div className="flex items-center gap-3">
        <Skull className="text-necro-purple w-8 h-8" />
        <div>
          <h1 className="text-xl font-black tracking-wider text-necro-light">SOLO_DEBUGGER</h1>
          <span className="text-[10px] tracking-[0.3em]" style={{ color: currentRank.color }}>
            {currentRank.icon} {currentRank.name}
          </span>
        </div>
      </div>

      {/* Rank Progress */}
      <div className="p-3 border bg-black/40" style={{ borderColor: `${currentRank.color}40` }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold tracking-widest" style={{ color: currentRank.color }}>
            {currentRank.icon} {currentRank.name}
          </span>
          {nextRank && (
            <span className="text-[10px] text-necro-purple/50">
              → {nextRank.icon} {nextRank.threshold - shadowCount} more
            </span>
          )}
        </div>
        <div className="w-full h-2 bg-necro-void border border-necro-purple/30 overflow-hidden">
          <motion.div
            className="h-full"
            style={{ backgroundColor: currentRank.color }}
            animate={{ width: `${Math.min(100, rankProgress)}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="mt-2 text-[10px] opacity-60" style={{ color: currentRank.color }}>
          {currentRank.abilityDescription}
        </div>
        
        {/* Ability Button (for Monarch) */}
        {currentRank.ability === 'domainExpansion' && (
          <motion.button
            onClick={activateAbility}
            disabled={abilityActive}
            whileHover={{ scale: abilityActive ? 1 : 1.02 }}
            whileTap={{ scale: abilityActive ? 1 : 0.95 }}
            className={`w-full mt-2 py-2 text-xs font-black uppercase tracking-widest border transition-all ${
              abilityActive
                ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50 cursor-not-allowed'
                : 'bg-yellow-500/10 text-yellow-500 border-yellow-500 hover:bg-yellow-500 hover:text-black shadow-[0_0_20px_rgba(251,191,36,0.3)]'
            }`}
          >
            {abilityActive ? '⚡ DOMAIN ACTIVE' : '👑 DOMAIN EXPANSION'}
          </motion.button>
        )}
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
              className={`p-2 text-xs font-bold uppercase tracking-wide border transition-all duration-200 ${
                activeDomain === domain.id
                  ? 'border-current bg-current/20 shadow-[0_0_20px_currentColor]'
                  : 'border-necro-purple/30 bg-black/40 hover:border-current hover:bg-current/10'
              }`}
              style={{ color: domain.color }}
            >
              <span className="text-lg">{domain.icon}</span>
              <div className="mt-1 text-[10px]">{domain.name}</div>
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
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold tracking-widest text-necro-purple/80 flex items-center gap-2">
          <Trophy size={14} /> HUNTER STATS
        </span>

        {/* Level & XP */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-necro-purple/70">LEVEL {playerLevel}</span>
          <span className="text-xs text-necro-purple/50">{playerXP} XP</span>
        </div>
        <div className="w-full h-1.5 bg-necro-void border border-necro-purple/30 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-necro-purple to-necro-light"
            animate={{ width: `${Math.max(0, Math.min(100, xpProgress))}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Shadow Count & Stability Row */}
        <div className="flex gap-2 mt-1">
          <div className="flex-1 p-2 bg-black/40 border border-necro-purple/20 text-center">
            <div className="text-[10px] text-necro-purple/50">SHADOWS</div>
            <div className="text-lg font-black" style={{ color: currentRank.color }}>{shadowCount}</div>
          </div>
          <div className="flex-1 p-2 bg-black/40 border border-necro-purple/20 text-center">
            <div className="text-[10px] text-necro-purple/50">STABILITY</div>
            <div className={`text-lg font-black ${stability < 30 ? 'text-red-500 animate-pulse' : 'text-necro-light'}`}>
              {stability.toFixed(0)}%
            </div>
          </div>
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
