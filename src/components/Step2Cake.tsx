import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { BirthdayData, RelationTemplate } from '../types';
import { Sparkles, ArrowRight } from 'lucide-react';

interface Step2Props {
  data: BirthdayData;
  template: RelationTemplate;
  onNext: () => void;
}

interface SmokePuff {
  id: number;
  offset: number;
}

export const Step2Cake: React.FC<Step2Props> = ({ data, template, onNext }) => {
  const [blown, setBlown] = useState(false);
  const [smokes, setSmokes] = useState<SmokePuff[]>([]);
  const [message, setMessage] = useState<string>(template.candleHint);

  const fireCandleConfetti = () => {
    // Grand celebratory burst from center and sides
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#3b82f6', '#fbbf24', '#10b981', '#ff5722'];
    
    // Center cannon
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.55 },
      colors,
    });

    // Left cannon
    confetti({
      particleCount: 45,
      angle: 60,
      spread: 60,
      origin: { x: 0.05, y: 0.65 },
      colors,
    });

    // Right cannon
    confetti({
      particleCount: 45,
      angle: 120,
      spread: 60,
      origin: { x: 0.95, y: 0.65 },
      colors,
    });
  };

  const handleBlow = () => {
    if (blown) return;
    setBlown(true);
    sound.playBlow();

    // Trigger full screen colorful confetti right as candle is extinguished
    setTimeout(fireCandleConfetti, 100);

    // Create realistic trailing smoke puffs
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        setSmokes((prev) => [...prev, { id: Date.now() + i, offset: (Math.random() - 0.5) * 20 }]);
      }, i * 160);
    }

    setMessage(template.candleWishSuccess);
    
    // Play celebratory win chime
    setTimeout(() => {
      sound.playWin();
    }, 500);

    // Automatically proceed to the next step (Flower bouquet) after enjoying confetti
    setTimeout(() => {
      onNext();
    }, 2200);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto py-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-4xl font-extrabold text-rose-600 mb-1 font-anek"
      >
        মোমবাতিটিতে ফুঁ দিয়ে নিভিয়ে দাও! 🕯️
      </motion.h2>

      <div className="font-galada text-2xl sm:text-4xl md:text-5xl text-gray-800 mb-4 px-2 max-w-full break-words text-center">
        {data.name}
      </div>

      {/* Interactive Birthday Cake */}
      <div className="relative my-6 select-none flex flex-col items-center">
        {/* Candle with Flame */}
        <div className="relative flex flex-col items-center justify-center z-30 mb-[-2px]">
          {/* Flame Container - Anchored directly to wick tip */}
          <div
            className="relative h-14 w-12 flex flex-col items-center justify-end cursor-pointer pb-0.5"
            onClick={handleBlow}
          >
            {!blown ? (
              <motion.div
                whileHover={{ scale: 1.15 }}
                className="relative flex flex-col items-center justify-end cursor-pointer"
                style={{ transformOrigin: 'bottom center' }}
              >
                {/* Flame Ambient Halo */}
                <div className="absolute -inset-4 bg-amber-400/35 rounded-full blur-lg flame-halo pointer-events-none" />

                {/* Lifelike Outer Flame with Organic Physics */}
                <div className="relative realistic-flame w-6 h-10 flex flex-col items-center justify-end pb-1">
                  {/* Inner White-Hot Core */}
                  <div className="inner-flame w-3 h-5 rounded-[50%_50%_35%_35%/60%_60%_40%_40%] mb-0.5" />
                  {/* Subtle Combustion Blue Base */}
                  <div className="w-2.5 h-1.5 rounded-full bg-blue-500/70 blur-[0.5px] -mb-0.5" />
                </div>
              </motion.div>
            ) : (
              <div className="relative w-8 h-10 flex justify-center items-end">
                {/* Rising Smoke Particles */}
                {smokes.map((s) => (
                  <div
                    key={s.id}
                    className="absolute bottom-0 left-1/2 w-3 h-3 rounded-full bg-gray-400/70 animate-smoke pointer-events-none"
                    style={{ marginLeft: `${s.offset}px` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Wick */}
          <div className="w-1 h-3 bg-gray-800 rounded-t mx-auto -mt-0.5" />

          {/* Candle Body */}
          <div className="w-4 h-14 bg-gradient-to-r from-pink-200 via-rose-100 to-pink-200 rounded-t shadow-sm border border-rose-300/60 relative overflow-hidden mx-auto">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(244,63,94,0.3)_4px,rgba(244,63,94,0.3)_8px)]" />
          </div>
        </div>

        {/* Cake Top Tier */}
        <div className="w-40 sm:w-48 h-16 sm:h-20 bg-gradient-to-b from-pink-100 to-pink-200 rounded-t-2xl border-b-4 border-pink-300 relative shadow-inner z-20 flex justify-center items-center overflow-hidden">
          {/* Dripping Frosting */}
          <div className="absolute top-0 w-full flex justify-between px-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="w-3.5 h-4 bg-white/90 rounded-b-full shadow-sm"
                style={{ height: i % 2 === 0 ? '18px' : '12px' }}
              />
            ))}
          </div>
          {/* Strawberries / Cherries on Top */}
          <div className="absolute top-1 w-full flex justify-around px-3">
            <span className="text-base sm:text-lg">🍓</span>
            <span className="text-base sm:text-lg">🍒</span>
            <span className="text-base sm:text-lg">🍓</span>
          </div>
          <span className="text-xs font-semibold text-rose-400 font-anek mt-4">Happy Birthday</span>
        </div>

        {/* Cake Bottom Tier */}
        <div className="w-56 sm:w-64 h-20 sm:h-24 bg-gradient-to-b from-rose-200 to-rose-300 rounded-b-2xl border-b-8 border-rose-400 relative shadow-md z-10 flex flex-col justify-between pt-1 overflow-hidden">
          {/* Cream frosting layer */}
          <div className="w-full flex justify-between px-2">
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-5 bg-white/90 rounded-b-full shadow-sm"
                style={{ height: i % 2 === 0 ? '20px' : '14px' }}
              />
            ))}
          </div>

          {/* Decorative Cream Pearls */}
          <div className="flex justify-around items-center pb-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-4 h-4 rounded-full bg-white shadow-inner border border-rose-200"
              />
            ))}
          </div>
        </div>

        {/* Cake Plate */}
        <div className="w-64 sm:w-76 h-5 bg-gradient-to-r from-gray-200 via-white to-gray-200 rounded-[50%] shadow-xl z-0 mt-1 border border-gray-300" />
      </div>

      {/* Guidance Message */}
      <AnimatePresence mode="wait">
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`text-base sm:text-lg font-medium transition-all ${
            blown ? 'text-emerald-600 font-bold scale-105' : 'text-gray-600'
          }`}
        >
          {message}
        </motion.p>
      </AnimatePresence>

      {/* Button to proceed if blown */}
      <div className="mt-6 min-h-[55px]">
        {blown && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 140 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              sound.playClick();
              onNext();
            }}
            className="px-8 sm:px-10 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-lg shadow-lg shadow-pink-500/30 flex items-center gap-2 cursor-pointer animate-bounce"
          >
            <span>পরের উপহারটি দেখুন</span>
            <Sparkles className="w-5 h-5 text-yellow-200" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
