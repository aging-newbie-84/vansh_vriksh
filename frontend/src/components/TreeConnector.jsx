import React from 'react';
import { generateCurvedPath } from '../utils/treeLayout';

/**
 * TreeConnector — Odishan Dynasty redesign.
 * Parent-child: single Oriya green curve with arrowhead.
 * Marriage: double terracotta curve with centre roundel.
 */
const TreeConnector = ({ link }) => {
  const path = generateCurvedPath(
    link.source.x, link.source.y,
    link.target.x, link.target.y
  );
  const isMarriage = link.type === 'marriage';

  if (isMarriage) {
    const sx = link.source.x;
    const sy = link.source.y;
    const tx = link.target.x;
    const ty = link.target.y;
    const mx = (sx + tx) / 2;
    const my = (sy + ty) / 2;

    return (
      <g className="connector-group">
        {/* Horizontal marriage line */}
        <line
          x1={sx} y1={sy} x2={tx} y2={ty}
          stroke="#C4622D"
          strokeWidth="2"
          strokeDasharray="6,4"
          opacity="0.6"
        />
        {/* Centre marriage roundel */}
        <circle cx={mx} cy={my} r="5" fill="#C4622D" stroke="#EDE0CE" strokeWidth="2" />
        <text x={mx} y={my + 1} textAnchor="middle" dominantBaseline="middle" fontSize="6" fill="#EDE0CE">∞</text>
        {/* Hit area */}
        <line x1={sx} y1={sy} x2={tx} y2={ty} stroke="transparent" strokeWidth="12" className="cursor-pointer" />
      </g>
    );
  }

  // Parent-child: single oriya green curve with terminal arrowhead
  const tx = link.target.x;
  const ty = link.target.y;

  return (
    <g className="connector-group">
      <path
        d={path}
        stroke="#6B7C4F"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Arrowhead at child end */}
      <polygon
        points={`${tx},${ty - 2} ${tx - 5},${ty - 12} ${tx + 5},${ty - 12}`}
        fill="#6B7C4F"
      />
      {/* Hit area */}
      <path d={path} stroke="transparent" strokeWidth="12" fill="none" className="cursor-pointer" />
    </g>
  );
};

export default TreeConnector;
