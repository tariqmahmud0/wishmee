import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';
import { RelationTemplate } from '../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Step1Props {
  template: RelationTemplate;
  onNext: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  size: number;
}

const BALLOON_COLORS = [
  { bg: 'from-pink-400 to-rose-500', shadow: 'rgba(244, 63, 94, 0.4)', knot: '#f43f5e' },
  { bg: 'from-sky-400 to-blue-500', shadow: 'rgba(56, 189, 248, 0.4)', knot: '#0284c7' },
  { bg: 'from-amber-300 to-yellow-500', shadow: 'rgba(234, 179, 8, 0.4)', knot: '#ca8a04' },
  { bg: 'from-purple-400 to-fuchsia-600', shadow: 'rgba(192, 38, 211, 0.4)', knot: '#a21caf' },
];

export const Step1Balloons: React.FC<Step1Props> = ({ template, onNext }) => {
  const [popped, setPopped] = useState<boolean[]>([false, false, false, false]);
  const [particles, setParticles] = useState<Particle[]>([]);

  const handlePop = (index: number, e: React.MouseEvent) => {
    if (popped[index]) return;

    sound.playPop();

    // Trigger particle explosion at click coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const colors = ['#f43f5e', '#ec4899', '#38bdf8', '#fbbf24', '#a855f7', '#ffffff'];
    const newParticles: Particle[] = Array.from({ length: 16 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 80 + 40;
      return {
        id: Date.now() + i,
        x: centerX,
        y: centerY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 4,
      };
    });

    setParticles((prev) => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
    }, 800);

    const updated = [...popped];
    updated[index] = true;
    setPopped(updated);

    if (updated.every(Boolean)) {
      setTimeout(() => sound.playWin(), 300);
    }
  };

  const allPopped = popped.every(Boolean);

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto py-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-4xl font-extrabold text-rose-600 mb-2 font-anek"
      >
        {template.balloonTitle}
      </motion.h2>
      <p className="text-sm sm:text-base text-gray-500 mb-8 font-medium">
        (প্রতিটি বেলুনে স্পর্শ করে গোপন বার্তা উন্মুক্ত করো)
      </p>

      {/* Balloons Grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-12 sm:gap-y-12 w-full max-w-sm sm:max-w-md place-items-center mb-10">
        {template.balloons.map((word, idx) => {
          const isPopped = popped[idx];
          const color = BALLOON_COLORS[idx % BALLOON_COLORS.length];

          return (
            <div key={idx} className="relative flex flex-col items-center justify-end h-36 sm:h-44 w-32">
              {/* Revealed Bengali Word underneath */}
              <div
                className={`absolute top-4 font-galada text-3xl sm:text-4xl font-bold text-rose-600 transition-all duration-500 transform ${
                  isPopped
                    ? 'opacity-100 scale-110 -translate-y-2'
                    : 'opacity-0 scale-75 translate-y-4'
                }`}
              >
                {word}
              </div>

              {/* Balloon */}
              {!isPopped ? (
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handlePop(idx, e)}
                  className="cursor-pointer relative z-10 balloon-float select-none"
                  style={{ animationDelay: `${idx * 0.4}s` }}
                >
                  {/* Balloon Body */}
                  <div
                    className={`w-20 h-28 sm:w-24 sm:h-32 rounded-[50%_50%_50%_50%/40%_40%_60%_60%] bg-gradient-to-tr ${color.bg} shadow-lg relative flex items-center justify-center`}
                    style={{
                      boxShadow: `0 10px 25px ${color.shadow}, inset -4px -6px 12px rgba(0,0,0,0.15)`,
                    }}
                  >
                    {/* Gloss / Reflection Highlight */}
                    <div className="absolute top-4 left-4 w-4 h-8 rounded-full bg-white/40 blur-[1px] transform -rotate-35" />
                    <span className="text-white/80 text-xl font-bold">✨</span>

                    {/* Knot */}
                    <div
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-2"
                      style={{
                        backgroundColor: color.knot,
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      }}
                    />
                  </div>

                  {/* Balloon String */}
                  <div className="w-[1.5px] h-8 bg-gray-400/60 mx-auto" />
                </motion.div>
              ) : (
                <div className="h-28 flex items-center justify-center text-2xl">
                  <Sparkles className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pop Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="fixed pointer-events-none rounded-full z-50 transition-all duration-700 ease-out"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            transform: `translate(${p.dx}px, ${p.dy}px) scale(0)`,
            opacity: 0,
          }}
        />
      ))}

      {/* Continue Button */}
      <div className="min-h-[60px] flex items-center justify-center">
        {allPopped && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 150 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              sound.playClick();
              onNext();
            }}
            className="px-8 sm:px-10 py-3.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-lg shadow-xl shadow-pink-500/30 flex items-center gap-2 cursor-pointer animate-bounce"
          >
            <span>পরবর্তী ধাপে যান</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
};
