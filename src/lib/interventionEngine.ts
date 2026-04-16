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
  const rand = Math.random();
  
  // MRT Logic: 1/3 No intervention (Control), 1/3 Blanket, 1/3 Adapted
  if (rand < 0.33) {
    return { isVisible: false } as InterventionConfig;
  }

  const isBlanket = rand < 0.66;
  const text = isBlanket 
    ? OFFICIAL_RANKING[0] 
    : OFFICIAL_RANKING[Math.floor(Math.random() * (OFFICIAL_RANKING.length - 1)) + 1];

  return {
    isVisible: true,
    type: isBlanket ? 'blanket' : 'adapted',
    text: text,
    position: POSITIONS[Math.floor(Math.random() * POSITIONS.length)],
    hasIcon: Math.random() > 0.5,
    loadingType: LOADING_TYPES[Math.floor(Math.random() * LOADING_TYPES.length)],
    loadingDuration: Math.floor(Math.random() * (1000 - 300 + 1) + 300), // 300ms to 1000ms
  };
};