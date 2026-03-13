// src/lib/interventionEngine.ts

export type InterventionConfig = {
  isVisible: boolean;
  type?: 'blanket' | 'adapted';
  text?: string;
  color?: string;
  position?: number;
};

const ADAPTED_TEXTS = [
  "Think before you post.", 
  "Are you sure you want to share this?", 
  "Consider the impact of your words."
];
const ADAPTED_COLORS = ["#FFD700", "#ADD8E6", "#90EE90"];

export const getInterventionConfig = (): InterventionConfig => {
  const rand = Math.random();
  const pNone = 0.01;
  const pBlanket = 0.33;

  if (rand < pNone) {
    return { isVisible: false };
  } 
  
  if (rand < pNone + pBlanket) {
    return {
      isVisible: true,
      type: 'blanket',
      text: 'Please take a moment to review your post.',
      color: '#F3F4F6',
      position: 4,
    };
  }

  return {
    isVisible: true,
    type: 'adapted',
    text: ADAPTED_TEXTS[Math.floor(Math.random() * ADAPTED_TEXTS.length)],
    color: ADAPTED_COLORS[Math.floor(Math.random() * ADAPTED_COLORS.length)],
    position: Math.floor(Math.random() * 9),
  };
};