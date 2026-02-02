'use client';
import React from 'react';
import { useGhostStore } from '@/store/useGhostStore';
import { ArenaSidebar } from './ArenaSidebar';
import { ErrorSpawnZone } from './ErrorSpawnZone';
import { GhostOverlay } from './GhostOverlay';
import { PlayerHUD } from './PlayerHUD';
import { TerminalLogs } from './TerminalLogs';
import { motion, AnimatePresence } from 'motion/react';

export const Arena: React.FC = () => {
  const isCollapsed = useGhostStore((s) => s.isCollapsed);
  const stability = useGhostStore((s) => s.stability);
  const shadowCount = useGhostStore((s) => s.shadowCount);

  // Visual distortion based on stability
  const getDistortionStyle = () => {
    if (stability >= 70) return {};

    const severity = 70 - stability;
    return {
      filter: `hue-rotate(${severity * 1.5}deg) contrast(${100 + severity}%) brightness(${100 - severity * 0.3}%)`,
    };
  };

  return (
    <div
      className="relative w-full h-screen bg-necro-bg text-necro-purple overflow-hidden flex transition-all duration-1000"
      style={isCollapsed ? { backgroundColor: '#000' } : getDistortionStyle()}
    >
      {/* Background Pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          backgroundColor: stability < 30 ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.03)',
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Low stability warning pulse */}
      <AnimatePresence>
        {stability < 30 && !isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
            className="absolute inset-0 bg-red-900/20 pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Hidden in Monarch State */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ArenaSidebar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Arena */}
      <div className="flex-1 relative">
        {/* Terminal Logs Background */}
        {!isCollapsed && <TerminalLogs />}

        {/* Error Spawn Zone */}
        <ErrorSpawnZone />

        {/* Player HUD */}
        <PlayerHUD />

        {/* Monarch State Overlay */}
        <AnimatePresence>
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-40"
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center"
              >
                <motion.h1
                  className="text-6xl md:text-9xl font-black text-necro-light mix-blend-difference text-center leading-none tracking-tighter"
                  animate={{
                    textShadow: [
                      '0 0 20px #a855f7',
                      '0 0 60px #a855f7',
                      '0 0 20px #a855f7',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  I AM<br />THE ERROR
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-8 text-necro-purple text-xl tracking-[0.5em] uppercase"
                >
                  Shadow Monarch Awakened
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="mt-4 text-necro-purple/50 text-sm"
                >
                  {shadowCount} Shadows Extracted
                </motion.p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ghost Overlay - Always on top */}
      <GhostOverlay />

      {/* Scanline overlay */}
      <div
        className="scanlines pointer-events-none fixed inset-0 z-[100]"
        style={{ opacity: isCollapsed ? 0.1 : 0.3 }}
      />
    </div>
  );
};
