'use client';
import { create } from 'zustand';

// ============================================
// RANK SYSTEM - The Path of the Shadow Monarch
// ============================================
export interface Rank {
  id: string;
  name: string;
  threshold: number;
  color: string;
  icon: string;
  ability: string;
  abilityDescription: string;
}

export const RANKS: Rank[] = [
  {
    id: 'hunter',
    name: 'SHADOW HUNTER',
    threshold: 0,
    color: '#9ca3af', // Gray
    icon: '🗡️',
    ability: 'none',
    abilityDescription: 'No special abilities. Prove your worth.',
  },
  {
    id: 'slayer',
    name: 'ERROR SLAYER',
    threshold: 10,
    color: '#22c55e', // Green
    icon: '⚔️',
    ability: 'timeExtend',
    abilityDescription: '+1s error timeout. Errors last longer before escaping.',
  },
  {
    id: 'necromancer',
    name: 'NECROMANCER',
    threshold: 25,
    color: '#a855f7', // Purple
    icon: '💀',
    ability: 'shadowStrike',
    abilityDescription: 'Shadow Strike: Click shadows to defeat nearby errors.',
  },
  {
    id: 'monarch',
    name: 'SHADOW MONARCH',
    threshold: 60,
    color: '#fbbf24', // Gold
    icon: '👑',
    ability: 'domainExpansion',
    abilityDescription: 'Domain Expansion: All errors auto-defeated for 5s. Ultimate power.',
  },
];

export const getRankFromShadows = (shadowCount: number): Rank => {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (shadowCount >= RANKS[i].threshold) {
      return RANKS[i];
    }
  }
  return RANKS[0];
};

export const getNextRank = (currentRank: Rank): Rank | null => {
  const idx = RANKS.findIndex(r => r.id === currentRank.id);
  return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
};

// ============================================
// DOMAIN CONFIGURATION - The Battlegrounds
// ============================================
export interface ErrorDomain {
  id: string;
  name: string;
  icon: string;
  color: string;
  errors: string[];
}

export const ERROR_DOMAINS: Record<string, ErrorDomain> = {
  frontend: {
    id: 'frontend',
    name: 'FRONTEND',
    icon: '🖥️',
    color: '#a855f7', // Purple
    errors: [
      'Hydration Mismatch',
      'Cannot read undefined',
      'Invalid hook call',
      'Maximum update depth exceeded',
      'Objects are not valid as React child',
      'Each child must have unique key',
      'useEffect missing dependency',
      'Cannot update unmounted component',
      'Too many re-renders',
      'Minified React error #301',
    ],
  },
  backend: {
    id: 'backend',
    name: 'BACKEND',
    icon: '⚙️',
    color: '#22c55e', // Green
    errors: [
      'ECONNREFUSED',
      'ENOENT: no such file',
      '500 Internal Server Error',
      'TypeError: undefined is not a function',
      'ReferenceError: x is not defined',
      'SyntaxError: Unexpected token',
      'ETIMEDOUT',
      'EADDRINUSE: port already in use',
      'JWT malformed',
      'Unhandled promise rejection',
    ],
  },
  database: {
    id: 'database',
    name: 'DATABASE',
    icon: '🗄️',
    color: '#3b82f6', // Blue
    errors: [
      'Deadlock detected',
      'ORA-01017: invalid credentials',
      'Duplicate key violation',
      'Foreign key constraint failed',
      'Connection pool exhausted',
      'Query timeout exceeded',
      'Table does not exist',
      'Column ambiguously defined',
      'Transaction aborted',
      'Lock wait timeout',
    ],
  },
  devops: {
    id: 'devops',
    name: 'DEVOPS',
    icon: '🐳',
    color: '#f97316', // Orange
    errors: [
      'OOMKilled',
      'ImagePullBackOff',
      'CrashLoopBackOff',
      'Pod evicted',
      'ErrImagePull',
      'CreateContainerError',
      'NodeNotReady',
      'FailedScheduling',
      'Liveness probe failed',
      'Exit code 137',
    ],
  },
};

// ============================================
// GHOST (Shadow) ENTITY
// ============================================
export interface Ghost {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  errorMsg: string;
  domain: string;
  color: string;
  isActive: boolean; // Active = on battlefield, not yet defeated
  spawnTime: number;
}

// ============================================
// ARENA STATE
// ============================================
interface ArenaState {
  // Shadow Army
  ghosts: Ghost[];
  shadowCount: number;
  isCollapsed: boolean;
  cursor: { x: number; y: number };

  // Domain & Waves
  activeDomain: string;
  currentWave: number;
  isWaveActive: boolean;
  errorsPerWave: number;
  activeErrors: Ghost[]; // Errors currently on the battlefield
  errorTimeout: number; // Base timeout in ms (can be extended by rank)

  // Player Stats
  playerXP: number;
  playerLevel: number;
  stability: number; // 0-100
  currentRank: Rank;
  previousRank: Rank | null; // For detecting rank-up events
  justRankedUp: boolean;

  // Abilities
  abilityActive: boolean;
  abilityEndTime: number;

  // Actions
  setDomain: (domain: string) => void;
  startWave: () => void;
  spawnError: () => void;
  defeatError: (ghostId: string) => void;
  missError: (ghostId: string) => void;
  updateGhosts: () => void;
  setCursor: (x: number, y: number) => void;
  activateAbility: () => void;
  shadowStrike: (ghostId: string) => void;
  clearRankUp: () => void;
  reset: () => void;
}

// ============================================
// XP & LEVEL CALCULATIONS
// ============================================
const getXPForLevel = (level: number) => Math.floor(100 * Math.pow(1.5, level - 1));
const getLevelFromXP = (xp: number) => {
  let level = 1;
  let required = 100;
  while (xp >= required) {
    level++;
    required = getXPForLevel(level);
  }
  return level;
};

// ============================================
// THE STORE - Necromancer Engine
// ============================================
export const useGhostStore = create<ArenaState>((set, get) => ({
  // Initial State
  ghosts: [],
  shadowCount: 0,
  isCollapsed: false,
  cursor: { x: 0, y: 0 },
  activeDomain: 'frontend',
  currentWave: 0,
  isWaveActive: false,
  errorsPerWave: 3,
  activeErrors: [],
  errorTimeout: 5000, // 5 seconds base
  playerXP: 0,
  playerLevel: 1,
  stability: 100,
  currentRank: RANKS[0],
  previousRank: null,
  justRankedUp: false,
  abilityActive: false,
  abilityEndTime: 0,

  // Set active domain
  setDomain: (domain) => set({ activeDomain: domain }),

  // Start a new wave
  startWave: () => {
    const state = get();
    if (state.isWaveActive) return;

    const newWave = state.currentWave + 1;
    const errorsToSpawn = Math.min(3 + Math.floor(newWave / 2), 10); // Scale difficulty

    set({
      currentWave: newWave,
      isWaveActive: true,
      errorsPerWave: errorsToSpawn,
      activeErrors: [],
    });

    // Spawn errors with delay
    for (let i = 0; i < errorsToSpawn; i++) {
      setTimeout(() => {
        get().spawnError();
      }, i * 800); // Stagger spawns
    }
  },

  // Spawn a single error on the battlefield
  spawnError: () => set((state) => {
    const domain = ERROR_DOMAINS[state.activeDomain];
    const errorMsg = domain.errors[Math.floor(Math.random() * domain.errors.length)];

    // Spawn in center-ish area with some randomness
    const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 500;
    const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;

    const newError: Ghost = {
      id: Math.random().toString(36).substring(2, 9),
      x: centerX + (Math.random() - 0.5) * 400,
      y: centerY + (Math.random() - 0.5) * 200,
      vx: 0,
      vy: 0,
      errorMsg,
      domain: state.activeDomain,
      color: domain.color,
      isActive: true,
      spawnTime: Date.now(),
    };

    return {
      activeErrors: [...state.activeErrors, newError],
      stability: Math.max(0, state.stability - 2), // Each spawn hurts stability
    };
  }),

  // Defeat an error - add to shadow army
  defeatError: (ghostId) => set((state) => {
    const error = state.activeErrors.find((e) => e.id === ghostId);
    if (!error) return {};

    // Convert to shadow
    const shadow: Ghost = {
      ...error,
      isActive: false,
    };

    const newShadowCount = state.shadowCount + 1;
    const xpGain = 10 + state.currentWave * 2;
    const newXP = state.playerXP + xpGain;
    const newLevel = getLevelFromXP(newXP);
    
    // Check for rank up
    const newRank = getRankFromShadows(newShadowCount);
    const didRankUp = newRank.id !== state.currentRank.id;
    
    // Monarch state at 60 shadows
    const isNowCollapsed = newShadowCount >= 60;
    
    // ERROR SLAYER ability: +1s timeout
    const newTimeout = newRank.ability === 'timeExtend' ? 6000 : state.errorTimeout;

    // Check if wave is complete
    const remainingActive = state.activeErrors.filter((e) => e.id !== ghostId);
    const waveComplete = remainingActive.length === 0;

    return {
      ghosts: [...state.ghosts, shadow],
      shadowCount: newShadowCount,
      activeErrors: remainingActive,
      playerXP: newXP,
      playerLevel: newLevel,
      stability: Math.min(100, state.stability + 1),
      isCollapsed: isNowCollapsed,
      isWaveActive: !waveComplete,
      currentRank: newRank,
      previousRank: didRankUp ? state.currentRank : state.previousRank,
      justRankedUp: didRankUp,
      errorTimeout: newTimeout,
    };
  }),

  // Miss an error - it escapes, hurting stability
  missError: (ghostId) => set((state) => {
    const remainingActive = state.activeErrors.filter((e) => e.id !== ghostId);
    const waveComplete = remainingActive.length === 0;

    return {
      activeErrors: remainingActive,
      stability: Math.max(0, state.stability - 10), // Big penalty for missing
      isWaveActive: !waveComplete,
    };
  }),

  // Update ghost positions (Boids-like flocking)
  updateGhosts: () => set((state) => {
    if (state.ghosts.length === 0) return {};

    const cursor = state.cursor;
    const newGhosts = state.ghosts.map((ghost) => {
      // Vector to cursor
      const dx = cursor.x - ghost.x;
      const dy = cursor.y - ghost.y;

      // Attraction force (stronger in Monarch state)
      const attraction = state.isCollapsed ? 0.08 : 0.03;

      let vx = ghost.vx + dx * attraction * 0.01;
      let vy = ghost.vy + dy * attraction * 0.01;

      // Random jitter (The "Ghost" twitch)
      vx += (Math.random() - 0.5) * 1.5;
      vy += (Math.random() - 0.5) * 1.5;

      // Damping
      vx *= 0.92;
      vy *= 0.92;

      return {
        ...ghost,
        x: ghost.x + vx,
        y: ghost.y + vy,
        vx,
        vy,
      };
    });

    return { ghosts: newGhosts };
  }),

  setCursor: (x, y) => set({ cursor: { x, y } }),

  // Activate special ability based on current rank
  activateAbility: () => {
    const state = get();
    const rank = state.currentRank;
    
    if (rank.ability === 'domainExpansion' && !state.abilityActive) {
      // Domain Expansion: Auto-defeat all errors for 5 seconds
      set({ 
        abilityActive: true, 
        abilityEndTime: Date.now() + 5000 
      });
      
      // Auto-defeat all current errors
      const { activeErrors, defeatError } = get();
      activeErrors.forEach(error => {
        defeatError(error.id);
      });
      
      // Clear ability after 5 seconds
      setTimeout(() => {
        set({ abilityActive: false, abilityEndTime: 0 });
      }, 5000);
    }
  },

  // Shadow Strike: Click a shadow to defeat nearby errors (Necromancer ability)
  shadowStrike: (ghostId) => set((state) => {
    if (state.currentRank.ability !== 'shadowStrike') return {};
    
    const shadow = state.ghosts.find(g => g.id === ghostId);
    if (!shadow) return {};
    
    // Find errors within 150px of the shadow
    const nearbyErrors = state.activeErrors.filter(error => {
      const dist = Math.hypot(error.x - shadow.x, error.y - shadow.y);
      return dist < 150;
    });
    
    if (nearbyErrors.length === 0) return {};
    
    // Defeat the first nearby error
    const targetError = nearbyErrors[0];
    const shadowFromError: Ghost = { ...targetError, isActive: false };
    const newShadowCount = state.shadowCount + 1;
    const newRank = getRankFromShadows(newShadowCount);
    const didRankUp = newRank.id !== state.currentRank.id;
    
    return {
      ghosts: [...state.ghosts, shadowFromError],
      shadowCount: newShadowCount,
      activeErrors: state.activeErrors.filter(e => e.id !== targetError.id),
      playerXP: state.playerXP + 15, // Bonus XP for ability use
      currentRank: newRank,
      previousRank: didRankUp ? state.currentRank : state.previousRank,
      justRankedUp: didRankUp,
      isCollapsed: newShadowCount >= 60,
    };
  }),

  // Clear rank-up notification
  clearRankUp: () => set({ justRankedUp: false }),

  reset: () => set({
    ghosts: [],
    shadowCount: 0,
    isCollapsed: false,
    currentWave: 0,
    isWaveActive: false,
    activeErrors: [],
    errorTimeout: 5000,
    playerXP: 0,
    playerLevel: 1,
    stability: 100,
    currentRank: RANKS[0],
    previousRank: null,
    justRankedUp: false,
    abilityActive: false,
    abilityEndTime: 0,
  }),
}));

