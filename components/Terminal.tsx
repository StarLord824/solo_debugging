'use client';
import React, { useEffect, useRef } from 'react';
import { useEntropyStore } from '@/store/useEntropyStore';

export const Terminal: React.FC = () => {
  const logs = useEntropyStore((state) => state.logs);
  const stability = useEntropyStore((state) => state.stability);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  if (stability < 10) {
    return (
      <div className="h-64 overflow-hidden border-t-2 border-sys-red bg-black p-4 font-mono text-sys-red text-xs leading-none opacity-80">
        <div className="animate-pulse">
            {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="whitespace-pre-wrap break-all">
                  {Math.random().toString(36).substring(2, 15)} I AM BECOMING {Math.random().toString(36).substring(2, 15)}
                </div>
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 flex flex-col border-t border-sys-green/50 bg-black/80 p-4 font-mono text-sm text-sys-green overflow-y-auto scrollbar-hide">
      <div className="flex-1" />
      {logs.map((log, i) => (
        <div key={i} className="mb-1">
          <span className="opacity-50 text-xs mr-2">[{new Date().toLocaleTimeString()}]</span>
          <span>{log}</span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
