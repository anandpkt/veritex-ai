import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sliders, RotateCcw, Activity, ShieldCheck, AlertTriangle, ShieldAlert, AlertCircle } from 'lucide-react';
import { calculateSimulation } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import RiskAssessmentCard from '../components/RiskAssessmentCard';
import NoticeBox from '../components/NoticeBox';

export default function RiskSimulatorPage() {
  const { t } = useLanguage();

  // Active Signal States
  const [tampering, setTampering] = useState(true);
  const [mrzMismatch, setMrzMismatch] = useState(true);
  const [faceMismatch, setFaceMismatch] = useState(false);
  const [expiredDoc, setExpiredDoc] = useState(false);
  const [metadataAnomaly, setMetadataAnomaly] = useState(false);

  // Signal Weights
  const [wTampering, setWTampering] = useState(30);
  const [wMrz, setWMrz] = useState(20);
  const [wFace, setWFace] = useState(20);
  const [wConsistency, setWConsistency] = useState(15);
  const [wValidity, setWValidity] = useState(10);
  const [wMetadata, setWMetadata] = useState(5);

  const [simResult, setSimResult] = useState(null);
  const [previousScore, setPreviousScore] = useState(null);

  const runSimulation = async () => {
    try {
      const res = await calculateSimulation({
        tampering_detected: tampering,
        mrz_mismatch: mrzMismatch,
        face_mismatch: faceMismatch,
        expired_document: expiredDoc,
        metadata_anomaly: metadataAnomaly,
        weight_tampering: Number(wTampering),
        weight_mrz: Number(wMrz),
        weight_face: Number(wFace),
        weight_consistency: Number(wConsistency),
        weight_validity: Number(wValidity),
        weight_metadata: Number(wMetadata),
      });
      if (simResult) {
        setPreviousScore(simResult.risk_score);
      }
      setSimResult(res);
    } catch (err) {
      console.error('Simulation calculation error:', err);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [tampering, mrzMismatch, faceMismatch, expiredDoc, metadataAnomaly, wTampering, wMrz, wFace, wConsistency, wValidity, wMetadata]);

  const handleResetWeights = () => {
    setWTampering(30);
    setWMrz(20);
    setWFace(20);
    setWConsistency(15);
    setWValidity(10);
    setWMetadata(5);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Services', path: '/' }, { label: 'Risk Simulator' }]} />

      {/* Header */}
      <div className="gov-card border-l-4 border-gov-primary space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-[24px] font-extrabold text-gov-primary">
              Multi-Signal Risk Fusion Simulator
            </h1>
            <p className="text-[14px] text-gov-muted">
              Adjust multi-signal weights and toggle verification anomalies in real time to observe dynamic risk score fusion.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetWeights}
            className="gov-btn-secondary text-[12px] py-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Weights</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Toggles & Weight Sliders (6 cols) */}
        <div className="lg:col-span-6 space-y-5">
          {/* Signal Toggles */}
          <div className="gov-card space-y-3">
            <div className="gov-section-header">
              <span>Active Evidence Signal Toggles</span>
              <span className="text-[12px] font-normal text-gov-muted">Input Flags</span>
            </div>

            <div className="space-y-2 text-[13px]">
              {/* Tampering */}
              <div className="p-3 rounded-sm bg-gov-bg border border-gov-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-gov-text block">Image Forensics / ELA Tampering</span>
                  <span className="text-[12px] text-gov-muted">Compression discontinuities and high-pass noise seams</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTampering(!tampering)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    tampering ? 'bg-gov-danger' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      tampering ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* MRZ Mismatch */}
              <div className="p-3 rounded-sm bg-gov-bg border border-gov-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-gov-text block">MRZ Checksum & Field Conflict</span>
                  <span className="text-[12px] text-gov-muted">Visual OCR divergence from ICAO MRZ TD3 payload</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMrzMismatch(!mrzMismatch)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    mrzMismatch ? 'bg-gov-danger' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      mrzMismatch ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Face Mismatch */}
              <div className="p-3 rounded-sm bg-gov-bg border border-gov-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-gov-text block">Facial Biometric Divergence</span>
                  <span className="text-[12px] text-gov-muted">Live selfie vector similarity &lt; 70% authorized threshold</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFaceMismatch(!faceMismatch)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    faceMismatch ? 'bg-gov-danger' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      faceMismatch ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Expired Document */}
              <div className="p-3 rounded-sm bg-gov-bg border border-gov-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-gov-text block">Document Expiry Date Elapsed</span>
                  <span className="text-[12px] text-gov-muted">Chronological validity limit expired in past</span>
                </div>
                <button
                  type="button"
                  onClick={() => setExpiredDoc(!expiredDoc)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    expiredDoc ? 'bg-gov-saffron' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      expiredDoc ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Metadata Anomaly */}
              <div className="p-3 rounded-sm bg-gov-bg border border-gov-border flex items-center justify-between">
                <div>
                  <span className="font-bold text-gov-text block">EXIF / Structural Metadata Discrepancy</span>
                  <span className="text-[12px] text-gov-muted">Software tag anomalies or aspect ratio conflicts</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMetadataAnomaly(!metadataAnomaly)}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                    metadataAnomaly ? 'bg-gov-saffron' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      metadataAnomaly ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Weight Sliders */}
          <div className="gov-card space-y-3">
            <div className="gov-section-header">
              <span>Configurable Multi-Signal Weight Distributions</span>
              <span className="text-[12px] font-mono text-gov-primary font-bold">
                SUM: {Number(wTampering) + Number(wMrz) + Number(wFace) + Number(wConsistency) + Number(wValidity) + Number(wMetadata)}%
              </span>
            </div>

            <div className="space-y-3 text-[13px]">
              <div>
                <div className="flex justify-between text-gov-muted text-[12px] mb-1 font-semibold">
                  <span>Forensic Tampering Weight</span>
                  <span className="font-mono text-gov-primary font-bold">{wTampering}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={wTampering}
                  onChange={(e) => setWTampering(e.target.value)}
                  className="w-full accent-[#123B63]"
                />
              </div>

              <div>
                <div className="flex justify-between text-gov-muted text-[12px] mb-1 font-semibold">
                  <span>MRZ Inconsistency Weight</span>
                  <span className="font-mono text-gov-primary font-bold">{wMrz}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={wMrz}
                  onChange={(e) => setWMrz(e.target.value)}
                  className="w-full accent-[#123B63]"
                />
              </div>

              <div>
                <div className="flex justify-between text-gov-muted text-[12px] mb-1 font-semibold">
                  <span>Facial Biometric Weight</span>
                  <span className="font-mono text-gov-primary font-bold">{wFace}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={wFace}
                  onChange={(e) => setWFace(e.target.value)}
                  className="w-full accent-[#123B63]"
                />
              </div>

              <div>
                <div className="flex justify-between text-gov-muted text-[12px] mb-1 font-semibold">
                  <span>Field Consistency Weight</span>
                  <span className="font-mono text-gov-primary font-bold">{wConsistency}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={wConsistency}
                  onChange={(e) => setWConsistency(e.target.value)}
                  className="w-full accent-[#123B63]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Calculated Outcome (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {simResult && (
            <>
              <div className="bg-gov-lightBlue p-3 rounded-sm border border-gov-border flex items-center justify-between text-[13px] font-mono">
                <span className="text-gov-muted font-bold">Dynamic Recalculation:</span>
                <span className="text-gov-primary font-bold text-[15px]">
                  {previousScore !== null ? `${previousScore} → ` : ''}
                  <strong className="text-2xl font-extrabold">{simResult.risk_score}</strong> / 100
                </span>
              </div>

              <RiskAssessmentCard
                score={simResult.risk_score}
                level={simResult.risk_level}
                action={simResult.recommended_action}
                integrity={simResult.document_integrity}
                identity={simResult.identity_confidence}
                consistency={simResult.data_consistency}
                forensic={simResult.forensic_confidence}
                processingTime={18}
                referenceId="SIMULATION-MODE"
              />

              {/* Mathematical Signal Contribution Breakdown */}
              <div className="gov-card space-y-3">
                <div className="gov-section-header">
                  <span>Mathematical Signal Contribution Table</span>
                  <span className="text-[12px] font-mono text-gov-muted">Point Contribution</span>
                </div>

                <div className="border border-gov-border rounded-sm overflow-hidden">
                  <table className="gov-table">
                    <thead>
                      <tr>
                        <th>Verification Vector</th>
                        <th className="w-24 text-center">Active State</th>
                        <th className="w-24 text-center">Weight</th>
                        <th className="w-28 text-right">Points Impact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simResult.signals &&
                        Object.entries(simResult.signals).map(([key, sig]) => (
                          <tr key={key}>
                            <td className="font-bold text-gov-primary uppercase text-[12.5px] font-mono">
                              {key}
                            </td>
                            <td className="text-center">
                              <span
                                className={`inline-block text-[11px] font-bold px-1.5 py-0.2 rounded border ${
                                  sig.active
                                    ? 'bg-red-100 text-red-900 border-red-300'
                                    : 'bg-slate-100 text-slate-700 border-slate-300'
                                }`}
                              >
                                {sig.active ? 'FLAGGED' : 'CLEAN'}
                              </span>
                            </td>
                            <td className="text-center font-mono text-[12px] font-bold text-gov-text">
                              {sig.weight}%
                            </td>
                            <td className="text-right font-mono text-[12.5px] font-extrabold text-gov-primary">
                              +{sig.score_contribution} pts
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
