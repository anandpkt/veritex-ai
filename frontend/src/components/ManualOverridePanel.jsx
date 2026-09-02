import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, RotateCcw, Check, AlertTriangle, UserCheck } from 'lucide-react';
import { applyManualOverride } from '../services/api';

export default function ManualOverridePanel({ screeningId, currentOverrideStatus, currentNotes, onOverrideApplied }) {
  const [overrideStatus, setOverrideStatus] = useState(currentOverrideStatus || 'NONE');
  const [notes, setNotes] = useState(currentNotes || '');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleApply = async (action) => {
    try {
      setSubmitting(true);
      setSuccessMessage('');
      const res = await applyManualOverride(screeningId, {
        action,
        reviewer_notes: notes.trim() || `Officer decision applied: ${action}`,
        actor: 'SECURITY_OFFICER_ADMIN'
      });
      setOverrideStatus(action);
      setSuccessMessage(`Decision [${action}] recorded in immutable audit ledger.`);
      if (onOverrideApplied) {
        onOverrideApplied(res.screening);
      }
    } catch (err) {
      console.error('Failed to apply manual override:', err);
      alert('Failed to log manual override. Please check network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gov-card border-2 border-gov-primary space-y-4 bg-[#FBFDFE]">
      <div className="flex items-center justify-between border-b border-gov-border pb-3">
        <div className="flex items-center space-x-2">
          <UserCheck className="w-5 h-5 text-gov-primary" />
          <h3 className="text-[15px] font-bold text-gov-primary uppercase tracking-wide">
            Human Security Officer Decision & Manual Override Panel
          </h3>
        </div>
        {overrideStatus !== 'NONE' && (
          <span
            className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
              overrideStatus === 'APPROVE_OVERRIDE'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : overrideStatus === 'ESCALATE_FRAUD'
                ? 'bg-red-100 text-red-900 border-red-300'
                : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}
          >
            STATUS: {overrideStatus.replace(/_/g, ' ')}
          </span>
        )}
      </div>

      {successMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-sm text-[12.5px] flex items-center space-x-2 font-mono">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Reviewer Notes Input */}
      <div>
        <label className="block text-[12.5px] font-bold text-gov-text mb-1">
          Reviewer Audit Justification / Case Notes:
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter investigation rationale, secondary physical check notes, or biometric validation reference..."
          rows={2}
          className="gov-input text-[12.5px] font-mono resize-none"
        />
      </div>

      {/* 3 Decision Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <span className="text-[11px] text-gov-muted italic">
          All actions are timestamped and signed in the immutable security audit trail.
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action 1: Manual Approve */}
          <button
            type="button"
            onClick={() => handleApply('APPROVE_OVERRIDE')}
            disabled={submitting}
            className="px-3 py-1.5 text-[12.5px] font-bold text-emerald-900 bg-emerald-100 hover:bg-emerald-200 border border-emerald-400 rounded-sm inline-flex items-center space-x-1.5 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>Approve Override (Pass)</span>
          </button>

          {/* Action 2: Escalate Fraud */}
          <button
            type="button"
            onClick={() => handleApply('ESCALATE_FRAUD')}
            disabled={submitting}
            className="px-3 py-1.5 text-[12.5px] font-bold text-red-900 bg-red-100 hover:bg-red-200 border border-red-400 rounded-sm inline-flex items-center space-x-1.5 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-gov-danger" />
            <span>Escalate to Fraud Unit</span>
          </button>

          {/* Action 3: Request Re-upload */}
          <button
            type="button"
            onClick={() => handleApply('REQUEST_REUPLOAD')}
            disabled={submitting}
            className="px-3 py-1.5 text-[12.5px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-400 rounded-sm inline-flex items-center space-x-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-amber-700" />
            <span>Request Re-upload</span>
          </button>
        </div>
      </div>
    </div>
  );
}
