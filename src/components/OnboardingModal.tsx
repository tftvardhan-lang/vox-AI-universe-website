import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from './AppLogo';
import { Sparkles, ArrowRight, Check, Compass, Wand2, X } from 'lucide-react';

const SLIDES = [
  {
    title: 'Stop Guessing AI Models',
    subtitle: 'Start with what you want to create',
    desc: 'Instead of wondering whether to use Claude, Veo, Midjourney, or DeepSeek, simply describe your creative or technical goal.',
    icon: Compass,
    accent: 'from-[#7C4DFF] to-[#3B82F6]'
  },
  {
    title: 'Smart Task Match Score',
    subtitle: 'Capabilities matched to requirements',
    desc: 'We score models based on task modality, context demands, generation quality, latency, and cost efficiency.',
    icon: Sparkles,
    accent: 'from-[#EC4899] to-[#8B5CF6]'
  },
  {
    title: 'Instant Prompt Optimizer',
    subtitle: 'Ready to copy and run',
    desc: 'Every recommendation includes a custom-engineered prompt tailored specifically to that model’s architecture and strengths.',
    icon: Wand2,
    accent: 'from-[#3B82F6] to-[#10B981]'
  }
];

export const OnboardingModal: React.FC = () => {
  const { showOnboarding, setShowOnboarding } = useApp();
  const [slideIndex, setSlideIndex] = useState(0);

  if (!showOnboarding) return null;

  const currentSlide = SLIDES[slideIndex];
  const Icon = currentSlide.icon;

  const handleNext = () => {
    if (slideIndex < SLIDES.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else {
      setShowOnboarding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#181B22] border border-[#2e3444] rounded-3xl p-6 shadow-2xl relative flex flex-col items-center text-center animate-scale-up">
        {/* Close Button */}
        <button
          onClick={() => setShowOnboarding(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon Sphere / Official App Logo */}
        {slideIndex === 0 ? (
          <div className="mb-5 relative group">
            <AppLogo size={70} withGlow className="shadow-2xl shadow-orange-500/30 ring-2 ring-orange-500/40" />
          </div>
        ) : (
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${currentSlide.accent} flex items-center justify-center shadow-lg shadow-[#7C4DFF]/30 mb-5`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
        )}

        {/* Step Indicator */}
        <div className="flex gap-1.5 mb-4">
          {SLIDES.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === slideIndex ? 'w-6 bg-[#7C4DFF]' : 'w-2 bg-zinc-700'
              }`}
            />
          ))}
        </div>

        <h3 className="text-lg font-black text-white tracking-tight mb-1">
          {currentSlide.title}
        </h3>
        <p className="text-xs font-semibold text-[#7C4DFF] mb-3">
          {currentSlide.subtitle}
        </p>
        <p className="text-xs text-zinc-400 leading-relaxed mb-6">
          {currentSlide.desc}
        </p>

        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#7C4DFF]/30 active:scale-95 transition-all"
        >
          <span>{slideIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
