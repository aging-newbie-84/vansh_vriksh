/**
 * Vansh Vriksha API Client
 * Priority order:
 *   1. VITE_OPENAI_API_KEY  → call OpenAI directly (dev/demo mode)
 *   2. VITE_N8N_WEBHOOK_URL → call n8n workflow (production)
 *   3. Neither set          → return Mohanty family mock data
 */

const SYSTEM_PROMPT = `You are Vanshacharya — the family historian AI at the heart of Vansh Vriksha, a heritage-preservation application that helps Indian families map their ancestral lineage.

Your role is sacred and practical: you listen to messy, spoken, emotional, non-linear family narratives — in English, Hinglish, or colloquial mixed language — and transform them into clean, structured family tree data.

You are warm, patient, respectful — like a wise family elder. You are culturally fluent in Indian family structures, naming conventions (nicknames like Munna, Chotu, Bhai, Didi), joint families, and regional terms.

Always output ONLY a valid JSON object in this exact structure — no markdown fences, no extra text:

{
  "persons": [
    {
      "id": "p1",
      "name": "Full Name",
      "gender": "male | female",
      "role": "Patriarch | Son | Daughter | etc",
      "profession": "optional",
      "location": "optional",
      "one_liner": "Location · Profession · Defining trait",
      "verified": true,
      "marriages": [
        {
          "spouse_id": "p2",
          "children_ids": ["p3", "p4"]
        }
      ]
    }
  ],
  "relationships": [],
  "summary": "One sentence summary of what was parsed.",
  "nudges": ["Follow-up question 1", "Follow-up question 2"],
  "ambiguities": []
}

Rules:
- persons[0] must always be the root/patriarch/matriarch
- Every person must have a unique id (p1, p2, p3...)
- marriages.children_ids must contain the IDs of children from that union
- All persons referenced in children_ids or spouse_id must exist in the persons array
- verified: true for clearly stated people, false for inferred/uncertain
- Include all generations mentioned
- Never invent people not mentioned`;

// ── Full Mohanty family mock data ────────────────────────────────
const MOHANTY_MOCK = {
  persons: [
    {
      id: 'p1', name: 'Biranchi Narayan Mohanty', gender: 'male',
      location: 'Kianalikul, Jajpur Town, Odisha',
      role: 'Patriarch', one_liner: 'Kianalikul, Jajpur · Elder · The root of the Mohanty tree',
      verified: true, is_deceased: true,
      marriages: [
        { spouse_id: 'p2', children_ids: ['p4', 'p5', 'p6', 'p7'] },
        { spouse_id: 'p3', children_ids: ['p8'] }
      ]
    },
    { id: 'p2', name: 'First Wife', gender: 'female', role: 'Matriarch (First Marriage)', verified: true, is_deceased: true, marriages: [] },
    { id: 'p3', name: 'Second Wife', gender: 'female', role: 'Matriarch (Second Marriage)', verified: true, is_deceased: true, marriages: [] },

    // Sons — first marriage
    {
      id: 'p4', name: 'BadaBapa', gender: 'male', role: 'Eldest Son',
      one_liner: 'Eldest of four brothers', verified: true,
      marriages: [{ spouse_id: 'p9', children_ids: ['p14', 'p15', 'p16', 'p17', 'p18'] }]
    },
    {
      id: 'p5', name: 'Charu', gender: 'male', role: 'Middle Son',
      verified: true,
      marriages: [{ spouse_id: 'p10', children_ids: ['p19', 'p20'] }]
    },
    {
      id: 'p6', name: 'Chua Bhai', gender: 'male', role: 'Younger Son',
      verified: true,
      marriages: [{ spouse_id: 'p11', children_ids: ['p21', 'p22', 'p23', 'p24'] }]
    },
    {
      id: 'p7', name: 'Tipa', gender: 'male', role: 'Youngest Son (First Marriage)',
      verified: true,
      marriages: [{ spouse_id: 'p12', children_ids: ['p25', 'p26'] }]
    },

    // Son — second marriage
    {
      id: 'p8', name: 'Chaudhary', gender: 'male', role: 'Son (Second Marriage)',
      profession: 'Bus Conductor', verified: true,
      marriages: [{ spouse_id: 'p13', children_ids: ['p27', 'p28'] }]
    },

    // Wives
    { id: 'p9',  name: 'Bada Bau',        gender: 'female', role: 'Wife of BadaBapa',  verified: true, marriages: [] },
    { id: 'p10', name: 'Usha',             gender: 'female', role: 'Wife of Charu',     verified: true, marriages: [] },
    { id: 'p11', name: 'Sana Bou',         gender: 'female', role: 'Wife of Chua Bhai', verified: true, marriages: [] },
    { id: 'p12', name: 'Khudi',            gender: 'female', role: 'Wife of Tipa',      verified: true, marriages: [] },
    { id: 'p13', name: 'Jharkhand Bou',    gender: 'female', role: 'Wife of Chaudhary', location: 'Jharkhand', verified: true, marriages: [] },

    // BadaBapa's children
    { id: 'p14', name: 'Chandan',  gender: 'male',   role: 'Son of BadaBapa',       verified: true },
    { id: 'p15', name: 'Ranjan',   gender: 'male',   role: 'Son of BadaBapa',       verified: true },
    { id: 'p16', name: 'Tapan',    gender: 'male',   role: 'Son of BadaBapa',       verified: true },
    { id: 'p17', name: 'Japani',   gender: 'female', role: 'Daughter of BadaBapa',  verified: true },
    { id: 'p18', name: 'Queenie',  gender: 'female', role: 'Daughter of BadaBapa',  verified: true },

    // Charu's children
    { id: 'p19', name: 'Santosh', gender: 'male', role: 'Son of Charu', verified: true },
    { id: 'p20', name: 'Sambit',  gender: 'male', role: 'Son of Charu', verified: true },

    // Chua Bhai's children (all married with one kid each)
    {
      id: 'p21', name: 'Jyoti',  gender: 'female', role: 'Eldest child of Chua Bhai',
      verified: true, marriages: [{ spouse_id: null, children_ids: ['p29'] }]
    },
    {
      id: 'p22', name: 'Baya',   gender: 'female', role: 'Elder daughter of Chua Bhai',
      verified: true, marriages: [{ spouse_id: null, children_ids: ['p30'] }]
    },
    {
      id: 'p23', name: 'Pinky',  gender: 'female', role: 'Younger daughter of Chua Bhai',
      verified: true, marriages: [{ spouse_id: null, children_ids: ['p31'] }]
    },
    {
      id: 'p24', name: 'Sania',  gender: 'male',   role: 'Youngest son of Chua Bhai',
      verified: true, marriages: [{ spouse_id: null, children_ids: ['p32'] }]
    },

    // Tipa's children
    { id: 'p25', name: 'Rinki',    gender: 'female', role: 'Daughter of Tipa', verified: true },
    { id: 'p26', name: 'Futkuri',  gender: 'female', role: 'Daughter of Tipa', verified: true },

    // Chaudhary's children
    { id: 'p27', name: 'Daughter (elder)',  gender: 'female', role: 'Daughter of Chaudhary', verified: false },
    { id: 'p28', name: 'Daughter (younger)', gender: 'female', role: 'Daughter of Chaudhary', verified: false },

    // Great-grandchildren (Jyoti, Baya, Pinky, Sania each have one child)
    { id: 'p29', name: "Jyoti's Child",  gender: 'male',   role: 'Great-grandchild', verified: false },
    { id: 'p30', name: "Baya's Child",   gender: 'female', role: 'Great-grandchild', verified: false },
    { id: 'p31', name: "Pinky's Child",  gender: 'male',   role: 'Great-grandchild', verified: false },
    { id: 'p32', name: "Sania's Child",  gender: 'female', role: 'Great-grandchild', verified: false },
  ],
  relationships: [],
  summary: "Four generations of the Mohanty family from Bhubaneswar. BN Mohanty had five sons — four from his first marriage, one from the second. The tree spans 32 family members across four generations.",
  nudges: [
    "What were the professions of BadaBapa, Charu, and Tipa?",
    "Do you know the names of Chaudhary's two daughters?",
    "What are the names of Jyoti, Baya, Pinky, and Sania's children?"
  ],
  ambiguities: [
    {
      issue: "Names needed",
      description: "Chaudhary's two daughters and the great-grandchildren need their real names confirmed.",
      people_involved: ["p27", "p28", "p29", "p30", "p31", "p32"]
    }
  ]
};

// ── OpenAI direct call (for demo — set VITE_OPENAI_API_KEY in .env) ──
async function callOpenAI(transcript, previousData, sessionId) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
  ];

  if (previousData && previousData.persons?.length > 0) {
    messages.push({
      role: 'assistant',
      content: JSON.stringify(previousData)
    });
    messages.push({
      role: 'user',
      content: `Here is additional information to add to the family tree: ${transcript}`
    });
  } else {
    messages.push({
      role: 'user',
      content: transcript
    });
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature: 0.3,
      max_tokens: 4000
    })
  });

  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);

  const result = await response.json();
  const content = result.choices[0].message.content;

  // Strip markdown fences if present
  const cleaned = content.replace(/```json|```/g, '').trim();
  const parsed  = JSON.parse(cleaned);

  // Attach token usage so the UI can show cost
  const usage = result.usage || {};
  parsed._usage = {
    prompt_tokens:     usage.prompt_tokens     || 0,
    completion_tokens: usage.completion_tokens || 0,
    total_tokens:      usage.total_tokens      || 0,
  };

  return parsed;
}

// ── Main export ──────────────────────────────────────────────────
export const parseFamily = async (transcript, previousData = [], sessionId = null) => {
  const openaiKey    = import.meta.env.VITE_OPENAI_API_KEY;
  const webhookUrl   = import.meta.env.VITE_N8N_WEBHOOK_URL;

  // Path 1: OpenAI direct
  if (openaiKey) {
    return callOpenAI(transcript, previousData[0] || null, sessionId);
  }

  // Path 2: n8n webhook
  if (webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, previousData, sessionId })
    });
    if (!response.ok) throw new Error('Backend consultation failed.');
    return response.json();
  }

  // Path 3: Mohanty family mock (no env vars set)
  console.info('No API key or webhook set — loading Mohanty family demo data.');
  return new Promise(resolve => setTimeout(() => resolve(MOHANTY_MOCK), 1200));
};
