import { create } from 'zustand';

export interface Ghost {
  id: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  errorMsg: string;
}

interface GhostState {
  ghosts: Ghost[];
  shadowCount: number;
  isCollapsed: boolean;
  cursor: { x: number; y: number };
  
  spawnGhost: (errorMsg?: string) => void;
  updateGhosts: () => void;
  setCursor: (x: number, y: number) => void;
  reset: () => void;
}

const ERROR_MESSAGES = [
  "SEGFAULT",
  "NULL_PTR",
  "FATAL_EXC",
  "0x00452",
  "STACK_OVERFLOW",
  "HEAP_CORRUPTION",
  "DAEMON_UNBOUND",
  "VOID_RETURN"
];

export const useGhostStore = create<GhostState>((set) => ({
  ghosts: [],
  shadowCount: 0,
  isCollapsed: false,
  cursor: { x: 0, y: 0 },

  spawnGhost: (errorMsg) => set((state) => {
    const newCount = state.shadowCount + 1;
    const isNowCollapsed = newCount > 50;

    // "Extract" from the bottom-left/center (Terminal Area)
    // Assuming terminal is mostly bottom-half. 
    // We spawn them there and let them float out.
    const startX = typeof window !== 'undefined' ? 50 + Math.random() * (window.innerWidth / 2) : 500;
    const startY = typeof window !== 'undefined' ? window.innerHeight - 150 - Math.random() * 100 : 800;

    const newGhost: Ghost = {
      id: Math.random().toString(36).substring(7),
      x: startX,
      y: startY,
      errorMsg: errorMsg || ERROR_MESSAGES[Math.floor(Math.random() * ERROR_MESSAGES.length)]
    };

    return {
      ghosts: [...state.ghosts, newGhost],
      shadowCount: newCount,
      isCollapsed: isNowCollapsed
    };
  }),

  updateGhosts: () => set((state) => {
    // Simple Boids-like behavior:
    // 1. Attraction to Cursor (Monarch)
    // 2. Random jitter (Chaos)
    // 3. Velocity damping
    
    if (state.ghosts.length === 0) return {};

    const cursor = state.cursor;
    const newGhosts = state.ghosts.map(ghost => {
        // Vector to cursor
        const dx = cursor.x - ghost.x;
        const dy = cursor.y - ghost.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        // Attraction force (stronger if far, weaker if close to avoid piling)
        // If collapsed (Monarch State), stronger attraction? Or explosion? 
        // User said: "Constellation" -> interconnected.
        const attraction = state.isCollapsed ? 0.05 : 0.02;
        
        let vx = (ghost.vx || 0) + dx * attraction * 0.01;
        let vy = (ghost.vy || 0) + dy * attraction * 0.01;

        // Random jitter (The "Ghost" twitch)
        vx += (Math.random() - 0.5) * 2;
        vy += (Math.random() - 0.5) * 2;

        // Damping (Friction)
        vx *= 0.95;
        vy *= 0.95;

        // Update position
        return {
            ...ghost,
            x: ghost.x + vx,
            y: ghost.y + vy,
            vx,
            vy
        };
    });

    return { ghosts: newGhosts };
  }),

  setCursor: (x, y) => set({ cursor: { x, y } }),

  reset: () => set({ ghosts: [], shadowCount: 0, isCollapsed: false })
}));
