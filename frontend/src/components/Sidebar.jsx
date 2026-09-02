import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileScan,
  History,
  Eye,
  Share2,
  Sliders,
  FlaskConical,
  FileText,
  Cpu,
  Layers
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'New Screening', path: '/screening/new', icon: FileScan, badge: 'Live' },
  { name: 'Screening History', path: '/history', icon: History },
  { name: 'Document Forensics', path: '/forensics', icon: Eye },
  { name: 'Digital Twin', path: '/digital-twin', icon: Layers },
  { name: 'Identity Graph', path: '/identity-graph', icon: Share2 },
  { name: 'Risk Simulator', path: '/risk-simulator', icon: Sliders },
  { name: 'Synthetic Lab', path: '/synthetic-lab', icon: FlaskConical, badge: 'Demo' },
  { name: 'Reports Dossier', path: '/reports', icon: FileText },
  { name: 'System Status', path: '/system-status', icon: Cpu },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#0D1322] border-r border-slate-800 flex flex-col flex-shrink-0 min-h-[calc(100vh-64px-33px)] p-4">
      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-3">
        SOC Screening Console
      </div>
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold shadow-glow-cyan'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`
              }
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    item.badge === 'Live'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* System Engine Mode Box */}
      <div className="mt-6 bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 text-[11px] space-y-2">
        <div className="flex items-center justify-between text-slate-300">
          <span className="font-semibold">Engine Operating Mode</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        </div>
        <div className="text-slate-400 text-[10px] leading-relaxed">
          Zero-Dataset deterministic screening with local ELA & MRZ algorithms active.
        </div>
        <div className="pt-1 flex items-center justify-between font-mono text-[9px] text-slate-400 border-t border-slate-800">
          <span>PIPELINE v2.4</span>
          <span>100% STANDALONE</span>
        </div>
      </div>
    </aside>
  );
}
