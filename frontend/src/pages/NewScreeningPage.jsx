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
  Info,
  Globe,
  User,
  Calendar,
  Database,
  ShieldCheck,
  Video,
  Hash,
  ArrowRight,
  Zap,
  Search
} from 'lucide-react';
import { getPresets, analyzePreset, uploadAndScreen, getMockRegistry, verifyIdNumber } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import NoticeBox from '../components/NoticeBox';
import LiveCameraModal from '../components/LiveCameraModal';

export default function NewScreeningPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [presets, setPresets] = useState([]);
  const [mockRegistry, setMockRegistry] = useState([]);

  // Verification Mode: 'DIRECT_ID' (Instant number check) vs 'FULL_DOCUMENT' (Scan & Camera)
  const [verificationMode, setVerificationMode] = useState('DIRECT_ID');

  // Direct ID Number Verification States
  const [directDocType, setDirectDocType] = useState('AADHAAR');
  const [directDocNumber, setDirectDocNumber] = useState('');
  const [directClaimedName, setDirectClaimedName] = useState('');

  // File Upload & Camera States
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [selectedLivePhoto, setSelectedLivePhoto] = useState(null);
  const [livePhotoPreview, setLivePhotoPreview] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // User Claimed Details
  const [docType, setDocType] = useState('AADHAAR');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [nationality, setNationality] = useState('IND');

  const [loading, setLoading] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [validationError, setValidationError] = useState('');

  const processingSteps = [
    'Validating format & mathematical checksum algorithm (Verhoeff / PAN / ICAO)',
    'Querying National Citizen & Document Ground-Truth Registry (UIDAI/NSDL/Passport)',
    'Cross-referencing entity attributes and classifying discrepancy risk',
    'Synthesizing multi-signal evidence chain and computing authenticity score'
  ];

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [pData, rData] = await Promise.all([getPresets(), getMockRegistry()]);
        setPresets(pData);
        setMockRegistry(rData);
      } catch (err) {
        console.error('Failed to load initial data:', err);
      }
    }
    loadInitialData();
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

  const handleLivePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedLivePhoto(file);
      setLivePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleCameraCapture = (file, previewUrl) => {
    setSelectedLivePhoto(file);
    setLivePhotoPreview(previewUrl);
  };

  const handlePreFillDirect = (person) => {
    setDirectClaimedName(person.full_name);
    if (directDocType === 'AADHAAR' && person.aadhaar_number) {
      setDirectDocNumber(person.aadhaar_number);
    } else if (directDocType === 'PAN' && person.pan_number) {
      setDirectDocNumber(person.pan_number);
    } else if (directDocType === 'PASSPORT' && person.passport_number) {
      setDirectDocNumber(person.passport_number);
    } else if (directDocType === 'DRIVING_LICENSE' && person.dl_number) {
      setDirectDocNumber(person.dl_number);
    } else {
      setDirectDocNumber(person.aadhaar_number || person.pan_number || '548291038476');
    }
  };

  const handlePreFillFull = (person) => {
    setName(person.full_name);
    setDob(person.dob);
    setNationality(person.nationality || 'IND');
    if (docType === 'AADHAAR' && person.aadhaar_number) {
      setDocNumber(person.aadhaar_number);
    } else if (docType === 'PAN' && person.pan_number) {
      setDocNumber(person.pan_number);
    } else if (docType === 'PASSPORT' && person.passport_number) {
      setDocNumber(person.passport_number);
    } else if (docType === 'DRIVING_LICENSE' && person.dl_number) {
      setDocNumber(person.dl_number);
    } else {
      setDocNumber(person.aadhaar_number || person.passport_number || 'P1234567');
    }
  };

  const simulateStepProgress = async () => {
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentStepIndex(i);
      await new Promise((r) => setTimeout(r, 60));
    }
  };

  // Direct ID Number Form Submit (No image or camera required)
  const handleDirectIdSubmit = async (e) => {
    e.preventDefault();
    if (!directDocNumber.trim()) {
      setValidationError('Please enter a valid ID Number (e.g. 12-digit Aadhaar or 10-char PAN).');
      return;
    }

    try {
      setLoading(true);
      const progressPromise = simulateStepProgress();
      const apiPromise = verifyIdNumber(
        directDocType,
        directDocNumber.trim(),
        directClaimedName.trim() || undefined
      );
      const [, res] = await Promise.all([progressPromise, apiPromise]);
      navigate(`/screening/${res.id}`);
    } catch (err) {
      console.error('Direct ID verification failed:', err);
      setValidationError('Failed to complete ID query. Please check the ID format and try again.');
      setLoading(false);
    }
  };

  // Full Document Scan & Camera Submit
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setValidationError('Please select a document scan file to proceed with verification.');
      return;
    }

    try {
      setLoading(true);
      const progressPromise = simulateStepProgress();
      const claimedData = {
        name: name.trim() || undefined,
        dob: dob.trim() || undefined,
        document_number: docNumber.trim() || undefined,
        expiry_date: expiryDate.trim() || undefined,
        nationality: nationality.trim() || 'IND',
      };
      const apiPromise = uploadAndScreen(selectedFile, docType, selectedLivePhoto, claimedData);
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
    setSelectedLivePhoto(null);
    setLivePhotoPreview(null);
    setName('');
    setDob('');
    setDocNumber('');
    setExpiryDate('');
    setNationality('IND');
    setDirectDocNumber('');
    setDirectClaimedName('');
    setValidationError('');
    const fileInput = document.getElementById('document-file-input');
    if (fileInput) fileInput.value = '';
    const liveInput = document.getElementById('live-photo-input');
    if (liveInput) liveInput.value = '';
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Services', path: '/' }, { label: 'AI Document Verification' }]} />

      {/* Page Header */}
      <div className="gov-card space-y-2 border-l-4 border-gov-primary">
        <h1 className="text-[24px] font-extrabold text-gov-primary">
          AI Identity & Document Screening System (SIH26188)
        </h1>
        <p className="text-[14px] text-gov-muted">
          Verify identities instantly by <strong>ID Number Only</strong> (Verhoeff Checksum & Database Cross-Check) or run <strong>Full Document Screening</strong> with image forensics and biometrics.
        </p>
      </div>

      {/* Mode Selection Switcher */}
      <div className="flex border-b border-gov-border gap-2 bg-gov-bg p-1 rounded-sm">
        <button
          type="button"
          onClick={() => { setVerificationMode('DIRECT_ID'); setValidationError(''); }}
          className={`flex-1 py-3 px-4 rounded-sm font-bold text-[14px] flex items-center justify-center space-x-2 transition-all ${
            verificationMode === 'DIRECT_ID'
              ? 'bg-gov-primary text-white shadow-sm'
              : 'text-gov-muted hover:bg-gov-lightBlue hover:text-gov-primary'
          }`}
        >
          <Zap className="w-4 h-4 text-gov-saffron" />
          <span>Instant ID Number Check (No Camera / Image Required)</span>
        </button>

        <button
          type="button"
          onClick={() => { setVerificationMode('FULL_DOCUMENT'); setValidationError(''); }}
          className={`flex-1 py-3 px-4 rounded-sm font-bold text-[14px] flex items-center justify-center space-x-2 transition-all ${
            verificationMode === 'FULL_DOCUMENT'
              ? 'bg-gov-primary text-white shadow-sm'
              : 'text-gov-muted hover:bg-gov-lightBlue hover:text-gov-primary'
          }`}
        >
          <Upload className="w-4 h-4 text-gov-secondary" />
          <span>Full Document Scan & Biometric Screening</span>
        </button>
      </div>

      {/* Live Camera Modal */}
      <LiveCameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraCapture}
      />

      {/* Processing State Modal */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-gov-primary rounded-sm max-w-lg w-full p-6 shadow-lg space-y-4">
            <div className="border-b border-gov-border pb-3">
              <h3 className="text-[16px] font-bold text-gov-primary uppercase tracking-wide flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-gov-saffron animate-pulse"></span>
                <span>Executing SIH26188 Verification Pipeline</span>
              </h3>
              <p className="text-[12px] text-gov-muted font-mono">Cross-checking checksum algorithms and Ground-Truth registry...</p>
            </div>

            {/* Checklist of stages */}
            <div className="space-y-2 py-2">
              {processingSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`flex items-center space-x-2.5 text-[12.5px] font-mono transition-opacity ${
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
              Please wait while the multi-vector engine validates check digits and verifies identity records.
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form according to mode (7 cols) */}
        <div className="lg:col-span-7 gov-card space-y-4">
          {validationError && (
            <NoticeBox type="danger" title="Validation Error">
              {validationError}
            </NoticeBox>
          )}

          {/* ========================================================================= */}
          {/* MODE 1: INSTANT ID NUMBER VERIFICATION (NO UPLOAD / CAMERA REQUIRED)     */}
          {/* ========================================================================= */}
          {verificationMode === 'DIRECT_ID' && (
            <div className="space-y-4">
              <div className="gov-section-header">
                <span>Instant ID Number Check</span>
                <span className="text-[11px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-bold">
                  FAST ALGORITHMIC CHECK
                </span>
              </div>

              <NoticeBox type="info" title="Direct ID Verification">
                Enter any Aadhaar, PAN, Passport, or DL number. The system will mathematically validate the check digits (Verhoeff / PAN structure) and query the official verification registry.
              </NoticeBox>

              <form onSubmit={handleDirectIdSubmit} className="space-y-4">
                {/* ID Type Selector */}
                <div>
                  <label className="block text-[13px] font-bold text-gov-text mb-1">
                    Select Document Category Standard <span className="text-gov-danger">*</span>
                  </label>
                  <select
                    value={directDocType}
                    onChange={(e) => setDirectDocType(e.target.value)}
                    className="gov-input font-bold text-gov-primary"
                  >
                    <option value="AADHAAR">Aadhaar Card (UIDAI 12-Digit Verhoeff Checksum)</option>
                    <option value="PAN">PAN Card (Income Tax 10-Char Entity Alphanumeric)</option>
                    <option value="PASSPORT">Passport (ICAO Doc 9303 Check Digits)</option>
                    <option value="DRIVING_LICENSE">Driving License (Parivahan State RTO)</option>
                  </select>
                </div>

                {/* ID Number Input */}
                <div>
                  <label className="block text-[13px] font-bold text-gov-text mb-1">
                    Enter Document ID Number <span className="text-gov-danger">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="w-4 h-4 text-gov-muted absolute left-3 top-3" />
                    <input
                      type="text"
                      value={directDocNumber}
                      onChange={(e) => setDirectDocNumber(e.target.value)}
                      className="gov-input pl-9 text-[15px] font-mono font-bold uppercase tracking-wider text-gov-primary"
                      placeholder={
                        directDocType === 'AADHAAR' ? 'e.g. 548291038476 (12 digits)' :
                        directDocType === 'PAN' ? 'e.g. ABCPA1234F (10 characters)' :
                        directDocType === 'PASSPORT' ? 'e.g. Z9876543' : 'e.g. TN0120180004567'
                      }
                    />
                  </div>
                </div>

                {/* Optional Claimed Name */}
                <div>
                  <label className="block text-[12.5px] font-bold text-gov-text mb-1">
                    Claimed Entity / Subject Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={directClaimedName}
                    onChange={(e) => setDirectClaimedName(e.target.value)}
                    className="gov-input font-mono uppercase"
                    placeholder="e.g. ANAND KUMAR (To test fuzzy match & typo detection)"
                  />
                  <p className="text-[11px] text-gov-muted mt-0.5">
                    If provided, the engine will cross-check fuzzy name distance against the database.
                  </p>
                </div>

                {/* Quick Pre-fill Chips */}
                {mockRegistry.length > 0 && (
                  <div className="p-3 bg-gov-lightBlue/60 rounded-sm border border-gov-border space-y-2">
                    <span className="text-[11.5px] font-bold text-gov-primary flex items-center space-x-1 font-mono">
                      <Database className="w-3.5 h-3.5" />
                      <span>One-Click Test IDs from Verified Database:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mockRegistry.map((person) => (
                        <button
                          key={person.id}
                          type="button"
                          onClick={() => handlePreFillDirect(person)}
                          className="text-[11.5px] font-mono font-bold px-2.5 py-1 bg-white hover:bg-gov-primary hover:text-white border border-gov-border rounded-sm transition-colors text-gov-primary"
                        >
                          {person.full_name} ({person.nationality})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Form Buttons */}
                <div className="pt-3 border-t border-gov-border flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="gov-btn-secondary"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Clear</span>
                  </button>

                  <button
                    type="submit"
                    disabled={!directDocNumber.trim() || loading}
                    className="gov-btn-primary py-2 px-5 text-[14px]"
                  >
                    <Search className="w-4 h-4" />
                    <span>Verify ID Number &rarr;</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================================================= */}
          {/* MODE 2: FULL DOCUMENT & FORENSIC SCREENING (IMAGE / LIVE CAMERA)          */}
          {/* ========================================================================= */}
          {verificationMode === 'FULL_DOCUMENT' && (
            <div className="space-y-4">
              <div className="gov-section-header">
                <span>Full Document Scan & Biometric Verification</span>
                <span className="text-[11px] font-mono text-gov-primary bg-gov-lightBlue px-2 py-0.5 rounded border border-gov-border font-bold">
                  ELA & GRAD-CAM
                </span>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                {/* Field: Document Type */}
                <div>
                  <label className="block text-[13.5px] font-bold text-gov-text mb-1">
                    Document Category Standard <span className="text-gov-danger">*</span>
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="gov-input font-bold text-gov-primary"
                  >
                    <option value="AADHAAR">Aadhaar Card (UIDAI 12-Digit Verhoeff Checksum)</option>
                    <option value="PAN">PAN Card (Income Tax 10-Char Entity Alphanumeric)</option>
                    <option value="PASSPORT">Passport Specimen (ICAO Doc 9303 TD3 44-Char MRZ)</option>
                    <option value="DRIVING_LICENSE">Driving License Specimen (Parivahan State RTO)</option>
                  </select>
                </div>

                {/* Field: Document File Upload */}
                <div>
                  <label className="block text-[13.5px] font-bold text-gov-text mb-1">
                    Digital ID Image / Scan <span className="text-gov-danger">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gov-border p-4 rounded-sm bg-gov-bg text-center space-y-2 hover:bg-[#F0F4F8] transition-colors">
                    <input
                      id="document-file-input"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                      className="block w-full text-[13px] text-gov-text file:mr-4 file:py-1.5 file:px-3 file:rounded-sm file:border-0 file:text-[13px] file:font-semibold file:bg-gov-primary file:text-white hover:file:bg-gov-primaryDark cursor-pointer"
                    />
                    <p className="text-[11.5px] text-gov-muted">
                      Supported: <strong>PNG, JPG, JPEG, PDF</strong> (Scanned via ELA, Noise Variance & Grad-CAM)
                    </p>
                  </div>

                  {filePreview && (
                    <div className="mt-2 p-2 bg-white border border-gov-border rounded-sm flex items-center space-x-3">
                      <img src={filePreview} alt="Document attachment preview" className="h-16 rounded-sm border object-contain" />
                      <span className="text-[12px] text-gov-muted font-mono">Document Scan Attached Ready for Screening</span>
                    </div>
                  )}
                </div>

                {/* Quick Demo Pre-fill Chips */}
                {mockRegistry.length > 0 && (
                  <div className="p-2.5 bg-gov-lightBlue/60 rounded-sm border border-gov-border space-y-1.5">
                    <span className="text-[11.5px] font-bold text-gov-primary flex items-center space-x-1 font-mono">
                      <Database className="w-3.5 h-3.5" />
                      <span>Quick Pre-fill from Registered Ground-Truth Entities:</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mockRegistry.slice(0, 4).map((person) => (
                        <button
                          key={person.id}
                          type="button"
                          onClick={() => handlePreFillFull(person)}
                          className="text-[11px] font-mono font-semibold px-2 py-0.5 bg-white hover:bg-gov-primary hover:text-white border border-gov-border rounded-sm transition-colors text-gov-text"
                        >
                          {person.full_name} ({person.nationality})
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Claimed Identity Details */}
                <div className="pt-3 border-t border-gov-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-gov-primary uppercase tracking-wider">
                      Subject Identity Attributes (Confirm Claimed Data):
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[12.5px] font-bold text-gov-text mb-1">
                        Subject Full Name
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="gov-input font-mono uppercase"
                        placeholder="e.g. ANAND KUMAR / PRIYA SHARMA"
                      />
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-bold text-gov-text mb-1">
                        Date of Birth (DOB)
                      </label>
                      <input
                        type="text"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="gov-input font-mono"
                        placeholder="DD-MM-YYYY (e.g. 15-08-1998)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[12.5px] font-bold text-gov-text mb-1">
                        Document ID Number
                      </label>
                      <input
                        type="text"
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value)}
                        className="gov-input font-mono uppercase"
                        placeholder={
                          docType === 'AADHAAR' ? '548291038476' :
                          docType === 'PAN' ? 'ABCPA1234F' : 'Z9876543'
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-bold text-gov-text mb-1">
                        Date of Expiry
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="gov-input font-mono"
                        placeholder="DD-MM-YYYY"
                      />
                    </div>

                    <div>
                      <label className="block text-[12.5px] font-bold text-gov-text mb-1">
                        Country Code (ISO 3166)
                      </label>
                      <input
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value.toUpperCase())}
                        className="gov-input font-mono uppercase"
                        placeholder="IND"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>

                {/* Live Camera Capture Module */}
                <div className="pt-3 border-t border-gov-border space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-[13px] font-bold text-gov-text flex items-center space-x-1.5">
                      <Camera className="w-4 h-4 text-gov-secondary" />
                      <span>Live Capture / Webcam Selfie (Optional Biometrics)</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCameraOpen(true)}
                      className="px-2.5 py-1 text-[11.5px] font-bold text-white bg-gov-secondary hover:bg-gov-primary rounded-sm inline-flex items-center space-x-1 transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Open Live Webcam</span>
                    </button>
                  </div>

                  <input
                    id="live-photo-input"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleLivePhotoChange}
                    className="block w-full text-[12.5px] text-gov-text file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border-0 file:text-[12px] file:font-semibold file:bg-gov-bg file:text-gov-text hover:file:bg-gov-lightBlue cursor-pointer"
                  />

                  {livePhotoPreview && (
                    <div className="mt-1 flex items-center space-x-2 p-1.5 bg-emerald-50 border border-emerald-300 rounded-sm">
                      <img src={livePhotoPreview} alt="Live selfie preview" className="w-12 h-12 rounded-sm border object-cover" />
                      <span className="text-[11.5px] text-emerald-800 font-bold font-mono">
                        ✓ Live Selfie Ready for Biometric Feature & Liveness Cross-Correlation
                      </span>
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
          )}
        </div>

        {/* Right Column: Pre-Configured Benchmark Suite (5 cols) */}
        <div className="lg:col-span-5 gov-card space-y-4">
          <div className="gov-section-header">
            <div>
              <span>Benchmark Forgery Demo Suite</span>
              <p className="text-[12px] font-normal text-gov-muted">
                Pre-configured test specimens demonstrating specific discrepancy detection
              </p>
            </div>
            <span className="text-[11px] font-mono bg-gov-lightBlue text-gov-primary px-2 py-0.5 rounded border border-gov-border font-bold">
              ONE-CLICK
            </span>
          </div>

          <div className="space-y-2">
            {presets.map((preset) => {
              const isCrit = preset.expected_risk_level === 'CRITICAL';
              const isHigh = preset.expected_risk_level === 'HIGH';
              const isMed = preset.expected_risk_level === 'MEDIUM';

              return (
                <div
                  key={preset.case_id}
                  onClick={() => !loading && handlePresetSelect(preset.case_id)}
                  className="p-2.5 bg-gov-bg hover:bg-gov-lightBlue border border-gov-border rounded-sm cursor-pointer transition-colors flex items-center justify-between"
                >
                  <div className="space-y-0.5 pr-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="font-bold text-gov-primary text-[13px]">
                        {preset.title}
                      </span>
                      <span
                        className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded border ${
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
                    <p className="text-[11.5px] text-gov-muted line-clamp-1">
                      {preset.description}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span
                      className={`block font-mono text-[11.5px] font-bold ${
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

          <NoticeBox type="info" title="SIH26188 Verification Protocol">
            Instant ID checks and Full Document scans both validate against official Verhoeff Aadhaar checksums, PAN syntax formulas, Ground-Truth Database registries, and Grad-CAM attention heatmaps.
          </NoticeBox>
        </div>
      </div>
    </div>
  );
}
