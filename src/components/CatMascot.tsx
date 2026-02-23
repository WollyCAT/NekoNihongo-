import React from 'react';
import { motion } from 'motion/react';

interface CatMascotProps {
  mood?: 'happy' | 'thinking' | 'sleeping' | 'excited';
  className?: string;
}

export const CatMascot: React.FC<CatMascotProps> = ({ mood = 'happy', className = '' }) => {
  const getCatSvg = () => {
    switch (mood) {
      case 'thinking':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500 fill-current">
            <path d="M20,40 Q10,10 30,20 Q50,10 70,20 Q90,10 80,40 Q90,70 50,90 Q10,70 20,40 Z" />
            <circle cx="35" cy="45" r="5" fill="black" />
            <circle cx="65" cy="45" r="5" fill="black" />
            <path d="M45,55 Q50,60 55,55" stroke="black" strokeWidth="2" fill="none" />
            <path d="M70,30 Q80,20 90,30" stroke="black" strokeWidth="2" fill="none" />
            <circle cx="85" cy="25" r="3" fill="black" />
            <circle cx="92" cy="18" r="2" fill="black" />
            <circle cx="97" cy="12" r="1" fill="black" />
          </svg>
        );
      case 'sleeping':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500 fill-current">
            <path d="M20,50 Q10,20 30,30 Q50,20 70,30 Q90,20 80,50 Q90,80 50,90 Q10,80 20,50 Z" />
            <path d="M30,50 Q35,45 40,50" stroke="black" strokeWidth="2" fill="none" />
            <path d="M60,50 Q65,45 70,50" stroke="black" strokeWidth="2" fill="none" />
            <path d="M45,60 Q50,65 55,60" stroke="black" strokeWidth="2" fill="none" />
            <text x="75" y="30" fontSize="12" fill="black">Z</text>
            <text x="85" y="20" fontSize="10" fill="black">z</text>
            <text x="92" y="12" fontSize="8" fill="black">z</text>
          </svg>
        );
      case 'excited':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500 fill-current">
            <path d="M20,40 Q10,10 30,20 Q50,10 70,20 Q90,10 80,40 Q90,70 50,90 Q10,70 20,40 Z" />
            <path d="M30,40 L40,45 L30,50" stroke="black" strokeWidth="2" fill="none" />
            <path d="M70,40 L60,45 L70,50" stroke="black" strokeWidth="2" fill="none" />
            <path d="M45,55 Q50,70 55,55" stroke="black" strokeWidth="2" fill="none" />
            <path d="M45,55 L55,55" stroke="black" strokeWidth="2" fill="none" />
            <path d="M10,30 L20,40" stroke="black" strokeWidth="2" />
            <path d="M90,30 L80,40" stroke="black" strokeWidth="2" />
          </svg>
        );
      case 'happy':
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500 fill-current">
            <path d="M20,40 Q10,10 30,20 Q50,10 70,20 Q90,10 80,40 Q90,70 50,90 Q10,70 20,40 Z" />
            <path d="M30,45 Q35,40 40,45" stroke="black" strokeWidth="2" fill="none" />
            <path d="M60,45 Q65,40 70,45" stroke="black" strokeWidth="2" fill="none" />
            <path d="M45,55 Q50,60 55,55" stroke="black" strokeWidth="2" fill="none" />
            <circle cx="25" cy="55" r="4" fill="#ff9999" opacity="0.6" />
            <circle cx="75" cy="55" r="4" fill="#ff9999" opacity="0.6" />
          </svg>
        );
    }
  };

  return (
    <motion.div
      className={`w-24 h-24 ${className}`}
      animate={{ y: [0, -5, 0] }}
      transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
    >
      {getCatSvg()}
    </motion.div>
  );
};
