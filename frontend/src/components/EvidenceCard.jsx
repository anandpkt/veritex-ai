import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, ChevronDown, ChevronUp, Cpu, ExternalLink } from 'lucide-react';

export default function EvidenceCard({ evidence = [], onHighlightRegion = null }) {
  const [expandedId, setExpandedId] = useState(null);

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-purple-950/80 text-purple-300 border-purple-800',
          dot: 'bg-purple-400',
          icon: AlertCircle,
          label: 'CRITICAL DISCREPANCY',
        };
      case 'danger':
        return {
          bg: 'bg-rose-950/80 text-rose-300 border-rose-800',
          dot: 'bg-rose-400',
          icon: AlertCircle,
          label: 'HIGH SEVERITY',
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/80 text-amber-300 border-amber-800',
          dot: 'bg-amber-400',
          icon: AlertTriangle,
          label: 'WARNING ANOMALY',
        };
      case 'info':
      default:
        return {
          bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
          dot: 'bg-emerald-400',
          icon: CheckCircle2,
          label: 'VERIFIED / PASS',
        };
    }
  };

  if (!evidence || evidence.length === 0) {
    return (
      <div className="cyber-card rounded-xl p-6 text-center text-slate-400 text-xs">
        No active evidence flags detected on this document scan.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {evidence.map((item, idx) => {
        const badge = getSeverityBadge(item.severity);
        const Icon = badge.icon;
        const isExpanded = expandedId === item.id;

        return (
          <div
            key={item.id || idx}
            className="cyber-card rounded-xl border border-slate-800 hover:border-slate-700 transition overflow-hidden"
          >
            <div
              className="p-4 flex items-start justify-between cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono font-bold text-slate-300">
                    {idx + 1}
                  </span>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-200">
                      {item.title}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border flex items-center space-x-1 ${badge.bg}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                      <span>{badge.label}</span>
                    </span>
                    {item.field && (
                      <span className="text-[10px] font-mono bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                        Field: {item.field}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-slate-400 ml-4 flex-shrink-0">
                <button
                  type="button"
                  className="p-1 hover:text-cyan-400 transition"
                  aria-label="Toggle technical details"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Technical Detail Expandable Drawer */}
            {isExpanded && item.technical_detail && (
              <div className="px-4 pb-4 pt-1 bg-slate-950/60 border-t border-slate-800/80">
                <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  <Cpu className="w-3 h-3 text-cyan-400" />
                  <span>Forensic & Algorithmic Subsystem Telemetry</span>
                </div>
                <div className="font-mono text-[11px] text-cyan-300/90 bg-slate-900/90 p-2.5 rounded border border-slate-800 break-all leading-relaxed">
                  {item.technical_detail}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
