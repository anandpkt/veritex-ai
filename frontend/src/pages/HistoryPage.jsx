import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { History, Search, Filter, ArrowRight, ShieldCheck, AlertTriangle, ShieldAlert, AlertCircle, RotateCcw } from 'lucide-react';
import { getScreeningsList } from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';

export default function HistoryPage() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getScreeningsList(100, filter === 'ALL' ? null : filter);
        setScreenings(data);
      } catch (err) {
        console.error('Failed to load screening history:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [filter]);

  const filteredScreenings = screenings.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.id?.toLowerCase().includes(q) ||
      s.person_name?.toLowerCase().includes(q) ||
      s.document_number?.toLowerCase().includes(q)
    );
  });

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'HIGH':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'MEDIUM':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'LOW':
      default:
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Audit History' }]} />

      {/* Header */}
      <div className="gov-card border-l-4 border-gov-primary space-y-2">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-extrabold text-gov-primary">
              Screening Audit Log & Records Registry
            </h1>
            <p className="text-[14px] text-gov-muted">
              Searchable administrative register of all historical document screenings, multi-signal risk evaluations, and operational decisions.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1 bg-gov-bg p-1 rounded-sm border border-gov-border text-xs">
            {['ALL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFilter(lvl)}
                className={`px-3 py-1 rounded-sm font-mono text-[11px] font-bold transition-colors ${
                  filter === lvl
                    ? 'bg-gov-primary text-white'
                    : 'text-gov-muted hover:bg-gov-lightBlue hover:text-gov-primary'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gov-muted absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Reference ID (e.g. VRX-...), Subject Name, or Document Number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="gov-input pl-9 text-[13px] font-mono"
          />
        </div>
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="gov-btn-secondary text-[12px] py-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Filter</span>
          </button>
        )}
      </div>

      {/* Registry Table */}
      <div className="gov-card p-0 overflow-hidden border border-gov-border">
        <div className="overflow-x-auto">
          <table className="gov-table">
            <thead>
              <tr>
                <th className="w-32">Reference ID</th>
                <th className="w-40">Date & Timestamp</th>
                <th>Subject Entity Name</th>
                <th className="w-36">Document Number</th>
                <th className="w-28">Doc Type</th>
                <th className="w-32">Risk Score</th>
                <th>Administrative Decision</th>
                <th className="w-24 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gov-muted text-[13px]">
                    Loading verification registry records...
                  </td>
                </tr>
              ) : filteredScreenings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gov-muted text-[13px]">
                    No matching verification records found in registry.
                  </td>
                </tr>
              ) : (
                filteredScreenings.map((s) => (
                  <tr key={s.id}>
                    <td className="font-mono font-bold text-gov-primary">
                      {s.id}
                    </td>
                    <td className="text-gov-muted text-[12px] font-mono">
                      {s.created_at}
                    </td>
                    <td className="font-bold text-gov-text">
                      {s.person_name}
                    </td>
                    <td className="font-mono text-gov-muted font-bold text-[12.5px]">
                      {s.document_number}
                    </td>
                    <td className="text-gov-muted text-[12.5px]">
                      {s.document_type}
                    </td>
                    <td>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono font-bold text-gov-text">{s.risk_score}</span>
                        <span className={`text-[9.5px] px-1.5 py-0.2 rounded border uppercase font-bold font-mono ${getRiskBadge(s.risk_level)}`}>
                          {s.risk_level}
                        </span>
                      </div>
                    </td>
                    <td className="text-gov-text text-[12.5px] font-medium">
                      {s.recommended_action}
                    </td>
                    <td className="text-right">
                      <Link
                        to={`/screening/${s.id}`}
                        className="text-gov-primary hover:text-gov-secondary font-bold text-[12.5px] underline inline-flex items-center space-x-1"
                      >
                        <span>Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
