import React from 'react';
import { Server, Activity, ShieldAlert, Cpu } from 'lucide-react';
import { useEntropyStore } from '@/store/useEntropyStore';

export const Sidebar: React.FC = () => {
    const { stability } = useEntropyStore();
    
    // Simulate clusters
    const clusters = [
        { name: 'ALPHA_NODE', status: stability > 80 ? 'active' : 'warn' },
        { name: 'BETA_LINK', status: stability > 60 ? 'active' : 'warn' },
        { name: 'GAMMA_CORE', status: stability > 40 ? 'active' : 'crit' },
        { name: 'DELTA_VOID', status: stability > 20 ? 'active' : 'crit' },
    ];

    const getStatusColor = (status: string) => {
        if (status === 'active') return 'text-sys-green shadow-[0_0_10px_#00ff41]';
        if (status === 'warn') return 'text-yellow-500 animate-pulse';
        return 'text-sys-red animate-ping shadow-[0_0_20px_#ff0000]';
    };

    return (
        <div className="flex flex-col gap-6 p-4 border-r border-sys-green/20 bg-black/40 backdrop-blur-md min-w-[200px]">
             <div className="flex items-center gap-2 mb-4">
                <Activity className="text-sys-green" />
                <h2 className="font-bold tracking-widest text-sm">CLUSTERS</h2>
            </div>
            
            <div className="flex flex-col gap-4">
                {clusters.map((cluster, idx) => (
                    <div key={idx} className="flex items-center justify-between border-b border-sys-green/10 pb-2">
                        <div className="flex items-center gap-2">
                            <Server size={16} className={stability < 30 ? "animate-spin" : ""} />
                            <span className="text-xs font-mono">{cluster.name}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(cluster.status)}`} />
                    </div>
                ))}
            </div>

            <div className="mt-auto">
                 <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className={stability < 50 ? "text-sys-red animate-bounce" : "text-sys-green"} />
                    <span className="text-xs font-bold">FIREWALL</span>
                </div>
                <div className="h-1 w-full bg-sys-dark border border-sys-green/30">
                    <div 
                        className="h-full bg-sys-green transition-all" 
                        style={{ width: `${stability}%`, opacity: stability > 20 ? 1 : 0.5 }} 
                    />
                </div>
            </div>
        </div>
    );
};
