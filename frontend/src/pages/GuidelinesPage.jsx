import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, ShieldCheck, FileText, Lock, CheckCircle2, HelpCircle } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';
import NoticeBox from '../components/NoticeBox';

export default function GuidelinesPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Service Guidelines & Compliance' }]} />

      {/* Header */}
      <div className="gov-card border-l-4 border-gov-primary space-y-2">
        <h1 className="text-[24px] font-extrabold text-gov-primary">
          Service Guidelines & Standard Operating Procedures
        </h1>
        <p className="text-[14px] text-gov-muted">
          Official compliance guidelines, ICAO Doc 9303 machine-readable travel document specifications, Error Level Analysis (ELA) standards, and data privacy principles.
        </p>
      </div>

      {/* Notice */}
      <NoticeBox type="info" title="Operational Standard">
        VERIDEX AI operates strictly in an advisory capacity to assist credential verification officers by automating multi-signal cross-checks and flagging discrepancies.
      </NoticeBox>

      {/* Sections */}
      <div className="space-y-4">
        {/* Section 1: ICAO 9303 MRZ Guidelines */}
        <div className="gov-card space-y-3">
          <div className="gov-section-header">
            <span>1. ICAO Doc 9303 Machine-Readable Zone (MRZ) Standard</span>
            <span className="text-[12px] font-mono text-gov-muted">Part 3 & 4 (TD1/TD3)</span>
          </div>
          <div className="space-y-2 text-[14px] text-gov-text leading-relaxed">
            <p>
              Machine-Readable Travel Documents (MRTDs) feature standardized optical character recognition lines encoded using the OCR-B font. The machine-readable lines contain essential identity fields paired with 7-3-1 weight check digit algorithms:
            </p>
            <div className="bg-gov-bg p-3 rounded-sm border border-gov-border font-mono text-[13px] space-y-1">
              <div><strong>Line 1 (TD3 Passport):</strong> P&lt;[COUNTRY][SURNAME]&lt;&lt;[GIVEN_NAMES]&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;</div>
              <div><strong>Line 2 (TD3 Passport):</strong> [DOC_NUMBER][CHK][NAT][DOB][CHK][SEX][EXPIRY][CHK]&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;[COMPOSITE_CHK]</div>
            </div>
            <p className="text-[13px] text-gov-muted">
              The weighting formula cyclically multiplies each character value by [7, 3, 1] modulo 10. A single character modification in the Document Number or Date of Birth will trigger a mathematical checksum discrepancy.
            </p>
          </div>
        </div>

        {/* Section 2: Error Level Analysis (ELA) & Image Forensics */}
        <div className="gov-card space-y-3">
          <div className="gov-section-header">
            <span>2. Image Forensics & Error Level Analysis (ELA)</span>
            <span className="text-[12px] font-mono text-gov-muted">Digital Integrity Analysis</span>
          </div>
          <div className="space-y-2 text-[14px] text-gov-text leading-relaxed">
            <p>
              Digital document forgery often involves pasting modified text or replacement portraits over an authentic background. This introduces localized compression rate disparities:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[13.5px] text-gov-text">
              <li><strong>Error Level Analysis (ELA):</strong> Re-compresses the document image at a known quality level (90%) and calculates pixel-wise delta differences. Spliced regions exhibit higher quantization error rates.</li>
              <li><strong>High-Pass Noise Variance:</strong> Evaluates local Laplacian filter variances. Authentic document substrates have consistent paper grain; digital paste patches lack natural substrate noise.</li>
              <li><strong>Edge Gradient Magnitude:</strong> Identifies sharp rectangular discontinuity boundaries around manipulated visual fields.</li>
            </ul>
          </div>
        </div>

        {/* Section 3: Data Protection & Privacy Policy */}
        <div className="gov-card space-y-3">
          <div className="gov-section-header">
            <span>3. Privacy Policy & Synthetic Data Governance</span>
            <span className="text-[12px] font-mono text-gov-muted">SIH26188 Compliance</span>
          </div>
          <div className="space-y-2 text-[14px] text-gov-text leading-relaxed">
            <p>
              In accordance with responsible AI standards and the demonstration mandate:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[13.5px] text-gov-text">
              <li><strong>Zero Real Citizen Data:</strong> All names, personal identifiers, and photographs are synthetically generated and 100% fictional.</li>
              <li><strong>No Real Government Database Queries:</strong> The platform operates 100% standalone without external network calls to immigration or police watchlists.</li>
              <li><strong>Explainable Risk Metrics:</strong> Evaluation results are presented as risk likelihood scores (LOW, MEDIUM, HIGH, CRITICAL), never definitive binary assertions.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
