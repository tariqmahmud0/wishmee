import React, { useState } from 'react';
import { sound } from '../utils/audio';
import { BirthdayData, RelationTemplate } from '../types';
import { Gift, Heart } from 'lucide-react';

interface Step5Props {
  data: BirthdayData;
  template: RelationTemplate;
  onNext: () => void;
}

export const Step5Letter: React.FC<Step5Props> = ({ data, template, onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReadMode, setIsReadMode] = useState(false);

  const paragraphs =
    data.customLetterText && data.customLetterText.length > 0
      ? data.customLetterText
      : template.letter;

  const greeting = data.customGreeting || template.greeting;

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    sound.playClick();
    setIsOpen(true);

    // After flap flips and letter slides up, transition envelope to read mode
    setTimeout(() => {
      sound.playSparkle();
      setIsReadMode(true);
    }, 900);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto py-4 min-h-[460px] relative">
      {/* Title */}
      <div
        className={`mb-8 sm:mb-12 transition-opacity duration-700 ${
          isReadMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <h2 className="text-3xl sm:text-5xl font-extrabold text-rose-600 mb-1 font-anek">
          {template.envelopeTitle}
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          (খামটিতে স্পর্শ করে চিঠিটি উন্মুক্ত করো)
        </p>
      </div>

      {/* Interactive Envelope with smooth 3D CSS classes */}
      <div
        className={`envelope-container ${isOpen ? 'open' : ''} ${isReadMode ? 'read-mode' : ''}`}
        onClick={handleOpenEnvelope}
      >
        {/* Envelope Flap (Triangle on top) */}
        <div className="envelope-flap" />

        {/* Envelope Pocket Body */}
        <div className="envelope-body" />

        {/* Tap to open indicator pill */}
        {!isOpen && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full shadow-lg border border-amber-200 pointer-events-none flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500 fill-current animate-pulse" />
            <span className="text-gray-800 font-semibold text-sm sm:text-base font-anek">
              {template.envelopeTapText}
            </span>
          </div>
        )}

        {/* The Letter Paper */}
        <div className="letter-content" onClick={(e) => isReadMode && e.stopPropagation()}>
          {/* Greeting */}
          <h3 className="font-galada text-3xl sm:text-4xl text-rose-600 mb-3 shrink-0">
            {greeting}
          </h3>

          {/* Body paragraphs */}
          <div className="w-full flex-grow overflow-y-auto no-scrollbar mb-4 px-2 sm:px-4 space-y-3 text-left">
            {paragraphs.map((p, idx) => (
              <p
                key={idx}
                className="text-gray-700 text-sm sm:text-base font-serif-bn leading-relaxed indent-3"
              >
                {p}
              </p>
            ))}

            {/* Sender Signature Section */}
            <div className="pt-3 pb-1 border-t border-rose-100/80 mt-4 text-right">
              <span className="text-xs sm:text-sm text-gray-500 block font-anek font-medium">
                শুভেচ্ছান্তে ও আন্তরিক দোয়ায়,
              </span>
              <span className="font-galada text-2xl sm:text-3xl text-rose-600 block mt-0.5 tracking-wide">
                — {data.senderName || 'তারিক মাহমুদ'}
              </span>
            </div>
          </div>

          {/* Action button inside letter */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              sound.playClick();
              onNext();
            }}
            className="shrink-0 px-8 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold text-sm sm:text-base shadow-lg shadow-pink-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer w-auto mx-auto"
          >
            <span>সবশেষে একটি গোপন উপহার...</span>
            <Gift className="w-4 h-4 text-yellow-200" />
          </button>
        </div>
      </div>
    </div>
  );
};
