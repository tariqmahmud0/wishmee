import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import { BirthdayData, RelationTemplate } from '../types';
import { RotateCcw, Copy, Check, Sparkles, Heart } from 'lucide-react';

interface Step6Props {
  data: BirthdayData;
  template: RelationTemplate;
  onRestart: () => void;
  onOpenCustomizer?: () => void;
}

export const Step6Gift: React.FC<Step6Props> = ({
  data,
  template,
  onRestart,
}) => {
  const [opened, setOpened] = useState(false);
  const [copied, setCopied] = useState(false);

  const fireGrandConfetti = () => {
    // Grand celebration multi-stage confetti
    const colors = ['#f43f5e', '#ec4899', '#a855f7', '#3b82f6', '#fbbf24', '#10b981', '#ff5722', '#ffeb3b'];

    // Big initial center explosion
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.6 },
      colors,
    });

    // Side cannons: Left and Right bursts
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.7 },
      colors,
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.7 },
      colors,
    });

    // Continuous celebration fireworks raining across screen for 2.5 seconds
    const end = Date.now() + 2500;
    const interval = window.setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.75 },
        colors,
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.75 },
        colors,
      });
    }, 280);
  };

  const handleOpenGift = () => {
    sound.playWin();
    setOpened(true);
    fireGrandConfetti();
    setTimeout(fireGrandConfetti, 400);
  };

  const handleCopyWish = () => {
    const textToCopy = `🎉 শুভ জন্মদিন ${data.name}! 🎉\n\n${
      data.customGreeting || template.greeting
    }\n${(data.customLetterText || template.letter).join('\n\n')}\n\n${
      data.customFinalCaption || template.finalCaption
    }`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto py-6">
      <AnimatePresence>
        {!opened ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex flex-col items-center"
          >
            <h2 className="text-3xl sm:text-5xl font-extrabold text-rose-600 mb-2 font-anek">
              {template.finalTitle}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6 font-medium">
              {template.finalHint}
            </p>

            {/* Bouncing Gift Box */}
            <motion.div
              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
              whileTap={{ scale: 0.9 }}
              onClick={handleOpenGift}
              className="text-[7rem] sm:text-[10rem] cursor-pointer filter drop-shadow-2xl my-4 animate-bounce select-none"
            >
              🎁
            </motion.div>

            <span className="text-xs sm:text-sm text-gray-400 font-medium">
              (উপহারটি খুলতে বক্সের ওপর ট্যাপ করো)
            </span>
          </motion.div>
        ) : (
          /* Opened Surprise Showcase */
          <motion.div
            initial={{ opacity: 0, scale: 0.7, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 120 }}
            className="w-full flex flex-col items-center"
          >
            {/* Surprise Card */}
            <div className="w-full bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/60 mb-6 text-center relative overflow-hidden">
              {/* Confetti button in corner */}
              <button
                onClick={fireGrandConfetti}
                className="absolute top-4 right-4 p-2 rounded-full bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                title="কনফেটি উড়ান"
              >
                <Sparkles className="w-5 h-5" />
              </button>

              {/* Final Media / Emoji Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mb-4 inline-block"
              >
                <div className="text-6xl sm:text-7xl p-3 bg-gradient-to-tr from-pink-100 to-rose-50 rounded-2xl shadow-inner border border-rose-200">
                  {template.finalEmoji}
                </div>
              </motion.div>

              {/* Recipient name & heart */}
              <div className="flex items-center justify-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-rose-500 fill-current" />
                <span className="text-sm font-bold text-gray-500 font-anek">
                  {data.name}-এর জন্য ভালোবাসা
                </span>
                <Heart className="w-5 h-5 text-rose-500 fill-current" />
              </div>

              {/* Final Caption */}
              <h3 className="font-galada text-3xl sm:text-5xl text-rose-600 mb-3 leading-snug">
                {data.customFinalCaption || template.finalCaption}
              </h3>

              {/* Subtext */}
              <p className="text-gray-700 font-medium text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                {template.finalSubtext}
              </p>
            </div>

            {/* Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              {/* Replay */}
              <button
                onClick={() => {
                  sound.playClick();
                  onRestart();
                }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-gray-700 font-semibold shadow-md hover:bg-gray-50 border border-gray-200 transition-all active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <span>আবার দেখুন</span>
              </button>

              {/* Copy Wishes */}
              <button
                onClick={handleCopyWish}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold shadow-md hover:shadow-lg transition-all active:scale-95 text-sm sm:text-base cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>কপি করা হয়েছে!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>শুভেচ্ছা কপি করুন</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
