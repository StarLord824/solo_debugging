'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useGhostStore } from '@/store/useGhostStore';

export const TerminalLogs: React.FC = () => {
  const activeDomain = useGhostStore((s) => s.activeDomain);
  const currentWave = useGhostStore((s) => s.currentWave);
  const shadowCount = useGhostStore((s) => s.shadowCount);
  const stability = useGhostStore((s) => s.stability);

  const [logs, setLogs] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Domain-specific log messages
  const DOMAIN_LOGS: Record<string, string[]> = {
    frontend: [
      'VDOM_RECONCILE: 0x0000',
      'FIBER_NODE: Mounted',
      'HYDRATION_CHECK: OK',
      'EFFECT_CLEANUP: Running',
      'STATE_UPDATE: Batched',
      'RENDER_PHASE: Complete',
      'SUSPENSE_BOUNDARY: Resolved',
    ],
    backend: [
      'SERVER_TICK: ' + Date.now(),
      'ROUTE_MATCH: /api/*',
      'MIDDLEWARE: Executed',
      'DB_POOL: 12 active',
      'CACHE_HIT: true',
      'REQUEST_LOG: 200 OK',
      'EVENT_LOOP: Idle',
    ],
    database: [
      'QUERY_PARSE: OK',
      'INDEX_SCAN: users_pkey',
      'LOCK_ACQUIRED: row',
      'TRANSACTION: BEGIN',
      'WAL_WRITE: 64kb',
      'CHECKPOINT: Complete',
      'VACUUM: Running',
    ],
    devops: [
      'CONTAINER_HEALTH: OK',
      'POD_STATUS: Running',
      'NODE_CPU: 34%',
      'INGRESS_ROUTE: Matched',
      'SECRET_MOUNT: /var/run',
      'REPLICA_SET: 3/3',
      'HPA_SCALE: 1x',
    ],
  };

  const BOOT_SEQUENCE = [
    '> SOLO_DEBUGGER v1.0.0',
    '> INITIALIZING SHADOW EXTRACTION PROTOCOL...',
    '> CONNECTING TO VOID...',
    '> MOUNTING ERROR DIMENSIONS...',
    '> SYSTEM READY.',
    '> AWAITING HUNT INITIATION...',
  ];

  useEffect(() => {
    setLogs(BOOT_SEQUENCE);
  }, []);

  // Stream domain-specific logs
  useEffect(() => {
    const interval = setInterval(() => {
      const domainLogs = DOMAIN_LOGS[activeDomain] || DOMAIN_LOGS.frontend;
      const randomLog = domainLogs[Math.floor(Math.random() * domainLogs.length)];

      let logEntry = `[${activeDomain.toUpperCase()}] ${randomLog}`;

      // Add status messages based on game state
      if (Math.random() > 0.9) {
        logEntry = `> SHADOW_COUNT: ${shadowCount} | STABILITY: ${stability.toFixed(0)}%`;
      }
      if (Math.random() > 0.95 && currentWave > 0) {
        logEntry = `> WAVE ${currentWave} DETECTED. ERRORS MANIFESTING...`;
      }

      setLogs((prev) => [...prev, logEntry].slice(-40));
    }, 600);

    return () => clearInterval(interval);
  }, [activeDomain, shadowCount, stability, currentWave]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  return (
    <div className="absolute inset-0 font-mono text-xs text-necro-purple/40 flex flex-col gap-0.5 p-8 overflow-hidden pointer-events-none">
      <div className="flex-1 overflow-hidden flex flex-col justify-end">
        {logs.map((log, i) => (
          <div
            key={i}
            className={`truncate ${log.startsWith('>') ? 'text-necro-purple/60' : 'opacity-40'}`}
          >
            {log}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
