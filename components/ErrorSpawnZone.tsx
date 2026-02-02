'use client';
import React, { useEffect } from 'react';
import { useGhostStore } from '@/store/useGhostStore';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

export const ErrorSpawnZone: React.FC = () => {
  const activeErrors = useGhostStore((s) => s.activeErrors);
  const defeatError = useGhostStore((s) => s.defeatError);
  const missError = useGhostStore((s) => s.missError);
  const isWaveActive = useGhostStore((s) => s.isWaveActive);
  const errorTimeout = useGhostStore((s) => s.errorTimeout);
  const abilityActive = useGhostStore((s) => s.abilityActive);

  // Auto-expire errors after timeout (miss them)
  useEffect(() => {
    if (abilityActive) return; // Don't expire during Domain Expansion
    
    const interval = setInterval(() => {
      const now = Date.now();
      activeErrors.forEach((error) => {
        if (now - error.spawnTime > errorTimeout) {
          missError(error.id);
        }
      });
    }, 500);

    return () => clearInterval(interval);
  }, [activeErrors, missError, errorTimeout, abilityActive]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      <AnimatePresence>
        {activeErrors.map((error) => {
          const timeAlive = Date.now() - error.spawnTime;
          const progress = Math.min(timeAlive / errorTimeout, 1);
          const isUrgent = progress > 0.6;

          return (
            <motion.div
              key={error.id}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
                x: isUrgent ? [0, -3, 3, -3, 3, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 0.3, rotate: 10, y: -50 }}
              transition={{
                duration: 0.3,
                x: { duration: 0.4, repeat: Infinity },
              }}
              className="absolute pointer-events-auto cursor-pointer"
              style={{
                left: error.x,
                top: error.y,
                transform: 'translate(-50%, -50%)',
              }}
              onClick={() => defeatError(error.id)}
            >
              <div
                className={`error-card relative px-6 py-4 bg-black/80 ${isUrgent ? 'animate-glitch' : ''}`}
                style={{
                  color: error.color,
                  borderColor: error.color,
                  boxShadow: `0 0 ${isUrgent ? 50 : 30}px ${error.color}`,
                }}
              >
                {/* Progress bar (time left) */}
                <div className="absolute top-0 left-0 h-1 bg-current/30" style={{ width: '100%' }}>
                  <motion.div
                    className="h-full bg-current"
                    initial={{ width: '100%' }}
                    animate={{ width: `${(1 - progress) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                {/* Domain icon */}
                <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-current flex items-center justify-center text-black text-xs font-bold">
                  {error.domain === 'frontend' && '🖥️'}
                  {error.domain === 'backend' && '⚙️'}
                  {error.domain === 'database' && '🗄️'}
                  {error.domain === 'devops' && '🐳'}
                </div>

                {/* Error message */}
                <div className="text-sm font-bold tracking-wide">{error.errorMsg}</div>
                
                {/* Click hint */}
                <div className="text-[10px] mt-2 opacity-50 uppercase tracking-widest flex items-center gap-1">
                  <X size={10} /> Click to defeat
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Wave Complete Message */}
      <AnimatePresence>
        {!isWaveActive && activeErrors.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            {/* This space intentionally left for wave complete effects */}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
