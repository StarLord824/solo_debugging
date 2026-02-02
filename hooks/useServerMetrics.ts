import { useQuery } from '@tanstack/react-query';
import { useEntropyStore } from '@/store/useEntropyStore';

interface ServerMetrics {
  cpu: number;
  memory: number;
  networkLatency: number;
  neuralLoad: number;
  entropyVector: number;
}

// Mock fetcher that degrades based on stability
const fetchMetrics = async (stability: number): Promise<ServerMetrics> => {
  // 1. Calculate chaos factors
  const instability = 100 - stability;
  const chaosFactor = instability / 100; // 0.0 to 1.0

  // 2. Simulate Network Latency
  // Base 100ms, max +2000ms based on chaos
  const delay = 100 + (Math.random() * 2000 * chaosFactor * chaosFactor); 
  
  await new Promise(resolve => setTimeout(resolve, delay));

  // 3. Simulate Packet Loss / Error 500
  // Chance of failure increases with instability
  const failureChance = Math.max(0, (instability - 20) / 100); // Starts failing < 80% stability
  if (Math.random() < failureChance) {
    throw new Error("PACKET_LOSS");
  }

  // 4. Generate Data
  return {
    cpu: Math.min(100, Math.max(10, 30 + (Math.random() * 50 * chaosFactor) + (chaosFactor * 20))),
    memory: Math.min(100, 40 + (Math.random() * 40 * chaosFactor)),
    networkLatency: delay,
    neuralLoad: Math.min(100, 20 + (Math.random() * 60) + (chaosFactor * 20)),
    entropyVector: instability + (Math.random() * 10),
  };
};

export const useServerMetrics = () => {
  const { stability, increaseEntropy, addLog } = useEntropyStore();

  return useQuery({
    queryKey: ['serverMetrics'], // Should strictly depend on stability? No, we want it to poll.
    queryFn: async () => {
      try {
        const data = await fetchMetrics(stability);
        // Small chance to heal or stabilize slightly? No, this is entropy.
        return data;
      } catch (err) {
        // FEEDBACK LOOP: Failed queries drain stability!
        const drainAmount = 2 + (Math.random() * 3);
        increaseEntropy(drainAmount);
        addLog(`ERROR: Connection packet dropped. Stability -${drainAmount.toFixed(1)}%`);
        throw err;
      }
    },
    refetchInterval: Math.max(200, 1000 - (100 - stability) * 8), // Stability drops -> Polling gets faster (panic mode)
    retry: false, // We want to catch the error in the UI or let it bubble to the fetcher catch? 
                  // Actually, queryFn catch block handles the side effect. 
                  // We disable internal retry to force the side effect on every failure immediately.
  });
};
