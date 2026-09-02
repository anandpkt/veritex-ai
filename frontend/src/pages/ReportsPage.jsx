import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FileText, Download, Printer, Shield, ExternalLink, ArrowRight } from 'lucide-react';
import { getScreeningsList, getReport } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';

export default function ReportsPage() {
  const { t } = useLanguage();
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getScreeningsList(50);
        setScreenings(data);
      } catch (err) {
        console.error('Failed to load reports archive:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleDownload = async (id) => {
    try {
      setDownloadingId(id);
      const res = await getReport(id);
      if (res.pdf_url) {
        window.open(res.pdf_url, '_blank');
      }
    } catch (err) {
      console.error('Failed to compile PDF dossier:', err);
      alert('Unable to compile official PDF dossier.');
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Official Dossiers' }]} />

      {/* Header */}
      <div className="gov-card border-l-4 border-gov-primary space-y-2">
        <h1 className="text-[24px] font-extrabold text-gov-primary">
          Official Verification Dossiers & PDF Archive
        </h1>
        <p className="text-[14px] text-gov-muted">
          Download structured PDF investigation dossiers containing complete multi-signal evidence, digital twin extraction tables, forensic heatmap details, and pipeline audit logs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {screenings.map((s) => (
          <div
            key={s.id}
            className="gov-card space-y-3 flex flex-col justify-between hover:border-gov-primary transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-gov-border">
                <span className="font-mono text-[13px] font-bold text-gov-primary">
                  {s.id}
                </span>
                <span
                  className={`text-[9.5px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                    s.risk_level === 'CRITICAL'
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : s.risk_level === 'HIGH'
                      ? 'bg-red-100 text-red-900 border-red-300'
                      : s.risk_level === 'MEDIUM'
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                  }`}
                >
                  {s.risk_level} ({s.risk_score}/100)
                </span>
              </div>

              <h3 className="text-[15px] font-bold text-gov-text">
                {s.person_name}
              </h3>
              <p className="text-[12px] font-mono text-gov-muted">
                Doc No: {s.document_number} • {s.document_type}
              </p>
              <p className="text-[11px] text-gov-muted font-mono">
                Generated: {s.created_at}
              </p>
            </div>

            <div className="pt-2 border-t border-gov-border flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleDownload(s.id)}
                disabled={downloadingId === s.id}
                className="gov-btn-primary py-1.5 px-3 text-[12px] flex-1"
              >
                {downloadingId === s.id ? (
                  <span className="animate-spin mr-1">⏳</span>
                ) : (
                  <Download className="w-3.5 h-3.5" />
                )}
                <span>Download PDF</span>
              </button>

              <a
                href={`/screening/${s.id}`}
                className="gov-btn-secondary py-1.5 px-3 text-[12px]"
                title="View in browser"
              >
                <span>Inspect</span>
                <ArrowRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
