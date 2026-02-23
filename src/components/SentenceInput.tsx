import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface SentenceInputProps {
  onAnalyze: (sentence: string) => Promise<void>;
  isLoading: boolean;
}

export const SentenceInput: React.FC<SentenceInputProps> = ({ onAnalyze, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onAnalyze(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center bg-white rounded-full shadow-sm border-2 border-amber-200 focus-within:border-amber-400 focus-within:ring-4 focus-within:ring-amber-100 transition-all duration-300 overflow-hidden">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste a Japanese sentence here... (e.g. 猫は可愛いですね)"
          className="w-full py-4 pl-6 pr-16 text-lg font-japanese bg-transparent outline-none text-gray-800 placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="absolute right-2 p-3 bg-amber-500 text-white rounded-full hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors shadow-sm"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
        </button>
      </div>
      <p className="text-center text-sm text-amber-700/60 mt-3 font-medium">
        Intermediate level analysis. Skips basic particles and common words.
      </p>
    </form>
  );
};
