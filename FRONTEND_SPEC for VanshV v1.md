# Vansh Vriksha — Frontend Specification
## For Anti Gravity / Claude Code

---

## Overview

Build a React single-page application with 3 sequential screens. The app is designed for elderly Indian users with low tech literacy. Every interaction must be large, forgiving, and warm.

---

## Tech Stack

```
React 18 (Vite)
TailwindCSS (styling)
Framer Motion (transitions between screens)
D3.js (tree layout calculation only — not rendering)
jsPDF + html2canvas (PDF export)
Web Speech API (audio capture — browser native, no library needed)
axios (API calls to n8n webhook)
```

---

## Font Imports (Google Fonts — add to index.html)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?
  family=Cinzel+Decorative:wght@400;700;900&
  family=IM+Fell+English:ital@0;1&
  family=Lato:wght@300;400;700&
  family=Noto+Sans+Devanagari:wght@400;600&
  display=swap" rel="stylesheet">
```

---

## Design Tokens (tokens.css)

```css
:root {
  /* Colors */
  --color-primary:     #8B1A1A;   /* deep maroon — primary actions */
  --color-accent:      #D4AF37;   /* temple gold — highlights, borders */
  --color-accent-pale: #F0E0A0;   /* pale gold — hover states */
  --color-bg:          #FDF3E3;   /* aged parchment — main background */
  --color-bg-dark:     #2C1810;   /* dark ink — footer, dark sections */
  --color-surface:     #FAF0DC;   /* slightly darker parchment — cards */
  --color-border:      #C9A84C;   /* gold border */
  --color-text:        #2C1810;   /* dark ink — primary text */
  --color-text-muted:  #7A5C3A;   /* warm brown — secondary text */
  --color-success:     #3D6B45;   /* forest green — confirmation */
  --color-error:       #8B1A1A;   /* reuse primary — error (no jarring red) */

  /* Fonts */
  --font-heading:  'Cinzel Decorative', serif;   /* screen titles, app name */
  --font-name:     'IM Fell English', serif;     /* person names in tree */
  --font-body:     'Lato', sans-serif;           /* all UI text */
  --font-devanag:  'Noto Sans Devanagari', sans-serif; /* Hindi text if any */

  /* Spacing */
  --radius-sm:  6px;
  --radius-md:  12px;
  --radius-lg:  20px;

  /* Shadows */
  --shadow-card: 0 4px 24px rgba(44, 24, 16, 0.12);
  --shadow-glow: 0 0 20px rgba(212, 175, 55, 0.3);
}
```

---

## App Shell (App.jsx)

```jsx
// Three screens, navigated via state — no router needed
// Screens: 'input' | 'preview' | 'tree'
// Global state: { screen, transcript, parsedData, confirmedData }

const [screen, setScreen] = useState('input');
const [parsedData, setParsedData] = useState(null);
const [confirmedData, setConfirmedData] = useState(null);

// Auto-save to localStorage every 30s
useEffect(() => {
  const interval = setInterval(() => {
    localStorage.setItem('vv_draft', JSON.stringify({ parsedData, confirmedData }));
  }, 30000);
  return () => clearInterval(interval);
}, [parsedData, confirmedData]);
```

---

## Screen 1 — InputScreen.jsx

### Layout
- Full viewport height
- Parchment background texture (CSS background-image)
- Centered content, max-width 720px, padded

### Elements (top to bottom)

**1. App Title**
- Font: Cinzel Decorative, 32px on desktop / 24px mobile
- Color: var(--color-primary)
- Text: "वंश वृक्ष"
- Subtitle: "Vansh Vriksha" in IM Fell English, 18px, color: var(--color-accent)
- Tagline: "Map your family. Honour your roots." in Lato 14px, muted

**2. Audio Capture Button**
- Circular button, 120px diameter
- Background: var(--color-primary)
- Icon: microphone SVG (white, 48px)
- Active/recording state: pulsing gold ring animation (CSS keyframe)
- Below button: recording duration counter "0:00" in Lato mono
- State labels: "Tap to Speak" / "Recording... tap to stop" / "Processing..."
- Minimum tap target enforced (button is already 120px)

**3. Divider**
- Text: "— or type below —" in Lato 12px, centered, muted color

**4. Text Area**
- Placeholder: "Type your family story here... For example: My grandfather Ramesh was from Cuttack. He had three sons..."
- Min-height: 200px
- Font: Lato 16px (never smaller — elderly users)
- Border: 2px solid var(--color-border)
- Border-radius: var(--radius-md)
- Background: var(--color-surface)
- Resize: vertical only

**5. Nudge Prompts Panel**
- Collapsible section: "💡 Not sure where to start? Try these..."
- 4-6 soft prompt suggestions rendered as gold-bordered pill buttons
- Clicking a pill appends that suggestion text to the textarea
- Examples:
  - "Tell us about your grandparents"
  - "Who are the eldest members you remember?"
  - "Any family members in the army or government?"
  - "Who moved cities for work or marriage?"

**6. Submit Button**
- Full width, height 56px
- Background: var(--color-primary)
- Text: "Build My Family Tree →" in Lato 700, 18px, white
- Loading state: spinner + "Understanding your family story..."
- Border-radius: var(--radius-md)

### Audio Implementation
```javascript
// Web Speech API — no library needed
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-IN'; // Indian English accent model

recognition.onresult = (event) => {
  const transcript = Array.from(event.results)
    .map(r => r[0].transcript)
    .join(' ');
  setTranscript(transcript);
};
```

---

## Screen 2 — PreviewScreen.jsx

### Purpose
Wire-frame review. NO decoration. Clean, fast, editable.

### Layout
- White/very light background (#FAFAF8)
- Full-width table/card layout
- Sticky header with: "Review Your Family Map" + "Looks right → Build Tree" CTA button

### Person Card Component (PersonCard.jsx)

Each parsed person renders as a horizontal card:

```
┌─────────────────────────────────────────────────────────────┐
│  [M/F]  Name: [editable]          Relation: [editable]      │
│         One-liner: [editable]     Location: [editable]      │
│         Marriages: [list]         Children: [list]          │
│                                              [✓ Confirm] [✗ Remove] │
└─────────────────────────────────────────────────────────────┘
```

- All fields are inline-editable (click to edit, blur to save)
- Gender toggle: M / F buttons (large, 40px tap target each)
- Confirm button turns card border green
- Remove button shows confirmation dialog before removing

### Ambiguities Panel
- Yellow/amber banner at top if `ambiguities.length > 0`
- Lists each ambiguity with a "Resolve" button
- Resolve opens a simple modal: "Are Munna and Mohan the same person? [Yes, merge] [No, keep separate]"

### Nudge Questions Section
- Below all person cards
- Each `nudge_question` from the AI renders as a card with [Answer] button
- Clicking [Answer] opens the text input again, pre-seeded with that question

### Re-parse Button
- "Add more family members" — reopens input screen, passes current parse as context

### Confirm CTA
- Large gold button: "This looks right — Build My Tree 🌳"
- Passes `confirmedData` to Screen 3

---

## Screen 3 — TreeScreen.jsx

### Layout
- Full-screen, horizontally scrollable on mobile
- Parchment texture background
- Ornate SVG border (tiling mandala/paisley pattern along all 4 edges)
- Zoom controls: + / - / Reset (fixed bottom-right)
- "Export PDF" button (fixed top-right)

### Tree Rendering

Use D3's `d3.hierarchy()` and `d3.tree()` for layout calculation only.
Render the result as React JSX, not D3 DOM manipulation.

```javascript
import * as d3 from 'd3';

const treeLayout = d3.tree().nodeSize([160, 220]);
const root = d3.hierarchy(dataAsNestedObject);
treeLayout(root);
// root.descendants() gives x,y coordinates for each node
// root.links() gives connector paths
```

### TreeNode Component (TreeNode.jsx)

```
┌──────────────┐
│  [silhouette] │   ← SVG placeholder (male/female variant)
│               │
│  Ramesh       │   ← IM Fell English, 16px, --color-primary
│  Chandra      │
│  ─────────── │   ← thin gold divider
│  Cuttack      │   ← Lato 10px, --color-text-muted
│  Govt. Clerk  │
└──────────────┘
```

- Card size: 130px wide × 170px tall
- Background: var(--color-surface)
- Border: 1px solid var(--color-border)
- Box-shadow: var(--shadow-card)
- On hover: gold glow (var(--shadow-glow))
- Placeholder image box: 60px × 60px, dashed gold border, centered in card
- Caption below image box: "[ Paste photo ]" in 9px muted italic

### Connector Lines
- Color: var(--color-accent) — gold
- Stroke-width: 1.5px
- Marriage connector: horizontal line between spouses with small ring icon at midpoint
- Parent-child connector: curved vertical line (d3 linkVertical)

### Silhouette SVGs
Create two inline SVG components:
- `MaleSilhouette` — stylised seated/standing figure in dhoti aesthetic
- `FemaleSilhouette` — stylised figure with saree drape aesthetic
- Both: fill var(--color-text-muted), opacity 0.6
- Size: fits within 60×60px box

### Generation Labels
- Each horizontal generation row has a label on the left: "1st Generation", "2nd Generation", etc.
- Font: Cinzel Decorative 10px, gold, rotated 90° on left edge

---

## PDF Export (pdfExport.js)

```javascript
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function exportTreeAsPDF(treeContainerRef, options = {}) {
  const { format = 'a3', orientation = 'landscape' } = options;
  
  const canvas = await html2canvas(treeContainerRef.current, {
    scale: 2,           // High DPI for print quality
    backgroundColor: '#FDF3E3',
    useCORS: true,
    logging: false,
  });

  const pdf = new jsPDF({ orientation, unit: 'mm', format });
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  
  const imgRatio = canvas.width / canvas.height;
  const pdfImgHeight = pdfWidth / imgRatio;
  
  // If tree is taller than one page, add multiple pages
  let heightLeft = pdfImgHeight;
  let position = 0;
  
  pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, pdfWidth, pdfImgHeight);
  heightLeft -= pdfHeight;
  
  while (heightLeft > 0) {
    position -= pdfHeight;
    pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, position, pdfWidth, pdfImgHeight);
    heightLeft -= pdfHeight;
  }

  pdf.save(`vansh-vriksha-${Date.now()}.pdf`);
}
```

---

## Accessibility Rules (Non-negotiable)

```
- Minimum font size: 16px body, 20px+ for labels, 24px+ for headings
- All interactive elements: minimum 48×48px tap target
- No hover-only interactions (everything must work on touch)
- Error messages in plain English, no codes, no jargon
- All form inputs: visible labels (no placeholder-only)
- Color contrast: minimum 4.5:1 for all text
- Auto-save to localStorage every 30 seconds (no data loss)
- Loading states on ALL async operations
- Graceful fallback if Web Speech API not supported: show text input only + message "For voice input, use Chrome or Edge browser"
```

---

## Component File List

```
src/
├── screens/
│   ├── InputScreen.jsx
│   ├── PreviewScreen.jsx
│   └── TreeScreen.jsx
├── components/
│   ├── PersonCard.jsx        (preview screen editable card)
│   ├── TreeNode.jsx          (artistic tree node)
│   ├── TreeConnector.jsx     (SVG connector lines)
│   ├── AudioCapture.jsx      (mic button + Web Speech API)
│   ├── NudgePanel.jsx        (prompt suggestions)
│   ├── AmbiguityBanner.jsx   (ambiguity resolution UI)
│   ├── MaleSilhouette.jsx    (SVG component)
│   ├── FemaleSilhouette.jsx  (SVG component)
│   └── MandalaBorder.jsx     (tiling decorative border SVG)
├── utils/
│   ├── pdfExport.js
│   ├── treeLayout.js         (D3 layout wrapper)
│   └── apiClient.js          (n8n webhook calls)
├── styles/
│   ├── tokens.css
│   └── animations.css        (pulse, shimmer, transition effects)
└── App.jsx
```

---

## API Client (apiClient.js)

```javascript
const N8N_WEBHOOK = import.meta.env.VITE_N8N_WEBHOOK_URL;

export async function parseFamily({ transcript, previousParse = null, sessionId }) {
  const response = await fetch(N8N_WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      transcript,
      previous_parse: previousParse,
      session_id: sessionId || crypto.randomUUID(),
    }),
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}
```
