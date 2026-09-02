import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Breadcrumbs({ items = [] }) {
  const { t } = useLanguage();

  return (
    <nav className="flex items-center space-x-2 text-[13px] text-gov-muted mb-4 font-medium" aria-label="Breadcrumb">
      <Link to="/" className="hover:text-gov-primary hover:underline flex items-center space-x-1">
        <Home className="w-3.5 h-3.5" />
        <span>{t.navHome}</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {item.path ? (
            <Link to={item.path} className="hover:text-gov-primary hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-gov-text font-bold" aria-current="page">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
