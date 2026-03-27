import React from 'react';
import { NODE_H, NODE_W, SPOUSE_H, SPOUSE_W } from './TreeNode';

const HALF_H      = NODE_H / 2;   // 29px
const HALF_SPOUSE = SPOUSE_H / 2; // 23px

const TreeConnector = ({ link }) => {
  const isMarriage = link.type === 'marriage';

  if (isMarriage) {
    const sx = link.source.x + NODE_W / 2;    // right edge of primary card
    const tx = link.target.x - SPOUSE_W / 2;  // left edge of spouse card
    const y  = link.source.y;         // same generation row

    if (tx <= sx) return null;         // safety guard — don't draw backwards
    const mx = (sx + tx) / 2;

    return (
      <g>
        <line
          x1={sx} y1={y} x2={tx} y2={y}
          stroke="#C4622D"
          strokeWidth="2"
          strokeDasharray="5,3"
          opacity="0.7"
        />
        <circle cx={mx} cy={y} r="6" fill="#C4622D" />
        <text
          x={mx} y={y}
          textAnchor="middle" dominantBaseline="middle"
          fontSize="7" fill="#FDF0DC" fontFamily="'Cormorant Garamond', serif"
        >
          ∞
        </text>
      </g>
    );
  }

  // ── Parent → child orthogonal elbow ───────────────────────────────────────
  const sx   = link.source.x;
  const sy   = link.source.y + HALF_H;   // bottom-center of parent card
  const tx   = link.target.x;
  const ty   = link.target.y - HALF_H;   // top-center of child card

  // Mid-Y: halfway between parent bottom and child top
  const midY = sy + (ty - sy) * 0.5;

  // Orthogonal path: down → across → down
  const d = `M ${sx},${sy} L ${sx},${midY} L ${tx},${midY} L ${tx},${ty}`;

  return (
    <g>
      <path
        d={d}
        stroke="#5A7A4E"
        strokeWidth="1.5"
        fill="none"
        strokeLinejoin="round"
        opacity="0.75"
      />
      {/* Small arrowhead at child entry */}
      <polygon
        points={`${tx},${ty} ${tx - 4},${ty - 9} ${tx + 4},${ty - 9}`}
        fill="#5A7A4E"
        opacity="0.75"
      />
    </g>
  );
};

export default TreeConnector;
