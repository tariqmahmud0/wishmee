import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BirthdayData, RelationTemplate } from '../types';
import { sound } from '../utils/audio';
import { Sparkles, Heart } from 'lucide-react';

interface Step0Props {
  data: BirthdayData;
  template: RelationTemplate;
  onNext: () => void;
}

export const Step0Welcome: React.FC<Step0Props> = ({ data, template, onNext }) => {
  const [noBtnPos, setNoBtnPos] = useState<{ x: number; y: number } | null>(null);
  const [noWarning, setNoWarning] = useState<string | null>(null);

  const moveNoButton = () => {
    sound.playClick();
    const randomX = (Math.random() - 0.5) * 240;
    const randomY = (Math.random() - 0.5) * 160;
    setNoBtnPos({ x: randomX, y: randomY });

    const warnings = [
      'না বলার কোনো সুযোগ নেই কিন্তু! 😜',
      'আজকের দিনে কোনো না চলবে না! 🥳',
      'একটুখানি হ্যাঁ বলে দেখো, চমক অপেক্ষা করছে! ✨',
      'আরে দাঁড়াও! একবার দেখেই নাও! 💕',
    ];
    setNoWarning(warnings[Math.floor(Math.random() * warnings.length)]);
  };

  const handleStart = () => {
    sound.playClick();
    onNext();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto py-6">
      {/* Animated Cake Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 12, stiffness: 120 }}
        className="relative mb-6"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/80 backdrop-blur-md shadow-xl flex items-center justify-center border border-white/60">
          <span className="text-4xl sm:text-5xl animate-bounce">🎂</span>
        </div>
        <motion.div
          animate={{ scale: [1, 1.25, 1], rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute -top-2 -right-2 text-rose-500"
        >
          <Sparkles className="w-6 h-6 fill-current" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl sm:text-5xl font-extrabold text-rose-600 mb-2 font-anek tracking-normal"
      >
        শুভ জন্মদিন,
      </motion.h1>

      {/* Styled Recipient Name */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 100 }}
        className="w-full my-2 px-2 flex justify-center items-center"
      >
        <span
          className={`font-galada ${
            data.name.length > 14
              ? 'text-3xl sm:text-5xl md:text-6xl'
              : data.name.length > 8
              ? 'text-4xl sm:text-6xl md:text-7xl'
              : 'text-5xl sm:text-7xl md:text-8xl'
          } text-rose-600 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent leading-normal py-2 block text-center max-w-full break-words`}
          style={{ textShadow: '0 2px 10px rgba(244, 63, 94, 0.15)' }}
        >
          {data.name}
        </span>
      </motion.div>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-base sm:text-xl text-gray-700 font-medium mb-10 max-w-md leading-relaxed px-2"
      >
        {template.welcomeSubText}
      </motion.p>

      {/* Fun No Warning Pill */}
      <AnimatePresence>
        {noWarning && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mb-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-rose-100/90 text-rose-700 text-sm font-semibold shadow-sm border border-rose-200"
          >
            <Heart className="w-4 h-4 fill-current text-rose-500" />
            <span>{noWarning}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-4 relative min-h-[70px]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 text-white font-semibold text-lg sm:text-xl shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all flex items-center gap-2 cursor-pointer z-10"
        >
          <span>হ্যাঁ, শুরু করা যাক!</span>
          <Sparkles className="w-5 h-5 text-yellow-200" />
        </motion.button>

        {/* Playful Evasive "No" Button */}
        <motion.button
          animate={
            noBtnPos
              ? { x: noBtnPos.x, y: noBtnPos.y }
              : { x: 0, y: 0 }
          }
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          onMouseEnter={moveNoButton}
          onTouchStart={moveNoButton}
          onClick={moveNoButton}
          className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-full bg-white/90 backdrop-blur-md text-gray-600 font-medium text-base sm:text-lg border-2 border-gray-200 shadow-md hover:bg-gray-50 transition-colors cursor-pointer select-none"
        >
          না
        </motion.button>
      </div>
    </div>
  );
};
