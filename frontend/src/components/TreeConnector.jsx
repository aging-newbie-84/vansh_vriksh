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
    // Double terracotta line for marriage
    return (
      <g className="connector-group">
        <path
          d={path}
          stroke="#C4622D"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={path}
          stroke="#C4622D"
          strokeWidth="0.8"
          fill="none"
          strokeLinecap="round"
          opacity="0.45"
          strokeDasharray="0"
        />
        {/* Centre marriage roundel — midpoint approximation */}
        <circle
          cx={(link.source.x + link.target.x) / 2}
          cy={(link.source.y + link.target.y) / 2 - 10}
          r="4"
          fill="#C4622D"
          stroke="#EDE0CE"
          strokeWidth="1.5"
        />
        {/* Hit area */}
        <path d={path} stroke="transparent" strokeWidth="12" fill="none" className="cursor-pointer" />
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
