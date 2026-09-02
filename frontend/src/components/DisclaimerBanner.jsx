import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function DisclaimerBanner() {
  return (
    <div className="bg-slate-900/90 border-b border-cyan-500/20 px-4 py-2 text-xs flex items-center justify-between text-slate-300">
      <div className="flex items-center space-x-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="font-semibold text-cyan-400 tracking-wide uppercase">Research & Demonstration Prototype</span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-300">100% Synthetic Fictional Identity Data • Zero Real Biometrics • Standalone Operation</span>
      </div>
      <div className="hidden md:flex items-center space-x-3 text-[11px] text-slate-400">
        <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">SIH26188</span>
        <span className="bg-cyan-950/80 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800 font-mono">DEMO / DETERMINISTIC MODE</span>
      </div>
    </div>
  );
}
