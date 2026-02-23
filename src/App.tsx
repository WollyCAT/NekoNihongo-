import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, FileText, Sparkles, Settings } from 'lucide-react';
import { CatMascot } from './components/CatMascot';
import { SentenceInput } from './components/SentenceInput';
import { AnalysisResult } from './components/AnalysisResult';
import { Flashcards } from './components/Flashcards';
import { SettingsPanel } from './components/SettingsPanel';
import { analyzeSentence } from './services/geminiService';
import { SentenceAnalysis, Flashcard } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'analyze' | 'review' | 'settings'>('analyze');
  const [analysis, setAnalysis] = useState<SentenceAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [catMood, setCatMood] = useState<'happy' | 'thinking' | 'sleeping' | 'excited'>('happy');

  // Load flashcards from local storage
  useEffect(() => {
    const savedCards = localStorage.getItem('nekonihongo_flashcards');
    if (savedCards) {
      try {
        setFlashcards(JSON.parse(savedCards));
      } catch (e) {
        console.error('Failed to parse saved flashcards', e);
      }
    }
  }, []);

  // Save flashcards to local storage
  useEffect(() => {
    localStorage.setItem('nekonihongo_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  const handleAnalyze = async (sentence: string) => {
    setIsLoading(true);
    setError(null);
    setCatMood('thinking');
    setAnalysis(null);

    try {
      const result = await analyzeSentence(sentence);
      setAnalysis(result);
      setCatMood('excited');
      setTimeout(() => setCatMood('happy'), 3000);
    } catch (err) {
      console.error(err);
      setError('Oops! The cat got confused. Please check your API key or try again.');
      setCatMood('sleeping');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFlashcard = (card: Flashcard) => {
    setFlashcards((prev) => {
      // Prevent duplicates based on front text
      if (prev.some((c) => c.front === card.front)) {
        return prev;
      }
      return [card, ...prev];
    });
    setCatMood('excited');
    setTimeout(() => setCatMood('happy'), 2000);
  };

  const handleRemoveFlashcard = (id: string) => {
    setFlashcards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-gray-800 font-sans selection:bg-amber-200">
      {/* Header */}
      <header className="bg-white border-b border-amber-100 sticky top-0 z-50 shadow-sm/50 backdrop-blur-md bg-white/80">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
              <Sparkles size={20} />
            </div>
            <h1 className="text-xl font-bold text-amber-900 tracking-tight">NekoNihongo</h1>
          </div>
          
          <nav className="flex gap-1 bg-amber-50 p-1 rounded-full border border-amber-100">
            <button
              onClick={() => setActiveTab('analyze')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'analyze'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-amber-700/70 hover:text-amber-900'
              }`}
            >
              <FileText size={16} />
              <span className="hidden sm:inline">Analyze</span>
            </button>
            <button
              onClick={() => setActiveTab('review')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'review'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-amber-700/70 hover:text-amber-900'
              }`}
            >
              <BookOpen size={16} />
              <span className="hidden sm:inline">Review</span>
              {flashcards.length > 0 && (
                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                  {flashcards.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                activeTab === 'settings'
                  ? 'bg-white text-amber-900 shadow-sm'
                  : 'text-amber-700/70 hover:text-amber-900'
              }`}
            >
              <Settings size={16} />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'analyze' ? (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Hero Section */}
              <div className="text-center space-y-6 flex flex-col items-center">
                <CatMascot mood={catMood} className="w-32 h-32" />
                <div className="space-y-2 max-w-lg mx-auto">
                  <h2 className="text-3xl sm:text-4xl font-bold text-amber-950 tracking-tight">
                    Break down any sentence
                  </h2>
                  <p className="text-gray-500 text-lg">
                    Paste Japanese text and let the cat explain the grammar and vocabulary for you.
                  </p>
                </div>
                
                <SentenceInput onAnalyze={handleAnalyze} isLoading={isLoading} />
                
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 text-red-600 px-4 py-3 rounded-2xl text-sm font-medium border border-red-100"
                  >
                    {error}
                  </motion.div>
                )}
              </div>

              {/* Results Section */}
              {analysis && (
                <div className="pt-8 border-t border-amber-100/50">
                  <AnalysisResult analysis={analysis} onAddFlashcard={handleAddFlashcard} />
                </div>
              )}
            </motion.div>
          ) : activeTab === 'review' ? (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Flashcards cards={flashcards} onRemove={handleRemoveFlashcard} />
            </motion.div>
          ) : (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SettingsPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
