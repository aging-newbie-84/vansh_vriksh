import React, { useRef, useState, useEffect, useCallback } from 'react';
import { buildTreeLayout } from '../utils/treeLayout';
import { exportTreeAsPDF } from '../utils/pdfExport';
import TreeNode from '../components/TreeNode';
import TreeConnector from '../components/TreeConnector';
import CoatOfArms from '../components/CoatOfArms';
import PrintCanvas from '../components/PrintCanvas';
import { saveTree } from '../utils/supabaseClient';

const TreeScreen = ({ data, onBack }) => {
  const canvasRef  = useRef(null);
  const printRef   = useRef(null);
  const isDragging = useRef(false);
  const lastMouse  = useRef({ x: 0, y: 0 });

  const [zoom, setZoom]       = useState(0.85);
  const [pan, setPan]         = useState({ x: 0, y: 0 });
  const [layout, setLayout]   = useState({ nodes: [], links: [] });
  const [pdfFormat, setPdfFormat] = useState('a1');
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [shareCode, setShareCode] = useState(null);

  // Build layout and centre view
  useEffect(() => {
    if (!data) return;
    const tree = buildTreeLayout(data.persons, data.persons[0]?.id);
    setLayout(tree);

    // Auto-centre: find bounding box and translate to viewport centre
    if (tree.nodes.length > 0) {
      const xs = tree.nodes.map(n => n.x);
      const ys = tree.nodes.map(n => n.y);
      const midX = (Math.min(...xs) + Math.max(...xs)) / 2;
      const midY = (Math.min(...ys) + Math.max(...ys)) / 2;
      // We'll offset so mid of tree maps to canvas centre
      setPan({ x: -midX * 0.85, y: -midY * 0.85 + 80 });
    }
  }, [data]);

  // ── Pan handlers ──────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.style.cursor = 'grabbing';
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setPan(p => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const onMouseUp = useCallback((e) => {
    isDragging.current = false;
    if (e.currentTarget) e.currentTarget.style.cursor = 'grab';
  }, []);

  // ── Wheel zoom — centred on cursor ────────────────────────────────────────
  const onWheel = useCallback((e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.08 : 0.93;
    setZoom(z => Math.max(0.2, Math.min(3, z * factor)));
  }, []);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // ── Export & Save ─────────────────────────────────────────────────────────
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

  const familyName = (data?.persons?.[0]?.name?.split(' ').slice(-1)[0] || 'Family') + ' Family';

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await saveTree(familyName, data);
      if (result?.share_code) setShareCode(result.share_code);
      else alert('Saved to browser only (Supabase not configured).');
    } catch (err) {
      alert('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  // Canvas origin offset — all nodes/connectors use this reference point
  const ORIGIN_X = window.innerWidth  / 2;
  const ORIGIN_Y = window.innerHeight / 2 - 40;

  return (
    <div className="flex flex-col h-screen overflow-hidden select-none"
      style={{ background: '#F5ECD8', fontFamily: 'var(--font-body)' }}
    >
      {/* ══════════ HEADER ══════════ */}
      <header className="fixed top-0 z-20 w-full flex items-center justify-between px-6 py-3"
        style={{
          background: 'rgba(253,240,220,0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '2px solid #C4622D',
          boxShadow: '0 2px 20px rgba(42,31,20,0.12)',
        }}
      >
        <button onClick={onBack} style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '0.65rem',
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: '#C4622D', border: '1px solid #C4622D',
          background: 'transparent', borderRadius: 4, padding: '6px 14px', cursor: 'pointer',
        }}>
          ← Back
        </button>

        <div className="flex items-center gap-4">
          <CoatOfArms persons={data?.persons || []} familyName={familyName} size={52} />
          <div className="text-center hidden sm:block">
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.05rem', color: '#C4622D', fontStyle: 'italic' }}>
              {familyName}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.52rem', color: '#5A7A4E', letterSpacing: '0.35em', textTransform: 'uppercase', marginTop: 1 }}>
              वंश वृक्ष · Dynasty Lineage
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center rounded overflow-hidden" style={{ border: '1px solid #C4622D' }}>
            <button onClick={() => setZoom(z => Math.max(0.2, z - 0.1))}
              style={{ width: 28, height: 28, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#C4622D' }}>−</button>
            <div style={{ width: 44, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Cormorant Garamond', serif", fontSize: '0.6rem', borderLeft: '1px solid #D4C5B0', borderRight: '1px solid #D4C5B0', color: '#2A1F14' }}>
              {Math.round(zoom * 100)}%
            </div>
            <button onClick={() => setZoom(z => Math.min(3, z + 0.1))}
              style={{ width: 28, height: 28, background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#C4622D' }}>+</button>
          </div>

          <select value={pdfFormat} onChange={e => setPdfFormat(e.target.value)}
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.6rem', letterSpacing: '0.1em', color: '#2A1F14',
              background: '#FDF0DC', border: '1px solid #C4622D', borderRadius: 4, padding: '5px 8px', cursor: 'pointer' }}>
            <option value="a0">A0 Poster</option>
            <option value="a1">A1 Poster</option>
            <option value="a2">A2 Print</option>
            <option value="a3">A3 Print</option>
          </select>

          <button onClick={handleExport} disabled={exporting} style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '0.62rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: '#FDF0DC',
            background: exporting ? '#9E9485' : '#C4622D', border: 'none',
            borderRadius: 20, padding: '7px 18px', cursor: exporting ? 'not-allowed' : 'pointer',
            boxShadow: '0 2px 10px rgba(196,98,45,0.3)', transition: 'all 0.2s',
          }}>
            {exporting ? 'Generating…' : `Export ${pdfFormat.toUpperCase()} PDF`}
          </button>

          <button onClick={handleSave} disabled={saving || !!shareCode} style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '0.62rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', color: shareCode ? '#FDF0DC' : '#C4622D',
            background: shareCode ? '#5A7A4E' : 'transparent',
            border: shareCode ? 'none' : '1px solid #C4622D',
            borderRadius: 20, padding: '7px 14px', cursor: saving ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
          }}>
            {saving ? 'Saving…' : shareCode ? '✓ Saved' : 'Save & Share'}
          </button>

          {shareCode && (
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/share/${shareCode}`); alert('Link copied!'); }}
              style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '0.55rem', letterSpacing: '0.1em',
                color: '#5A7A4E', background: 'transparent', border: '1px solid #5A7A4E',
                borderRadius: 20, padding: '6px 12px', cursor: 'pointer' }}>
              Copy Link
            </button>
          )}
        </div>
      </header>

      {/* ══════════ CANVAS ══════════ */}
      <div
        ref={canvasRef}
        className="flex-grow overflow-hidden"
        style={{ marginTop: 64, cursor: 'grab', position: 'relative' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        {/* The entire tree scales and pans as one unit */}
        <div style={{
          position: 'absolute',
          inset: 0,
          transform: `translate(${ORIGIN_X + pan.x}px, ${ORIGIN_Y + pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}>
          {/* SVG layer — connectors */}
          <svg style={{ position: 'absolute', overflow: 'visible', pointerEvents: 'none', left: 0, top: 0, width: 1, height: 1 }}>
            {layout.links.map((link, i) => (
              <TreeConnector key={i} link={link} />
            ))}
          </svg>

          {/* HTML layer — node cards */}
          {layout.nodes.map(node => (
            <TreeNode key={node.data?.id || node.isSpouse + '_' + node.x} node={node} />
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <footer className="fixed bottom-5 left-1/2 -translate-x-1/2 pointer-events-none z-10">
        <div style={{
          background: 'rgba(253,240,220,0.88)', backdropFilter: 'blur(8px)',
          border: '1px solid #C4622D', borderRadius: 20, padding: '5px 20px',
          fontFamily: "'Cormorant Garamond', serif", fontSize: '0.52rem',
          letterSpacing: '0.28em', textTransform: 'uppercase', color: '#9E9485',
        }}>
          Drag to Pan · Scroll to Zoom
        </div>
      </footer>

      {/* Off-screen print canvas */}
      <PrintCanvas ref={printRef} data={data} layout={layout} familyName={familyName} format={pdfFormat} />
    </div>
  );
};

export default TreeScreen;
