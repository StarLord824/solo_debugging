import { create } from 'zustand';

interface SystemState {
  stability: number;
  cpu: number;
  entropy: number;
  neuralLoad: number;
  logs: string[];
  isCollapsed: boolean;
  
  // Actions
  drainStability: (amount: number) => void;
  reboot: () => void;
  tick: () => void;
  addLog: (message: string) => void;
}

const INITIAL_LOGS = [
  "Initialize SYSCAP_CORE v9.2...",
  "Loading neural pathways...",
  "Connecting to server cluster...",
  "System stable.",
];

export const useSystemStore = create<SystemState>((set, get) => ({
  stability: 100,
  cpu: 12,
  entropy: 0.5,
  neuralLoad: 24,
  logs: [...INITIAL_LOGS],
  isCollapsed: false,

  drainStability: (amount) => set((state) => {
    const newStability = Math.max(0, state.stability - amount);
    let newLogs = state.logs;
    
    // Add logs based on stability drops
    if (newStability < 90 && state.stability >= 90) newLogs = [...newLogs, "WARNING: Stability deviation detected."];
    if (newStability < 70 && state.stability >= 70) newLogs = [...newLogs, "ALERT: Structural integrity compromised."];
    if (newStability < 40 && state.stability >= 40) newLogs = [...newLogs, "CRITICAL: Reality anchors failing."];
    if (newStability < 10 && state.stability >= 10) newLogs = [...newLogs, "ERROR: SYSTEM COLLAPSE IMMINENT."];

    return { 
      stability: newStability,
      logs: newLogs,
      isCollapsed: newStability <= 0
    };
  }),

  reboot: () => set({
    stability: 100,
    cpu: 12,
    entropy: 0.5,
    neuralLoad: 24,
    logs: ["REBOOTING...", ...INITIAL_LOGS],
    isCollapsed: false,
  }),

  addLog: (message) => set((state) => ({ logs: [...state.logs, message].slice(-50) })), // Keep last 50 logs

  tick: () => set((state) => {
    // If collapsed, only generate ASCII garbage logs occasionally
    if (state.stability < 10) {
       const garbage = Math.random() > 0.7 ? 
         `0x${Math.floor(Math.random()*16777215).toString(16)} CORRUPT` : null;
       
       return {
         logs: garbage ? [...state.logs, garbage].slice(-20) : state.logs,
         cpu: 100,
         entropy: 100,
         neuralLoad: 100
       };
    }

    // Normal operation: Random fluctuations
    // CPU fluctuates around stability (lower stability = higher/more erratic CPU)
    const stabilityFactor = (100 - state.stability) / 100; // 0 to 1
    
    // Random fluctuation -5 to +5 normally, but higher variance as stability drops
    const fluctuation = (Math.random() - 0.5) * (10 + stabilityFactor * 50); 
    
    let newCpu = Math.max(0, Math.min(100, state.cpu + fluctuation));
    let newEntropy = Math.max(0, Math.min(100, state.entropy + (Math.random() - 0.4) * 2 + stabilityFactor));
    let newNeuralLoad = Math.max(0, Math.min(100, state.neuralLoad + (Math.random() - 0.5) * 5 + stabilityFactor * 2));

    // Auto-decay stability slightly if it is already damaged
    let newStability = state.stability;
    if (state.stability < 100 && state.stability > 10) {
        newStability = Math.max(0, newStability - 0.05); // Slow decay
    }
    
    // Add periodic logs
    let newLogs = state.logs;
    if (Math.random() > 0.98) {
       const messages = [
         "Packet loss detected on sub-net 4.",
         "Cooling system operating at 87%.",
         "Neural patterns converging.",
         "Heuristic scan complete.",
         "Writing swap file...",
         "Checking memory integrity..."
       ];
       newLogs = [...newLogs, messages[Math.floor(Math.random() * messages.length)]].slice(-50);
    }

    return {
      cpu: newCpu,
      entropy: newEntropy,
      neuralLoad: newNeuralLoad,
      stability: newStability,
      logs: newLogs
    };
  }),
}));
