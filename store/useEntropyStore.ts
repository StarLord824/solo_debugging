import { create } from 'zustand';

interface EntropyState {
  stability: number;   // 0-100, where 100 is stable
  entropy: number;     // 0-100, derived inverse of stability or independent chaos factor
  isCollapsing: boolean;
  logs: string[];
  
  // Actions
  increaseEntropy: (amount: number) => void; // Drains stability
  decreaseEntropy: (amount: number) => void; // Heals stability (optional, or for reboot)
  reboot: () => void;
  addLog: (message: string) => void;
}

const INITIAL_LOGS = [
  "Initialize SYSCAP_CORE v9.2...",
  "Loading neural pathways...",
  "Connecting to server cluster...",
  "System stable.",
];

export const useEntropyStore = create<EntropyState>((set, get) => ({
  stability: 100,
  entropy: 0,
  isCollapsing: false,
  logs: [...INITIAL_LOGS],

  increaseEntropy: (amount) => set((state) => {
    // Stability drops, Entropy rises
    const newStability = Math.max(0, state.stability - amount);
    const newEntropy = Math.min(100, state.entropy + amount);
    
    let newLogs = state.logs;
    
    // Add logs based on stability thresholds (one-time alerts could be handled better, but this works for now)
    // We can use a randomized chance to add glitch logs if entropy is high
    if (newStability < 90 && state.stability >= 90) newLogs = [...newLogs, "WARNING: Entropy rising. Stabilization protocols active."];
    if (newStability < 50 && state.stability >= 50) newLogs = [...newLogs, "ALERT: Neural linkage desynchronizing."];
    if (newStability < 20 && state.stability >= 20) newLogs = [...newLogs, "CRITICAL: REALITY ANCHORS FAILING."];
    if (newStability < 5 && state.stability >= 5) newLogs = [...newLogs, "ERROR: SYSTEM COLLAPSE IMMINENT."];

    return { 
      stability: newStability,
      entropy: newEntropy,
      logs: newLogs,
      isCollapsing: newStability <= 0
    };
  }),

  decreaseEntropy: (amount) => set((state) => {
    const newStability = Math.min(100, state.stability + amount);
    const newEntropy = Math.max(0, state.entropy - amount);
    return { stability: newStability, entropy: newEntropy };
  }),

  reboot: () => set({
    stability: 100,
    entropy: 0,
    isCollapsing: false,
    logs: ["REBOOTING SYSTEM...", ...INITIAL_LOGS],
  }),

  addLog: (message) => set((state) => ({ logs: [...state.logs, message].slice(-50) })),
}));
