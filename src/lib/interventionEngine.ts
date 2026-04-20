// src/lib/interventionEngine.ts

export type InterventionPosition = 'top' | 'middle' | 'placeholder' | 'bottom';

export type InterventionConfig = {
  isVisible: boolean;
  type: 'blanket' | 'adapted';
  text: string;
  position: InterventionPosition;
  hasIcon: boolean;
  loadingType: 'none' | 'placeholder' | 'circle' | 'lines';
  loadingDuration: number;
};

// ==========================================
// --- MRT CONFIGURATION VARIABLES ---
// ==========================================

// Probability the intervention appears at all. 
// 1.0 = 100% chance (Always show for testing)
// 0.66 = ~66% chance (Standard MRT: 1/3 Control, 2/3 Intervention)
const CHANCE_TO_SHOW_INTERVENTION = 1.0; 

// If showing an intervention, probability it is the "Blanket" type.
// 0.5 = 50% Blanket / 50% Adapted.
const CHANCE_FOR_BLANKET_TYPE = 0.5;

// Fake loading duration bounds (in milliseconds)
const MIN_LOADING_MS = 2000; // 2 seconds
const MAX_LOADING_MS = 3000; // 3 seconds

// ==========================================

const OFFICIAL_RANKING = [
  "Remember, there are real people on the other side of the screen.",
  "Let's remember to talk to the people behind the screen, not just the screen itself.",
  "Consider how your words might look to someone scrolling past this on their timeline.",
  "Before you hit send, remember the human beings behind the screen.",
  "It can be easy to forget, but your words will reach real humans on the other side.",
  "Your words are about to reach real people, just like you. Please keep that in mind.",
  "Pause and remember: there are human beings on the receiving end of this post.",
  "Remember that every screen displaying your post has a real person behind it.",
  "Take a second to imagine how your message will land with the people reading it.",
  "Take a brief pause: how would you react if you were the one reading this?",
  "Stop for a second and try to see this post from the perspective of whoever comes across it.",
  "Pause and imagine reading this for the first time from the other side of the screen."
];

const POSITIONS: InterventionPosition[] = ['top', 'middle', 'placeholder', 'bottom'];
const LOADING_TYPES: InterventionConfig['loadingType'][] = ['placeholder', 'circle', 'lines'];

export const getInterventionConfig = (): InterventionConfig => {
  // 1. Check if the user falls into the Control group (no intervention)
  if (Math.random() > CHANCE_TO_SHOW_INTERVENTION) {
    return { isVisible: false } as InterventionConfig;
  }

  // 2. Determine Blanket vs Adapted
  const isBlanket = Math.random() < CHANCE_FOR_BLANKET_TYPE;
  const text = isBlanket 
    ? OFFICIAL_RANKING[0] 
    : OFFICIAL_RANKING[Math.floor(Math.random() * (OFFICIAL_RANKING.length - 1)) + 1];

  // 3. Calculate random duration between MIN and MAX
  const loadingDuration = Math.floor(
    Math.random() * (MAX_LOADING_MS - MIN_LOADING_MS + 1) + MIN_LOADING_MS
  );

  // 4. Return the fully constructed config
  return {
    isVisible: true,
    type: isBlanket ? 'blanket' : 'adapted',
    text: text,
    position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
    hasIcon: Math.random() > 0.5,
    loadingType: LOADING_TYPES[Math.floor(Math.random() * LOADING_TYPES.length)],
    loadingDuration: loadingDuration,
  };
};