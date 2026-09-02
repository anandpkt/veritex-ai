import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Shield,
  FileCheck,
  AlertTriangle,
  Clock,
  ArrowRight,
  TrendingUp,
  FileText,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { getDashboardStats, getPresets, analyzePreset } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import NoticeBox from '../components/NoticeBox';

export default function DashboardPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzingCaseId, setAnalyzingCaseId] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, presetsData] = await Promise.all([
          getDashboardStats(),
          getPresets()
        ]);
        setStats(statsData);
        setPresets(presetsData);
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleQuickDemo = async (caseId) => {
    try {
      setAnalyzingCaseId(caseId);
      const res = await analyzePreset(caseId);
      navigate(`/screening/${res.id}`);
    } catch (err) {
      console.error('Failed to execute preset analysis:', err);
    } finally {
      setAnalyzingCaseId(null);
    }
  };

  if (loading) {
    return (
      <div className="gov-card text-center py-16 space-y-3">
        <div className="w-8 h-8 border-3 border-gov-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-[13px] font-mono text-gov-muted">Connecting to Service Database...</p>
      </div>
    );
  }

  const metrics = stats?.metrics || {};
  const alerts = stats?.alerts || [];
  const trendData = stats?.screening_trend_24h || [];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />

      {/* 1. Official Service Introduction Header */}
      <div className="gov-card border-l-4 border-gov-primary space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2 text-[12px] text-gov-muted font-bold uppercase tracking-wider">
              <span>Public Service Portal</span>
              <span>•</span>
              <span className="text-gov-primary">SIH26188 Verification Engine</span>
            </div>
            <h1 className="text-[26px] font-extrabold text-gov-primary tracking-tight">
              AI-Based Identity & Document Screening Service
            </h1>
            <p className="text-[14px] text-gov-text leading-relaxed max-w-3xl">
              An explainable, multi-layer verification platform evaluating physical document structures, Optical Character Recognition (OCR), ICAO Doc 9303 MRZ checksums, image forensic patterns (ELA/Noise), and facial biometrics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
            <Link
              to="/screening/new"
              className="gov-btn-primary"
            >
              <FileCheck className="w-4 h-4" />
              <span>{t.btnStartService}</span>
            </Link>
            <Link
              to="/guidelines"
              className="gov-btn-secondary"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Service Guidelines</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Structured Information Architecture Table */}
      <div className="gov-card space-y-3">
        <div className="gov-section-header">
          <span>Service Architecture & Specifications</span>
          <span className="text-[12px] font-normal text-gov-muted">Official Overview</span>
        </div>

        <div className="border border-gov-border rounded-sm overflow-hidden">
          <table className="gov-table">
            <tbody>
              <tr>
                <td className="w-48 font-bold text-gov-primary bg-gov-lightBlue">Service Name</td>
                <td>AI-Assisted Identity & Document Forensic Screening (SIH26188)</td>
              </tr>
              <tr>
                <td className="font-bold text-gov-primary bg-gov-lightBlue">Operating Availability</td>
                <td>Online (Continuous Telemetry)</td>
              </tr>
              <tr>
                <td className="font-bold text-gov-primary bg-gov-lightBlue">Analysis Methods</td>
                <td>Optical Character Recognition (OCR), ICAO 9303 Checksums, Error Level Analysis (ELA), Noise Variance Mapping, Facial Embedding Comparison</td>
              </tr>
              <tr>
                <td className="font-bold text-gov-primary bg-gov-lightBlue">Primary Output</td>
                <td>Explainable 0–100 Risk Score, 4 Core Integrity Pillars, and Official Downloadable PDF Dossier</td>
              </tr>
              <tr>
                <td className="font-bold text-gov-primary bg-gov-lightBlue">Supported Standards</td>
                <td>ICAO Doc 9303 (TD1, TD3), ISO/IEC 19794, Unicode UTF-8</td>
              </tr>
              <tr>
                <td className="font-bold text-gov-primary bg-gov-lightBlue">Supported Languages</td>
                <td>English / தமிழ் (Tamil)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Official Public Service Metrics (Labeled DEMO DATA) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[12px] text-gov-muted font-bold uppercase tracking-wider">
          <span>Operational Throughput Metrics</span>
          <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded font-mono text-[11px]">
            DEMO DATA
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="gov-card border-t-4 border-gov-primary space-y-1">
            <span className="text-[12px] font-bold text-gov-muted uppercase">Today's Screenings</span>
            <div className="text-3xl font-bold font-mono text-gov-primary">
              {metrics.today_screenings?.toLocaleString() || '1,298'}
            </div>
            <p className="text-[12px] text-gov-muted">Continuous pipeline verification count</p>
          </div>

          <div className="gov-card border-t-4 border-gov-green space-y-1">
            <span className="text-[12px] font-bold text-gov-muted uppercase">Low Risk (Verified Pass)</span>
            <div className="text-3xl font-bold font-mono text-gov-green">
              {metrics.low_risk_count?.toLocaleString() || '1,135'}
            </div>
            <p className="text-[12px] text-gov-muted">
              {Math.round(((metrics.low_risk_count || 1135) / (metrics.today_screenings || 1298)) * 100)}% of processed cases
            </p>
          </div>

          <div className="gov-card border-t-4 border-gov-saffron space-y-1">
            <span className="text-[12px] font-bold text-gov-muted uppercase">Medium Risk (Review Req.)</span>
            <div className="text-3xl font-bold font-mono text-gov-saffron">
              {metrics.medium_risk_count?.toLocaleString() || '112'}
            </div>
            <p className="text-[12px] text-gov-muted">Advisory review recommended</p>
          </div>

          <div className="gov-card border-t-4 border-gov-danger space-y-1">
            <span className="text-[12px] font-bold text-gov-muted uppercase">High & Critical Risk</span>
            <div className="text-3xl font-bold font-mono text-gov-danger">
              {((metrics.high_risk_count || 37) + (metrics.critical_risk_count || 14)).toLocaleString()}
            </div>
            <p className="text-[12px] text-gov-muted">Tampering or identity mismatch</p>
          </div>
        </div>
      </div>

      {/* 4. Notice Boxes (Important Information & Privacy Notice) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NoticeBox type="info" title={t.importantNoticeTitle}>
          {t.importantNoticeBody}
        </NoticeBox>
        <NoticeBox type="warning" title={t.privacyNoticeTitle}>
          {t.privacyNoticeBody}
        </NoticeBox>
      </div>

      {/* 5. Deterministic Demo Benchmark Suite (6 Test Cases) */}
      <div className="gov-card space-y-3">
        <div className="gov-section-header">
          <div>
            <span>Deterministic Demo Benchmark Suite (Zero Dataset)</span>
            <p className="text-[12px] font-normal text-gov-muted">
              Pre-configured test specimens demonstrating specific discrepancy detection capabilities
            </p>
          </div>
          <span className="text-[11px] font-mono bg-gov-lightBlue text-gov-primary px-2 py-0.5 rounded border border-gov-border font-bold">
            6 STANDARDIZED CASES
          </span>
        </div>

        <div className="border border-gov-border rounded-sm overflow-hidden">
          <table className="gov-table">
            <thead>
              <tr>
                <th className="w-16">Case ID</th>
                <th>Test Case Title & Subject</th>
                <th>Anomaly Scenario Tested</th>
                <th className="w-36">Expected Risk</th>
                <th className="w-36 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {presets.map((preset, idx) => {
                const isRunning = analyzingCaseId === preset.case_id;
                const isCrit = preset.expected_risk_level === 'CRITICAL';
                const isHigh = preset.expected_risk_level === 'HIGH';
                const isMed = preset.expected_risk_level === 'MEDIUM';

                return (
                  <tr key={preset.case_id}>
                    <td className="font-mono text-[12px] font-bold text-gov-muted">
                      #{idx + 1}
                    </td>
                    <td>
                      <div className="font-bold text-gov-primary">{preset.title}</div>
                      <div className="text-[12px] text-gov-muted font-mono">Subject: {preset.person?.name}</div>
                    </td>
                    <td className="text-[13px] text-gov-text">
                      {preset.description}
                    </td>
                    <td>
                      <span
                        className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border font-mono ${
                          isCrit
                            ? 'bg-purple-100 text-purple-900 border-purple-300'
                            : isHigh
                            ? 'bg-red-100 text-red-900 border-red-300'
                            : isMed
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {preset.expected_risk}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => !isRunning && handleQuickDemo(preset.case_id)}
                        disabled={isRunning}
                        className="gov-btn-primary py-1 px-3 text-[12px]"
                      >
                        {isRunning ? (
                          <span className="animate-spin mr-1">⏳</span>
                        ) : (
                          <FileCheck className="w-3.5 h-3.5" />
                        )}
                        <span>Run Test</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Processing Activity Feed & Screening Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 24-Hour Screening Volume Chart (7 cols) */}
        <div className="lg:col-span-7 gov-card space-y-3">
          <div className="gov-section-header">
            <span>24-Hour Processing Throughput</span>
            <span className="text-[11px] font-mono text-gov-muted">INTERVAL: 2H</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#5F6B73" fontSize={11} tickLine={false} />
                <YAxis stroke="#5F6B73" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D7DDE2', borderRadius: '4px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="screenings" stroke="#123B63" strokeWidth={2} fill="#EAF2F8" fillOpacity={1} name="Total Screenings" />
                <Area type="monotone" dataKey="flagged" stroke="#C62828" strokeWidth={2} fill="#FFEBEE" fillOpacity={0.8} name="Flagged Cases" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Screening Activity Log (5 cols) */}
        <div className="lg:col-span-5 gov-card space-y-3">
          <div className="gov-section-header">
            <span>Recent Screening Activity</span>
            <span className="text-[11px] font-mono text-gov-green font-bold">LIVE TELEMETRY</span>
          </div>

          <div className="space-y-2">
            {alerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className="p-2.5 rounded-sm bg-gov-bg border border-gov-border text-[12.5px] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gov-primary font-mono">{alert.case_id}</span>
                  <span className="text-[11px] text-gov-muted font-mono">{alert.time}</span>
                </div>
                <p className="text-gov-text font-medium text-[12px]">{alert.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
