import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Share2, Info, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export default function IdentityGraphCanvas({ identityGraph = { nodes: [], edges: [] } }) {
  const { t } = useLanguage();
  const [selectedNode, setSelectedNode] = useState(null);

  const nodePositions = {
    node_person: { x: 350, y: 180, label: 'Subject Entity' },
    node_name: { x: 180, y: 80, label: 'Name Attribute' },
    node_dob: { x: 350, y: 60, label: 'DOB Attribute' },
    node_doc_num: { x: 520, y: 80, label: 'Doc Number' },
    node_expiry: { x: 520, y: 280, label: 'Expiry Date' },
    node_ocr: { x: 140, y: 280, label: 'Visual OCR Read' },
    node_mrz: { x: 350, y: 320, label: 'ICAO MRZ Record' },
    node_face: { x: 180, y: 200, label: 'Live Biometrics' },
    node_forensics: { x: 550, y: 200, label: 'Forensic Scan' },
  };

  const getNodeStyles = (status) => {
    switch (status?.toLowerCase()) {
      case 'mismatch':
        return {
          fill: '#FFEBEE',
          stroke: '#C62828',
          text: '#B71C1C',
          badge: 'bg-red-100 text-red-900 border-red-300',
          label: 'Mismatch',
        };
      case 'suspicious':
        return {
          fill: '#FFF8E7',
          stroke: '#E67E22',
          text: '#B94A00',
          badge: 'bg-amber-100 text-amber-900 border-amber-300',
          label: 'Suspicious',
        };
      case 'valid':
      case 'consistent':
      default:
        return {
          fill: '#E8F5E9',
          stroke: '#2E7D32',
          text: '#1B5E20',
          badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          label: 'Consistent',
        };
    }
  };

  const getEdgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'mismatch':
        return '#C62828';
      case 'suspicious':
        return '#E67E22';
      case 'consistent':
      default:
        return '#2E7D32';
    }
  };

  const nodes = identityGraph.nodes || [];
  const edges = identityGraph.edges || [];

  return (
    <div className="gov-card space-y-4">
      <div className="gov-section-header">
        <div>
          <span>{t.navIdentityGraph}</span>
          <p className="text-[12px] font-normal text-gov-muted">
            Entity-attribute topological consistency network
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[12px]">
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gov-green"></span>
            <span className="text-gov-text font-medium">Consistent</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gov-danger"></span>
            <span className="text-gov-text font-medium">Mismatch</span>
          </span>
          <span className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-gov-saffron"></span>
            <span className="text-gov-text font-medium">Suspicious</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative bg-white border border-gov-border rounded-sm p-3 min-h-[380px] flex items-center justify-center">
        <svg viewBox="0 0 700 380" className="w-full max-w-[700px] h-auto select-none">
          {/* Render Edges */}
          {edges.map((edge, idx) => {
            const p1 = nodePositions[edge.source] || { x: 350, y: 190 };
            const p2 = nodePositions[edge.target] || { x: 350, y: 190 };
            const edgeCol = getEdgeColor(edge.status);
            const isMismatch = edge.status === 'mismatch';

            return (
              <g key={`edge-${idx}`}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={edgeCol}
                  strokeWidth={isMismatch ? 2.5 : 1.5}
                  strokeDasharray={isMismatch ? '4,4' : 'none'}
                />
                {edge.label && (
                  <text
                    x={(p1.x + p2.x) / 2}
                    y={(p1.y + p2.y) / 2 - 4}
                    fill="#5F6B73"
                    fontSize="9"
                    fontFamily="Noto Sans, sans-serif"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Nodes */}
          {nodes.map((node) => {
            const pos = nodePositions[node.id] || { x: 350, y: 190 };
            const styles = getNodeStyles(node.status);
            const isPerson = node.id === 'node_person';
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                className="cursor-pointer"
                onClick={() => setSelectedNode(node)}
              >
                {/* Node Box */}
                <rect
                  x={isPerson ? -55 : -48}
                  y={isPerson ? -24 : -20}
                  width={isPerson ? 110 : 96}
                  height={isPerson ? 48 : 40}
                  rx="3"
                  fill={styles.fill}
                  stroke={isSelected ? '#123B63' : styles.stroke}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                />
                {/* Title */}
                <text
                  y={isPerson ? -6 : -4}
                  fill="#123B63"
                  fontSize={isPerson ? '11' : '9.5'}
                  fontWeight="bold"
                  fontFamily="Noto Sans, sans-serif"
                  textAnchor="middle"
                >
                  {node.label}
                </text>
                {/* Value */}
                <text
                  y={isPerson ? 12 : 10}
                  fill={styles.text}
                  fontSize={isPerson ? '10' : '9'}
                  fontFamily="Consolas, monospace"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {node.value ? (node.value.length > 12 ? node.value.slice(0, 10) + '…' : node.value) : node.status}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode ? (
        <div className="bg-gov-bg p-3.5 rounded-sm border border-gov-border flex items-center justify-between text-[13px]">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gov-primary">{selectedNode.label}</span>
              <span className="text-[11px] font-mono bg-white text-gov-muted px-2 py-0.5 rounded border border-gov-border">
                Type: {selectedNode.type}
              </span>
            </div>
            <p className="text-gov-muted">
              Parsed / Encoded Field Value: <strong className="text-gov-text font-mono">{selectedNode.value || 'N/A'}</strong>
            </p>
          </div>
          <span
            className={`font-bold text-[11px] px-2 py-1 rounded border uppercase ${
              selectedNode.status === 'mismatch'
                ? 'bg-red-100 text-red-900 border-red-300'
                : 'bg-emerald-100 text-emerald-900 border-emerald-300'
            }`}
          >
            Status: {selectedNode.status}
          </span>
        </div>
      ) : (
        <div className="text-[12px] text-gov-muted text-center italic">
          Click any attribute node on the topology graph to inspect underlying field values and verification integrity.
        </div>
      )}

      {/* Government Disclaimer Notice */}
      <div className="text-[11.5px] text-gov-muted bg-gov-lightBlue p-2.5 rounded-sm border border-gov-border">
        <strong>Institutional Notice:</strong> The Identity Consistency Graph is an explainable visual representation of cross-field comparisons, not an independent or automated legal determination.
      </div>
    </div>
  );
}
