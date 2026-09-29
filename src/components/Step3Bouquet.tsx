import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';
import { RelationTemplate } from '../types';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

interface Step3Props {
  template: RelationTemplate;
  onNext: () => void;
}

export const Step3Bouquet: React.FC<Step3Props> = ({ template, onNext }) => {
  const [bloomed, setBloomed] = useState(false);

  const handleBouquetClick = () => {
    sound.playSparkle();
    setBloomed(true);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto py-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-5xl font-extrabold text-rose-600 mb-2 font-anek"
      >
        {template.bouquetTitle}
      </motion.h2>

      {/* Interactive Bouquet Emblem */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBouquetClick}
        className="text-[7rem] sm:text-[10rem] my-4 cursor-pointer select-none filter drop-shadow-2xl relative"
      >
        <span>💐</span>

        {/* Floating blooming hearts around bouquet */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-2 right-4 text-pink-500"
        >
          <Heart className="w-8 h-8 fill-current" />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.3, 1], y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, delay: 0.5 }}
          className="absolute top-8 -left-2 text-rose-500"
        >
          <Sparkles className="w-8 h-8 fill-current" />
        </motion.div>
      </motion.div>

      {/* Bengali Blessing/Poetic Subtext */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-base sm:text-xl text-gray-700 font-medium mb-8 max-w-md leading-relaxed px-4"
      >
        {template.bouquetSubText}
      </motion.p>

      {bloomed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-sm sm:text-base font-semibold text-rose-600 bg-rose-50 px-4 py-1.5 rounded-full border border-rose-200 mb-6"
        >
          🌸 প্রতিটি পাপড়িতে মিশে রইল অফুরন্ত ভালোবাসা! 🌸
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          sound.playClick();
          onNext();
        }}
        className="px-8 sm:px-10 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-lg shadow-lg shadow-pink-500/30 flex items-center gap-2 cursor-pointer hover:shadow-xl transition-all"
      >
        <span>পরবর্তী স্মৃতিগুলো দেখুন</span>
        <ArrowRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};
