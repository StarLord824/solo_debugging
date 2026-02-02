'use client';
import React, { useEffect, useState } from 'react';
import { useEntropyStore } from '@/store/useEntropyStore';
import { useServerMetrics } from '@/hooks/useServerMetrics';
import { MetricChart } from './MetricChart';
import { Terminal } from './Terminal';
import { DriftingCard } from './DriftingCard';
import { Sidebar } from './Sidebar';
import { motion } from 'motion/react';
import { Zap, Brain, Activity, Database, Cpu } from 'lucide-react';

export const Dashboard: React.FC = () => {
    const { stability, entropy, logs, increaseEntropy, reboot } = useEntropyStore();
    const { data, isError } = useServerMetrics(); // This drives the feedback loop
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    // Derived visual severity
    const getContainerStyle = () => {
        if (stability >= 70) return {};
        
        const severity = 70 - stability; // 0 to 70
        return {
            backdropFilter: `blur(${severity * 0.1}px) contrast(${100 + severity * 2}%)`,
            filter: `hue-rotate(${severity * 2}deg)`,
            transform: `skewX(${severity * 0.05}deg) scale(${1 + severity * 0.001})`
        };
    };

    const isCritical = stability < 20;

    return (
        <div 
             className="relative min-h-screen bg-sys-dark text-sys-green overflow-hidden flex"
        >
             {/* Global Backdrop for Stability Effects */}
             <div 
                className="absolute inset-0 pointer-events-none z-0 transition-all duration-300"
                style={getContainerStyle()}
             />

            <Sidebar />

            <div className="flex-1 flex flex-col p-4 md:p-8 relative z-10 gap-4">
                {/* Header */}
                <DriftingCard className="flex border-b border-sys-green pb-4 justify-between items-center bg-black/80 p-4">
                    <div className="flex flex-col">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter flex items-center gap-4">
                            SYSCAP_CORE <Zap className={isCritical ? "text-sys-red" : "text-sys-green"} />
                        </h1>
                        <span className="text-xs tracking-[0.5em] opacity-70">SENTIENT MONITORING SYSTEM</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="text-xl font-bold">STATUS: {isCritical ? <span className="text-sys-red animate-pulse">CRITICAL FAILURE</span> : <span className="text-sys-green">OPERATIONAL</span>}</div>
                        <div className="font-mono text-2xl">STABILITY: <span className={stability < 50 ? "text-sys-red" : "text-sys-green"}>{stability.toFixed(1)}%</span></div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => increaseEntropy(15)}
                                className="px-4 py-2 text-xs bg-sys-red/10 border border-sys-red text-sys-red hover:bg-sys-red hover:text-black transition-all font-bold uppercase tracking-widest active:scale-95"
                            >
                                STRESS TEST
                            </button>
                            <button 
                                onClick={reboot}
                                className="px-4 py-2 text-xs bg-sys-green/10 border border-sys-green text-sys-green hover:bg-sys-green hover:text-black transition-all font-bold uppercase tracking-widest active:scale-95"
                            >
                                REBOOT
                            </button>
                        </div>
                    </div>
                </DriftingCard>

                {/* Main Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DriftingCard className="h-48">
                        <div className="flex items-center gap-2 mb-2 p-2 bg-black/40"><Cpu size={16}/> CPU LOAD</div>
                        <MetricChart label="" value={data?.cpu || 0} />
                    </DriftingCard>
                    <DriftingCard className="h-48">
                        <div className="flex items-center gap-2 mb-2 p-2 bg-black/40"><Database size={16}/> MEMORY</div>
                        <MetricChart label="" value={data?.memory || 0} color="bg-cyan-500"/>
                    </DriftingCard>
                    <DriftingCard className="h-48">
                         <div className="flex items-center gap-2 mb-2 p-2 bg-black/40"><Brain size={16}/> NEURAL SYNAPSE</div>
                         <MetricChart label="" value={data?.neuralLoad || 0} color="bg-purple-500" />
                    </DriftingCard>
                    <DriftingCard className="h-48">
                         <div className="flex items-center gap-2 mb-2 p-2 bg-black/40"><Activity size={16}/> ENTROPY VECTOR</div>
                         <div className="h-full flex items-center justify-center text-4xl font-black text-sys-red">
                             {(data?.entropyVector || 0).toFixed(2)}
                         </div>
                    </DriftingCard>
                </div>

                {/* Error Log / Terminal */}
                <Terminal />
            </div>
            
            {/* Scanline overlay */}
            <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
        </div>
    );
};
