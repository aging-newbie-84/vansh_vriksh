import React from 'react';

/**
 * Classifies an array of persons into a dominant profession category
 * based on keyword matching across all professions.
 */
function classifyProfession(persons) {
  if (!persons || persons.length === 0) return 'default';

  const allProfessions = persons
    .map(p => (p.profession || p.one_liner || '').toLowerCase())
    .join(' ');

  const categories = {
    jewellery:   ['jewel', 'jeweller', 'goldsmith', 'silversmith', 'gem', 'diamond', 'ornament', 'zari', 'kundan'],
    education:   ['teacher', 'professor', 'educator', 'academic', 'scholar', 'principal', 'lecturer', 'headmaster', 'tutor', 'school'],
    agriculture: ['farmer', 'agriculture', 'farm', 'crop', 'harvest', 'land', 'kisan', 'zamindars', 'zamindar'],
    commerce:    ['business', 'merchant', 'trader', 'shop', 'commerce', 'trade', 'entrepreneur', 'vyapari', 'seth'],
    government:  ['clerk', 'officer', 'government', 'govt', 'ias', 'ips', 'civil', 'minister', 'collector', 'babu', 'sarkari'],
    medicine:    ['doctor', 'physician', 'surgeon', 'medical', 'nurse', 'health', 'vaidya', 'ayurveda'],
    engineering: ['engineer', 'architect', 'builder', 'construction', 'software', 'developer', 'tech'],
    military:    ['army', 'military', 'soldier', 'defence', 'navy', 'force', 'police', 'sainik'],
    arts:        ['artist', 'painter', 'musician', 'singer', 'dancer', 'sculptor', 'craft', 'weaver'],
    religion:    ['pandit', 'priest', 'pujari', 'temple', 'brahmin', 'dharma', 'monk', 'swami'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(kw => allProfessions.includes(kw))) {
      return category;
    }
  }
  return 'default';
}

/**
 * Returns 4 quadrant symbol configs based on profession category.
 * Each symbol: { icon, color, label }
 */
function getShieldSymbols(category) {
  const tc = '#C4622D';
  const og = '#6B7C4F';

  const symbolMap = {
    jewellery:   [
      { icon: '💎', label: 'Gem' },
      { icon: '⚜', label: 'Crest' },
      { icon: '🔱', label: 'Trident' },
      { icon: '✦', label: 'Star' },
    ],
    education:   [
      { icon: '🪔', label: 'Lamp' },
      { icon: '✒', label: 'Quill' },
      { icon: '📜', label: 'Scroll' },
      { icon: '✦', label: 'Star' },
    ],
    agriculture: [
      { icon: '🌾', label: 'Sheaf' },
      { icon: '☀', label: 'Sun' },
      { icon: '🌿', label: 'Leaf' },
      { icon: '✦', label: 'Star' },
    ],
    commerce:    [
      { icon: '⚖', label: 'Scales' },
      { icon: '🪙', label: 'Coin' },
      { icon: '🤝', label: 'Bond' },
      { icon: '✦', label: 'Star' },
    ],
    government:  [
      { icon: '🦅', label: 'Eagle' },
      { icon: '⚔', label: 'Sword' },
      { icon: '🏛', label: 'Pillar' },
      { icon: '✦', label: 'Star' },
    ],
    medicine:    [
      { icon: '🌺', label: 'Lotus' },
      { icon: '☤', label: 'Caduceus' },
      { icon: '🌿', label: 'Herb' },
      { icon: '✦', label: 'Star' },
    ],
    engineering: [
      { icon: '⚙', label: 'Gear' },
      { icon: '🔩', label: 'Bolt' },
      { icon: '📐', label: 'Square' },
      { icon: '✦', label: 'Star' },
    ],
    military:    [
      { icon: '⚔', label: 'Sword' },
      { icon: '🦅', label: 'Eagle' },
      { icon: '🛡', label: 'Shield' },
      { icon: '✦', label: 'Star' },
    ],
    arts:        [
      { icon: '🎨', label: 'Palette' },
      { icon: '🪷', label: 'Lotus' },
      { icon: '🎶', label: 'Note' },
      { icon: '✦', label: 'Star' },
    ],
    religion:    [
      { icon: '🕉', label: 'Om' },
      { icon: '🪔', label: 'Diya' },
      { icon: '🌸', label: 'Flower' },
      { icon: '✦', label: 'Star' },
    ],
    default:     [
      { icon: '🌳', label: 'Tree' },
      { icon: '🌿', label: 'Leaf' },
      { icon: '🔱', label: 'Trident' },
      { icon: '✦', label: 'Star' },
    ],
  };

  return symbolMap[category] || symbolMap.default;
}

/**
 * CoatOfArms — SVG heraldic shield, dynamically styled based on family profession.
 * Props:
 *   persons   — array of family members
 *   familyName — string shown in motto ribbon
 *   size       — width in px (default 120)
 */
const CoatOfArms = ({ persons = [], familyName = 'Family', size = 120 }) => {
  const category  = classifyProfession(persons);
  const symbols   = getShieldSymbols(category);
  const tc        = '#C4622D';
  const og        = '#6B7C4F';
  const stoneBg   = '#EDE0CE';
  const stoneCrm  = '#D4C5B0';
  const stoneGrey = '#9E9485';

  // Short family name for ribbon
  const shortName = familyName.replace(/family|parivar/gi, '').trim().toUpperCase();
  const motto     = `${shortName} · ${category.toUpperCase()}`;

  return (
    <svg
      viewBox="0 0 130 155"
      width={size}
      height={size * (155 / 130)}
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(2px 4px 8px rgba(0,0,0,0.22))' }}
      aria-label={`${familyName} Coat of Arms`}
    >
      {/* ── Shield background ── */}
      <path
        d="M8,8 L122,8 L122,95 Q122,138 65,148 Q8,138 8,95 Z"
        fill={stoneBg}
        stroke={tc}
        strokeWidth="3"
      />

      {/* ── Stone texture inner border ── */}
      <path
        d="M8,8 L122,8 L122,95 Q122,138 65,148 Q8,138 8,95 Z"
        fill="none"
        stroke={stoneCrm}
        strokeWidth="1"
        strokeDasharray="4,4"
      />

      {/* ── Inner shield line ── */}
      <path
        d="M16,16 L114,16 L114,93 Q114,130 65,140 Q16,130 16,93 Z"
        fill="none"
        stroke={og}
        strokeWidth="1.5"
      />

      {/* ── Quadrant dividers ── */}
      <line x1="65" y1="16" x2="65" y2="128" stroke={tc} strokeWidth="1.5" />
      <line x1="16" y1="65" x2="114" y2="65" stroke={tc} strokeWidth="1.5" />

      {/* ── Quadrant symbols ── */}
      {/* Q1 top-left */}
      <text x="40" y="56" textAnchor="middle" fontSize="22" fill={tc}>{symbols[0].icon}</text>
      {/* Q2 top-right */}
      <text x="90" y="56" textAnchor="middle" fontSize="20" fill={og}>{symbols[1].icon}</text>
      {/* Q3 bottom-left */}
      <text x="40" y="102" textAnchor="middle" fontSize="20" fill={og}>{symbols[2].icon}</text>
      {/* Q4 bottom-right */}
      <text x="90" y="102" textAnchor="middle" fontSize="18" fill={tc}>{symbols[3].icon}</text>

      {/* ── Centre roundel ── */}
      <circle cx="65" cy="65" r="11" fill={tc} stroke={stoneBg} strokeWidth="2" />
      <text x="65" y="69" textAnchor="middle" fontSize="10" fill={stoneBg} fontFamily="serif">✦</text>

      {/* ── Crest top ornament ── */}
      <path d="M42,8 Q65,-6 88,8" fill="none" stroke={tc} strokeWidth="2.5" />
      <circle cx="65" cy="3" r="4.5" fill={tc} />
      <circle cx="65" cy="3" r="2" fill={stoneBg} />

      {/* ── Flanking support lines ── */}
      <line x1="2" y1="22" x2="8" y2="22" stroke={stoneGrey} strokeWidth="1.5" />
      <line x1="122" y1="22" x2="128" y2="22" stroke={stoneGrey} strokeWidth="1.5" />
      <line x1="2" y1="95" x2="8" y2="95" stroke={stoneGrey} strokeWidth="1.5" />
      <line x1="122" y1="95" x2="128" y2="95" stroke={stoneGrey} strokeWidth="1.5" />

      {/* ── Motto ribbon ── */}
      <path d="M12,142 Q65,152 118,142" fill="none" stroke={tc} strokeWidth="1.5" />
      <text
        x="65" y="150"
        textAnchor="middle"
        fontSize="5.5"
        fill={og}
        fontFamily="'Cinzel', serif"
        letterSpacing="1.2"
      >
        {motto.length > 22 ? motto.slice(0, 22) : motto}
      </text>
    </svg>
  );
};

export default CoatOfArms;
