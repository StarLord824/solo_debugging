import React, { useEffect, useState, useRef } from 'react';

const BOOT_SEQUENCE = [
  "KERNEL_INIT: 0x00000000",
  "LOADING_DAEMON: WATCHER_V1",
  "ALLOCATING MEMORY...",
  "MOUNTING VOID...",
  "SUCCESS.",
  "LISTENING FOR INTERRUPTS...",
];

export const TerminalLogs: React.FC = () => {
  const [logs, setLogs] = useState<string[]>(BOOT_SEQUENCE);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Stream pseudo-random system logs
      const rand = Math.random();
      let msg = `SYS_TICK: ${Date.now()}`;
      
      if (rand > 0.9) msg = "DAEMON_PING: OK";
      if (rand > 0.95) msg = "ALLOC_REQ: 64kb";
      if (rand > 0.98) msg = "GC_COLLECT: 0 objects freed"; // Necromancy hint

      setLogs(prev => [...prev, msg].slice(-30));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Update logic to inject errors? 
  // Actually, the user wants the ghost spawning to be the main error mechanic.
  // But logs should reflect it too. 

  useEffect(() => {
      if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="font-mono text-xs md:text-sm text-necro-purple opacity-70 flex flex-col gap-1 p-8 h-full justify-end pointer-events-none">
      {logs.map((log, i) => (
        <div key={i} className="opacity-50">{log}</div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
