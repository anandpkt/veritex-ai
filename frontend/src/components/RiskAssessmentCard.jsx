import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, AlertTriangle, AlertCircle, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export default function RiskAssessmentCard({
  score = 0,
  level = 'LOW',
  action = 'PASS',
  integrity = 100,
  identity = 100,
  consistency = 100,
  forensic = 100,
  processingTime = 320,
  referenceId = 'VRX-SPECIMEN',
  timestamp = ''
}) {
  const { t } = useLanguage();

  const getRiskDetails = (score, level) => {
    if (score < 30 || level === 'LOW') {
      return {
        badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        barColor: 'bg-gov-green',
        icon: ShieldCheck,
        iconColor: 'text-gov-green',
        boxBorder: 'border-l-4 border-gov-green',
        levelLabel: t.riskLow,
        actionLabel: t.actionPass,
      };
    } else if (score < 60 || level === 'MEDIUM') {
      return {
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        barColor: 'bg-gov-saffron',
        icon: AlertTriangle,
        iconColor: 'text-gov-saffron',
        boxBorder: 'border-l-4 border-gov-saffron',
        levelLabel: t.riskMedium,
        actionLabel: t.actionManualReview,
      };
    } else if (score < 80 || level === 'HIGH') {
      return {
        badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
        barColor: 'bg-gov-danger',
        icon: ShieldAlert,
        iconColor: 'text-gov-danger',
        boxBorder: 'border-l-4 border-gov-danger',
        levelLabel: t.riskHigh,
        actionLabel: action.includes('PHYSICAL') ? t.actionPhysicalInspect : t.actionManualReview,
      };
    } else {
      return {
        badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
        barColor: 'bg-[#6A1B9A]',
        icon: AlertCircle,
        iconColor: 'text-[#6A1B9A]',
        boxBorder: 'border-l-4 border-[#6A1B9A]',
        levelLabel: t.riskCritical,
        actionLabel: t.actionReject,
      };
    }
  };

  const details = getRiskDetails(score, level);
  const Icon = details.icon;

  return (
    <div className={`gov-card ${details.boxBorder} space-y-4`}>
      {/* Header with Reference ID and Processing Latency */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gov-border text-[13px]">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-gov-primary uppercase tracking-wider">
            Verification Assessment Summary
          </span>
          <span className="text-gov-muted">•</span>
          <span className="font-mono text-gov-muted font-bold">
            Ref: {referenceId}
          </span>
        </div>

        <div className="flex items-center space-x-3 text-[12px] text-gov-muted font-mono">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Processing Time: <strong>{processingTime} ms</strong></span>
          </span>
          {timestamp && <span>• {timestamp}</span>}
        </div>
      </div>

      {/* Main Score & Action Evaluation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Formal Score Display */}
        <div className="md:col-span-4 bg-gov-bg p-4 rounded-sm border border-gov-border text-center space-y-1.5">
          <span className="text-[12px] font-bold uppercase tracking-wider text-gov-muted block">
            {t.riskScore}
          </span>
          <div className="text-4xl font-extrabold font-mono text-gov-primary">
            {score} <span className="text-lg font-normal text-gov-muted">/ 100</span>
          </div>
          <span className={`inline-block px-3 py-1 rounded-sm text-[12px] font-bold uppercase border ${details.badgeBg}`}>
            {details.levelLabel}
          </span>
        </div>

        {/* Right: Operational Action & 4 Core Pillars */}
        <div className="md:col-span-8 space-y-3.5">
          <div className="bg-gov-lightBlue p-3.5 rounded-sm border border-gov-border">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gov-primary mb-0.5">
              Recommended Administrative Decision:
            </div>
            <div className="text-[15px] font-bold text-gov-primary flex items-center space-x-2">
              <Icon className={`w-5 h-5 ${details.iconColor} flex-shrink-0`} />
              <span>{action || details.actionLabel}</span>
            </div>
          </div>

          {/* 4 Pillars Progress Grid */}
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <div className="bg-white p-2.5 rounded-sm border border-gov-border">
              <div className="flex justify-between text-gov-muted text-[12px] mb-1 font-medium">
                <span>{t.pillarIntegrity}</span>
                <span className="font-mono font-bold text-gov-text">{integrity}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-sm overflow-hidden">
                <div className="h-full bg-gov-primary" style={{ width: `${integrity}%` }} />
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-sm border border-gov-border">
              <div className="flex justify-between text-gov-muted text-[12px] mb-1 font-medium">
                <span>{t.pillarIdentity}</span>
                <span className="font-mono font-bold text-gov-text">{identity}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-sm overflow-hidden">
                <div className="h-full bg-gov-secondary" style={{ width: `${identity}%` }} />
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-sm border border-gov-border">
              <div className="flex justify-between text-gov-muted text-[12px] mb-1 font-medium">
                <span>{t.pillarConsistency}</span>
                <span className="font-mono font-bold text-gov-text">{consistency}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-sm overflow-hidden">
                <div className="h-full bg-gov-green" style={{ width: `${consistency}%` }} />
              </div>
            </div>

            <div className="bg-white p-2.5 rounded-sm border border-gov-border">
              <div className="flex justify-between text-gov-muted text-[12px] mb-1 font-medium">
                <span>{t.pillarForensic}</span>
                <span className="font-mono font-bold text-gov-text">{forensic}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-sm overflow-hidden">
                <div className="h-full bg-gov-saffron" style={{ width: `${forensic}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
