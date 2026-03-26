import React, { useMemo } from 'react';

// ── Design tokens for print ──────────────────────────────────────
const PARCHMENT  = '#FDF3E3';
const GOLD       = '#D4AF37';
const GOLD_BORD  = '#C9A84C';
const MAROON     = '#8B1A1A';
const WARM_BROWN = '#7A5C3A';
const SIENNA     = '#8B4513';
const SAGE       = '#6B5D4F';

// Paper sizes in px at 96dpi (landscape)
const PAPER = {
  a3: { w: 1587, h: 1122 },
  a2: { w: 2245, h: 1587 },
  a1: { w: 3179, h: 2245 },
  a0: { w: 4494, h: 3179 },
};

const BORDER_W = 56;
const HEADER_H = 96;
const FOOTER_H = 44;
const NODE_W   = 118;
const NODE_H   = 96;
const TREE_PAD = 60;

// ── 8-petalled lotus medallion for corners ───────────────────────
function LotusCorner({ cx, cy, r }) {
  const petals = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const px = cx + Math.cos(angle) * r * 0.55;
    const py = cy + Math.sin(angle) * r * 0.55;
    petals.push(
      <ellipse
        key={i} cx={px} cy={py}
        rx={r * 0.26} ry={r * 0.44}
        fill={GOLD} opacity="0.38"
        transform={`rotate(${(angle * 180 / Math.PI) + 90} ${px} ${py})`}
      />
    );
  }
  return (
    <g>
      {petals}
      <circle cx={cx} cy={cy} r={r * 0.22} fill={GOLD} opacity="0.7" />
      <circle cx={cx} cy={cy} r={r * 0.10} fill={PARCHMENT} />
    </g>
  );
}

// ── Mandala border SVG ───────────────────────────────────────────
function MandalaFrameSVG({ w, h, b }) {
  const r0 = b * 0.15;
  const r1 = b * 0.38;
  const r2 = b * 0.68;

  const corners = [
    [r1, r1],
    [w - r1, r1],
    [r1, h - r1],
    [w - r1, h - r1],
  ];

  // Edge ornament dots & diamonds along all four sides of the main border
  const edgeElems = [];
  const step = 22;

  const addEdge = (axis, fixedVal, start, end, prefix) => {
    let idx = 0;
    for (let v = start + step; v < end - step; v += step) {
      const phase = idx++ % 3;
      const cx = axis === 'x' ? v : fixedVal;
      const cy = axis === 'x' ? fixedVal : v;
      const key = `${prefix}${v}`;
      if (phase === 0) {
        edgeElems.push(<circle key={key} cx={cx} cy={cy} r="1.5" fill={GOLD} opacity="0.55" />);
      } else if (phase === 1) {
        edgeElems.push(
          <rect key={key} x={cx - 2.5} y={cy - 2.5} width="5" height="5"
            fill={GOLD} opacity="0.45" transform={`rotate(45 ${cx} ${cy})`} />
        );
      } else {
        edgeElems.push(<circle key={key} cx={cx} cy={cy} r="1" fill={GOLD} opacity="0.35" />);
      }
    }
  };

  addEdge('x', r1, r1, w - r1, 't');
  addEdge('x', h - r1, r1, w - r1, 'b');
  addEdge('y', r1, r1, h - r1, 'l');
  addEdge('y', w - r1, r1, h - r1, 'r');

  return (
    <svg
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}
      width={w} height={h}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outermost faint rect */}
      <rect x={r0} y={r0} width={w - r0 * 2} height={h - r0 * 2}
        fill="none" stroke={GOLD} strokeWidth="1" opacity="0.2" />
      {/* Main border */}
      <rect x={r1} y={r1} width={w - r1 * 2} height={h - r1 * 2}
        fill="none" stroke={GOLD_BORD} strokeWidth="1.5" opacity="0.8" />
      {/* Inner border */}
      <rect x={r2} y={r2} width={w - r2 * 2} height={h - r2 * 2}
        fill="none" stroke={GOLD} strokeWidth="0.75" opacity="0.4" />
      {/* Edge ornaments */}
      {edgeElems}
      {/* Corner lotus medallions */}
      {corners.map(([cx, cy], i) => (
        <LotusCorner key={i} cx={cx} cy={cy} r={b * 0.28} />
      ))}
    </svg>
  );
}

// ── Print-optimised person node (HTML for font fidelity) ─────────
function PrintNodeHTML({ node, px, py }) {
  const d = node.data;
  const isMale = d.gender !== 'female';
  const topAccent = isMale ? SIENNA : SAGE;
  const birthYear = d.birth_year || d.birthYear || '';
  const deathYear = d.death_year || d.deathYear || '';
  const years = birthYear ? `${birthYear} – ${deathYear || 'present'}` : '';
  const bio = (d.profession || d.one_liner || '').substring(0, 26);

  return (
    <div
      style={{
        position: 'absolute',
        left: px - NODE_W / 2,
        top: py - NODE_H / 2,
        width: NODE_W,
        height: NODE_H,
        background: PARCHMENT,
        border: `0.75px solid ${GOLD_BORD}`,
        borderTop: `2px solid ${topAccent}`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 6,
        paddingBottom: 5,
        paddingLeft: 5,
        paddingRight: 5,
      }}
    >
      {/* Portrait oval placeholder */}
      <div
        style={{
          width: 30, height: 36,
          borderRadius: '50%',
          border: `0.75px dashed ${GOLD_BORD}`,
          opacity: 0.45,
          flexShrink: 0,
          marginBottom: 4,
        }}
      />
      {/* Name — IM Fell English italic, regal quality */}
      <div
        style={{
          fontFamily: "'Lora', serif",
          fontStyle: 'italic',
          fontSize: 10.5,
          color: MAROON,
          textAlign: 'center',
          lineHeight: 1.25,
          letterSpacing: '0.01em',
          maxWidth: '100%',
          wordBreak: 'break-word',
        }}
      >
        {d.name || 'Unknown'}
      </div>
      {/* Thin gold divider */}
      <div
        style={{
          width: '55%', height: 0.5,
          background: GOLD_BORD, opacity: 0.55,
          margin: '3px 0 2px', flexShrink: 0,
        }}
      />
      {/* Years */}
      {years && (
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 6.5,
            color: WARM_BROWN,
            letterSpacing: '0.04em',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {years}
        </div>
      )}
      {/* Profession one-liner */}
      {bio && (
        <div
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: 'italic',
            fontSize: 6,
            color: WARM_BROWN,
            opacity: 0.7,
            textAlign: 'center',
            marginTop: 2,
            lineHeight: 1.2,
          }}
        >
          {bio}
        </div>
      )}
    </div>
  );
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

// ── Main PrintCanvas component ───────────────────────────────────
const PrintCanvas = React.forwardRef(function PrintCanvas(
  { data, layout, familyName, format = 'a3' },
  ref
) {
  const { w: W, h: H } = PAPER[format] || PAPER.a3;
  const CW = W - BORDER_W * 2;
  const CH = H - BORDER_W * 2 - HEADER_H - FOOTER_H;
  const treeOriginY = BORDER_W + HEADER_H;

  const nodes = layout?.nodes || [];
  const links = layout?.links || [];

  // Auto-scale tree layout to fill content area with generous breathing room
  const { sX, sY, oX, oY } = useMemo(() => {
    if (!nodes.length) return { sX: 1, sY: 1, oX: 0, oY: 0 };
    const xs = nodes.map(n => n.x);
    const ys = nodes.map(n => n.y);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const treeW = (maxX - minX) || 200;
    const treeH = (maxY - minY) || 200;
    const availW = CW - TREE_PAD * 2 - 28; // 28px reserved for gen labels column
    const availH = CH - TREE_PAD * 2;
    const s = Math.min(availH / treeH, availW / treeW, 1.6);
    const scaledW = treeW * s;
    const scaledH = treeH * s;
    return {
      sX: s, sY: s,
      oX: 28 + (availW - scaledW) / 2 - minX * s + TREE_PAD,
      oY: (availH - scaledH) / 2 - minY * s + TREE_PAD,
    };
  }, [nodes, CW, CH]);

  // Generation label positions
  const genLabels = useMemo(() => {
    if (!nodes.length) return [];
    const byDepth = new Map();
    nodes.forEach(n => {
      const scaledY = n.y * sY + oY;
      if (!byDepth.has(n.depth)) byDepth.set(n.depth, []);
      byDepth.get(n.depth).push(scaledY);
    });
    return Array.from(byDepth.entries()).map(([depth, ys]) => ({
      depth,
      y: ys.reduce((a, b) => a + b, 0) / ys.length,
      label: `GEN ${ROMAN[depth] || depth + 1}`,
    }));
  }, [nodes, sX, sY, oX, oY]);

  const year = new Date().getFullYear();
  const headline = (familyName || 'Family Lineage').toUpperCase();
  const subtitle = `वंश वृक्ष  ·  Dynasty Record  ·  ${year}`;

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        left: -(W + 200),
        top: 0,
        width: W,
        height: H,
        background: PARCHMENT,
        overflow: 'hidden',
        fontFamily: "'Lora', serif",
        userSelect: 'none',
      }}
    >
      {/* Mandala border */}
      <MandalaFrameSVG w={W} h={H} b={BORDER_W} />

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: BORDER_W, left: BORDER_W,
          width: CW, height: HEADER_H,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 7, zIndex: 2,
        }}
      >
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: Math.min(26, CW / 25),
            color: GOLD,
            letterSpacing: '0.06em',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          {headline}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '52%' }}>
          <div style={{ flex: 1, height: 0.75, background: GOLD_BORD, opacity: 0.55 }} />
          <span style={{ color: GOLD, fontSize: 12, opacity: 0.8, lineHeight: 1 }}>◆</span>
          <div style={{ flex: 1, height: 0.75, background: GOLD_BORD, opacity: 0.55 }} />
        </div>
        <div
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: 'italic',
            fontSize: 12,
            color: WARM_BROWN,
            letterSpacing: '0.08em',
            textAlign: 'center',
            opacity: 0.85,
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* ── TREE CONTENT AREA ──────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: treeOriginY, left: BORDER_W,
          width: CW, height: CH,
          overflow: 'hidden', zIndex: 2,
        }}
      >
        {/* Generation labels — left edge, rotated */}
        {genLabels.map(gl => (
          <div
            key={gl.depth}
            style={{
              position: 'absolute',
              left: 0, top: gl.y,
              width: 22, height: 60,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transform: 'translateY(-50%)',
            }}
          >
            <div
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 7,
                color: GOLD,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                opacity: 0.7,
                whiteSpace: 'nowrap',
                transform: 'rotate(-90deg)',
              }}
            >
              {gl.label}
            </div>
          </div>
        ))}

        {/* SVG connector lines — thin gold bezier curves */}
        <svg
          style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
          width={CW} height={CH}
        >
          {links.map((link, i) => {
            const sx = link.source.x * sX + oX;
            const sy = link.source.y * sY + oY + NODE_H / 2;
            const tx = link.target.x * sX + oX;
            const ty = link.target.y * sY + oY - NODE_H / 2;
            const my = (sy + ty) / 2;
            const d = `M ${sx} ${sy} C ${sx} ${my} ${tx} ${my} ${tx} ${ty}`;
            const isMar = link.type === 'marriage';
            if (isMar) {
              return (
                <g key={i}>
                  <path d={d} stroke={MAROON} strokeWidth="0.75" fill="none"
                    opacity="0.4" strokeDasharray="4,3" />
                  <circle cx={(sx + tx) / 2} cy={my} r="2.5"
                    fill={MAROON} opacity="0.35" />
                </g>
              );
            }
            return (
              <path key={i} d={d} stroke={GOLD_BORD} strokeWidth="0.9"
                fill="none" opacity="0.65" />
            );
          })}
        </svg>

        {/* HTML person nodes */}
        {nodes.map(node => (
          <PrintNodeHTML
            key={node.data?.id || node.data?.name || Math.random()}
            node={node}
            px={node.x * sX + oX}
            py={node.y * sY + oY}
          />
        ))}
      </div>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: BORDER_W, left: BORDER_W,
          width: CW, height: FOOTER_H,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 5, zIndex: 2,
        }}
      >
        <div style={{ width: '42%', height: 0.5, background: GOLD_BORD, opacity: 0.4 }} />
        <div
          style={{
            fontFamily: "'Lora', serif",
            fontStyle: 'italic',
            fontSize: 9,
            color: WARM_BROWN,
            letterSpacing: '0.1em',
            textAlign: 'center',
            opacity: 0.75,
          }}
        >
          May this tree grow for generations to come  ·  Vansh Vriksha  ·  {year}
        </div>
      </div>
    </div>
  );
});

export default PrintCanvas;
