import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Shield, ExternalLink, CheckCircle2, Lock, FileText, Info } from 'lucide-react';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#1C2D42] text-slate-200 text-[13px] border-t-4 border-gov-primary mt-12">
      {/* 4 Column Institutional Info Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: About Platform */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-white font-bold text-[15px]">
              <Shield className="w-5 h-5 text-gov-saffron" />
              <span>{t.appName}</span>
            </div>
            <p className="text-slate-300 text-[13px] leading-relaxed">
              {t.footerAboutText}
            </p>
            <div className="pt-2 text-[12px] text-slate-400 font-mono">
              <span>{t.appVersion}</span> • <span>{t.lastUpdated}</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-[14px] uppercase tracking-wider border-b border-slate-700 pb-1.5">
              {t.footerLinksTitle}
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                <Link to="/" className="hover:text-gov-saffron hover:underline transition-colors">
                  {t.navHome}
                </Link>
              </li>
              <li>
                <Link to="/screening/new" className="hover:text-gov-saffron hover:underline transition-colors">
                  {t.navScreening}
                </Link>
              </li>
              <li>
                <Link to="/synthetic-lab" className="hover:text-gov-saffron hover:underline transition-colors">
                  {t.navSyntheticLab}
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-gov-saffron hover:underline transition-colors">
                  {t.navHistory}
                </Link>
              </li>
              <li>
                <Link to="/reports" className="hover:text-gov-saffron hover:underline transition-colors">
                  {t.navReports}
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-gov-saffron hover:underline transition-colors">
                  {t.navGuidelines}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Public Policies */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-[14px] uppercase tracking-wider border-b border-slate-700 pb-1.5">
              {t.footerPoliciesTitle}
            </h4>
            <ul className="space-y-1.5 text-slate-300">
              <li>
                <Link to="/guidelines" className="hover:text-gov-saffron hover:underline transition-colors">
                  {t.footerPrivacy}
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-gov-saffron hover:underline transition-colors">
                  {t.footerTerms}
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-gov-saffron hover:underline transition-colors">
                  {t.footerAccessibility}
                </Link>
              </li>
              <li>
                <Link to="/guidelines" className="hover:text-gov-saffron hover:underline transition-colors">
                  Hyperlinking Policy & Disclaimers
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Service Information */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-[14px] uppercase tracking-wider border-b border-slate-700 pb-1.5">
              {t.footerInfoTitle}
            </h4>
            <div className="space-y-2 text-slate-300 text-[12.5px]">
              <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{t.serviceStatus}</span>
              </div>
              <p className="text-slate-400">
                Operating under standard ICAO Doc 9303 machine-readable travel document specifications and ISO/IEC 19794 biometric interchange standards.
              </p>
              <div className="pt-1">
                <Link
                  to="/system-status"
                  className="inline-flex items-center space-x-1.5 text-gov-saffron hover:underline font-semibold text-[12px]"
                >
                  <span>{t.navSystemStatus}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Mandatory Disclaimer Strip */}
      <div className="bg-[#111E2E] border-t border-slate-800 py-4 text-center text-[12px] text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-200">
            {t.footerDisclaimer}
          </p>
          <p className="text-[11px] text-slate-400">
            Research & Demonstration Prototype for SIH26188 • Standalone execution with zero dataset dependency • 100% Synthetic Fictional Data.
          </p>
        </div>
      </div>
    </footer>
  );
}
