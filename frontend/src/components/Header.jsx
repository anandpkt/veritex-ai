import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import {
  Shield,
  Search,
  Menu,
  X,
  FileCheck,
  Cpu,
  Layers,
  Eye,
  Share2,
  Sliders,
  History,
  FileText,
  BookOpen,
  CheckCircle2,
  Globe
} from 'lucide-react';

export default function Header() {
  const { lang, setLang, textScale, setTextScale, highContrast, toggleHighContrast, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinks = [
    { name: t.navHome, path: '/' },
    { name: t.navScreening, path: '/screening/new' },
    { name: t.navSyntheticLab, path: '/synthetic-lab' },
    { name: t.navForensics, path: '/forensics' },
    { name: t.navDigitalTwin, path: '/digital-twin' },
    { name: t.navIdentityGraph, path: '/identity-graph' },
    { name: t.navSimulator, path: '/risk-simulator' },
    { name: t.navHistory, path: '/history' },
    { name: t.navReports, path: '/reports' },
    { name: t.navGuidelines, path: '/guidelines' },
    { name: t.navSystemStatus, path: '/system-status' },
  ];

  return (
    <header className="border-b border-gov-border bg-white sticky top-0 z-50">
      {/* Skip to Main Content Link for Screen Readers */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-gov-saffron focus:text-white focus:px-4 focus:py-2 focus:z-50 text-xs font-bold"
      >
        {t.skipToContent}
      </a>

      {/* 1. Top Utility Strip */}
      <div className="bg-[#1C2D42] text-slate-200 text-[12px] border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-between gap-2">
          {/* Left: Prototype Marker */}
          <div className="flex items-center space-x-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-gov-saffron inline-block"></span>
            <span className="tracking-wide text-slate-100 uppercase">{t.prototypeBadge}</span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-300 text-[11px] hidden sm:inline">{t.disclaimerBar}</span>
          </div>

          {/* Right: Accessibility Controls & Language Toggle */}
          <div className="flex items-center space-x-4 text-[12px]">
            {/* Text Resizing Controls */}
            <div className="flex items-center space-x-1 border-r border-slate-600 pr-3">
              <span className="text-slate-400 mr-1 text-[11px]">{t.textSize}:</span>
              <button
                type="button"
                onClick={() => setTextScale('sm')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${textScale === 'sm' ? 'bg-gov-saffron text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                title="Decrease font size"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => setTextScale('normal')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${textScale === 'normal' ? 'bg-gov-saffron text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                title="Standard font size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setTextScale('lg')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${textScale === 'lg' ? 'bg-gov-saffron text-white' : 'text-slate-300 hover:bg-slate-700'}`}
                title="Increase font size"
              >
                A+
              </button>
            </div>

            {/* High Contrast Toggle */}
            <button
              type="button"
              onClick={toggleHighContrast}
              className={`text-[11px] px-2 py-0.5 rounded border ${highContrast ? 'bg-yellow-400 text-black border-yellow-300 font-bold' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}`}
              title="Toggle High Contrast Mode"
            >
              {t.highContrast}
            </button>

            {/* Language Toggle: English | Tamil */}
            <div className="flex items-center space-x-1 font-semibold">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-1.5 py-0.5 rounded text-[11px] transition-colors ${lang === 'en' ? 'bg-gov-primary text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                English
              </button>
              <span className="text-slate-500">|</span>
              <button
                type="button"
                onClick={() => setLang('ta')}
                className={`px-1.5 py-0.5 rounded text-[11px] font-tamil transition-colors ${lang === 'ta' ? 'bg-gov-primary text-white font-bold' : 'text-slate-300 hover:text-white'}`}
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Fictional Government Identity Emblem & Branding */}
        <Link to="/" className="flex items-center space-x-3.5 group">
          {/* Fictional Geometric Public Service Emblem */}
          <div className="w-12 h-12 rounded-sm bg-gov-primary flex items-center justify-center p-2 text-white border-2 border-[#0D2A47] flex-shrink-0 shadow-sm">
            <svg viewBox="0 0 24 24" className="w-full h-full fill-none stroke-current stroke-2">
              <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" />
              <path d="M12 8v8M8 12h8" strokeLinecap="round" />
            </svg>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[20px] font-extrabold tracking-tight text-gov-primary group-hover:text-gov-secondary transition-colors">
                {t.appName}
              </span>
              <span className="bg-gov-lightBlue text-gov-primary text-[11px] font-bold px-2 py-0.5 rounded border border-gov-border">
                {t.appVersion}
              </span>
            </div>
            <p className="text-[12px] font-medium text-gov-muted tracking-tight">
              {t.appSub}
            </p>
          </div>
        </Link>

        {/* Right Header: Search & Service Health Indicator */}
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearchSubmit} className="relative w-64 hidden sm:block">
            <input
              type="text"
              placeholder="Search reference ID / case..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAFAFC] border border-gov-border rounded-sm pl-8 pr-3 py-1.5 text-[13px] text-gov-text placeholder-gov-muted focus:border-gov-primary focus:bg-white focus:outline-none"
            />
            <Search className="w-4 h-4 text-gov-muted absolute left-2.5 top-2" />
          </form>

          <div className="hidden lg:flex items-center space-x-2 bg-gov-lightBlue px-3 py-1.5 rounded-sm border border-gov-border text-[12px] font-semibold text-gov-primary">
            <CheckCircle2 className="w-4 h-4 text-gov-green" />
            <span>{t.serviceStatus}</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gov-primary hover:bg-gov-lightBlue rounded-sm border border-gov-border"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. Navy Blue Navigation Bar */}
      <nav className="bg-gov-primary border-t border-b border-[#0D2A47] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center space-x-1 overflow-x-auto py-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-[13.5px] font-semibold tracking-normal rounded-sm transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-gov-primaryDark text-white border-b-2 border-gov-saffron font-bold'
                      : 'text-slate-100 hover:bg-[#1C4E78] hover:text-white'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-[#1C4E78] space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 text-[14px] font-medium rounded-sm ${
                      isActive
                        ? 'bg-gov-primaryDark text-white font-bold border-l-4 border-gov-saffron'
                        : 'text-slate-100 hover:bg-[#1C4E78]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
