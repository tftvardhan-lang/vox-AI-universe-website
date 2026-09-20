import React from 'react';
import { Sparkles, CheckCircle2, Cpu, Compass, Layers, Zap } from 'lucide-react';

interface LoadingScreenProps {
  step: number; // 0 to 5
  taskPrompt: string;
}

const STEPS = [
  { label: 'Analyzing your task…', icon: Compass, desc: 'Parsing prompt semantics and intent' },
  { label: 'Understanding requirements', icon: Layers, desc: 'Detecting modalities, format, and complexity' },
  { label: 'Matching capabilities', icon: Cpu, desc: 'Evaluating 15+ verified frontier models' },
  { label: 'Comparing models', icon: CheckCircle2, desc: 'Ranking benchmark scores and cost trade-offs' },
  { label: 'Optimizing your prompt', icon: Sparkles, desc: 'Crafting tailored model-specific directives' },
  { label: 'Your best AI match is ready.', icon: Zap, desc: 'Preparing detailed recommendation dossier' }
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ step, taskPrompt }) => {
  const currentStep = Math.min(step, STEPS.length - 1);
  const CurrentIcon = STEPS[currentStep].icon;
  const progressPercent = Math.min(100, Math.round(((step + 1) / STEPS.length) * 100));

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center animate-fade-in">
      {/* Central Pulsing Sphere */}
      <div className="relative mb-8">
        {/* Ambient Ring Glow */}
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] opacity-30 blur-xl animate-pulse" />
        
        {/* Outer Rotating Border */}
        <div className="w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-[#7C4DFF] via-[#3B82F6] to-transparent animate-spin" style={{ animationDuration: '4s' }}>
          <div className="w-full h-full rounded-full bg-[#111318] flex items-center justify-center">
            <CurrentIcon className="w-10 h-10 text-[#7C4DFF] animate-pulse" />
          </div>
        </div>

        {/* Floating Mini Badge */}
        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
          {progressPercent}%
        </div>
      </div>

      {/* Main Animated Title */}
      <h2 className="text-xl font-bold text-white mb-2 tracking-tight transition-all duration-300">
        {STEPS[currentStep].label}
      </h2>
      <p className="text-xs text-zinc-400 mb-6 max-w-xs transition-opacity duration-300">
        {STEPS[currentStep].desc}
      </p>

      {/* Glowing Progress Track */}
      <div className="w-full max-w-xs bg-[#20232B] h-2 rounded-full overflow-hidden mb-8 border border-white/5">
        <div 
          className="h-full bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(124,77,255,0.6)]"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Task Snippet Card */}
      <div className="w-full max-w-xs bg-[#181B22] border border-[#262B36] rounded-2xl p-3.5 text-left mb-6">
        <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1">
          Analyzed Task
        </div>
        <div className="text-xs text-zinc-200 line-clamp-2 italic">
          "{taskPrompt}"
        </div>
      </div>

      {/* Checklist Preview */}
      <div className="w-full max-w-xs space-y-2">
        {STEPS.slice(0, 5).map((s, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <div 
              key={index}
              className={`flex items-center gap-2.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
                isCurrent 
                  ? 'bg-[#7C4DFF]/10 text-white font-medium border border-[#7C4DFF]/30' 
                  : isDone 
                    ? 'text-zinc-400 opacity-80' 
                    : 'text-zinc-600'
              }`}
            >
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                isDone 
                  ? 'bg-emerald-500/20 text-emerald-400' 
                  : isCurrent 
                    ? 'bg-[#7C4DFF] text-white animate-pulse' 
                    : 'bg-zinc-800 text-zinc-600'
              }`}>
                {isDone ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
              </div>
              <span className="truncate">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
