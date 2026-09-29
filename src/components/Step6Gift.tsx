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

// Sparkle burst particles configuration for the opening explosion
const BURST_PARTICLES = Array.from({ length: 18 }).map((_, i) => {
  const angle = (i * 360) / 18;
  const rad = (angle * Math.PI) / 180;
  const dist = 95 + (i % 3) * 35;
  return {
    id: i,
    x: Math.cos(rad) * dist,
    y: Math.sin(rad) * dist,
    color: ['#f43f5e', '#fbbf24', '#ec4899', '#38bdf8', '#a855f7', '#f59e0b', '#10b981'][i % 7],
    icon: ['✨', '⭐', '🌟', '✦', '💖'][i % 5],
    delay: (i % 4) * 0.04,
  };
});

export const Step6Gift: React.FC<Step6Props> = ({
  data,
  template,
  onRestart,
}) => {
  const [opened, setOpened] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
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
    if (opened || isShaking) return;

    // Trigger Shake animation and sound
    setIsShaking(true);
    sound.playSparkle();

    // Initial golden sparkle pop
    confetti({
      particleCount: 35,
      spread: 60,
      startVelocity: 25,
      origin: { y: 0.55 },
      colors: ['#fbbf24', '#f43f5e', '#ec4899', '#38bdf8', '#ffffff'],
      scalar: 0.8,
    });

    // Second sparkle sound at mid-shake
    setTimeout(() => {
      sound.playSparkle();
    }, 380);

    // After intense anticipation shake and sparkle burst, open the gift!
    setTimeout(() => {
      sound.playWin();
      setIsShaking(false);
      setOpened(true);
      fireGrandConfetti();
      setTimeout(fireGrandConfetti, 400);
    }, 850);
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

            {/* Gift Box Container with Glow and Particles */}
            <div className="relative my-4 flex items-center justify-center">
              {/* Ambient Glowing Aura */}
              <div className="absolute w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-rose-400/25 via-amber-300/35 to-pink-500/25 blur-2xl animate-pulse pointer-events-none" />

              {/* Expanding Shockwave Rings during Shake */}
              {isShaking && (
                <>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="absolute w-40 h-40 rounded-full border-4 border-amber-300 pointer-events-none shadow-[0_0_25px_rgba(251,191,36,0.6)]"
                  />
                  <motion.div
                    initial={{ scale: 0.4, opacity: 1 }}
                    animate={{ scale: 2.6, opacity: 0 }}
                    transition={{ duration: 0.85, delay: 0.15, ease: 'easeOut' }}
                    className="absolute w-40 h-40 rounded-full border-2 border-rose-400 pointer-events-none shadow-[0_0_20px_rgba(244,63,94,0.5)]"
                  />
                </>
              )}

              {/* Burst of Sparkles shooting outward during shake */}
              {isShaking && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                  {BURST_PARTICLES.map((p) => (
                    <motion.div
                      key={p.id}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
                      animate={{
                        x: p.x,
                        y: p.y,
                        scale: [0, 1.5, 0.8],
                        opacity: [1, 1, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
                      className="absolute text-xl sm:text-2xl filter drop-shadow-md select-none"
                    >
                      {p.icon}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Floating idle ambient sparkles around the box */}
              {!isShaking && (
                <>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6], rotate: [0, 15, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-3 text-xl sm:text-2xl pointer-events-none select-none"
                  >
                    ✨
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0.9, 0.5], rotate: [0, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 2.4, delay: 0.7 }}
                    className="absolute -bottom-1 -left-3 text-xl sm:text-2xl pointer-events-none select-none"
                  >
                    💖
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.85, 0.4] }}
                    transition={{ repeat: Infinity, duration: 1.8, delay: 1.2 }}
                    className="absolute top-1/2 -right-7 text-xl sm:text-2xl pointer-events-none select-none"
                  >
                    ⭐
                  </motion.div>
                </>
              )}

              {/* Interactive Gift Box with Shake & Anticipation Animation */}
              <motion.div
                animate={
                  isShaking
                    ? {
                        rotate: [0, -18, 18, -15, 15, -12, 12, -8, 8, -4, 4, 0],
                        x: [0, -12, 12, -9, 9, -7, 7, -4, 4, 0],
                        y: [0, -6, 6, -4, 4, -2, 2, 0],
                        scale: [1, 1.08, 1.15, 1.22, 1.32],
                      }
                    : {
                        rotate: [0, -7, 7, -5, 5, 0],
                        y: [0, -10, 0],
                        scale: 1,
                      }
                }
                transition={
                  isShaking
                    ? { duration: 0.85, ease: 'easeInOut' }
                    : { repeat: Infinity, duration: 2.6, ease: 'easeInOut' }
                }
                whileHover={!isShaking ? { scale: 1.12 } : {}}
                whileTap={!isShaking ? { scale: 0.94 } : {}}
                onClick={handleOpenGift}
                className={`text-[7rem] sm:text-[10rem] cursor-pointer filter drop-shadow-2xl select-none relative z-10 transition-transform ${
                  isShaking ? 'cursor-wait' : ''
                }`}
                title="উপহারটি খুলতে ক্লিক করো"
              >
                🎁
              </motion.div>
            </div>

            {/* Hint / Anticipation Text */}
            <div className="h-7 flex items-center justify-center">
              {isShaking ? (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-sm sm:text-base text-rose-600 font-bold flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
                  সারপ্রাইজ খুলছে... একটু অপেক্ষা করো! ✨
                </motion.span>
              ) : (
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  (উপহারটি খুলতে বক্সের ওপর ট্যাপ করো)
                </span>
              )}
            </div>
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
