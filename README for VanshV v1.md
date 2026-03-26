# 🌳 Vansh Vriksha
### *वंश वृक्ष — The Heritage Family Tree Builder*

> *"Those who forget their roots, forget themselves."*

---

## What Is This?

**Vansh Vriksha** is a heritage-preservation web application built for Indian families — especially elders in Tier 2 cities and towns — to map, document, and beautifully print their ancestral lineage before that knowledge is lost forever.

You speak. Or you type. The system listens, understands, asks the right questions, and builds a living, printable family tree that future generations will treasure.

---

## The Problem It Solves

Across India, in homes in Bhubaneswar, Raipur, Allahabad, Madurai, and thousands of smaller towns, elders carry entire family histories in their memory. Names, marriages, migrations, professions, stories. When they go — that knowledge goes with them.

Vansh Vriksha is the bridge between spoken memory and permanent record.

---

## Core Features

### 🎙️ Input — Speak or Type
- Large, forgiving microphone button for audio narration
- Plain text area as fallback
- Both feed the same intelligent parsing pipeline
- Designed for users with low tech literacy — no jargon, no complexity

### 🤖 AI Understanding (Powered by Claude / OpenAI via n8n)
- Parses messy, conversational family narratives
- Handles second marriages, estranged relationships, deceased members
- Resolves name variations (Munna = Mohan = Monu — flagged for you)
- Asks gentle follow-up nudges: *"Did they have any children who passed away?"*
- Outputs clean structured JSON for preview

### 📋 Preview — Simple & Editable
- Clean tabular view — no decoration
- Every person shown as an editable card: name, gender, relation, one-liner bio
- Correct mistakes instantly: tap a name to fix it
- Confirm or reject each parsed relationship
- *"Does this look right?"* confirmation before final render

### 🎨 Artistic Output — Printable PDF
- Full Vedic visual treatment: mandala borders, parchment background, temple gold accents
- Male/female silhouette placeholders (paste actual photos later)
- Names in antique English cursive (Cinzel Decorative / IM Fell English)
- One-liner bio per person: location · profession · defining trait
- A3 landscape format — printable, frameable, displayable on TV

---

## Who Is This For?

| User | How They Use It |
|------|----------------|
| Elderly grandparent in Bhubaneswar | Speaks family history in Hindi/Odia into the mic |
| Middle-aged family member | Types out the narrative, reviews the AI parse |
| NRI child in Bangalore | Receives the PDF, pastes in scanned family photos |
| Extended family | Gathers around a TV screen to view and celebrate the tree |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (single page, scroll-friendly) |
| AI Parsing | Claude API / OpenAI GPT-4o via n8n workflow |
| Audio Input | Web Speech API (browser-native) |
| PDF Export | jsPDF + html2canvas |
| State | React useState + localStorage (auto-save) |
| Backend Orchestration | n8n (no-code workflow automation) |
| Hosting | Vercel / Netlify (static) |

---

## Project Structure

```
vansh-vriksha/
├── frontend/
│   ├── src/
│   │   ├── screens/
│   │   │   ├── InputScreen.jsx       # Audio/text capture
│   │   │   ├── PreviewScreen.jsx     # Editable wire-frame preview
│   │   │   └── TreeScreen.jsx        # Artistic family tree
│   │   ├── components/
│   │   │   ├── PersonCard.jsx        # Editable person tile
│   │   │   ├── TreeNode.jsx          # Rendered tree node
│   │   │   ├── AudioCapture.jsx      # Mic button + Web Speech API
│   │   │   └── NudgePanel.jsx        # AI follow-up question prompts
│   │   ├── utils/
│   │   │   ├── pdfExport.js          # jsPDF rendering logic
│   │   │   ├── treeLayout.js         # D3-based generational layout
│   │   │   └── apiClient.js          # n8n webhook caller
│   │   ├── styles/
│   │   │   ├── tokens.css            # Design tokens (colors, fonts)
│   │   │   └── vedic.css             # Decorative Vedic elements
│   │   └── App.jsx
├── n8n-workflows/
│   └── family-parser-workflow.json   # n8n export
├── prompts/
│   ├── system-prompt.md              # Master AI system prompt
│   └── nudge-prompts.json            # Follow-up question bank
├── assets/
│   ├── silhouettes/                  # Male/female SVG placeholders
│   ├── borders/                      # Mandala/paisley SVG borders
│   └── textures/                     # Parchment background textures
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- n8n instance (cloud or self-hosted)
- Claude API key or OpenAI API key

### Installation

```bash
git clone https://github.com/your-org/vansh-vriksha
cd vansh-vriksha/frontend
npm install
npm run dev
```

### Environment Variables

```env
VITE_N8N_WEBHOOK_URL=https://your-n8n.cloud/webhook/family-parse
VITE_APP_NAME=Vansh Vriksha
```

---

## Design Philosophy

**Vedic Magnificence meets Accessible Simplicity.**

The interface speaks two languages simultaneously:
- To the elder: warmth, familiarity, dignity — nothing intimidating
- To the output: grandeur, heritage, timelessness — something worth printing and framing

Full design guidelines in `DESIGN_PHILOSOPHY.md`.

---

## Roadmap

### Phase 1 — MVP
- [x] Text input → AI parse → editable preview → tree render → PDF export
- [x] Audio input via Web Speech API
- [x] Male/female SVG placeholders
- [x] Core Vedic styling

### Phase 2
- [ ] Image upload per person (replaces placeholder)
- [ ] Multi-session save (IndexedDB)
- [ ] Cast-to-TV / fullscreen presentation mode
- [ ] Deeper nudge engine with follow-up questioning

### Phase 3
- [ ] Multi-language support (Hindi, Odia, Tamil, Telugu)
- [ ] QR code per printed tree linking to digital version
- [ ] Family sharing / collaborative editing

---

## License

MIT License. Built with love for Indian families everywhere.

---

*"A family without a recorded history is like a tree without roots."*
*— Vansh Vriksha, 2025*
