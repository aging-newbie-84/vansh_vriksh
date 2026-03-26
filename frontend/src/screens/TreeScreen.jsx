import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { buildTreeLayout } from '../utils/treeLayout';
import { exportTreeAsPDF } from '../utils/pdfExport';
import TreeNode from '../components/TreeNode';
import TreeConnector from '../components/TreeConnector';
import CoatOfArms from '../components/CoatOfArms';
import PrintCanvas from '../components/PrintCanvas';
import { saveTree } from '../utils/supabaseClient';

const TreeScreen = ({ data, onBack }) => {
  const containerRef = useRef(null);
  const printRef = useRef(null);
  const [zoom, setZoom]     = useState(1);
  const [layout, setLayout] = useState({ nodes: [], links: [] });
  const [pdfFormat, setPdfFormat] = useState('a1');
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [shareCode, setShareCode] = useState(null);

  useEffect(() => {
    if (data) {
      const tree = buildTreeLayout(data.persons, data.persons[0]?.id);
      setLayout(tree);
    }
  }, [data]);

  const handleZoom = (dir) => {
    setZoom(prev => Math.max(0.3, Math.min(2.5, prev + dir * 0.1)));
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportTreeAsPDF(printRef.current, 'Vansh_Vriksha_Dynasty', pdfFormat);
    } catch (err) {
      console.error(err);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveTree(familyName, data);
      if (result?.share_code) {
        setShareCode(result.share_code);
      } else {
        alert('Saved to browser only (Supabase not configured).');
      }
    } catch (err) {
      console.error(err);
      alert('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Family name from first person's data
  const familyName = data?.persons?.[0]?.name?.split(' ').slice(-1)[0] + ' Family'
    || 'Family';

  return (
    <div
      className="flex flex-col h-screen overflow-hidden"
      style={{ background: 'var(--stone-bg)', fontFamily: 'var(--font-body)' }}
    >
      {/* ── Sandstone texture overlay ── */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          opacity: 0.5,
        }}
      />

      {/* ══════════════ HEADER ══════════════ */}
      <header
        className="fixed top-0 z-20 w-full flex items-center justify-between px-6 py-3"
        style={{
          background: 'rgba(237,224,206,0.92)',
          backdropFilter: 'blur(8px)',
          borderBottom: '2px solid var(--terracotta)',
          boxShadow: '0 2px 16px rgba(42,31,20,0.10)',
        }}
      >
        {/* Back */}
        <button
          onClick={onBack}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.65rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'var(--terracotta)',
            border: '1px solid var(--terracotta)',
            background: 'transparent',
            borderRadius: 4,
            padding: '6px 14px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>

        {/* Title + Coat of Arms */}
        <div className="flex items-center gap-4">
          <CoatOfArms persons={data?.persons || []} familyName={familyName} size={56} />
          <div className="text-center hidden sm:block">
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.1rem',
                color: 'var(--terracotta)',
                letterSpacing: '0.04em',
                fontStyle: 'italic',
              }}
            >
              {familyName}
            </div>
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.55rem',
                color: 'var(--oriya-green)',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              वंश वृक्ष · Dynasty Lineage
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Zoom */}
          <div
            className="flex items-center rounded overflow-hidden"
            style={{ border: '1px solid var(--terracotta)' }}
          >
            <button
              onClick={() => handleZoom(-1)}
              style={{ width: 30, height: 30, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'var(--terracotta)' }}
            >−</button>
            <div
              style={{
                width: 46, height: 30,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Cormorant Garamond', serif", fontSize: '0.6rem',
                borderLeft: '1px solid var(--stone-cream)',
                borderRight: '1px solid var(--stone-cream)',
                color: 'var(--ink)',
              }}
            >
              {Math.round(zoom * 100)}%
            </div>
            <button
              onClick={() => handleZoom(1)}
              style={{ width: 30, height: 30, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: 'var(--terracotta)' }}
            >+</button>
          </div>

          {/* Format selector */}
          <select
            value={pdfFormat}
            onChange={e => setPdfFormat(e.target.value)}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              color: 'var(--ink)',
              background: 'var(--stone-bg)',
              border: '1px solid var(--terracotta)',
              borderRadius: 4,
              padding: '5px 8px',
              cursor: 'pointer',
            }}
          >
            <option value="a0">A0 Poster</option>
            <option value="a1">A1 Poster</option>
            <option value="a2">A2 Poster</option>
            <option value="a3">A3 Print</option>
          </select>

          {/* Export button */}
          <button
            onClick={handleExport}
            disabled={exporting}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--stone-bg)',
              background: exporting ? 'var(--stone-grey)' : 'var(--terracotta)',
              border: 'none',
              borderRadius: 20,
              padding: '8px 20px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 10px rgba(196,98,45,0.3)',
              transition: 'all 0.2s',
            }}
          >
            {exporting ? 'Generating…' : `Export ${pdfFormat.toUpperCase()} PDF`}
          </button>

          {/* Save & Share button */}
          <button
            onClick={handleSave}
            disabled={saving || !!shareCode}
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.62rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: shareCode ? 'var(--stone-bg)' : 'var(--terracotta)',
              background: shareCode ? 'var(--oriya-green)' : 'transparent',
              border: shareCode ? 'none' : '1px solid var(--terracotta)',
              borderRadius: 20,
              padding: '8px 16px',
              cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {saving ? 'Saving…' : shareCode ? `✓ Saved` : 'Save & Share'}
          </button>

          {/* Share code display */}
          {shareCode && (
            <button
              onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/share/${shareCode}`); alert('Link copied!'); }}
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.55rem',
                letterSpacing: '0.1em',
                color: 'var(--oriya-green)',
                background: 'transparent',
                border: '1px solid var(--oriya-green)',
                borderRadius: 20,
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              Copy Link
            </button>
          )}
        </div>
      </header>

      {/* ══════════════ TREE CANVAS ══════════════ */}
      <main
        className="flex-grow overflow-hidden relative z-10"
        id="tree-canvas"
        style={{ marginTop: 64 }}
      >
        <motion.div
          className="w-full h-full cursor-grab active:cursor-grabbing"
          style={{ scale: zoom, transformOrigin: 'center center' }}
          drag
          dragConstraints={{ left: -1200, right: 1200, top: -1200, bottom: 1200 }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* SVG connectors */}
            <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
              <g transform="translate(500, 200)">
                {layout.links.map((link, i) => (
                  <TreeConnector key={i} link={link} />
                ))}
              </g>
            </svg>

            {/* Node cards */}
            <div
              className="absolute inset-0 w-full h-full"
              style={{ transform: 'translate(500px, 200px)' }}
            >
              {layout.nodes.map(node => (
                <TreeNode key={node.id} node={node} />
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer className="fixed bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-10">
        <div
          style={{
            background: 'rgba(237,224,206,0.88)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--terracotta)',
            borderRadius: 20,
            padding: '5px 20px',
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '0.55rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--stone-grey)',
          }}
        >
          Drag · Scroll to Explore Your Heritage
        </div>
      </footer>
      {/* Off-screen print canvas — captured for PDF export */}
      <PrintCanvas
        ref={printRef}
        data={data}
        layout={layout}
        familyName={familyName}
        format={pdfFormat}
      />
    </div>
  );
};

export default TreeScreen;
