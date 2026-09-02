import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  FlaskConical,
  FileCheck,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Check,
  AlertTriangle,
  Info
} from 'lucide-react';
import { generateSynthetic, uploadAndScreen } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import NoticeBox from '../components/NoticeBox';

export default function SyntheticLabPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [docType, setDocType] = useState('PASSPORT');
  const [name, setName] = useState('ARUN KUMAR');
  const [dob, setDob] = useState('15-04-2002');
  const [docNumber, setDocNumber] = useState('DEMO123456');
  const [expiry, setExpiry] = useState('15-04-2032');
  const [issue, setIssue] = useState('15-04-2022');

  // Manipulation Toggles
  const [changeDob, setChangeDob] = useState(false);
  const [changeName, setChangeName] = useState(false);
  const [changeExpiry, setChangeExpiry] = useState(false);
  const [changeDocNumber, setChangeDocNumber] = useState(false);
  const [modifyMrz, setModifyMrz] = useState(false);
  const [replacePhoto, setReplacePhoto] = useState(false);
  const [addImageArtifact, setAddImageArtifact] = useState(false);
  const [multipleManipulations, setMultipleManipulations] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState(null);
  const [runningScreening, setRunningScreening] = useState(false);

  const handleGenerate = async (e) => {
    e?.preventDefault();
    try {
      setGenerating(true);
      const res = await generateSynthetic({
        document_type: docType,
        name,
        dob,
        document_number: docNumber,
        issue_date: issue,
        expiry_date: expiry,
        change_dob: changeDob,
        change_name: changeName,
        change_expiry: changeExpiry,
        change_doc_number: changeDocNumber,
        modify_mrz: modifyMrz,
        replace_photo: replacePhoto,
        add_image_artifact: addImageArtifact,
        multiple_manipulations: multipleManipulations,
      });
      setGeneratedResult(res);
    } catch (err) {
      console.error('Failed to generate synthetic specimen:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleRunScreening = async () => {
    if (!generatedResult) return;
    try {
      setRunningScreening(true);
      const imgRes = await fetch(generatedResult.modified_image_url);
      const blob = await imgRes.blob();
      const file = new File([blob], `synthetic_${generatedResult.doc_id}.jpg`, { type: 'image/jpeg' });
      const screenRes = await uploadAndScreen(file, docType);
      navigate(`/screening/${screenRes.id}`);
    } catch (err) {
      console.error('Failed to execute screening on specimen:', err);
    } finally {
      setRunningScreening(false);
    }
  };

  const handleReset = () => {
    setName('ARUN KUMAR');
    setDob('15-04-2002');
    setDocNumber('DEMO123456');
    setExpiry('15-04-2032');
    setIssue('15-04-2022');
    setChangeDob(false);
    setChangeName(false);
    setChangeExpiry(false);
    setChangeDocNumber(false);
    setModifyMrz(false);
    setReplacePhoto(false);
    setAddImageArtifact(false);
    setMultipleManipulations(false);
    setGeneratedResult(null);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Services', path: '/' }, { label: 'Synthetic Document Lab' }]} />

      {/* Header */}
      <div className="gov-card border-l-4 border-gov-primary space-y-2">
        <h1 className="text-[24px] font-extrabold text-gov-primary">
          Synthetic Document & Forgery Simulation Lab
        </h1>
        <p className="text-[14px] text-gov-muted">
          Generate custom fictional identity documents and inject controlled manipulation scenarios to evaluate pipeline detection accuracy without external datasets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Specimen Configuration (6 cols) */}
        <div className="lg:col-span-6 gov-card space-y-4">
          <div className="gov-section-header">
            <span>Specimen Parameters & Manipulations</span>
            <span className="text-[12px] font-normal text-gov-muted">Configuration Form</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label htmlFor="lab-doc-type" className="block text-[13.5px] font-bold text-gov-text mb-1">
                Document Standard Template <span className="text-gov-danger">*</span>
              </label>
              <select
                id="lab-doc-type"
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="gov-input"
              >
                <option value="PASSPORT">Passport Specimen (ICAO Doc 9303 TD3)</option>
                <option value="NATIONAL_ID">National ID Card (ICAO Doc 9303 TD1)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-bold text-gov-text mb-1">
                  Full Name <span className="text-gov-danger">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="gov-input font-mono"
                  placeholder="e.g. ARUN KUMAR"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gov-text mb-1">
                  Date of Birth <span className="text-gov-danger">*</span>
                </label>
                <input
                  type="text"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="gov-input font-mono"
                  placeholder="DD-MM-YYYY"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-bold text-gov-text mb-1">
                  Document Number <span className="text-gov-danger">*</span>
                </label>
                <input
                  type="text"
                  value={docNumber}
                  onChange={(e) => setDocNumber(e.target.value)}
                  className="gov-input font-mono"
                  placeholder="e.g. DEMO123456"
                />
              </div>

              <div>
                <label className="block text-[13px] font-bold text-gov-text mb-1">
                  Date of Expiry <span className="text-gov-danger">*</span>
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="gov-input font-mono"
                  placeholder="DD-MM-YYYY"
                />
              </div>
            </div>

            {/* Controlled Manipulations Checklist */}
            <div className="pt-2 border-t border-gov-border space-y-2">
              <label className="block text-[13.5px] font-bold text-gov-primary uppercase">
                Inject Tampering & Mutation Vectors:
              </label>

              <div className="space-y-2 text-[13px]">
                <label className="flex items-start space-x-2.5 p-2 bg-gov-bg hover:bg-gov-lightBlue border border-gov-border rounded-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={changeDob}
                    onChange={(e) => setChangeDob(e.target.checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-gov-text block">Alter Date of Birth (Visual Patch)</span>
                    <span className="text-[12px] text-gov-muted">Modifies visual OCR read while preserving original MRZ encoding to simulate DOB tampering.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-2.5 p-2 bg-gov-bg hover:bg-gov-lightBlue border border-gov-border rounded-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={changeDocNumber}
                    onChange={(e) => setChangeDocNumber(e.target.checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-gov-text block">Spliced Document Number</span>
                    <span className="text-[12px] text-gov-muted">Injects a spliced text patch creating local noise variance and ELA compression boundary.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-2.5 p-2 bg-gov-bg hover:bg-gov-lightBlue border border-gov-border rounded-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={changeExpiry}
                    onChange={(e) => setChangeExpiry(e.target.checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-gov-text block">Expired Document Validity</span>
                    <span className="text-[12px] text-gov-muted">Sets expiry date in the past to test chronological authorization rejection.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-2.5 p-2 bg-gov-bg hover:bg-gov-lightBlue border border-gov-border rounded-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modifyMrz}
                    onChange={(e) => setModifyMrz(e.target.checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-gov-text block">Corrupt MRZ Checksum Formulas</span>
                    <span className="text-[12px] text-gov-muted">Alters check digits to trigger ICAO Doc 9303 7-3-1 mathematical validation failure.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-2.5 p-2 bg-gov-bg hover:bg-gov-lightBlue border border-gov-border rounded-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={replacePhoto}
                    onChange={(e) => setReplacePhoto(e.target.checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-gov-text block">Photo Replacement / Biometric Mismatch</span>
                    <span className="text-[12px] text-gov-muted">Swaps facial subject with distinct biometric feature vectors to test facial divergence.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-2.5 p-2 bg-gov-bg hover:bg-gov-lightBlue border border-gov-border rounded-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addImageArtifact}
                    onChange={(e) => setAddImageArtifact(e.target.checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-gov-text block">JPEG Compression Anomaly (ELA)</span>
                    <span className="text-[12px] text-gov-muted">Injects high-frequency recompression blocks for Error Level Analysis detection.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-2.5 p-2 bg-[#FFF8E7] border border-gov-saffron rounded-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={multipleManipulations}
                    onChange={(e) => setMultipleManipulations(e.target.checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-[#B94A00] block">Multiple Compound Forgeries (Critical Risk)</span>
                    <span className="text-[12px] text-gov-muted">Combines DOB tampering, MRZ corruption, spliced artifacts, and facial mismatch.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-gov-border flex items-center justify-between">
              <button
                type="button"
                onClick={handleReset}
                className="gov-btn-secondary"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.btnReset}</span>
              </button>

              <button
                type="submit"
                disabled={generating}
                className="gov-btn-primary"
              >
                {generating ? (
                  <span className="animate-spin mr-1">⏳</span>
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Generate Test Specimen</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Preview Column (6 cols) */}
        <div className="lg:col-span-6 gov-card space-y-4">
          <div className="gov-section-header">
            <span>Generated Specimen Preview</span>
            <span className="text-[12px] font-normal text-gov-muted">Inspection Bench</span>
          </div>

          {generatedResult ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-gov-green uppercase block">Clean Reference (Pristine):</span>
                  <div className="bg-slate-900 p-1.5 rounded-sm border border-gov-border">
                    <img src={generatedResult.original_image_url} alt="Clean Reference Specimen" className="w-full h-auto rounded-sm object-contain" />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-gov-danger uppercase block">Mutated Specimen (Tampered):</span>
                  <div className="bg-slate-900 p-1.5 rounded-sm border-2 border-gov-danger">
                    <img src={generatedResult.modified_image_url} alt="Tampered Specimen" className="w-full h-auto rounded-sm object-contain" />
                  </div>
                </div>
              </div>

              {/* Injected Parameters List */}
              <div className="bg-gov-bg p-3 rounded-sm border border-gov-border space-y-1.5 text-[12.5px]">
                <div className="font-bold text-gov-primary uppercase text-[12px]">Injected Target Mutations:</div>
                {generatedResult.tampered_regions?.length > 0 ? (
                  <ul className="space-y-1">
                    {generatedResult.tampered_regions.map((reg, idx) => (
                      <li key={idx} className="flex items-center justify-between text-gov-danger font-mono text-[12px]">
                        <span>• {reg.label} ({reg.anomaly_type})</span>
                        <span className="font-bold">Conf: {Math.round(reg.confidence * 100)}%</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gov-green font-semibold text-[12px]">✓ Pristine specimen with 0 injected anomalies.</p>
                )}
              </div>

              <button
                type="button"
                onClick={handleRunScreening}
                disabled={runningScreening}
                className="w-full gov-btn-saffron py-3 text-[14px]"
              >
                {runningScreening ? (
                  <span className="animate-spin mr-1">⏳</span>
                ) : (
                  <FileCheck className="w-4 h-4" />
                )}
                <span>Run Full Verification Pipeline On This Specimen</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ) : (
            <div className="border border-dashed border-gov-border p-12 text-center space-y-2 text-gov-muted">
              <FlaskConical className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="font-bold text-gov-text text-[14px]">No Specimen Generated Yet</div>
              <p className="text-[12.5px]">Configure attributes and select tampering vectors on the left, then click <strong>Generate Test Specimen</strong>.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
