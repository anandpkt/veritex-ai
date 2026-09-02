import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  FileText,
  Download,
  Printer,
  Sliders,
  Eye,
  Layers,
  Share2,
  Clock,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Trash2,
  Database,
  UserCheck
} from 'lucide-react';

import { getScreening, getReport, deleteScreening } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import RiskAssessmentCard from '../components/RiskAssessmentCard';
import EvidenceTable from '../components/EvidenceTable';
import ForensicViewer from '../components/ForensicViewer';
import DigitalTwinView from '../components/DigitalTwinView';
import IdentityGraphCanvas from '../components/IdentityGraphCanvas';
import InvestigationTimeline from '../components/InvestigationTimeline';
import GroundTruthComparison from '../components/GroundTruthComparison';
import ManualOverridePanel from '../components/ManualOverridePanel';
import NoticeBox from '../components/NoticeBox';


export default function ScreeningDetailPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [screening, setScreening] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('evidence'); // 'evidence', 'forensics', 'digital_twin', 'graph', 'timeline'
  const [generatingReport, setGeneratingReport] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadScreening() {
      try {
        const data = await getScreening(id);
        setScreening(data);
      } catch (err) {
        console.error('Failed to load screening record:', err);
      } finally {
        setLoading(false);
      }
    }
    loadScreening();
  }, [id]);

  const handleDownloadPdf = async () => {
    try {
      setGeneratingReport(true);
      const res = await getReport(id);
      if (res.pdf_url) {
        window.open(res.pdf_url, '_blank');
      }
    } catch (err) {
      console.error('Failed to compile PDF report:', err);
      alert('Unable to compile official PDF dossier. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to permanently delete this screening dossier [${id}] and all associated files?`)) {
      try {
        setDeleting(true);
        await deleteScreening(id);
        alert(`Screening record ${id} has been permanently deleted.`);
        window.location.href = '/history';
      } catch (err) {
        console.error('Failed to delete screening record:', err);
        alert('Failed to delete screening record. Please try again.');
        setDeleting(false);
      }
    }
  };


  if (loading) {
    return (
      <div className="gov-card text-center py-16 space-y-3">
        <div className="w-8 h-8 border-3 border-gov-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-[13px] font-mono text-gov-muted">Retrieving Official Dossier Record [{id}]...</p>
      </div>
    );
  }

  if (!screening) {
    return (
      <div className="gov-card text-center py-12 space-y-4">
        <AlertCircle className="w-12 h-12 text-gov-danger mx-auto" />
        <h2 className="text-[18px] font-bold text-gov-primary">Record Not Found</h2>
        <p className="text-[13px] text-gov-muted">
          The requested verification dossier reference number <strong>{id}</strong> could not be located.
        </p>
        <Link to="/history" className="gov-btn-primary">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Screening Registry</span>
        </Link>
      </div>
    );
  }

  const ext = screening.extracted_data || {};
  const mrz = screening.mrz_data || {};

  const tabs = [
    { id: 'comparison', label: 'Ground-Truth DB Comparison', icon: Database },
    { id: 'evidence', label: `Evidence Findings (${screening.evidence?.length || 0})`, icon: FileText },
    { id: 'forensics', label: 'Document Forensics (Grad-CAM/ELA)', icon: Eye },
    { id: 'digital_twin', label: 'Document Digital Twin', icon: Layers },
    { id: 'graph', label: 'Identity Topology Graph', icon: Share2 },
    { id: 'timeline', label: 'Pipeline Audit Trail', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Audit History', path: '/history' },
          { label: `Dossier #${screening.id}` }
        ]}
      />

      {/* Official Case Header Bar */}
      <div className="gov-card space-y-3 border-l-4 border-gov-primary">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-[12px] text-gov-muted font-mono font-bold">
              <span>OFFICIAL DOSSIER RECORD</span>
              <span>•</span>
              <span className="text-gov-primary font-bold">{screening.id}</span>
              <span>•</span>
              <span>{screening.created_at}</span>
            </div>
            <h1 className="text-[22px] font-bold text-gov-primary flex items-center space-x-2">
              <span>Subject: {ext.name || 'Unknown Person'}</span>
              <span className="text-[13px] font-mono text-gov-muted font-normal bg-gov-bg px-2 py-0.5 rounded border border-gov-border">
                Doc No: {ext.document_number || 'N/A'}
              </span>
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="gov-btn-secondary"
            >
              <Printer className="w-4 h-4" />
              <span>{t.btnPrint}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={generatingReport}
              className="gov-btn-primary"
            >
              {generatingReport ? (
                <span className="animate-spin mr-1">⏳</span>
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{t.btnDownloadPdf}</span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-2 text-[13px] font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-300 rounded-sm inline-flex items-center space-x-1.5 transition-colors"
              title="Delete this screening record"
            >
              {deleting ? (
                <span className="animate-spin mr-1">⏳</span>
              ) : (
                <Trash2 className="w-4 h-4 text-gov-danger" />
              )}
              <span>Delete Record</span>
            </button>
          </div>
        </div>
      </div>

      {/* Human Officer Manual Override Panel */}
      <ManualOverridePanel
        screeningId={screening.id}
        currentOverrideStatus={screening.manual_override_status}
        currentNotes={screening.reviewer_notes}
        onOverrideApplied={(updated) => setScreening(updated)}
      />

      {/* Main Risk Assessment Evaluation Card */}
      <RiskAssessmentCard
        score={screening.risk_score}
        level={screening.risk_level}
        action={screening.recommended_action}
        integrity={screening.integrity_score}
        identity={screening.identity_score}
        consistency={screening.consistency_score}
        forensic={screening.forensic_score}
        processingTime={screening.processing_time_ms}
        referenceId={screening.id}
        timestamp={screening.created_at}
      />

      {/* Tab Navigation Controls */}
      <div className="border-b border-gov-border flex flex-wrap gap-1 no-print">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-[13.5px] font-semibold border-b-2 flex items-center space-x-2 transition-colors ${
                isActive
                  ? 'border-gov-primary text-gov-primary bg-gov-lightBlue font-bold'
                  : 'border-transparent text-gov-muted hover:text-gov-primary hover:bg-gov-bg'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div>
        {activeTab === 'comparison' && (
          <GroundTruthComparison
            groundTruthVerification={screening.ground_truth_verification}
            extractedData={ext}
            documentType={screening.document_type}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceTable evidence={screening.evidence} />
        )}

        {activeTab === 'forensics' && (
          <ForensicViewer
            forensicMaps={screening.forensic_maps}
            suspiciousRegions={screening.forensic_regions}
            ocrBoxes={ext.bounding_boxes || []}
            originalUrl={screening.document_image_url}
          />
        )}

        {activeTab === 'digital_twin' && (
          <DigitalTwinView
            extractedData={ext}
            mrzData={mrz}
            documentImageUrl={screening.document_image_url}
            livePhotoUrl={screening.live_photo_url}
            faceResult={screening.face_result}
          />
        )}

        {activeTab === 'graph' && (
          <IdentityGraphCanvas identityGraph={screening.identity_graph} />
        )}

        {activeTab === 'timeline' && (
          <InvestigationTimeline timeline={screening.timeline} />
        )}
      </div>


      {/* Official Footnote Notice */}
      <NoticeBox type="info" title="Verification Audit Compliance">
        This screening dossier was generated by the VERIDEX AI multi-layer algorithmic verification engine in compliance with ICAO Doc 9303 and ISO/IEC 19794 evaluation standards.
      </NoticeBox>
    </div>
  );
}
