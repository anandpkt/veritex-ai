import React from 'react';
import { Database, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, ShieldAlert, FileText } from 'lucide-react';

export default function GroundTruthComparison({ groundTruthVerification, extractedData, documentType }) {
  if (!groundTruthVerification) {
    return (
      <div className="gov-card p-6 text-center text-gov-muted space-y-2">
        <Database className="w-8 h-8 text-gov-muted mx-auto" />
        <p className="text-[13px]">No external database cross-verification record available.</p>
      </div>
    );
  }

  const {
    record_found,
    database_authority,
    match_status,
    risk_classification,
    name_similarity_pct,
    authenticity_penalty,
    summary,
    ground_truth_data,
    comparison_fields = []
  } = groundTruthVerification;

  const isCritical = risk_classification === 'CRITICAL_RISK' || !record_found;
  const isMedium = risk_classification === 'MEDIUM_RISK';
  const isMatch = match_status === 'MATCH_VERIFIED';

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div
        className={`p-4 rounded-sm border-l-4 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          isCritical
            ? 'bg-red-50 border-gov-danger text-red-950'
            : isMedium
            ? 'bg-amber-50 border-gov-saffron text-amber-950'
            : 'bg-emerald-50 border-gov-green text-emerald-950'
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            {isCritical ? (
              <ShieldAlert className="w-5 h-5 text-gov-danger flex-shrink-0" />
            ) : isMedium ? (
              <AlertTriangle className="w-5 h-5 text-gov-saffron flex-shrink-0" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-gov-green flex-shrink-0" />
            )}
            <span className="font-bold text-[15px] tracking-wide uppercase">
              {record_found ? match_status.replace(/_/g, ' ') : 'UNREGISTERED DOCUMENT IDENTIFIER'}
            </span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                isCritical
                  ? 'bg-red-200 text-red-900 border-red-400'
                  : isMedium
                  ? 'bg-amber-200 text-amber-900 border-amber-400'
                  : 'bg-emerald-200 text-emerald-900 border-emerald-400'
              }`}
            >
              {risk_classification.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-[12.5px] opacity-90">{summary}</p>
        </div>

        <div className="text-right flex-shrink-0 font-mono text-[12px]">
          <span className="block text-gov-muted text-[11px]">Database Authority</span>
          <span className="font-bold text-gov-primary">{database_authority}</span>
          {authenticity_penalty > 0 && (
            <span className="block text-gov-danger font-bold mt-0.5">
              Score Penalty: -{authenticity_penalty} pts
            </span>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparative Table */}
      <div className="gov-card p-0 overflow-hidden border border-gov-border">
        <div className="p-3 bg-gov-lightBlue border-b border-gov-border flex items-center justify-between">
          <span className="font-bold text-gov-primary text-[13.5px] uppercase tracking-wide flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Cross-Verification Matrix: Scanned ID vs Official Ground-Truth</span>
          </span>
          <span className="text-[11.5px] font-mono text-gov-muted">
            {record_found ? `Entity ID: ${ground_truth_data?.id}` : 'Query Result: 0 Matches'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th className="w-44">Attribute Field</th>
                <th>User Scanned ID (OCR Output)</th>
                <th>Official Government Registry Data</th>
                <th className="w-36 text-center">Field Status</th>
              </tr>
            </thead>
            <tbody>
              {comparison_fields.map((f, idx) => {
                const isFieldMismatch = !f.match;
                const isCritMismatch = f.severity === 'CRITICAL';

                return (
                  <tr
                    key={idx}
                    className={
                      isFieldMismatch
                        ? isCritMismatch
                          ? 'bg-red-50/70 hover:bg-red-100/70'
                          : 'bg-amber-50/70 hover:bg-amber-100/70'
                        : 'hover:bg-gov-bg'
                    }
                  >
                    {/* Field Name */}
                    <td className="font-bold text-gov-text text-[13px] font-mono">
                      {f.field}
                    </td>

                    {/* Scanned ID Value */}
                    <td
                      className={`font-mono text-[13px] font-semibold ${
                        isFieldMismatch ? 'text-red-700 bg-red-100/50 px-2 py-1 rounded' : 'text-gov-text'
                      }`}
                    >
                      {f.extracted || 'N/A'}
                    </td>

                    {/* Ground-Truth Value */}
                    <td
                      className={`font-mono text-[13px] font-semibold ${
                        isFieldMismatch ? 'text-red-800 font-bold' : 'text-emerald-800'
                      }`}
                    >
                      {f.ground_truth || 'UNREGISTERED'}
                    </td>

                    {/* Status Badge */}
                    <td className="text-center">
                      {f.match ? (
                        <span className="inline-flex items-center space-x-1 text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>EXACT MATCH</span>
                        </span>
                      ) : isCritMismatch ? (
                        <span className="inline-flex items-center space-x-1 text-red-900 bg-red-200 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-red-400">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>CRITICAL MISMATCH</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>MINOR TYPO</span>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
