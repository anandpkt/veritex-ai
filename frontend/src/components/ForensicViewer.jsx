import React, { useState } from 'react';
import { Eye, Layers, ZoomIn, ZoomOut, Flame, Cpu, Sliders, Scan, CheckSquare, Square } from 'lucide-react';

export default function ForensicViewer({
  forensicMaps = {},
  suspiciousRegions = [],
  ocrBoxes = [],
  originalUrl = '',
}) {
  const [activeTab, setActiveTab] = useState('heatmap'); // 'heatmap', 'ela', 'noise', 'edge', 'enhanced', 'original', 'split'
  const [splitPos, setSplitPos] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [showOcrOverlay, setShowOcrOverlay] = useState(false);
  const [showTamperBoxes, setShowTamperBoxes] = useState(true);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const tabs = [
    { id: 'heatmap', label: 'Cyber Heatmap', icon: Flame, badge: suspiciousRegions.length > 0 ? `${suspiciousRegions.length} Flagged` : null },
    { id: 'ela', label: 'Error Level (ELA)', icon: Layers },
    { id: 'noise', label: 'Noise Variance', icon: Cpu },
    { id: 'edge', label: 'Edge Discontinuity', icon: Scan },
    { id: 'enhanced', label: 'Enhanced Contrast', icon: Eye },
    { id: 'original', label: 'Original Scan', icon: Eye },
    { id: 'split', label: 'Before/After Comparison', icon: Sliders },
  ];

  const getCurrentImageUrl = () => {
    switch (activeTab) {
      case 'heatmap':
        return forensicMaps.heatmap || originalUrl;
      case 'ela':
        return forensicMaps.ela || originalUrl;
      case 'noise':
        return forensicMaps.noise || originalUrl;
      case 'edge':
        return forensicMaps.edge || originalUrl;
      case 'enhanced':
        return forensicMaps.enhanced || originalUrl;
      case 'original':
      default:
        return forensicMaps.original || originalUrl;
    }
  };

  return (
    <div className="gov-card space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gov-border">
        {/* Inspection Mode Tabs */}
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-sm text-[13px] font-semibold border transition-colors ${
                  isActive
                    ? 'bg-gov-primary text-white border-gov-primaryDark'
                    : 'bg-white text-gov-text border-gov-border hover:bg-gov-lightBlue'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-gov-danger text-white text-[10px] font-bold px-1.5 py-0.2 rounded-sm ml-1">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View Overlays & Zoom */}
        <div className="flex items-center space-x-2 text-[12px]">
          <button
            type="button"
            onClick={() => setShowOcrOverlay(!showOcrOverlay)}
            className={`px-2.5 py-1 rounded-sm border font-semibold inline-flex items-center space-x-1 ${
              showOcrOverlay ? 'bg-gov-secondary text-white border-gov-secondary' : 'bg-white text-gov-muted border-gov-border hover:bg-gov-lightBlue'
            }`}
          >
            {showOcrOverlay ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            <span>OCR Boxes</span>
          </button>

          <button
            type="button"
            onClick={() => setShowTamperBoxes(!showTamperBoxes)}
            className={`px-2.5 py-1 rounded-sm border font-semibold inline-flex items-center space-x-1 ${
              showTamperBoxes ? 'bg-gov-danger text-white border-gov-danger' : 'bg-white text-gov-muted border-gov-border hover:bg-gov-lightBlue'
            }`}
          >
            {showTamperBoxes ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
            <span>Tamper Flags</span>
          </button>

          <div className="flex items-center bg-white border border-gov-border rounded-sm">
            <button
              type="button"
              onClick={() => setZoom(Math.max(0.8, zoom - 0.2))}
              className="p-1.5 hover:bg-gov-lightBlue text-gov-muted border-r border-gov-border"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-gov-text px-2 font-bold">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom(Math.min(2.0, zoom + 0.2))}
              className="p-1.5 hover:bg-gov-lightBlue text-gov-muted border-l border-gov-border"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Inspection Canvas */}
      <div className="relative bg-[#0F172A] border border-gov-border rounded-sm min-h-[380px] flex items-center justify-center p-2 overflow-hidden">
        {activeTab === 'split' ? (
          /* Interactive Before / After Split Slider */
          <div className="relative w-full max-w-[850px] aspect-[850/540] overflow-hidden select-none border border-slate-700">
            <img
              src={forensicMaps.heatmap || originalUrl}
              alt="Forensic Heatmap Layer"
              className="absolute inset-0 w-full h-full object-contain"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${splitPos}%` }}
            >
              <img
                src={forensicMaps.original || originalUrl}
                alt="Original Document Scan"
                className="absolute inset-0 w-full h-full object-contain max-w-none"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            {/* Split Divider */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gov-saffron cursor-ew-resize flex items-center justify-center shadow-md"
              style={{ left: `${splitPos}%` }}
            >
              <div className="w-6 h-6 rounded-full bg-white border-2 border-gov-saffron flex items-center justify-center shadow">
                <Sliders className="w-3 h-3 text-gov-saffron" />
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={splitPos}
              onChange={(e) => setSplitPos(Number(e.target.value))}
              className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
            />
            <div className="absolute top-2 left-2 bg-black/80 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded">
              ORIGINAL SCAN
            </div>
            <div className="absolute top-2 right-2 bg-gov-danger text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded">
              FORENSIC HEATMAP
            </div>
          </div>
        ) : (
          /* Standard Viewer with Overlays */
          <div
            className="relative transition-transform duration-200"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
          >
            <img
              src={getCurrentImageUrl()}
              alt="Document Forensic Visual Analysis"
              className="max-h-[460px] max-w-full rounded-sm object-contain shadow-lg"
            />

            {/* OCR Bounding Boxes */}
            {showOcrOverlay &&
              ocrBoxes.map((box, idx) => (
                <div
                  key={`ocr-${idx}`}
                  className="absolute border-2 border-gov-secondary bg-gov-secondary/20"
                  style={{
                    left: `${(box.x / 850) * 100}%`,
                    top: `${(box.y / 540) * 100}%`,
                    width: `${(box.width / 850) * 100}%`,
                    height: `${(box.height / 540) * 100}%`,
                  }}
                  title={`OCR [${box.field}]: ${Math.round((box.confidence || 0.95) * 100)}%`}
                >
                  <span className="absolute -top-3.5 left-0 bg-gov-secondary text-white text-[8px] font-mono font-bold px-1 rounded-sm">
                    {box.field}
                  </span>
                </div>
              ))}

            {/* Suspicious Tampered Region Boxes */}
            {showTamperBoxes &&
              suspiciousRegions.map((region, idx) => (
                <div
                  key={`tamper-${region.id || idx}`}
                  onMouseEnter={() => setHoveredRegion(region)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  className="absolute border-2 border-gov-danger bg-red-500/30 cursor-pointer"
                  style={{
                    left: `${(region.x / 850) * 100}%`,
                    top: `${(region.y / 540) * 100}%`,
                    width: `${(region.width / 850) * 100}%`,
                    height: `${(region.height / 540) * 100}%`,
                  }}
                >
                  <span className="absolute -top-4 left-0 bg-gov-danger text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-sm shadow">
                    SUSPICIOUS ({Math.round((region.confidence || 0.9) * 100)}%)
                  </span>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Target Anomaly Details */}
      {hoveredRegion ? (
        <div className="bg-[#FFF5F5] border border-gov-danger/40 p-3 text-[13px] rounded-sm flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="font-bold text-gov-danger flex items-center space-x-2">
              <span>{hoveredRegion.label}</span>
              <span className="text-[11px] font-mono bg-red-100 text-gov-danger px-1.5 rounded font-semibold">
                Confidence: {Math.round((hoveredRegion.confidence || 0.9) * 100)}%
              </span>
            </div>
            <p className="text-gov-text text-[12px]">{hoveredRegion.reason}</p>
          </div>
          <span className="font-mono text-[11px] text-gov-muted uppercase font-bold">
            Type: {hoveredRegion.anomaly_type}
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-between text-[12px] text-gov-muted font-mono px-1">
          <span>Active Layer: {tabs.find((t) => t.id === activeTab)?.label}</span>
          <span>Standard Resolution: 850 x 540 px • Lossless RGB Analysis</span>
        </div>
      )}
    </div>
  );
}
