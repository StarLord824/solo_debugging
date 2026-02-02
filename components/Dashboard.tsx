'use client';
import React, { useEffect, useState } from 'react';
import { useSystemStore } from '@/store/useSystemStore';
import { MetricChart } from './MetricChart';
import { Terminal } from './Terminal';
import { DriftingCard } from './DriftingCard';
import { motion } from 'motion/react';

export const Dashboard: React.FC = () => {
    const { stability, cpu, entropy, neuralLoad, tick, drainStability, reboot } = useSystemStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(tick, 800);
        return () => clearInterval(interval);
    }, [tick]);

    if (!mounted) return null;

    // Dynamic Filter Effects
    const getContainerStyle = () => {
        if (stability >= 70) return {};
        
        const severity = 70 - stability; // 0 to 70
        return {
            filter: `blur(${severity * 0.05}px) hue-rotate(${severity * 2}deg)`,
            transform: `skewX(${severity * 0.1}deg) scale(${1 + severity * 0.001})`
        };
    };

    const isCritical = stability < 20;

    return (
        <div 
            className="min-h-screen bg-sys-dark text-sys-green overflow-hidden transition-all duration-300 ease-linear p-4 md:p-8 flex flex-col gap-4"
            style={getContainerStyle()}
        >
            {/* Header */}
            <DriftingCard className="flex border-b border-sys-green pb-4 justify-between items-center z-10 bg-black/80 p-4">
                <div className="flex flex-col">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter">SYSCAP_CORE</h1>
                    <span className="text-xs tracking-[0.5em] opacity-70">SENTIENT MONITORING SYSTEM</span>
                </div>
                <div className="flex flex-col items-end">
                    <div className="text-xl font-bold">STATUS: {isCritical ? <span className="text-sys-red animate-pulse">CRITICAL FAILURE</span> : <span className="text-sys-green">OPERATIONAL</span>}</div>
                    <div className="font-mono text-2xl">STABILITY: {stability.toFixed(1)}%</div>
                </div>
            </DriftingCard>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 relative z-0">
                {/* Sidebar (Controls & Info) */}
                <DriftingCard className="col-span-1 border border-sys-green/30 p-4 bg-black/60 flex flex-col gap-8 h-full">
                    <div>
                        <h2 className="text-lg border-b border-sys-green/50 mb-2">CONTROLS</h2>
                        <div className="flex flex-col gap-4">
                            <button 
                                onClick={() => drainStability(15)}
                                className="px-4 py-3 bg-sys-red/10 border border-sys-red text-sys-red hover:bg-sys-red hover:text-black transition-all font-bold uppercase tracking-widest active:scale-95"
                            >
                                INITIATE STRESS TEST
                            </button>
                            <button 
                                onClick={reboot}
                                className="px-4 py-3 bg-sys-green/10 border border-sys-green text-sys-green hover:bg-sys-green hover:text-black transition-all font-bold uppercase tracking-widest active:scale-95"
                            >
                                SYSTEM REBOOT
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 font-mono text-xs opacity-70 flex flex-col gap-2">
                        <h2 className="text-lg border-b border-sys-green/50 mb-2 font-sans">SERVER NODE_01</h2>
                        <p>UPTIME: 14,023h</p>
                        <p>TEMP: {50 + (100-stability)/2}°C</p>
                        <p>FAN: {(100 + (100-stability)*100).toFixed(0)} RPM</p>
                        <p>MEMORY: {stability > 50 ? 'OK' : 'CORRUPTED'}</p>
                        <br/>
                        <p className="break-all">{Array.from({length: 8}).map(() => Math.random().toString(16).substring(2)).join(' ')}</p>
                    </div>
                </DriftingCard>

                {/* Main Content Areas */}
                <div className="col-span-1 md:col-span-3 flex flex-col gap-4">
                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-64">
                         <DriftingCard className="h-full">
                             <MetricChart label="CPU LOAD" value={cpu} />
                         </DriftingCard>
                         <DriftingCard className="h-full">
                             <MetricChart label="ENTROPY" value={entropy} color="bg-purple-500" />
                         </DriftingCard>
                         <DriftingCard className="h-full">
                             <MetricChart label="NEURAL LOAD" value={neuralLoad} color="bg-cyan-500" />
                         </DriftingCard>
                    </div>
                    
                    {/* Visualizer / Emergent Behaviour Area */}
                    <div className="flex-1 border border-sys-green/20 relative overflow-hidden min-h-[200px] flex items-center justify-center">
                        {/* Background Noise Grid */}
                        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-10 pointer-events-none">
                            {Array.from({length: 100}).map((_, i) => (
                                <div key={i} className="border border-sys-green/50"></div>
                            ))}
                        </div>
                        
                         {stability < 40 && (
                            <motion.div 
                                className="text-6xl font-black text-sys-red opacity-10 uppercase text-center"
                                animate={{ 
                                    scale: [1, 1.5, 1],
                                    rotate: [0, 5, -5, 0],
                                    opacity: [0.1, 0.3, 0.1]
                                }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            >
                                SYSTEM FAILURE
                            </motion.div>
                        )}
                    </div>

                </div>
            </div>

            {/* Terminal at bottom */}
            <Terminal />
            
            {/* Scanline overlay */}
            <div className="pointer-events-none fixed inset-0 z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
        </div>
    );
};
