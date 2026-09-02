import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, XCircle, ShieldAlert } from 'lucide-react';

export default function RiskGauge({
  score = 0,
  level = 'LOW',
  action = 'PASS',
  integrity = 100,
  identity = 100,
  consistency = 100,
  forensic = 100,
  processingTime = 320
}) {
  // Determine color scheme based on risk score
  const getColorScheme = (score) => {
    if (score < 30) {
      return {
        bg: 'from-emerald-950/40 to-slate-900/90',
        border: 'border-emerald-500/40',
        glow: 'shadow-glow-emerald',
        text: 'text-emerald-400',
        badgeBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
        stroke: '#10B981',
        icon: ShieldCheck,
      };
    } else if (score < 60) {
      return {
        bg: 'from-amber-950/40 to-slate-900/90',
        border: 'border-amber-500/40',
        glow: 'shadow-glow-amber',
        text: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
        stroke: '#F59E0B',
        icon: AlertTriangle,
      };
    } else if (score < 80) {
      return {
        bg: 'from-rose-950/40 to-slate-900/90',
        border: 'border-rose-500/40',
        glow: 'shadow-glow-rose',
        text: 'text-rose-400',
        badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
        stroke: '#F43F5E',
        icon: ShieldAlert,
      };
    } else {
      return {
        bg: 'from-purple-950/50 to-slate-900/90',
        border: 'border-purple-500/40',
        glow: 'shadow-[0_0_25px_-5px_rgba(168,85,247,0.3)]',
        text: 'text-purple-400',
        badgeBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
        stroke: '#A855F7',
        icon: AlertOctagon,
      };
    }
  };

  const scheme = getColorScheme(score);
  const Icon = scheme.icon;

  // SVG Gauge calculations (semi-circle arc)
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * (circumference * 0.75);

  return (
    <div className={`cyber-card rounded-2xl p-6 border ${scheme.border} ${scheme.glow} relative overflow-hidden`}>
      {/* Top Banner */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <Icon className={`w-5 h-5 ${scheme.text}`} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Explainable Risk Assessment
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          Latency: <strong className="text-slate-200">{processingTime}ms</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-5">
        {/* Left: Animated Radial Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-135" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                strokeLinecap="round"
              />
              {/* Animated Progress Indicator */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={scheme.stroke}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-extrabold font-mono tracking-tight ${scheme.text}`}>
                {score}
              </span>
              <span className="text-[11px] font-mono text-slate-400">/ 100</span>
              <span className={`mt-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${scheme.badgeBg}`}>
                {level} RISK
              </span>
            </div>
          </div>
        </div>

        {/* Right: Operational Action & 4 Core Pillars */}
        <div className="md:col-span-7 space-y-4">
          <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Recommended Operational Decision
            </div>
            <div className={`text-sm font-bold tracking-wide flex items-center space-x-2 ${scheme.text}`}>
              <span>{action}</span>
            </div>
          </div>

          {/* 4 Core Pillars Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Document Integrity</span>
                <span className="font-mono text-slate-200 font-semibold">{integrity}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full transition-all duration-700"
                  style={{ width: `${integrity}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Identity Confidence</span>
                <span className="font-mono text-slate-200 font-semibold">{identity}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                  style={{ width: `${identity}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Data Consistency</span>
                <span className="font-mono text-slate-200 font-semibold">{consistency}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                  style={{ width: `${consistency}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Forensic Reliability</span>
                <span className="font-mono text-slate-200 font-semibold">{forensic}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-700"
                  style={{ width: `${forensic}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
