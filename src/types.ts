export interface Word {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  pos: string; // Part of speech
  example?: { jp: string; en: string };
}

export interface GrammarPoint {
  id: string;
  pattern: string;
  meaning: string;
  explanation: string;
  examples: { jp: string; en: string }[];
}

export interface SentenceAnalysis {
  original: string;
  translation: string;
  words: Word[];
  grammar: GrammarPoint[];
}

export interface Flashcard {
  id: string;
  type: 'word' | 'grammar' | 'sentence';
  front: string;
  back: string;
  reading?: string;
  notes?: string;
  createdAt: number;
}
