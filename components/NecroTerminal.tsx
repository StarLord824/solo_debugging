'use client';
import React from 'react';
import { useGhostStore } from '@/store/useGhostStore';
import { TerminalLogs } from './TerminalLogs';
import { GhostOverlay } from './GhostOverlay';
import { motion, AnimatePresence } from 'motion/react';

export const NecroTerminal: React.FC = () => {
  const spawnGhost = useGhostStore((state) => state.spawnGhost);
  const isCollapsed = useGhostStore((state) => state.isCollapsed);
  const shadowCount = useGhostStore((state) => state.shadowCount);

  return (
    <div className="relative w-full h-screen bg-necro-bg text-necro-purple overflow-hidden font-mono transition-colors duration-[5000ms]"
         style={isCollapsed ? { backgroundColor: '#000' } : {}}
    >
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-necro-purple/5 animate-pulse pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <header className="p-8 flex justify-between items-center border-b border-necro-purple/20">
              <h1 className="text-2xl font-bold tracking-[0.5em] text-necro-light drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                  SOLO_DEBUGGER
              </h1>
              <div className="text-xs">
                  SHADOW_COUNT: {shadowCount}
              </div>
          </header>

          {/* Logs Area */}
          <div className="flex-1 relative">
             {!isCollapsed && <TerminalLogs />}
             
             {/* Collapse Message */}
             <AnimatePresence>
                 {isCollapsed && (
                     <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                     >
                         <h1 className="text-6xl md:text-9xl font-black text-necro-light mix-blend-difference text-center leading-none">
                             I AM<br/>THE ERROR
                         </h1>
                     </motion.div>
                 )}
             </AnimatePresence>
          </div>

          {/* Controls */}
          <footer className="p-8 border-t border-necro-purple/20 flex justify-center">
              <button
                 onClick={() => spawnGhost()}
                 className="px-12 py-4 bg-necro-purple/10 border border-necro-purple text-necro-light hover:bg-necro-purple hover:text-black transition-all duration-75 uppercase tracking-widest font-bold active:scale-95 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_40px_rgba(168,85,247,0.6)]"
              >
                  DEBUG :: INITIATE
              </button>
          </footer>
      </div>

      {/* The Swarm */}
      <GhostOverlay />
    </div>
  );
};
