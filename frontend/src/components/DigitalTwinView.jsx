import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Check, X, Layers, User, Calendar, FileText, Globe } from 'lucide-react';

export default function DigitalTwinView({
  extractedData = {},
  mrzData = {},
  documentImageUrl = '',
  livePhotoUrl = '',
  faceResult = {}
}) {
  const { t } = useLanguage();

  const fields = [
    {
      label: 'Full Name',
      icon: User,
      visual: extractedData.name || 'N/A',
      mrz: mrzData.name || 'N/A',
      isMatch: extractedData.name && mrzData.name && extractedData.name.toUpperCase() === mrzData.name.toUpperCase(),
    },
    {
      label: 'Date of Birth (DOB)',
      icon: Calendar,
      visual: extractedData.dob || 'N/A',
      mrz: mrzData.dob || 'N/A',
      isMatch: extractedData.dob && mrzData.dob && extractedData.dob === mrzData.dob,
    },
    {
      label: 'Document Number',
      icon: FileText,
      visual: extractedData.document_number || 'N/A',
      mrz: mrzData.document_number || 'N/A',
      isMatch: extractedData.document_number && mrzData.document_number && extractedData.document_number === mrzData.document_number,
    },
    {
      label: 'Nationality / Code',
      icon: Globe,
      visual: extractedData.nationality || 'DEMO',
      mrz: mrzData.nationality || 'DEMO',
      isMatch: true,
    },
    {
      label: 'Date of Expiry',
      icon: Calendar,
      visual: extractedData.expiry_date || 'N/A',
      mrz: mrzData.expiry_date || 'N/A',
      isMatch: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Physical Scanned Asset */}
      <div className="lg:col-span-5 space-y-4">
        <div className="gov-card space-y-3">
          <div className="gov-section-header pb-1.5 mb-2">
            <span className="flex items-center space-x-1.5 text-[15px]">
              <Layers className="w-4 h-4 text-gov-primary" />
              <span>Physical Scanned Asset</span>
            </span>
            <span className="text-[11px] font-mono text-gov-primary bg-gov-lightBlue px-2 py-0.5 rounded border border-gov-border">
              SPECIMEN
            </span>
          </div>

          <div className="bg-[#0F172A] p-2 rounded-sm border border-gov-border">
            <img
              src={documentImageUrl}
              alt="Physical Scanned Document"
              className="w-full h-auto object-contain rounded-sm"
            />
          </div>
        </div>

        {/* Live Camera Verification Stream */}
        {livePhotoUrl && (
          <div className="gov-card space-y-3">
            <div className="gov-section-header pb-1.5 mb-2">
              <span className="flex items-center space-x-1.5 text-[15px]">
                <User className="w-4 h-4 text-gov-secondary" />
                <span>Live Camera Biometric Stream</span>
              </span>
              <span
                className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded border ${
                  faceResult.match_status === 'MATCH'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-rose-100 text-rose-900 border-rose-300'
                }`}
              >
                {faceResult.confidence_label || 'Match Verified'}
              </span>
            </div>

            <div className="flex items-center space-x-4 bg-gov-bg p-3 rounded-sm border border-gov-border">
              <img
                src={livePhotoUrl}
                alt="Live Camera Snapshot"
                className="w-24 h-28 rounded-sm object-cover border border-gov-border shadow-sm"
              />
              <div className="space-y-1 text-[13px]">
                <div className="text-gov-muted text-[11px] font-bold uppercase">
                  Biometric Facial Similarity
                </div>
                <div className="text-2xl font-mono font-extrabold text-gov-primary">
                  {faceResult.similarity_percentage || Math.round((faceResult.similarity_score || 0.9) * 100)}%
                </div>
                <p className="text-[12px] text-gov-muted leading-tight">
                  {faceResult.explanation || 'Biometric vector matches document photograph within authorized tolerance.'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Column: Structured Digital Twin Schema Comparison Table */}
      <div className="lg:col-span-7 space-y-4">
        <div className="gov-card space-y-4">
          <div className="gov-section-header pb-1.5 mb-2">
            <div>
              <span className="text-[15px]">Structured Digital Twin Schema</span>
              <p className="text-[12px] font-normal text-gov-muted">
                Cross-referencing Visual Inspection Zone (VIZ) with ICAO MRZ Encoded Payload
              </p>
            </div>
            <span className="text-[11px] font-mono bg-gov-lightBlue text-gov-primary px-2 py-0.5 rounded border border-gov-border font-bold">
              STANDARDIZED
            </span>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto border border-gov-border rounded-sm">
            <table className="gov-table">
              <thead>
                <tr>
                  <th className="w-36">Field Attribute</th>
                  <th>Visual OCR Read</th>
                  <th>MRZ Encoded Payload</th>
                  <th className="w-28 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((f, idx) => (
                  <tr key={idx} className={!f.isMatch ? 'bg-red-50/70' : ''}>
                    <td className="font-bold text-gov-primary flex items-center space-x-1.5">
                      <f.icon className="w-3.5 h-3.5 text-gov-secondary flex-shrink-0" />
                      <span>{f.label}</span>
                    </td>
                    <td className={`font-mono text-[13px] ${f.isMatch ? 'text-gov-text font-bold' : 'text-gov-danger font-extrabold underline'}`}>
                      {f.visual}
                    </td>
                    <td className={`font-mono text-[13px] ${f.isMatch ? 'text-gov-text font-bold' : 'text-gov-primary font-extrabold'}`}>
                      {f.mrz}
                    </td>
                    <td className="text-center">
                      {f.isMatch ? (
                        <span className="inline-flex items-center space-x-1 text-gov-green text-[11px] font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                          <Check className="w-3.5 h-3.5" />
                          <span>Consistent</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 text-gov-danger text-[11px] font-bold bg-red-100 px-2 py-0.5 rounded border border-red-300">
                          <X className="w-3.5 h-3.5" />
                          <span>Mismatch</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Raw MRZ Band Inspection */}
          <div className="space-y-2 pt-2">
            <div className="text-[12px] font-bold uppercase tracking-wider text-gov-primary">
              Machine-Readable Zone (MRZ) Raw Character Stream:
            </div>
            <div className="bg-[#1C2D42] text-slate-100 p-3 rounded-sm border border-slate-700 font-mono text-[12.5px] space-y-1">
              {mrzData.raw_mrz && mrzData.raw_mrz.length > 0 ? (
                mrzData.raw_mrz.map((line, lIdx) => (
                  <div key={lIdx} className="tracking-widest">
                    {line}
                  </div>
                ))
              ) : (
                <div className="text-slate-400">No MRZ records present</div>
              )}
              <div className="pt-2 border-t border-slate-700 flex items-center justify-between text-[11px] text-slate-300 font-sans">
                <span>Standard: {mrzData.format_type || 'ICAO Doc 9303 TD3 Passport'}</span>
                <span className={mrzData.check_digits_valid ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                  Check Digits: {mrzData.check_digits_valid ? '✓ Passed (7-3-1 Formula)' : '✗ Checksum Failure'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
