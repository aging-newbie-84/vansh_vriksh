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

  // Build layout + auto-fit zoom so the full tree is visible on load
  useEffect(() => {
    if (!data) return;
    const tree = buildTreeLayout(data.persons, data.persons[0]?.id);
    setLayout(tree);

    if (tree.nodes.length > 0) {
      const xs  = tree.nodes.map(n => n.x);
      const ys  = tree.nodes.map(n => n.y);
      const minX = Math.min(...xs) - 120;
      const maxX = Math.max(...xs) + 120;
      const minY = Math.min(...ys) - 80;
      const maxY = Math.max(...ys) + 80;

      const treeW = maxX - minX;
      const treeH = maxY - minY;

      const vw = window.innerWidth;
      const vh = window.innerHeight - 72;  // minus header height

      // Scale to fit, capped at 1.0 so we never over-zoom a small tree
      const fitZoom = Math.min(vw / treeW, vh / treeH, 1.0);
      setZoom(fitZoom);

      // Centre the tree in the viewport at the fitted zoom
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;
      setPan({ x: -midX * fitZoom, y: -midY * fitZoom });
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
      {/* ══════════ DYNASTY HEADER ══════════ */}
      <header className="fixed top-0 z-20 w-full"
        style={{
          background: 'linear-gradient(135deg, #1E0F06 0%, #2E1608 60%, #1E0F06 100%)',
          borderBottom: '3px solid #C4622D',
          boxShadow: '0 4px 32px rgba(0,0,0,0.45)',
          height: 72,
        }}
      >
        {/* Thin gold line across top */}
        <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:'linear-gradient(90deg, transparent, #C4622D88, #E8B86D, #C4622D88, transparent)' }} />

        <div className="flex items-center h-full px-4 gap-3">
          {/* Back */}
          <button onClick={onBack} style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '0.6rem',
            letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#E8B86D', border: '1px solid #C4622D55',
            background: 'transparent', borderRadius: 3, padding: '5px 12px', cursor: 'pointer',
            flexShrink: 0,
          }}>← Back</button>

          {/* Dynasty proclamation — centred */}
          <div className="flex-1 flex items-center justify-center gap-3">
            <CoatOfArms persons={data?.persons || []} familyName={familyName} size={44} />
            <div className="text-center">
              {/* The name — large, proud */}
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 800,
                fontSize: '1.5rem',
                color: '#F5E6C8',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                lineHeight: 1,
                textShadow: '0 1px 12px rgba(196,98,45,0.4)',
              }}>
                {familyName.replace(' Family', '')}
              </div>
              {/* Dynasty tagline */}
              <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.52rem',
                color: '#C4622D',
                letterSpacing: '0.45em',
                textTransform: 'uppercase',
                marginTop: 3,
              }}>
                ── वंश वृक्ष · Dynasty Lineage ──
              </div>
            </div>
          </div>

          {/* Controls — right side, compact */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center rounded overflow-hidden" style={{ border: '1px solid #C4622D55' }}>
              <button onClick={() => setZoom(z => Math.max(0.1, z - 0.1))}
                style={{ width:24, height:26, background:'transparent', border:'none', cursor:'pointer', fontWeight:'bold', color:'#E8B86D', fontSize:'0.9rem' }}>−</button>
              <div style={{ width:38, height:26, display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:"'Cormorant Garamond', serif", fontSize:'0.58rem', color:'#E8B86D',
                borderLeft:'1px solid #C4622D44', borderRight:'1px solid #C4622D44' }}>
                {Math.round(zoom * 100)}%
              </div>
              <button onClick={() => setZoom(z => Math.min(3, z + 0.1))}
                style={{ width:24, height:26, background:'transparent', border:'none', cursor:'pointer', fontWeight:'bold', color:'#E8B86D', fontSize:'0.9rem' }}>+</button>
            </div>

            <select value={pdfFormat} onChange={e => setPdfFormat(e.target.value)}
              style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:'0.55rem', letterSpacing:'0.08em',
                color:'#E8B86D', background:'transparent', border:'1px solid #C4622D55',
                borderRadius:3, padding:'4px 6px', cursor:'pointer' }}>
              <option value="a1" style={{background:'#1E0F06'}}>A1 Poster</option>
              <option value="a2" style={{background:'#1E0F06'}}>A2 Print</option>
              <option value="a3" style={{background:'#1E0F06'}}>A3 Print</option>
            </select>

            <button onClick={handleExport} disabled={exporting} style={{
              fontFamily:"'Cormorant Garamond', serif", fontSize:'0.6rem', letterSpacing:'0.15em',
              textTransform:'uppercase', color:'#1E0F06',
              background: exporting ? '#9E9485' : 'linear-gradient(135deg, #E8B86D, #C4622D)',
              border:'none', borderRadius:4, padding:'6px 14px',
              cursor: exporting ? 'not-allowed' : 'pointer',
              boxShadow:'0 2px 12px rgba(196,98,45,0.4)', transition:'all 0.2s', fontWeight:700,
            }}>
              {exporting ? '…' : `Export PDF`}
            </button>

            <button onClick={handleSave} disabled={saving || !!shareCode} style={{
              fontFamily:"'Cormorant Garamond', serif", fontSize:'0.6rem', letterSpacing:'0.12em',
              textTransform:'uppercase',
              color: shareCode ? '#1E0F06' : '#E8B86D',
              background: shareCode ? '#5A7A4E' : 'transparent',
              border: shareCode ? 'none' : '1px solid #C4622D66',
              borderRadius:4, padding:'6px 12px', cursor:'pointer', transition:'all 0.2s',
            }}>
              {saving ? '…' : shareCode ? '✓ Saved' : 'Share'}
            </button>
          </div>
        </div>
      </header>

      {/* ══════════ CANVAS ══════════ */}
      <div
        ref={canvasRef}
        className="flex-grow overflow-hidden"
        style={{ marginTop: 72, cursor: 'grab', position: 'relative' }}
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

{/* Off-screen print canvas */}
      <PrintCanvas ref={printRef} data={data} layout={layout} familyName={familyName} format={pdfFormat} />
    </div>
  );
};

export default TreeScreen;
