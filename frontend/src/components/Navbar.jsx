import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Activity, PlusCircle, Sparkles, Terminal } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="bg-[#0D1322] border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-indigo-600 to-slate-900 p-0.5 shadow-glow-cyan flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0F19] rounded-[7px] flex items-center justify-center group-hover:bg-opacity-80 transition">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-wider text-white">VERIDEX</span>
              <span className="bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border border-cyan-500/30">AI</span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-tight hidden sm:block">From Document Scan to Explainable Risk</p>
          </div>
        </Link>

        {/* Center Quick Stats */}
        <div className="hidden lg:flex items-center space-x-6 text-xs text-slate-400">
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Risk Engine: <strong className="text-slate-200">ONLINE</strong></span>
          </div>
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Avg Response: <strong className="text-slate-200">3.8s</strong></span>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            to="/synthetic-lab"
            className="flex items-center space-x-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-3 py-2 rounded-lg transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Synthetic Lab</span>
          </Link>
          <Link
            to="/screening/new"
            className="flex items-center space-x-1.5 text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 px-3.5 py-2 rounded-lg shadow-glow-cyan transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Screening</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
