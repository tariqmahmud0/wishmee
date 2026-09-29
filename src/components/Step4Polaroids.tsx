import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '../utils/audio';
import { BirthdayData, RelationTemplate, MemoryItem } from '../types';
import { Mail, Sparkles, RefreshCw } from 'lucide-react';

interface Step4Props {
  data: BirthdayData;
  template: RelationTemplate;
  onNext: () => void;
}

export const Step4Polaroids: React.FC<Step4Props> = ({ data, template, onNext }) => {
  const [cards, setCards] = useState<MemoryItem[]>(data.memories);
  const [swipedCount, setSwipedCount] = useState(0);

  const handleSwipe = () => {
    sound.playClick();
    setSwipedCount((prev) => prev + 1);
    // Remove the first/top card so the next one comes into view
    setCards((prev) => prev.slice(1));
  };

  const handleReset = () => {
    sound.playClick();
    setCards([...data.memories]);
    setSwipedCount(0);
  };

  const allFinished = cards.length === 0;

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto py-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-4xl font-extrabold text-rose-600 mb-1 font-anek"
      >
        {template.memoriesTitle}
      </motion.h2>
      <p className="text-xs sm:text-sm text-gray-500 mb-6 font-medium">
        {template.memoriesHint}
      </p>

      {/* Polaroid Deck Container */}
      <div className="relative w-[300px] sm:w-[340px] h-[390px] sm:h-[430px] mx-auto mb-8 flex items-center justify-center">
        {!allFinished ? (
          <AnimatePresence mode="popLayout">
            {cards.map((card, idx) => {
              const isTop = idx === 0;
              const rot = ((idx % 5) - 2) * 4;

              return (
                <motion.div
                  key={card.id}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{
                    scale: isTop ? 1 : Math.max(0.85, 0.96 - idx * 0.03),
                    rotate: isTop ? rot : rot / 2,
                    y: idx * 5,
                    opacity: 1,
                  }}
                  exit={{
                    x: 350,
                    rotate: 35,
                    opacity: 0,
                    transition: { duration: 0.4 },
                  }}
                  drag={isTop ? 'x' : false}
                  dragConstraints={{ left: -100, right: 100 }}
                  onDragEnd={(_, info) => {
                    if (Math.abs(info.offset.x) > 70) {
                      handleSwipe();
                    }
                  }}
                  onClick={() => {
                    if (isTop) handleSwipe();
                  }}
                  className="absolute inset-0 bg-white rounded-2xl p-3 pb-6 shadow-2xl border border-gray-100/90 flex flex-col justify-between cursor-pointer select-none"
                  style={{
                    zIndex: cards.length - idx,
                    boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.15), 0 0 1px 1px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Photo area */}
                  <div className="w-full flex-1 bg-gradient-to-tr from-pink-50 via-rose-50 to-purple-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 relative">
                    {card.type === 'image' && card.content ? (
                      <img
                        src={card.content}
                        alt={card.caption}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center">
                        <span className="text-5xl sm:text-6xl mb-2">{card.content || '🌟'}</span>
                        {card.subcaption && (
                          <span className="text-xs text-rose-500/80 font-medium font-anek">
                            {card.subcaption}
                          </span>
                        )}
                      </div>
                    )}
                    {/* Gloss highlight */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/20 pointer-events-none" />
                  </div>

                  {/* Caption in Bengali script */}
                  <div className="pt-3 pb-1 px-2 text-center min-h-[58px] flex items-center justify-center">
                    <span
                      className={`${
                        card.caption.length > 25
                          ? 'font-galada text-lg sm:text-xl leading-snug'
                          : 'font-galada text-2xl sm:text-3xl leading-tight'
                      } text-rose-600 block`}
                    >
                      {card.caption}
                    </span>
                  </div>

                  {/* Corner tape illusion */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-yellow-200/50 backdrop-blur-xs rotate-[-2deg] rounded-xs shadow-xs" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/60 w-full h-full"
          >
            <div className="text-5xl mb-4">💌</div>
            <p className="text-lg font-bold text-gray-800 font-anek mb-2">
              স্মৃতিটি দেখা সম্পন্ন হয়েছে!
            </p>
            <p className="text-sm text-gray-500 mb-6">
              এবার তোমার জন্য অপেক্ষা করছে একখানা আন্তরিক চিঠি...
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                sound.playSparkle();
                onNext();
              }}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-base sm:text-lg shadow-lg shadow-pink-500/30 flex items-center gap-2 cursor-pointer animate-pulse"
            >
              <span>চিঠিটি পড়ুন</span>
              <Mail className="w-5 h-5" />
            </motion.button>

            <button
              onClick={handleReset}
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>স্মৃতিটি আবার দেখুন</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Helper swipe prompt */}
      {!allFinished && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 font-medium">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>
            {cards.length > 1
              ? `বাকি রয়েছে ${cards.length} টি স্মৃতি কার্ড`
              : 'কার্ডটিতে স্পর্শ করে চিঠিটি উন্মোচন করো'}
          </span>
        </div>
      )}
    </div>
  );
};
