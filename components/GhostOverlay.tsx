'use client';
import React, { useEffect } from 'react';
import { useGhostStore } from '@/store/useGhostStore';
import { GhostParticle } from './GhostParticle';

export const GhostOverlay: React.FC = () => {
  const ghosts = useGhostStore((state) => state.ghosts);
  const updateGhosts = useGhostStore((state) => state.updateGhosts);
  const setCursor = useGhostStore((state) => state.setCursor);
  const shadowCount = useGhostStore((state) => state.shadowCount);
  const isCollapsed = useGhostStore((state) => state.isCollapsed);
  const currentRank = useGhostStore((state) => state.currentRank);
  const shadowStrike = useGhostStore((state) => state.shadowStrike);
  const activeErrors = useGhostStore((state) => state.activeErrors);

  const canShadowStrike = currentRank.ability === 'shadowStrike' && activeErrors.length > 0;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursor(e.clientX, e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setCursor]);

  // Simulation Loop - Boids flocking
  useEffect(() => {
    let animationFrameId: number;
    const loop = () => {
      updateGhosts();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [updateGhosts]);

  const handleShadowClick = (ghostId: string) => {
    if (canShadowStrike) {
      shadowStrike(ghostId);
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Constellation Lines - "Constellation of Failure" */}
      {shadowCount > 15 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible opacity-20">
          {ghosts.map((g, i) => {
            if (i === 0) return null;
            const prev = ghosts[i - 1];
            const dist = Math.hypot(g.x - prev.x, g.y - prev.y);

            // Only draw if close enough
            if (dist > 250) return null;

            return (
              <line
                key={`link-${g.id}`}
                x1={g.x}
                y1={g.y}
                x2={prev.x}
                y2={prev.y}
                stroke={g.color || '#a855f7'}
                strokeWidth="1"
                opacity={1 - dist / 250}
              />
            );
          })}
        </svg>
      )}

      {/* Cross-connections in Monarch state */}
      {isCollapsed && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible opacity-40">
          {ghosts.slice(0, 30).map((g, i) => {
            // Connect to a few nearby ghosts for denser constellation
            const connections = ghosts
              .slice(i + 1, i + 4)
              .filter((other) => Math.hypot(g.x - other.x, g.y - other.y) < 200);

            return connections.map((other) => (
              <line
                key={`monarch-${g.id}-${other.id}`}
                x1={g.x}
                y1={g.y}
                x2={other.x}
                y2={other.y}
                stroke={g.color || '#a855f7'}
                strokeWidth="0.5"
              />
            ));
          })}
        </svg>
      )}

      {/* Shadow Strike hint */}
      {canShadowStrike && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-purple-900/80 border border-necro-purple text-necro-light text-sm font-bold tracking-wide pointer-events-none z-[60]">
          💀 NECROMANCER: Click shadows near errors to defeat them!
        </div>
      )}

      {/* Ghost Particles */}
      {ghosts.map((ghost) => (
        <GhostParticle 
          key={ghost.id} 
          ghost={ghost} 
          onClick={canShadowStrike ? () => handleShadowClick(ghost.id) : undefined}
          isClickable={canShadowStrike}
        />
      ))}
    </div>
  );
};
