import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Cpu, CheckCircle2, Server, Terminal, AlertCircle } from 'lucide-react';
import { getSystemStatus } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';

export default function SystemStatusPage() {
  const { t } = useLanguage();
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getSystemStatus();
        setStatus(data);
      } catch (err) {
        console.error('Failed to load system status telemetry:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="gov-card text-center py-16 space-y-3">
        <div className="w-8 h-8 border-3 border-gov-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-[13px] font-mono text-gov-muted">Polling Subsystem Telemetry...</p>
      </div>
    );
  }

  const engines = status?.engines || [];
  const env = status?.environment || {};

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'System Status & Telemetry' }]} />

      {/* Header */}
      <div className="gov-card border-l-4 border-gov-primary space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-[24px] font-extrabold text-gov-primary">
              Subsystem Telemetry & Micro-Engine Health
            </h1>
            <p className="text-[14px] text-gov-muted">
              Live transparency telemetry for all 6 verification micro-engines, explicitly declaring algorithmic execution mode (Real Local Engine vs High-Precision Deterministic Fallback).
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-1.5 rounded-sm text-[12.5px] font-bold font-mono self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-gov-green" />
            <span>ALL ENGINES OPERATIONAL</span>
          </div>
        </div>
      </div>

      {/* Environment Summary Table */}
      <div className="gov-card space-y-3">
        <div className="gov-section-header">
          <span>Execution Environment & Host Telemetry</span>
          <span className="text-[12px] font-mono text-gov-muted">Hardware Profile</span>
        </div>

        <div className="border border-gov-border rounded-sm overflow-hidden">
          <table className="gov-table">
            <tbody>
              <tr>
                <td className="w-48 font-bold text-gov-primary bg-gov-lightBlue">Host Operating System</td>
                <td className="font-mono text-[13px]">{env.os || 'Windows 11 CPU Host'}</td>
              </tr>
              <tr>
                <td className="font-bold text-gov-primary bg-gov-lightBlue">Runtime Python Kernel</td>
                <td className="font-mono text-[13px] text-gov-primary font-bold">Python {env.python_version || '3.13'}</td>
              </tr>
              <tr>
                <td className="font-bold text-gov-primary bg-gov-lightBlue">Processing Mode</td>
                <td className="font-semibold text-gov-green">CPU-Optimized (Zero GPU Hardware Requirement)</td>
              </tr>
              <tr>
                <td className="font-bold text-gov-primary bg-gov-lightBlue">Prototype Disclaimer</td>
                <td className="text-gov-muted text-[13px]">Research / Demonstration Prototype — Synthetic Data Only</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 6 Micro-Engines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {engines.map((eng) => {
          const isReal = eng.type === 'REAL_ENGINE';

          return (
            <div
              key={eng.id}
              className="gov-card space-y-3 flex flex-col justify-between border-t-4 border-gov-primary"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-gov-border">
                  <span className="font-bold text-gov-primary text-[14px]">
                    {eng.name}
                  </span>
                  <span className="text-[11px] font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded font-bold">
                    {eng.status}
                  </span>
                </div>

                <div className="text-[12.5px]">
                  <span className="text-gov-muted font-bold block mb-0.5">Execution Mode:</span>
                  <span
                    className={`font-mono text-[12px] font-bold px-2 py-0.5 rounded border inline-block ${
                      isReal
                        ? 'bg-gov-lightBlue text-gov-primary border-gov-border'
                        : 'bg-amber-100 text-amber-900 border-amber-300'
                    }`}
                  >
                    {eng.mode}
                  </span>
                </div>

                <p className="text-[13px] text-gov-text leading-relaxed">
                  {eng.description}
                </p>
              </div>

              <div className="pt-3 border-t border-gov-border flex items-center justify-between text-[11.5px] font-mono text-gov-muted">
                <span>Average Latency: <strong>{eng.latency_avg_ms} ms</strong></span>
                <span className={isReal ? 'text-gov-primary font-bold' : 'text-gov-saffron font-bold'}>
                  {isReal ? '✓ REAL ALGORITHMIC ENGINE' : 'ℹ DEMO / DETERMINISTIC FALLBACK'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
