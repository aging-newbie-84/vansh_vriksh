import React from 'react';
import { motion } from 'framer-motion';

/**
 * TreeNode — Odishan Dynasty redesign.
 * Circular medallion with 3 concentric rings (terracotta / stone-cream / oriya-green).
 * Info card below: Name (Cinzel bold), years (terracotta/green), fine-print profession + location.
 */
const TreeNode = ({ node }) => {
  const { data, x, y } = node;
  const isMale = data.gender !== 'female';

  const outerRing  = isMale ? '#C4622D' : '#6B7C4F';
  const innerRing  = isMale ? '#6B7C4F' : '#C4622D';
  const dotColor   = outerRing;
  const initial    = (data.name || 'U').trim().charAt(0).toUpperCase();
  const initColor  = isMale ? '#C4622D' : '#6B7C4F';
  const yearColor  = isMale ? '#C4622D' : '#6B7C4F';
  const borderTop  = isMale ? '#C4622D' : '#6B7C4F';

  // Format years
  const birthYear = data.birth_year || data.birthYear || '';
  const deathYear = data.death_year || data.deathYear || '';
  const years = birthYear
    ? `${birthYear} – ${deathYear || 'present'}`
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      className="absolute flex flex-col items-center group cursor-pointer"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        width: 150,
      }}
    >
      {/* ── Medallion ring ── */}
      <div className="relative" style={{ width: 110, height: 110 }}>
        <svg
          viewBox="0 0 110 110"
          width="110"
          height="110"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer ring — gender colour */}
          <circle cx="55" cy="55" r="52" fill="none" stroke={outerRing} strokeWidth="3" />
          {/* Middle ring — stone cream dashed */}
          <circle cx="55" cy="55" r="45" fill="none" stroke="#D4C5B0" strokeWidth="1" strokeDasharray="4,5" />
          {/* Inner ring — opposite colour */}
          <circle cx="55" cy="55" r="39" fill="none" stroke={innerRing} strokeWidth="1.5" />
          {/* Cardinal dots */}
          <circle cx="55" cy="3"   r="3.5" fill={dotColor} />
          <circle cx="55" cy="107" r="3.5" fill={dotColor} />
          <circle cx="3"  cy="55"  r="3.5" fill={dotColor} />
          <circle cx="107" cy="55" r="3.5" fill={dotColor} />
          {/* Hover glow ring */}
          <circle
            cx="55" cy="55" r="52"
            fill="none"
            stroke={outerRing}
            strokeWidth="5"
            opacity="0"
            className="group-hover:opacity-20 transition-opacity duration-300"
          />
        </svg>

        {/* Centre fill */}
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{
            inset: 16,
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #F5ECD8, #E8D5B0)',
            boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.12)',
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.7rem',
              color: initColor,
              lineHeight: 1,
            }}
          >
            {initial}
          </span>
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.42rem',
              letterSpacing: '0.3em',
              color: '#9E9485',
              textTransform: 'uppercase',
              marginTop: 2,
            }}
          >
            {isMale ? 'Male' : 'Female'}
          </span>
        </div>
      </div>

      {/* ── Info card ── */}
      <div
        className="mt-2 text-center w-full transition-all duration-300 group-hover:shadow-lg"
        style={{
          background: 'rgba(255,255,255,0.6)',
          border: '1px solid #D4C5B0',
          borderTop: `2.5px solid ${borderTop}`,
          borderRadius: 4,
          padding: '7px 10px 8px',
          backdropFilter: 'blur(4px)',
        }}
      >
        {/* Name — prominent */}
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontWeight: 600,
            fontSize: '0.85rem',
            color: '#2A1F14',
            letterSpacing: '0.07em',
            lineHeight: 1.3,
            textTransform: 'none',
          }}
        >
          {data.name || 'UNNAMED'}
        </div>

        {/* Years */}
        {years && (
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.58rem',
              color: yearColor,
              marginTop: 3,
              letterSpacing: '0.05em',
            }}
          >
            {years}
          </div>
        )}

        {/* Fine-print divider */}
        {(data.profession || data.one_liner || data.location) && (
          <div
            style={{
              borderTop: '1px dashed #D4C5B0',
              marginTop: 5,
              paddingTop: 4,
            }}
          >
            {(data.profession || data.one_liner) && (
              <div
                style={{
                  fontFamily: "'Lora', serif",
                  fontStyle: 'italic',
                  fontSize: '0.58rem',
                  color: '#7A8C5A',
                  lineHeight: 1.3,
                }}
              >
                {data.profession || data.one_liner}
              </div>
            )}
            {data.location && (
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '0.5rem',
                  color: '#9E9485',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginTop: 2,
                }}
              >
                {data.location}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hover tooltip */}
      <div
        className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
        style={{
          background: '#2A1F14',
          color: '#EDE0CE',
          padding: '4px 10px',
          borderRadius: 3,
          fontSize: '0.6rem',
          fontFamily: "'Cormorant Garamond', serif",
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          border: '1px solid #C4622D',
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}
      >
        View Legacy Record
      </div>
    </motion.div>
  );
};

export default TreeNode;
