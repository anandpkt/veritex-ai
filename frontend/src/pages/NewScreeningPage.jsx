import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Upload,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  RotateCcw,
  Sparkles,
  HelpCircle,
  Camera,
  Info
} from 'lucide-react';
import { getPresets, analyzePreset, uploadAndScreen } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import NoticeBox from '../components/NoticeBox';

export default function NewScreeningPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [presets, setPresets] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [docType, setDocType] = useState('PASSPORT');
  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [validationError, setValidationError] = useState('');

  const processingSteps = [
    'Validating uploaded file format and resolution',
    'Extracting text fields via Optical Character Recognition (OCR)',
    'Parsing and verifying ICAO 9303 MRZ 7-3-1 check digits',
    'Executing Error Level Analysis (ELA) and noise variance scan',
    'Comparing facial biometric embeddings',
    'Cross-referencing multi-signal field consistency',
    'Synthesizing weighted risk score and generating decision dossier'
  ];

  useEffect(() => {
    async function loadPresets() {
      try {
        const data = await getPresets();
        setPresets(data);
      } catch (err) {
        console.error('Failed to load preset test cases:', err);
      }
    }
    loadPresets();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setValidationError('');
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|pdf)$/i)) {
        setValidationError('Invalid file format. Please upload a standard PNG, JPG, or PDF file.');
        setSelectedFile(null);
        setFilePreview(null);
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setValidationError('File size exceeds maximum 15MB limit. Please upload a compressed document scan.');
        setSelectedFile(null);
        setFilePreview(null);
        return;
      }
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(file));
      } else {
        setFilePreview(null);
      }
    }
  };

  const simulateStepProgress = async () => {
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentStepIndex(i);
      await new Promise((r) => setTimeout(r, 65));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setValidationError('Please select a document file to proceed with verification.');
      return;
    }

    try {
      setLoading(true);
      const progressPromise = simulateStepProgress();
      const apiPromise = uploadAndScreen(selectedFile, docType);
      const [, res] = await Promise.all([progressPromise, apiPromise]);
      navigate(`/screening/${res.id}`);
    } catch (err) {
      console.error('Upload failed:', err);
      setValidationError('Unable to process the request. Please check the document image and try again.');
      setLoading(false);
    }
  };

  const handlePresetSelect = async (caseId) => {
    try {
      setLoading(true);
      const progressPromise = simulateStepProgress();
      const apiPromise = analyzePreset(caseId);
      const [, res] = await Promise.all([progressPromise, apiPromise]);
      navigate(`/screening/${res.id}`);
    } catch (err) {
      console.error('Preset analysis failed:', err);
      setValidationError('Unable to complete demo screening. Please try again.');
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setValidationError('');
    const fileInput = document.getElementById('document-file-input');
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Services', path: '/' }, { label: 'AI Document Verification' }]} />

      {/* Page Header */}
      <div className="gov-card space-y-2 border-l-4 border-gov-primary">
        <h1 className="text-[24px] font-extrabold text-gov-primary">
          AI Document & Identity Verification
        </h1>
        <p className="text-[14px] text-gov-muted">
          Enter the required document scan below to initiate automated multi-layer forensic analysis and explainable risk evaluation.
        </p>
      </div>

      {/* Processing State Modal */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gov-primary rounded-sm max-w-lg w-full p-6 shadow-lg space-y-4">
            <div className="border-b border-gov-border pb-3">
              <h3 className="text-[16px] font-bold text-gov-primary uppercase tracking-wide flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-gov-saffron animate-pulse"></span>
                <span>Processing Verification Request</span>
              </h3>
              <p className="text-[12px] text-gov-muted font-mono">Executing multi-signal pipeline stages...</p>
            </div>

            {/* Checklist of stages */}
            <div className="space-y-2 py-2">
              {processingSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-2.5 text-[13px] font-mono transition-opacity ${
                    idx <= currentStepIndex ? 'text-gov-text opacity-100 font-semibold' : 'text-gov-muted opacity-40'
                  }`}
                >
                  {idx < currentStepIndex ? (
                    <CheckCircle2 className="w-4 h-4 text-gov-green flex-shrink-0" />
                  ) : idx === currentStepIndex ? (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-gov-primary border-t-transparent animate-spin flex-shrink-0"></span>
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex-shrink-0"></span>
                  )}
                  <span>{step}</span>
                </div>
              ))}
            </div>

            <div className="text-[11.5px] text-gov-muted bg-gov-lightBlue p-2.5 rounded-sm border border-gov-border">
              Please wait while the multi-signal engine cross-examines document checksums and forensic patterns.
            </div>
          </div>
        </div>
      )}

      {/* Main Request Form & Demo Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Document Submission (6 cols) */}
        <div className="lg:col-span-6 gov-card space-y-4">
          <div className="gov-section-header">
            <span>Request Details</span>
            <span className="text-[12px] font-normal text-gov-muted">Step 1 of 2</span>
          </div>

          {validationError && (
            <NoticeBox type="danger" title="Validation Error">
              {validationError}
            </NoticeBox>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            {/* Field: Document Type */}
            <div>
              <label htmlFor="doc-type-select" className="block text-[13.5px] font-bold text-gov-text mb-1">
                Document Category <span className="text-gov-danger">*</span>
              </label>
              <select
                id="doc-type-select"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="gov-input"
              >
                <option value="PASSPORT">Passport Specimen (ICAO Doc 9303 TD3)</option>
                <option value="NATIONAL_ID">National Identity Card (ICAO Doc 9303 TD1)</option>
                <option value="DRIVERS_LICENSE">Specimen Driver's License</option>
              </select>
              <p className="text-[12px] text-gov-muted mt-1">
                Select the international standard format corresponding to the uploaded credential.
              </p>
            </div>

            {/* Field: Document File Upload */}
            <div>
              <label htmlFor="document-file-input" className="block text-[13.5px] font-bold text-gov-text mb-1">
                Document Scan File <span className="text-gov-danger">*</span>
              </label>
              <div className="border-2 border-dashed border-gov-border p-5 rounded-sm bg-gov-bg text-center space-y-2 hover:bg-[#F0F4F8] transition-colors">
                <input
                  id="document-file-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  className="block w-full text-[13px] text-gov-text file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-[13px] file:font-semibold file:bg-gov-primary file:text-white hover:file:bg-gov-primaryDark cursor-pointer"
                />
                <p className="text-[12px] text-gov-muted">
                  Supported file formats: <strong>PNG, JPG, JPEG, PDF</strong> (Maximum size: 15MB)
                </p>
              </div>

              {filePreview && (
                <div className="mt-3 p-2 bg-white border border-gov-border rounded-sm">
                  <span className="text-[11px] font-bold text-gov-muted block mb-1 uppercase">Selected File Preview:</span>
                  <img src={filePreview} alt="Document attachment preview" className="max-h-36 mx-auto rounded-sm border" />
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="pt-3 border-t border-gov-border flex items-center justify-between">
              <button
                type="button"
                onClick={handleClear}
                className="gov-btn-secondary"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.btnReset}</span>
              </button>

              <button
                type="submit"
                disabled={!selectedFile || loading}
                className="gov-btn-primary"
              >
                <FileCheck className="w-4 h-4" />
                <span>{t.btnRunScreening}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Pre-Configured Benchmark Specimens (6 cols) */}
        <div className="lg:col-span-6 gov-card space-y-4">
          <div className="gov-section-header">
            <div>
              <span>Use Standard Test Specimen</span>
              <p className="text-[12px] font-normal text-gov-muted">
                Select a synthetic demo case to test specific verification scenarios
              </p>
            </div>
            <span className="text-[11px] font-mono bg-gov-lightBlue text-gov-primary px-2 py-0.5 rounded border border-gov-border font-bold">
              ONE-CLICK
            </span>
          </div>

          <div className="space-y-2.5">
            {presets.map((preset) => {
              const isCrit = preset.expected_risk_level === 'CRITICAL';
              const isHigh = preset.expected_risk_level === 'HIGH';
              const isMed = preset.expected_risk_level === 'MEDIUM';

              return (
                <div
                  key={preset.case_id}
                  onClick={() => !loading && handlePresetSelect(preset.case_id)}
                  className="p-3 bg-gov-bg hover:bg-gov-lightBlue border border-gov-border rounded-sm cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="space-y-1 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gov-primary text-[13.5px]">
                        {preset.title}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          isCrit
                            ? 'bg-purple-100 text-purple-900 border-purple-300'
                            : isHigh
                            ? 'bg-red-100 text-red-900 border-red-300'
                            : isMed
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {preset.tag}
                      </span>
                    </div>
                    <p className="text-[12px] text-gov-muted line-clamp-1">
                      {preset.description}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`block font-mono text-[12px] font-bold ${
                        isCrit ? 'text-purple-700' : isHigh ? 'text-gov-danger' : isMed ? 'text-gov-saffron' : 'text-gov-green'
                      }`}
                    >
                      {preset.expected_risk}
                    </span>
                    <span className="text-[11px] text-gov-primary font-bold underline">
                      Verify &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
