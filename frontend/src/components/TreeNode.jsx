import React from 'react';
import { motion } from 'framer-motion';

// Card dimensions — referenced by TreeConnector for connection points
export const NODE_W  = 164;
export const NODE_H  = 80;
export const SPOUSE_W = 124;
export const SPOUSE_H = 64;

const TreeNode = ({ node }) => {
  const { data, x, y, isSpouse } = node;
  const isMale    = data.gender !== 'female';
  const isDeceased = data.is_deceased === true;
  const initial   = (data.name || '?').trim().charAt(0).toUpperCase();

  const w = isSpouse ? SPOUSE_W : NODE_W;
  const h = isSpouse ? SPOUSE_H : NODE_H;

  // Accent colour: terracotta for male, plum-sage for female
  const accent = isMale ? '#C4622D' : '#7B6E8A';

  // Background: warm parchment; deceased gets sepia-grey
  const bg = isDeceased
    ? (isMale ? '#E8DDD0' : '#E2DCE8')
    : (isMale ? '#FDF0DC' : '#F5F0F8');

  const textColor = isDeceased ? '#6B5E55' : '#2A1F14';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isDeceased ? 0.72 : 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 140, damping: 18 }}
      className="absolute group cursor-pointer select-none"
      style={{ left: x - w / 2, top: y - h / 2, width: w, height: h }}
    >
      <div
        className="relative w-full h-full rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        style={{
          background: bg,
          border: `1.5px solid ${isDeceased ? '#C9BDB4' : accent}22`,
          outline: `1.5px solid ${accent}18`,
        }}
      >
        {/* Left accent strip */}
        <div
          className="absolute left-0 top-0 bottom-0"
          style={{ width: 5, background: accent, opacity: isDeceased ? 0.5 : 1 }}
        />

        {/* Initial badge */}
        <div
          className="absolute flex items-center justify-center rounded-full shadow-inner"
          style={{
            left: 14,
            top: h / 2 - (isSpouse ? 18 : 22),
            width: isSpouse ? 36 : 44,
            height: isSpouse ? 36 : 44,
            background: `${accent}22`,
            border: `2px solid ${accent}55`,
          }}
        >
          <span style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: isSpouse ? '1.15rem' : '1.45rem',
            color: accent,
            lineHeight: 1,
            opacity: isDeceased ? 0.7 : 1,
          }}>
            {initial}
          </span>
        </div>

        {/* Text content */}
        <div
          className="absolute flex flex-col justify-center"
          style={{
            left: isSpouse ? 58 : 68,
            right: 8,
            top: 0,
            bottom: 0,
          }}
        >
          {/* Name */}
          <div style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 700,
            fontSize: isSpouse ? '0.72rem' : '0.85rem',
            color: textColor,
            lineHeight: 1.25,
            textDecoration: isDeceased ? 'line-through' : 'none',
            textDecorationColor: '#9E9485',
          }}>
            {data.name || 'Unnamed'}
          </div>

          {/* Role / one-liner */}
          {(data.one_liner || data.role) && !isSpouse && (
            <div style={{
              fontFamily: "'Lora', serif",
              fontStyle: 'italic',
              fontSize: '0.58rem',
              color: isDeceased ? '#9E9485' : '#6B7C4F',
              lineHeight: 1.3,
              marginTop: 2,
            }}>
              {data.one_liner || data.role}
            </div>
          )}

          {/* Deceased marker */}
          {isDeceased && (
            <div style={{
              fontFamily: "'Lora', serif",
              fontSize: '0.52rem',
              color: '#9E9485',
              letterSpacing: '0.05em',
              marginTop: 1,
            }}>
              † {data.death_year || 'Deceased'}
            </div>
          )}

          {/* Location — only on primary nodes */}
          {data.location && !isSpouse && (
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.48rem',
              color: '#A09585',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: 3,
            }}>
              {data.location}
            </div>
          )}
        </div>

        {/* Hover tooltip bar */}
        <div
          className="absolute inset-x-0 bottom-0 translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50"
          style={{
            background: '#2A1F14',
            color: '#EDE0CE',
            fontSize: '0.52rem',
            fontFamily: "'Cormorant Garamond', serif",
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            textAlign: 'center',
            padding: '3px 0',
            borderRadius: '0 0 10px 10px',
          }}
        >
          View Legacy Record
        </div>
      </div>
    </motion.div>
  );
};

export default TreeNode;
