import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown, ChevronUp, AlertCircle, AlertTriangle, CheckCircle2, Terminal } from 'lucide-react';

export default function EvidenceTable({ evidence = [] }) {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState(null);

  const getSeverityBadge = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return {
          bg: 'bg-purple-100 text-purple-900 border-purple-300',
          label: 'CRITICAL',
          icon: AlertCircle,
        };
      case 'danger':
        return {
          bg: 'bg-rose-100 text-rose-900 border-rose-300',
          label: 'HIGH SEVERITY',
          icon: AlertCircle,
        };
      case 'warning':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          label: 'WARNING',
          icon: AlertTriangle,
        };
      case 'info':
      default:
        return {
          bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          label: 'PASSED',
          icon: CheckCircle2,
        };
    }
  };

  if (!evidence || evidence.length === 0) {
    return (
      <div className="gov-card text-center text-gov-muted py-6">
        No active anomalies or discrepancy flags reported on this record.
      </div>
    );
  }

  return (
    <div className="gov-card space-y-3">
      <div className="gov-section-header">
        <span>Ranked Evidence & Discrepancy Findings ({evidence.length})</span>
        <span className="text-[12px] font-normal text-gov-muted">ICAO Doc 9303 & ISO Standards Compliance</span>
      </div>

      <div className="overflow-x-auto border border-gov-border rounded-sm">
        <table className="gov-table">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>Finding & Description</th>
              <th className="w-36">Severity</th>
              <th className="w-32">Target Field</th>
              <th className="w-24 text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {evidence.map((item, idx) => {
              const badge = getSeverityBadge(item.severity);
              const isExpanded = expandedId === item.id;
              const Icon = badge.icon;

              return (
                <React.Fragment key={item.id || idx}>
                  <tr className="hover:bg-gov-lightBlue transition-colors">
                    <td className="text-center font-bold text-gov-muted font-mono text-[12px]">
                      {idx + 1}
                    </td>
                    <td className="space-y-0.5">
                      <div className="font-bold text-gov-primary text-[14px]">
                        {item.title}
                      </div>
                      <div className="text-[13px] text-gov-muted">
                        {item.description}
                      </div>
                    </td>
                    <td>
                      <span className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2 py-0.5 rounded border uppercase ${badge.bg}`}>
                        <Icon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                    </td>
                    <td className="font-mono text-[12px] text-gov-muted font-semibold">
                      {item.field || 'General'}
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="text-gov-primary hover:text-gov-secondary text-[12px] font-semibold underline inline-flex items-center space-x-1"
                        aria-label={`Toggle technical details for ${item.title}`}
                      >
                        <span>{isExpanded ? 'Hide' : 'Inspect'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Technical Detail Drawer */}
                  {isExpanded && item.technical_detail && (
                    <tr>
                      <td colSpan="5" className="bg-[#F0F4F8] p-3 text-[13px] border-t border-gov-border">
                        <div className="space-y-1">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-gov-primary flex items-center space-x-1">
                            <Terminal className="w-3.5 h-3.5 text-gov-saffron" />
                            <span>Algorithmic Telemetry & Rule Output:</span>
                          </div>
                          <div className="bg-white p-2.5 rounded border border-gov-border font-mono text-[12px] text-gov-text break-all leading-relaxed">
                            {item.technical_detail}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
