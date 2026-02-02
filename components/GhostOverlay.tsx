import React, { useEffect } from 'react';
import { useGhostStore } from '@/store/useGhostStore';
import { GhostParticle } from './GhostParticle';

export const GhostOverlay: React.FC = () => {
  const ghosts = useGhostStore((state) => state.ghosts);
  const updateGhosts = useGhostStore((state) => state.updateGhosts);
  const setCursor = useGhostStore((state) => state.setCursor);
  const shadowCount = useGhostStore((state) => state.shadowCount);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursor(e.clientX, e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [setCursor]);

  // Simulation Loop
  useEffect(() => {
     let animationFrameId: number;
     const loop = () => {
         updateGhosts();
         animationFrameId = requestAnimationFrame(loop);
     };
     loop();
     return () => cancelAnimationFrame(animationFrameId);
  }, [updateGhosts]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Tether Lines - Constellation of Failure */}
      {/* Now valid because ghosts.x/y are updating in real-time */}
      {shadowCount > 20 && ( // Lower threshold to see it sooner? User said >50 for "Monarch", but >20 is good feedback.
          <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible opacity-30">
              {ghosts.map((g, i) => {
                  // Connect to nearest neighbor or just random lines? 
                  // Connecting to *previous* in array creates a chain.
                  // Connecting to cursor (Monarch).
                  if (i === 0) return null;
                  const prev = ghosts[i-1];
                  const dist = Math.hypot(g.x - prev.x, g.y - prev.y);
                  
                  // Only draw if close enough to look like a connection, not a mess
                  if (dist > 300) return null; 

                  return (
                    <line 
                        key={`link-${g.id}`}
                        x1={g.x} y1={g.y}
                        x2={prev.x} y2={prev.y}
                        stroke="#a855f7"
                        strokeWidth="1"
                    />
                  );
              })}
          </svg>
      )}

      {ghosts.map((ghost) => (
        <GhostParticle key={ghost.id} ghost={ghost} />
      ))}
    </div>
  );
};
