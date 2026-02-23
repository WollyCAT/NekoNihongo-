import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookmarkPlus, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { SentenceAnalysis, Word, GrammarPoint, Flashcard } from '../types';
import { getMoreDetails } from '../services/geminiService';
import { v4 as uuidv4 } from 'uuid';

interface AnalysisResultProps {
  analysis: SentenceAnalysis;
  onAddFlashcard: (card: Flashcard) => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onAddFlashcard }) => {
  const [expandedItem, setExpandedItem] = useState<{ type: 'word' | 'grammar'; id: string } | null>(null);
  const [details, setDetails] = useState<Record<string, { explanation: string; examples: { jp: string; en: string }[] }>>({});
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null);

  const handleExpand = async (item: Word | GrammarPoint, type: 'word' | 'grammar') => {
    const isExpanded = expandedItem?.id === item.id;
    if (isExpanded) {
      setExpandedItem(null);
      return;
    }

    setExpandedItem({ type, id: item.id });

    if (!details[item.id]) {
      setLoadingDetails(item.id);
      try {
        const queryItem = type === 'word' ? (item as Word).word : (item as GrammarPoint).pattern;
        const moreDetails = await getMoreDetails(queryItem, type);
        setDetails((prev) => ({ ...prev, [item.id]: moreDetails }));
      } catch (error) {
        console.error('Failed to load details:', error);
      } finally {
        setLoadingDetails(null);
      }
    }
  };

  const handleAddWord = (word: Word) => {
    let notes = word.pos;
    if (word.example) {
      notes += `\n\nExample:\n${word.example.jp}\n${word.example.en}`;
    }

    onAddFlashcard({
      id: uuidv4(),
      type: 'word',
      front: word.word,
      back: word.meaning,
      reading: word.reading,
      notes: notes,
      createdAt: Date.now(),
    });
  };

  const handleAddGrammar = (grammar: GrammarPoint) => {
    onAddFlashcard({
      id: uuidv4(),
      type: 'grammar',
      front: grammar.pattern,
      back: grammar.meaning,
      notes: grammar.explanation,
      createdAt: Date.now(),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Original Sentence & Translation */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-10 opacity-50"></div>
        <h2 className="text-xl font-medium text-amber-900 mb-2">Translation</h2>
        <p className="text-2xl font-japanese text-gray-800 mb-3 leading-relaxed">
          {analysis.original}
        </p>
        <p className="text-lg text-gray-600 italic">
          "{analysis.translation}"
        </p>
      </div>

      {/* Vocabulary */}
      {analysis.words.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-amber-800 flex items-center gap-2">
            <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">Vocabulary</span>
          </h3>
          <div className="grid gap-3">
            {analysis.words.map((word) => (
              <div key={word.id} className="bg-white rounded-2xl p-4 shadow-sm border border-amber-50">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-xl font-japanese text-gray-900">{word.word}</span>
                      <span className="text-sm text-gray-500">【{word.reading}】</span>
                      <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        {word.pos}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{word.meaning}</p>
                    {word.example && (
                      <div className="mt-3 bg-amber-50/50 p-3 rounded-xl text-sm border border-amber-100/50">
                        <p className="font-japanese text-gray-800 mb-1">{word.example.jp}</p>
                        <p className="text-gray-500">{word.example.en}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddWord(word)}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-full transition-colors"
                      title="Add to Review Later"
                    >
                      <BookmarkPlus size={20} />
                    </button>
                    <button
                      onClick={() => handleExpand(word, 'word')}
                      className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors"
                    >
                      {expandedItem?.id === word.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedItem?.id === word.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-gray-100">
                        {loadingDetails === word.id ? (
                          <div className="flex items-center justify-center py-4 text-amber-500">
                            <Loader2 className="animate-spin" size={24} />
                          </div>
                        ) : details[word.id] ? (
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">{details[word.id].explanation}</p>
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">More Examples</h4>
                              {details[word.id].examples.map((ex, i) => (
                                <div key={i} className="bg-amber-50/50 p-3 rounded-xl text-sm">
                                  <p className="font-japanese text-gray-800 mb-1">{ex.jp}</p>
                                  <p className="text-gray-500">{ex.en}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grammar Points */}
      {analysis.grammar.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-rose-800 flex items-center gap-2">
            <span className="bg-rose-100 text-rose-800 px-3 py-1 rounded-full text-sm">Grammar Points</span>
          </h3>
          <div className="grid gap-3">
            {analysis.grammar.map((grammar) => (
              <div key={grammar.id} className="bg-white rounded-2xl p-4 shadow-sm border border-rose-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-lg font-japanese font-medium text-rose-900">{grammar.pattern}</span>
                    </div>
                    <p className="text-gray-700 mt-1 font-medium">{grammar.meaning}</p>
                    <p className="text-sm text-gray-600 mt-2">{grammar.explanation}</p>
                    
                    <div className="mt-4 space-y-2">
                      {grammar.examples.map((ex, i) => (
                        <div key={i} className="bg-rose-50/50 p-3 rounded-xl text-sm border border-rose-100/50">
                          <p className="font-japanese text-gray-800 mb-1">{ex.jp}</p>
                          <p className="text-gray-500">{ex.en}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleAddGrammar(grammar)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                      title="Add to Review Later"
                    >
                      <BookmarkPlus size={20} />
                    </button>
                    <button
                      onClick={() => handleExpand(grammar, 'grammar')}
                      className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-colors"
                    >
                      {expandedItem?.id === grammar.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedItem?.id === grammar.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 mt-4 border-t border-gray-100">
                        {loadingDetails === grammar.id ? (
                          <div className="flex items-center justify-center py-4 text-rose-500">
                            <Loader2 className="animate-spin" size={24} />
                          </div>
                        ) : details[grammar.id] ? (
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">{details[grammar.id].explanation}</p>
                            <div className="space-y-2">
                              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">More Examples</h4>
                              {details[grammar.id].examples.map((ex, i) => (
                                <div key={i} className="bg-rose-50/50 p-3 rounded-xl text-sm">
                                  <p className="font-japanese text-gray-800 mb-1">{ex.jp}</p>
                                  <p className="text-gray-500">{ex.en}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
