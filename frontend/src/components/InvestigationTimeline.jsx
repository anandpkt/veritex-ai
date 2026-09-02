import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function InvestigationTimeline({ timeline = [] }) {
  const { t } = useLanguage();

  if (!timeline || timeline.length === 0) {
    return (
      <div className="gov-card text-center text-gov-muted py-6 text-[13px]">
        No timeline events recorded for this screening session.
      </div>
    );
  }

  const totalDuration = timeline.reduce((acc, step) => acc + (step.duration_ms || 0), 0);

  return (
    <div className="gov-card space-y-4">
      <div className="gov-section-header">
        <div>
          <span>Investigation Pipeline Audit Trail</span>
          <p className="text-[12px] font-normal text-gov-muted">
            Chronological multi-layer execution log across all 10 verification stages
          </p>
        </div>
        <div className="text-right">
          <span className="text-[12px] text-gov-muted block">Total Processing Latency:</span>
          <span className="text-[14px] font-mono font-bold text-gov-primary">{totalDuration} ms</span>
        </div>
      </div>

      <div className="border border-gov-border rounded-sm overflow-hidden">
        <table className="gov-table">
          <thead>
            <tr>
              <th className="w-12 text-center">#</th>
              <th>Pipeline Stage</th>
              <th className="w-28 text-center">Status</th>
              <th className="w-28 text-right">Duration</th>
              <th className="w-36">Timestamp</th>
              <th>Stage Audit Details</th>
            </tr>
          </thead>
          <tbody>
            {timeline.map((step, idx) => {
              const isFlagged = step.status === 'FLAGGED';

              return (
                <tr key={step.step_id || idx} className={isFlagged ? 'bg-red-50/50' : ''}>
                  <td className="text-center font-bold text-gov-muted font-mono text-[12px]">
                    {idx + 1}
                  </td>
                  <td className="font-bold text-gov-primary text-[13.5px]">
                    {step.step_name}
                  </td>
                  <td className="text-center">
                    {isFlagged ? (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-gov-danger bg-red-100 px-2 py-0.5 rounded border border-red-300">
                        <AlertTriangle className="w-3 h-3" />
                        <span>FLAGGED</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-gov-green bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>PASSED</span>
                      </span>
                    )}
                  </td>
                  <td className="text-right font-mono text-[12px] font-bold text-gov-text">
                    +{step.duration_ms} ms
                  </td>
                  <td className="font-mono text-[12px] text-gov-muted">
                    {step.timestamp}
                  </td>
                  <td className="text-[12.5px] text-gov-text">
                    {step.details}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
