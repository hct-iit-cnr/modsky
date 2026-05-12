// src/lib/interventionEngine.ts

export type InterventionPosition = 'title' | 'top' | 'middle' | 'placeholder' | 'bottom' | 'none';

export type InterventionConfig = {
  isVisible: boolean;
  text: string;
  position: InterventionPosition;
  hasIcon: boolean;
  loadingType: 'none' | 'placeholder' | 'circle' | 'lines';
  loadingDuration: number;
  readingDuration: number; // Added to dictate how long the text is read before revealing composer
  testId?: number; // Added to log which specific test was chosen
};

// ==========================================
// --- MRT CONFIGURATION VARIABLES ---
// ==========================================

const CHANCE_TO_SHOW_INTERVENTION = 1.0; 
const INITIAL_DELAY_MS = 300; // Box appears -> Intervention appears
const MIN_READING_MS = 1200;   // Intervention appears -> Rest appearing (Min)
const MAX_READING_MS = 1500;   // Intervention appears -> Rest appearing (Max)

// ==========================================

// The fixed matrix binding IDs to explicit text, positions, and reply states.
export const TEST_INTERVENTIONS = [
  { id: 0, position: 'bottom', loadingType: 'placeholder', isReply: true, isNonReply: true, text: 'Remember, there are real people on the other side of the screen.', label: 'Bottom, Skeleton' },
  { id: 1, position: 'title', loadingType: 'placeholder', isReply: true, isNonReply: true, text: 'Real people are on the other side of the screen.', label: 'Title, Skeleton' },
  { id: 2, position: 'title', loadingType: 'circle', isReply: true, isNonReply: true, text: 'You are talking to real people, not just a screen.', label: 'Title, Spinner' },
  { id: 3, position: 'title', loadingType: 'lines', isReply: true, isNonReply: true, text: 'Your post will reach real humans.', label: 'Title, Dots' },
  { id: 4, position: 'top', loadingType: 'placeholder', isReply: true, isNonReply: true, text: 'It can be easy to forget, but your words will reach real humans on the other side of the screen.', label: 'Top, Skeleton' },
  { id: 5, position: 'top', loadingType: 'circle', isReply: true, isNonReply: true, text: 'Before you hit send, remember the human beings behind the screen.', label: 'Top, Spinner' },
  { id: 6, position: 'top', loadingType: 'lines', isReply: true, isNonReply: true, text: 'Your words are about to reach real people, just like you. Please keep that in mind.', label: 'Top, Dots' },
  { id: 7, position: 'middle', loadingType: 'placeholder', isReply: true, isNonReply: false, text: 'Take a second to imagine how your message will land with @user reading it.', label: 'Middle, Skeleton' },
  { id: 8, position: 'placeholder', loadingType: 'placeholder', isReply: true, isNonReply: false, text: "Let's remember to talk to @user behind the screen, not just the screen itself.", label: 'Placeholder, Skeleton' },
  { id: 9, position: 'placeholder', loadingType: 'circle', isReply: true, isNonReply: false, text: 'Before you hit send, remember the human being @user behind the screen.', label: 'Placeholder, Spinner' },
  { id: 10, position: 'placeholder', loadingType: 'lines', isReply: true, isNonReply: false, text: 'Your words will reach @user, a real person  just like you. Please keep that in mind.', label: 'Placeholder, Dots' },
  { id: 11, position: 'bottom', loadingType: 'placeholder', isReply: true, isNonReply: true, text: 'Pause and remember: there are human beings on the receiving end of what you post.', label: 'Bottom, Skeleton' },
  { id: 12, position: 'bottom', loadingType: 'circle', isReply: true, isNonReply: true, text: 'Remember that every screen displaying your posts has a real person behind it.', label: 'Bottom, Spinner' },
  { id: 13, position: 'bottom', loadingType: 'lines', isReply: true, isNonReply: true, text: 'Take a second to imagine how your message will land with the people reading it.', label: 'Bottom, Dots' }
] as const;

export const getInterventionConfig = (
  isReply: boolean,
  replyToName?: string,
  forceId?: number
): InterventionConfig => {

  let selectedConfig;

  // 1. If forced ID is provided from debug menu
  if (forceId !== undefined) {
    if (forceId === -1) return { isVisible: false } as InterventionConfig; 
    selectedConfig = TEST_INTERVENTIONS.find(t => t.id === forceId);
  } else {
    // 2. Standard Randomization Flow
    if (Math.random() > CHANCE_TO_SHOW_INTERVENTION) {
      return { isVisible: false } as InterventionConfig; 
    }

    const validInterventions = TEST_INTERVENTIONS.filter(t => isReply ? t.isReply : t.isNonReply);
    selectedConfig = validInterventions[Math.floor(Math.random() * validInterventions.length)];
  }

  if (!selectedConfig) {
    return { isVisible: false } as InterventionConfig; 
  }

  // 3. Parse and Inject the display name dynamically (NO '@' symbol)
  let formattedText = selectedConfig.text;
  if (formattedText.includes('@user')) {
    // Replace '@user' with the actual display name, or 'that person' if it fails to fetch
    const nameToDisplay = replyToName ? replyToName : 'that person';
    formattedText = formattedText.replace('@user', nameToDisplay);
  }

  // 4. Calculate randomized reading duration phase
  const readingDuration = Math.floor(
    Math.random() * (MAX_READING_MS - MIN_READING_MS + 1) + MIN_READING_MS
  );

  return {
    isVisible: true,
    text: formattedText,
    position: selectedConfig.position as InterventionPosition,
    hasIcon: true,
    loadingType: selectedConfig.loadingType as any,
    loadingDuration: INITIAL_DELAY_MS, // Static 300ms
    readingDuration: readingDuration, // <--- FIXED: Now strictly uses the 5000ms calc even for forced IDs
    testId: selectedConfig.id,
  };
};