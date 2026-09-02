import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Share2 } from 'lucide-react';
import { getScreeningsList, getScreening } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import IdentityGraphCanvas from '../components/IdentityGraphCanvas';

export default function IdentityGraphPage() {
  const { t } = useLanguage();
  const [screenings, setScreenings] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [activeScreening, setActiveScreening] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const list = await getScreeningsList(20);
        setScreenings(list);
        if (list.length > 0) {
          setSelectedId(list[0].id);
          const full = await getScreening(list[0].id);
          setActiveScreening(full);
        }
      } catch (err) {
        console.error('Failed to load identity graph records:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSelect = async (id) => {
    try {
      setSelectedId(id);
      const full = await getScreening(id);
      setActiveScreening(full);
    } catch (err) {
      console.error('Failed to switch record:', err);
    }
  };

  if (loading) {
    return (
      <div className="gov-card text-center py-16 space-y-3">
        <div className="w-8 h-8 border-3 border-gov-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-[13px] font-mono text-gov-muted">Building Identity Topology Network...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Services', path: '/' }, { label: 'Identity Graph' }]} />

      {/* Header */}
      <div className="gov-card border-l-4 border-gov-primary space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-extrabold text-gov-primary">
              Identity Consistency Graph Center
            </h1>
            <p className="text-[14px] text-gov-muted">
              Topological network mapping entity attributes (Name, DOB, Doc Number) to verification sources (OCR, MRZ, Live Facial Camera).
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="graph-case-select" className="text-[12px] font-bold text-gov-muted font-mono uppercase">
              SELECT RECORD:
            </label>
            <select
              id="graph-case-select"
              value={selectedId || ''}
              onChange={(e) => handleSelect(e.target.value)}
              className="gov-input font-mono text-[12px] py-1.5 w-64"
            >
              {screenings.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.id} — {s.person_name} ({s.risk_level})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {activeScreening ? (
        <IdentityGraphCanvas identityGraph={activeScreening.identity_graph} />
      ) : (
        <div className="gov-card text-center py-12 text-gov-muted">
          No records available. Please initiate a screening first.
        </div>
      )}
    </div>
  );
}
