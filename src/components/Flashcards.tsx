import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, RefreshCw } from 'lucide-react';
import { Flashcard } from '../types';

interface FlashcardsProps {
  cards: Flashcard[];
  onRemove: (id: string) => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({ cards, onRemove }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl shadow-sm border border-amber-100">
        <div className="text-amber-300 mb-4">
          <svg viewBox="0 0 100 100" className="w-24 h-24 fill-current mx-auto">
            <path d="M20,50 Q10,20 30,30 Q50,20 70,30 Q90,20 80,50 Q90,80 50,90 Q10,80 20,50 Z" />
            <path d="M30,50 Q35,45 40,50" stroke="black" strokeWidth="2" fill="none" />
            <path d="M60,50 Q65,45 70,50" stroke="black" strokeWidth="2" fill="none" />
            <path d="M45,60 Q50,65 55,60" stroke="black" strokeWidth="2" fill="none" />
            <text x="75" y="30" fontSize="12" fill="black">Z</text>
            <text x="85" y="20" fontSize="10" fill="black">z</text>
            <text x="92" y="12" fontSize="8" fill="black">z</text>
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">No flashcards yet</h3>
        <p className="text-gray-500">Add words and grammar points from your analysis to review them later!</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-amber-900">Review</h2>
        <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      <div className="relative h-80 perspective-1000">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id + (isFlipped ? '-back' : '-front')}
            initial={{ rotateY: isFlipped ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: isFlipped ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 w-full h-full cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className={`w-full h-full bg-white rounded-3xl shadow-md border-2 flex flex-col items-center justify-center p-8 text-center relative
              ${currentCard.type === 'word' ? 'border-amber-200' : 'border-rose-200'}`}
            >
              <div className={`absolute top-4 left-4 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
                ${currentCard.type === 'word' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}
              >
                {currentCard.type}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(currentCard.id);
                  if (cards.length === 1) setCurrentIndex(0);
                  else if (currentIndex === cards.length - 1) setCurrentIndex(currentIndex - 1);
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>

              {!isFlipped ? (
                // Front of card
                <div>
                  <h3 className="text-4xl font-japanese font-bold text-gray-900 mb-4">
                    {currentCard.front}
                  </h3>
                  <p className="text-sm text-gray-400 flex items-center justify-center gap-2 mt-8">
                    <RefreshCw size={14} /> Tap to flip
                  </p>
                </div>
              ) : (
                // Back of card
                <div className="w-full">
                  {currentCard.reading && (
                    <p className="text-lg text-amber-600 font-japanese mb-2">
                      【{currentCard.reading}】
                    </p>
                  )}
                  <h3 className="text-2xl font-medium text-gray-800 mb-4">
                    {currentCard.back}
                  </h3>
                  {currentCard.notes && (
                    <div className="mt-6 pt-4 border-t border-gray-100 text-sm text-gray-600 text-left whitespace-pre-wrap">
                      {currentCard.notes}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={prevCard}
          className="px-6 py-3 bg-white text-gray-700 font-medium rounded-2xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={nextCard}
          className="px-8 py-3 bg-amber-500 text-white font-medium rounded-2xl shadow-md shadow-amber-200 hover:bg-amber-600 transition-colors"
        >
          Next Card
        </button>
      </div>
    </div>
  );
};
