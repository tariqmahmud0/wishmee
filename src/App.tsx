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

  return (
    <div
      className="min-h-screen min-h-[100dvh] w-full flex flex-col justify-between relative overflow-hidden select-none"
      style={{
        background:
          data.gender === 'boy'
            ? 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 50%, #f0fdf4 100%)'
            : 'linear-gradient(135deg, #fff1f2 0%, #fce7f3 50%, #fdf4ff 100%)',
      }}
    >
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
