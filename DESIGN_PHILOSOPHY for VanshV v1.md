# Vansh Vriksha — Design Philosophy, Brand & UI Guidelines
## The Complete Design System

---

## I. DESIGN PHILOSOPHY

### The Central Paradox

Vansh Vriksha must speak two entirely different design languages simultaneously — and make them feel like one.

**To the elder user:** It must feel *familiar, warm, forgiving* — like speaking to a trusted family member. Nothing clinical. Nothing intimidating. No error codes. No "invalid input." No small buttons. No hover states. It must feel as natural as sitting on a veranda and telling stories.

**To the output:** It must feel *magnificent, timeless, worthy of framing* — like a document that will outlive its creators. A piece of visual heritage that a family 200 years from now would handle with reverence.

This paradox is the design DNA of everything that follows.

---

### Three Philosophical Pillars

**1. Vedic Magnificence**
The aesthetic draws from the visual language of ancient India — the geometry of temple architecture, the gold leaf of manuscript illumination, the measured dignity of royal proclamations. This is not kitsch or decorative. It is *earned grandeur* — the visual language of something that matters.

Reference touchpoints: Oriya Pattachitra painting, Mughal miniature manuscripts, Tamil Brahadeeswarar temple proportions, Rajasthani royal family trees (*vanshavali*), British India colonial typography meeting indigenous ornamentation.

**2. Ancestral Intimacy**
Every design decision should feel like it was made by someone who loved the people whose names appear in these pages. The silhouettes are not icons — they are *stand-ins for real people*. The one-liner bio is not a data field — it is a *small memorial*. The connecting lines are not UX elements — they are *bonds between human beings*.

Design should carry the weight of this.

**3. Radical Accessibility**
The user may be 75 years old, with failing eyesight, arthritic fingers, and zero experience with smartphones. Every interaction must be achievable by this person. Large. Forgiving. Clear. Patient. The app should never make someone feel stupid. It should make them feel *honoured* for the knowledge they carry.

---

## II. BRAND IDENTITY

### Brand Name
**Vansh Vriksha** (वंश वृक्ष)
- *Vansh* = lineage, dynasty, generation
- *Vriksha* = tree
- Together: The Tree of Your People

### Brand Voice & Tonality

| Context | Tone | Example |
|---------|------|---------|
| UI microcopy | Warm elder, never condescending | "Tell us your story — we're listening" |
| Error messages | Patient, reassuring | "We didn't quite catch that. Take your time." |
| Success moments | Celebratory, dignified | "Your family tree has been created." |
| Nudge questions | Gentle, curious | "Did any children pass away young? It's important to include them." |
| Loading states | Calm, meaningful | "Understanding your family story..." |
| PDF footer | Poetic, lasting | "May this tree grow for generations to come." |

### What The Brand Is NOT
- Not cute or playful (no rounded cartoon icons, no emoji in headings)
- Not corporate or clinical (no blue/white SaaS palette, no data dashboards)
- Not nostalgic kitsch (no sepia filters, no fake aging effects overdone)
- Not intimidating (no complex menus, no feature overload)

### Brand Personality in One Sentence
*A wise, warm, dignified elder who helps you remember what matters.*

---

## III. COLOR SYSTEM

### Primary Palette

```
Deep Maroon       #8B1A1A   — Primary actions, headings, CTAs
Temple Gold       #D4AF37   — Accents, borders, highlights, connectors
Aged Parchment    #FDF3E3   — Primary background
Dark Ink          #2C1810   — Primary text, dark surfaces
```

### Extended Palette

```
Pale Gold         #F0E0A0   — Hover states, selected states
Warm Brown        #7A5C3A   — Secondary text, muted labels
Surface Warm      #FAF0DC   — Card backgrounds (slightly darker than parchment)
Gold Border       #C9A84C   — Borders, dividers
Forest Green      #3D6B45   — Success, confirmation states
Amber             #D4860A   — Warnings, ambiguity flags
Ivory             #FFFFF0   — Alternative light surface
```

### Color Semantics

```
NEVER use:
- Pure black (#000000) — use Dark Ink (#2C1810)
- Pure white (#FFFFFF) — use Aged Parchment (#FDF3E3) or Ivory (#FFFFF0)
- Generic blue for links — use Temple Gold underline
- Red for errors — use Deep Maroon (keeps palette harmonious)
- Bright saturated colors — everything should feel like it's been touched by age
```

### Dark / TV Mode

```
Background:       #1C0F09   — deeper than dark ink
Surface:          #2C1810   — dark ink becomes surface
Text:             #F0E0A0   — pale gold becomes primary text
Accent:           #D4AF37   — gold unchanged
Border:           rgba(212,175,55,0.3)   — subtle gold
```

---

## IV. TYPOGRAPHY SYSTEM

### Type Scale

```
Display (App name, PDF title):    Cinzel Decorative, 40–56px, weight 700
Heading 1 (Screen titles):        Cinzel Decorative, 28–36px, weight 400
Heading 2 (Section headers):      IM Fell English, 22–26px, regular
Person Name (in tree):            IM Fell English, 16–20px, regular
Body (UI text, labels):           Lato, 16–18px, weight 400
Body Strong (important labels):   Lato, 16–18px, weight 700
Caption (one-liners, fine print): Lato, 11–13px, weight 300, letter-spacing 0.05em
Micro (footnotes, PDF footer):    IM Fell English Italic, 9–11px
Hindi/Odia text:                  Noto Sans Devanagari, 16px
```

### Font Pairing Logic

- **Cinzel Decorative** is used sparingly — only for titles and app-level headings. It commands attention and should never appear in body copy.
- **IM Fell English** is the soul of the product — it carries the human, handwritten quality. It should appear wherever people's names appear, in quotes, in anything that feels like memory.
- **Lato** is the workhorse — clean, modern, accessible. All instructions, labels, buttons, and body content use Lato.
- These three fonts should never appear in a single sentence together. Layer them across hierarchy, not within it.

### Type Don'ts
- Never set person names in Lato — use IM Fell English always
- Never use Cinzel Decorative for body copy — illegible at small sizes
- Never use font sizes below 11px in the interface (only fine print PDF footer exception)
- Never use font weights below 300 (too light for elderly users)
- Never use all-caps except for generation labels (rotated, small, gold)

---

## V. SPACING & LAYOUT

### Spacing Scale (base 8px)

```
xs:   4px   — icon padding, tiny gaps
sm:   8px   — inline spacing
md:  16px   — component internal padding
lg:  24px   — section gaps
xl:  40px   — between major sections
2xl: 64px   — between screens/hero areas
```

### Layout Principles

**Input Screen:** Single column, centered, max 720px. Breathing room is generous — this is not a form, it is an invitation.

**Preview Screen:** Full-width list. Cards span the width. Information density is moderate — every card is the same height for visual rhythm.

**Tree Screen:** Unconstrained canvas. The tree breathes. Minimum padding between nodes: 40px horizontal, 60px vertical. Do not compress the tree to fit — let it grow and let the user scroll/zoom.

### Grid
- Mobile: 4-column grid, 16px margins
- Desktop: 12-column grid, 40px margins
- Tree canvas: no grid — free layout via D3 coordinates

---

## VI. COMPONENT DESIGN GUIDELINES

### Buttons

```
Primary CTA:
  Background: #8B1A1A (maroon)
  Text: white, Lato 700, 18px
  Padding: 16px 32px
  Border-radius: 8px
  Min-height: 56px
  Hover: darken 10%, subtle gold shadow
  Active: scale(0.97)

Secondary/Outline:
  Border: 2px solid #D4AF37 (gold)
  Text: #8B1A1A (maroon), Lato 600
  Background: transparent
  Hover: Background #FDF3E3, keep border

Destructive (remove/delete):
  Same as outline but text color #8B1A1A
  Hover: light maroon tint background
  NEVER red — keeps palette harmonious
```

### Cards (Person Cards — Preview Screen)

```
Background: #FFFFFF
Border: 1px solid #E8D5A0 (light gold)
Border-radius: 12px
Padding: 16px 20px
Box-shadow: 0 2px 8px rgba(44,24,16,0.08)
Hover: border-color #D4AF37, shadow increases
Confirmed state: border-color #3D6B45 (green), left accent strip green
Unresolved state: border-color #D4860A (amber), left accent strip amber
```

### Tree Nodes

```
Card: 130px × 170px
Background: #FAF0DC (warm surface)
Border: 1px solid #C9A84C
Border-radius: 8px
Box-shadow: 0 4px 24px rgba(44,24,16,0.12)
Hover: 0 0 20px rgba(212,175,55,0.3) — gold glow

Image placeholder: 60×60px, centered, 
  border: 2px dashed #C9A84C
  background: rgba(212,175,55,0.1)
  border-radius: 4px

Name: IM Fell English, 15px, #8B1A1A, centered
One-liner: Lato 300, 9px, #7A5C3A, letter-spacing 0.06em, centered
Divider: 1px solid #C9A84C, 60% width, centered
```

### Decorative Elements

**Mandala Border (PDF/Tree Output):**
- SVG tiling pattern, repeating along all 4 edges
- Motif: 8-petalled lotus medallion at corners, continuous paisley chain on sides
- Color: #D4AF37 on #FDF3E3 background
- Border thickness: 40px on all sides for A3, 24px for mobile screen

**Dividers:**
- Between sections: thin rule `1px solid #C9A84C` with center diamond `◆` or lotus `❁` ornament
- Avoid plain horizontal rules — always ornament them slightly

**Generation Labels:**
- Rotated 90° on left edge of tree canvas
- Font: Cinzel Decorative, 10px, #D4AF37, letter-spacing 0.15em
- Text: "FIRST GENERATION", "SECOND GENERATION", etc.

---

## VII. MOTION & ANIMATION

### Principles
- Motion is dignified, never playful
- Transitions feel like turning the page of an old book — deliberate, weighted
- No bouncy easing, no spring physics — use `ease-in-out` or `cubic-bezier(0.4, 0, 0.2, 1)`

### Key Animations

```css
/* Screen transitions */
.screen-enter {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 400ms ease, transform 400ms ease;
}

/* Microphone recording pulse */
@keyframes mic-pulse {
  0%   { box-shadow: 0 0 0 0 rgba(212,175,55,0.6); }
  70%  { box-shadow: 0 0 0 20px rgba(212,175,55,0); }
  100% { box-shadow: 0 0 0 0 rgba(212,175,55,0); }
}

/* Tree node appearance */
@keyframes node-reveal {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
/* Stagger delay: each node delays by 80ms × its index */

/* Gold shimmer on connector lines */
@keyframes line-draw {
  from { stroke-dashoffset: 1000; }
  to   { stroke-dashoffset: 0; }
}
```

### Loading States
- AI processing: animated lotus/mandala spinner in gold, not a generic spinner
- "Understanding your family story..." — text fades in/out with soft opacity pulse

---

## VIII. ICONOGRAPHY

Use only outlined, hand-drawn-feeling icons. Avoid filled corporate icon sets.
Recommended library: Phosphor Icons (thin weight) or custom SVG.

```
Microphone    → recording input
Tree          → family tree / home
Person        → individual family member
Edit/Pen      → inline editing
Checkmark     → confirmation
Question mark → ambiguity / nudge
Print/Printer → PDF export
Expand        → fullscreen / TV mode
Gold ring ◯◯  → marriage connector in tree
```

---

## IX. PDF DESIGN SPECIFICATION

The PDF is the *product's crown jewel*. It is what justifies the entire experience. Design it like you are designing something meant to be framed.

### A3 Landscape Layout Grid

```
┌─────────────────────────────────────────────────────────────────────┐
│  [40px mandala border — all sides]                                  │
│                                                                     │
│  FAMILY NAME                                    Subtitle / Year     │  ← 80px header zone
│  ═══════════════════════════════════════════════════════════════    │
│                                                                     │
│          [Tree content — centered, generous spacing]                │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  May this tree grow for generations to come · Vansh Vriksha · 2025  │  ← 40px footer zone
└─────────────────────────────────────────────────────────────────────┘
```

### PDF Typography
- Family name headline: Cinzel Decorative, 36px, #D4AF37 (gold)
- "Family Tree of the..." subtitle: IM Fell English Italic, 14px, #7A5C3A
- Person names: IM Fell English, 13px, #8B1A1A
- One-liners: Lato 300, 8px, #7A5C3A, letter-spacing 0.08em
- Footer: IM Fell English Italic, 9px, #7A5C3A, centered
- Generation labels: Cinzel Decorative, 8px, #D4AF37, rotated

### Node Sizing for Print
- Node card: 110px × 150px
- Portrait placeholder: 55px × 55px
- Horizontal spacing between nodes: 30px minimum
- Vertical spacing between generations: 60px

---

## X. ACCESSIBILITY STANDARDS

```
Minimum touch target:    48 × 48px (all interactive elements)
Minimum font size:       16px (interface), 8px (PDF fine print exception only)
Color contrast:          4.5:1 minimum (all text on backgrounds)
Focus states:            2px gold outline (#D4AF37) on all focusable elements
Error recovery:          Every error has a plain-language solution path
Motion sensitivity:      Respect prefers-reduced-motion media query
Auto-save:               Every 30 seconds to localStorage
Timeout prevention:      No session timeouts in Phase 1
Language:                Plain English, no jargon, no technical terms
```

---

*"Design is the silent ambassador of your brand."*
*In Vansh Vriksha, design is the silent guardian of memory.*
