import React from 'react';
import { motion } from 'motion/react';

interface MetricChartProps {
  label: string;
  value: number;
  color?: string;
}

export const MetricChart: React.FC<MetricChartProps> = ({ label, value, color = 'bg-sys-green' }) => {
  return (
    <div className="flex flex-col gap-2 p-4 border border-sys-green/30 bg-black/50 backdrop-blur-sm">
      <div className="flex justify-between items-end">
        <h3 className="text-xl font-bold uppercase tracking-widest">{label}</h3>
        <span className="text-2xl font-mono">{Math.round(value)}%</span>
      </div>
      
      {/* Chart container */}
      <div className="h-32 flex items-end gap-1 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className={`flex-1 ${color} opacity-80`}
            initial={{ height: '0%' }}
            animate={{ 
              height: `${Math.min(100, Math.max(5, value * (0.5 + Math.random())))}%`,
              opacity: i % 2 === 0 ? 0.8 : 0.4 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          />
        ))}
      </div>
    </div>
  );
};
