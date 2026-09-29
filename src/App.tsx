import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BirthdayData, RelationType } from './types';
import { templates } from './data/templates';
import { sound } from './utils/audio';
import { BackgroundSparkles } from './components/BackgroundSparkles';
import { PetalsRain } from './components/PetalsRain';
import { Step0Welcome } from './components/Step0Welcome';
import { Step1Balloons } from './components/Step1Balloons';
import { Step2Cake } from './components/Step2Cake';
import { Step3Bouquet } from './components/Step3Bouquet';
import { Step4Polaroids } from './components/Step4Polaroids';
import { Step5Letter } from './components/Step5Letter';
import { Step6Gift } from './components/Step6Gift';
import { CustomizerModal } from './components/CustomizerModal';
import { Volume2, VolumeX, SlidersHorizontal, RotateCcw, Heart } from 'lucide-react';

const INITIAL_DATA: BirthdayData = {
  name: 'সামিয়া আক্তার জুঁথি',
  senderName: 'তারিক মাহমুদ',
  gender: 'girl',
  relation: 'friend_girl',
  customGreeting: '',
  customLetterText: [],
  customFinalCaption: '',
  memories: [
    {
      id: '1',
      type: 'emoji',
      content: '💌',
      caption: 'আমাদের তেমন কোনো স্মৃতি নেই, সামান্য শব্দ বিনিময় ছাড়া।',
      subcaption: 'তবুও এই দিনটি ভীষণ বিশেষ',
    },
  ],
  themeColor: 'rose',
  musicEnabled: false,
};

export default function App() {
  const [data, setData] = useState<BirthdayData>(() => {
    // Read URL params if shared
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get('name');
      const urlSender = params.get('sender');
      const urlRel = params.get('relation') as RelationType | null;

      if (urlName || urlRel || urlSender) {
        return {
          ...INITIAL_DATA,
          name: urlName || INITIAL_DATA.name,
          senderName: urlSender || INITIAL_DATA.senderName,
          relation: urlRel && templates[urlRel] ? urlRel : INITIAL_DATA.relation,
        };
      }
    }
    return INITIAL_DATA;
  });

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  const activeTemplate = templates[data.relation] || templates.friend_girl;

  // Music toggle handler
  const handleToggleMusic = () => {
    const nextState = !isMusicPlaying;
    setIsMusicPlaying(nextState);
    sound.toggleBirthdayMelody(nextState);
  };

  const handleNextStep = (step?: number) => {
    const next = typeof step === 'number' ? step : currentStep + 1;
    setCurrentStep(next);
  };

  const handleRestart = () => {
    setCurrentStep(0);
  };

  // Step Indicators in Bengali
  const stepTitles = [
    'শুরু',
    'বেলুন',
    'কেক',
    'ফুল',
    'স্মৃতি',
    'চিঠি',
    'উপহার',
  ];

  // Distinct theme gradients per step to add visual depth
  const STEP_GRADIENTS: Record<'girl' | 'boy', string[]> = {
    girl: [
      // 0. Welcome: Romantic blush morning
      'linear-gradient(135deg, #fff1f2 0%, #fce7f3 50%, #fdf4ff 100%)',
      // 1. Balloons: Vibrant coral & warm peach
      'linear-gradient(135deg, #fff7ed 0%, #ffe4e6 45%, #fef3c7 100%)',
      // 2. Cake: Cozy candlelit twilight & golden amber
      'linear-gradient(135deg, #fffbeb 0%, #fef3c7 40%, #fed7aa 100%)',
      // 3. Flowers: Garden romance, peony pink & floral petals
      'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #ffe4e6 100%)',
      // 4. Memories: Golden hour nostalgia & warm sepia glow
      'linear-gradient(135deg, #fff7ed 0%, #fef3c7 45%, #fed7aa 100%)',
      // 5. Letter: Intimate velvet lavender & romantic rose
      'linear-gradient(135deg, #faf5ff 0%, #f5d0fe 40%, #ffe4e6 100%)',
      // 6. Gift: Grand celebratory jubilee, sparkling champagne & prism pink
      'linear-gradient(135deg, #fce7f3 0%, #fed7aa 35%, #fef08a 70%, #f5d0fe 100%)',
    ],
    boy: [
      // 0. Welcome: Fresh morning sky & mint dew
      'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #f0fdf4 100%)',
      // 1. Balloons: Azure skies & electric festival yellow
      'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #fef9c3 100%)',
      // 2. Cake: Warm candle ember & midnight horizon
      'linear-gradient(135deg, #fefce8 0%, #fed7aa 50%, #e0f2fe 100%)',
      // 3. Flowers: Emerald botanical garden & cool mist
      'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #e0f2fe 100%)',
      // 4. Memories: Twilight dusk & nostalgic gold
      'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 45%, #fed7aa 100%)',
      // 5. Letter: Poetic midnight azure & starlight silver
      'linear-gradient(135deg, #f8fafc 0%, #ede9fe 50%, #e0f2fe 100%)',
      // 6. Gift: Royal celebration, sapphire, emerald & celebratory gold
      'linear-gradient(135deg, #e0e7ff 0%, #bae6fd 35%, #fef08a 70%, #dcfce7 100%)',
    ],
  };

  const STEP_ACCENT_GLOWS: Record<'girl' | 'boy', { primary: string; secondary: string }[]> = {
    girl: [
      { primary: 'rgba(244, 63, 94, 0.18)', secondary: 'rgba(236, 72, 153, 0.15)' },
      { primary: 'rgba(251, 146, 60, 0.22)', secondary: 'rgba(244, 63, 94, 0.18)' },
      { primary: 'rgba(245, 158, 11, 0.25)', secondary: 'rgba(251, 191, 36, 0.20)' },
      { primary: 'rgba(244, 63, 94, 0.22)', secondary: 'rgba(217, 70, 239, 0.18)' },
      { primary: 'rgba(234, 179, 8, 0.24)', secondary: 'rgba(249, 115, 22, 0.20)' },
      { primary: 'rgba(168, 85, 247, 0.20)', secondary: 'rgba(244, 63, 94, 0.18)' },
      { primary: 'rgba(234, 179, 8, 0.28)', secondary: 'rgba(244, 63, 94, 0.24)' },
    ],
    boy: [
      { primary: 'rgba(56, 189, 248, 0.18)', secondary: 'rgba(99, 102, 241, 0.15)' },
      { primary: 'rgba(99, 102, 241, 0.22)', secondary: 'rgba(56, 189, 248, 0.18)' },
      { primary: 'rgba(245, 158, 11, 0.22)', secondary: 'rgba(56, 189, 248, 0.20)' },
      { primary: 'rgba(34, 197, 94, 0.22)', secondary: 'rgba(14, 165, 233, 0.18)' },
      { primary: 'rgba(234, 179, 8, 0.24)', secondary: 'rgba(99, 102, 241, 0.18)' },
      { primary: 'rgba(139, 92, 246, 0.20)', secondary: 'rgba(56, 189, 248, 0.18)' },
      { primary: 'rgba(234, 179, 8, 0.28)', secondary: 'rgba(56, 189, 248, 0.24)' },
    ],
  };

  const activeGradients = STEP_GRADIENTS[data.gender] || STEP_GRADIENTS.girl;
  const activeGlows = STEP_ACCENT_GLOWS[data.gender] || STEP_ACCENT_GLOWS.girl;
  const currentGlow = activeGlows[currentStep] || activeGlows[0];

  return (
    <div className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-between relative overflow-hidden select-none">
      {/* Dynamic Smooth Cross-Fading CSS Gradient Layers */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {activeGradients.map((gradient, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              currentStep === idx ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ background: gradient }}
          />
        ))}

        {/* Ambient Depth Atmospheric Lighting Orbs */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            backgroundColor: currentGlow.primary,
            transform: `translate(${currentStep * 18}px, ${currentStep * 12}px) scale(${1 + (currentStep % 3) * 0.1})`,
          }}
        />
        <div
          className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"
          style={{
            backgroundColor: currentGlow.secondary,
            transform: `translate(-${currentStep * 16}px, -${currentStep * 10}px) scale(${1 + (currentStep % 2) * 0.15})`,
          }}
        />
      </div>
      {/* Background Animated Sparkles */}
      <BackgroundSparkles />

      {/* Floating Petals from step 3 onwards */}
      {currentStep >= 3 && <PetalsRain />}

      {/* Navigation & Header Controls */}
      <header className="relative z-30 w-full max-w-4xl mx-auto px-2.5 sm:px-4 py-2 sm:py-3.5 flex items-center justify-between gap-2">
        {/* Step Progress Pills - seamlessly responsive with hidden scrollbar */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1 scroll-smooth max-w-[calc(100%-120px)] sm:max-w-none">
          {stepTitles.map((title, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (idx <= currentStep || currentStep === 6) {
                  sound.playClick();
                  setCurrentStep(idx);
                }
              }}
              disabled={idx > currentStep && currentStep !== 6}
              className={`px-2 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold font-anek transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
                currentStep === idx
                  ? 'bg-rose-500 text-white shadow-md scale-105'
                  : idx < currentStep
                  ? 'bg-white/80 text-rose-600 border border-rose-200 hover:bg-rose-50 cursor-pointer'
                  : 'bg-white/40 text-gray-400 opacity-60'
              }`}
            >
              <span>{title}</span>
              {currentStep === idx && <Heart className="w-2.5 h-2.5 fill-current shrink-0" />}
            </button>
          ))}
        </div>

        {/* Top Control Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Music Toggle */}
          <button
            onClick={handleToggleMusic}
            className={`p-2.5 rounded-full shadow-md backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 ${
              isMusicPlaying
                ? 'bg-rose-500 text-white animate-pulse'
                : 'bg-white/90 text-gray-600 hover:bg-white border border-gray-200'
            }`}
            title={isMusicPlaying ? 'মিউজিক বন্ধ করুন' : 'মিউজিক চালু করুন'}
          >
            {isMusicPlaying ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="text-xs font-bold font-anek hidden sm:inline">মিউজিক চালু</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="text-xs font-medium font-anek hidden sm:inline">মিউজিক</span>
              </>
            )}
          </button>

          {/* Customizer Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsCustomizerOpen(true);
            }}
            className="p-2.5 rounded-full bg-white/90 text-gray-700 shadow-md hover:bg-white border border-gray-200 transition-all cursor-pointer flex items-center gap-1.5"
            title="কাস্টমাইজ করুন"
          >
            <SlidersHorizontal className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold font-anek hidden md:inline">সাজিয়ে নিন</span>
          </button>

          {/* Reset / Restart */}
          {currentStep > 0 && (
            <button
              onClick={() => {
                sound.playClick();
                handleRestart();
              }}
              className="p-2.5 rounded-full bg-white/80 text-gray-600 shadow-md hover:bg-white border border-gray-200 transition-all cursor-pointer"
              title="পুনরায় শুরু করুন"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </header>

      {/* Main Interactive Stage */}
      <main className="relative z-20 flex-1 flex items-center justify-center w-full px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full"
          >
            {currentStep === 0 && (
              <Step0Welcome
                data={data}
                template={activeTemplate}
                onNext={() => handleNextStep(1)}
              />
            )}

            {currentStep === 1 && (
              <Step1Balloons
                template={activeTemplate}
                onNext={() => handleNextStep(2)}
              />
            )}

            {currentStep === 2 && (
              <Step2Cake
                data={data}
                template={activeTemplate}
                onNext={() => handleNextStep(3)}
              />
            )}

            {currentStep === 3 && (
              <Step3Bouquet
                template={activeTemplate}
                onNext={() => handleNextStep(4)}
              />
            )}

            {currentStep === 4 && (
              <Step4Polaroids
                data={data}
                template={activeTemplate}
                onNext={() => handleNextStep(5)}
              />
            )}

            {currentStep === 5 && (
              <Step5Letter
                data={data}
                template={activeTemplate}
                onNext={() => handleNextStep(6)}
              />
            )}

            {currentStep === 6 && (
              <Step6Gift
                data={data}
                template={activeTemplate}
                onRestart={handleRestart}
                onOpenCustomizer={() => setIsCustomizerOpen(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="relative z-20 py-2 sm:py-3 text-center text-xs text-gray-500 font-medium font-anek">
        <p className="flex items-center justify-center gap-1.5 opacity-80">
          <span>হৃদয়ের গভীর থেকে বিশেষ শুভেচ্ছা</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" />
          <span>{data.name}</span>
        </p>
      </footer>

      {/* Customizer Drawer / Modal */}
      <CustomizerModal
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        data={data}
        onSave={(newData) => setData(newData)}
      />
    </div>
  );
}
