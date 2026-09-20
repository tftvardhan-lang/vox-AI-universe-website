import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from './AppLogo';
import { 
  Sparkles, 
  ArrowRight, 
  Film, 
  Image as ImageIcon, 
  Code, 
  PenTool, 
  Search, 
  Music, 
  HelpCircle,
  TrendingUp,
  LayoutGrid,
  Check,
  AlertCircle,
  Crown,
  Lock
} from 'lucide-react';

const QUICK_CATEGORIES = [
  { id: 'video', label: 'Video', icon: Film, emoji: '🎬', prompt: 'Create a cinematic Hollywood sci-fi action scene with anamorphic lens flare' },
  { id: 'image', label: 'Image', icon: ImageIcon, emoji: '🖼', prompt: 'Generate a realistic studio product image of a matte obsidian perfume bottle' },
  { id: 'coding', label: 'Coding', icon: Code, emoji: '💻', prompt: 'Write Python code for a high-frequency trading dashboard with WebSocket streams' },
  { id: 'writing', label: 'Writing', icon: PenTool, emoji: '✍️', prompt: 'Write a high-stakes executive email negotiating a contract renewal' },
  { id: 'research', label: 'Research', icon: Search, emoji: '🔎', prompt: 'Research the latest multi-modal AI reasoning benchmarks and summarize trends' },
  { id: 'audio', label: 'Audio', icon: Music, emoji: '🎵', prompt: 'Compose a cinematic cyberpunk synthwave track with heavy sub-bass and retro arps' },
];

const POPULAR_TASKS = [
  { label: 'Cinematic Hollywood scene', full: 'Create a cinematic Hollywood action scene with 35mm anamorphic camera motion', tag: 'Video' },
  { label: 'Python trading dashboard', full: 'Write Python code for a trading dashboard with WebSocket orderbook', tag: 'Coding' },
  { label: 'Realistic product shoot', full: 'Generate a realistic product image of a minimalist luxury watch on slate stone', tag: 'Image' },
  { label: 'Analyze 100-page PDF', full: 'Analyze this 100-page financial PDF report and summarize revenue growth variances', tag: 'Research' },
  { label: 'High-CTR YouTube thumbnail', full: 'Create an ultra-high CTR YouTube thumbnail with shocked expression and bold 3D text', tag: 'Thumbnail' },
  { label: 'Executive negotiation email', full: 'Write a professional email negotiating a vendor agreement with legal protections', tag: 'Writing' },
  { label: '10-minute continuous video', full: 'Generate a 10-minute high-definition nature video with camera flyovers', tag: 'Video' },
  { label: 'Latest AI benchmark research', full: 'Research the latest AI reasoning models and benchmark scores with primary citations', tag: 'Research' },
  { label: 'Startup pitch presentation', full: 'Create a 10-slide enterprise SaaS pitch deck outline with market sizing', tag: 'Presentation' },
  { label: 'Photo to cinematic video', full: 'Turn this static portrait image into a luxury 3D camera pan commercial video', tag: 'Video' }
];

export const HomeScreen: React.FC = () => {
  const { 
    currentPrompt, 
    setCurrentPrompt, 
    runMatch, 
    isAnalyzing, 
    categories, 
    entitlements, 
    openPricingModal,
    showToast 
  } = useApp();
  
  const [inputVal, setInputVal] = useState(currentPrompt);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [clarificationQuestion, setClarificationQuestion] = useState<string | null>(null);

  const isFreeExhausted = !entitlements.isPaid && entitlements.freeSearchesUsed >= entitlements.freeSearchLimit;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = inputVal.trim();
    if (!clean) {
      showToast('Please describe what you want to create.');
      return;
    }

    if (isFreeExhausted) {
      openPricingModal("You've used your 2 free searches. Upgrade to continue using MODEL MATCH AI.");
      return;
    }

    // Check for extreme vagueness to provide proactive clarification prompt
    if (clean.length < 5 || ['code', 'video', 'image', 'ai', 'write'].includes(clean.toLowerCase())) {
      setClarificationQuestion(`Tell us a little more about your ${clean} project: What specific format or language do you need?`);
      return;
    }

    setClarificationQuestion(null);
    runMatch(clean);
  };

  const handleSelectPopular = (taskPrompt: string) => {
    setInputVal(taskPrompt);
    if (isFreeExhausted) {
      openPricingModal("You've used your 2 free searches. Upgrade to continue using MODEL MATCH AI.");
      return;
    }
    runMatch(taskPrompt);
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-8 space-y-5">
      {/* Hero Header */}
      <div className="text-center pt-2 pb-1 flex flex-col items-center">
        {/* App Logo Emblem - Centered Hero Focus */}
        <div className="mb-3 relative group cursor-pointer hover:scale-105 transition-transform">
          <AppLogo size={68} withGlow className="shadow-2xl shadow-orange-500/25 ring-2 ring-orange-500/35" />
        </div>

        {/* Brand Name with Orange Accent */}
        <h1 className="text-3xl font-black tracking-tight text-white mb-1.5 font-mono">
          MODEL MATCH <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-[#7C4DFF]">AI</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xs mx-auto mb-3">
          Find the right AI model for every task.
        </p>

        {/* Entitlement & Search Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181B22] border border-[#262B36] text-[11px] font-medium">
          {entitlements.isPaid ? (
            <>
              <Crown className="w-3 h-3 text-amber-400" />
              <span className="text-zinc-200 font-bold uppercase">{entitlements.plan}</span>
              <span className="text-emerald-400">• Unlimited Searches</span>
            </>
          ) : (
            <>
              <span className={`w-2 h-2 rounded-full ${isFreeExhausted ? 'bg-rose-500' : 'bg-emerald-400 animate-pulse'}`} />
              <span className="text-zinc-300">
                Free searches: {entitlements.freeSearchesUsed} of {entitlements.freeSearchLimit} used
              </span>
              {!isFreeExhausted && (
                <span className="text-orange-400 font-semibold">({entitlements.remainingSearches} left)</span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Free Limit Exhausted Callout Banner */}
      {isFreeExhausted && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#241724] to-[#181a24] border border-rose-500/40 text-xs shadow-xl space-y-2.5 animate-slide-down">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white text-sm">
                You've used your 2 free searches.
              </div>
              <p className="text-zinc-300 text-xs mt-0.5 leading-relaxed">
                Upgrade to continue using MODEL MATCH AI.
              </p>
            </div>
          </div>

          <button
            onClick={() => openPricingModal("You've used your 2 free searches. Upgrade to continue using MODEL MATCH AI.")}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] hover:opacity-95 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-[#7C4DFF]/25 cursor-pointer"
          >
            <span>Upgrade Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Central Input Box */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="bg-[#181B22] border border-[#262B36] rounded-2xl p-4 shadow-xl focus-within:border-[#7C4DFF] focus-within:shadow-[0_0_25px_rgba(124,77,255,0.2)] transition-all">
          <label htmlFor="task-input" className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
            What do you want to create?
          </label>
          <textarea
            id="task-input"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            rows={3}
            placeholder="Describe what you want to do… (e.g. 'Create a cinematic Hollywood sci-fi action scene' or 'Write Python code for a trading dashboard')"
            className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 resize-none focus:outline-none leading-relaxed"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                handleSubmit();
              }
            }}
          />

          {/* Quick Submit Bar */}
          <div className="pt-2 flex items-center justify-between border-t border-[#262B36] mt-2">
            <span className="text-[10px] text-zinc-500">
              Press ⌘+Enter or click
            </span>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="flex items-center gap-2 bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] hover:opacity-95 active:scale-95 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-[#7C4DFF]/30 cursor-pointer"
            >
              {isFreeExhausted ? (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Upgrade to Match</span>
                </>
              ) : (
                <>
                  <span>Find My Best Model</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Proactive Clarification Prompt if text was too vague */}
        {clarificationQuestion && (
          <div className="mt-3 p-3.5 rounded-xl bg-[#20232B] border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5 animate-fade-in">
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1.5 flex-1">
              <div className="font-semibold text-white">Tell us a little more:</div>
              <p className="text-zinc-300">{clarificationQuestion}</p>
              <div className="flex gap-2 pt-1 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    setInputVal(prev => `${prev} in high quality 1080p`);
                    setClarificationQuestion(null);
                  }}
                  className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] hover:text-white border border-zinc-700"
                >
                  + Add 1080p Video
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputVal(prev => `${prev} in production Python 3.12 with clean typing`);
                    setClarificationQuestion(null);
                  }}
                  className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] hover:text-white border border-zinc-700"
                >
                  + Add Python Code
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputVal(prev => `${prev} as a photorealistic Hasselblad image`);
                    setClarificationQuestion(null);
                  }}
                  className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] hover:text-white border border-zinc-700"
                >
                  + Add Photorealism
                </button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Quick Categories Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Quick Categories
          </span>
          <button
            onClick={() => setShowAllCategories(!showAllCategories)}
            className="text-[11px] text-[#7C4DFF] hover:underline flex items-center gap-1 font-medium"
          >
            <LayoutGrid className="w-3 h-3" />
            <span>{showAllCategories ? 'Collapse' : 'All 18 Categories'}</span>
          </button>
        </div>

        {/* 6 Quick Category Cards */}
        <div className="grid grid-cols-3 gap-2.5">
          {QUICK_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setInputVal(cat.prompt);
                  if (isFreeExhausted) {
                    openPricingModal("You've used your 2 free searches. Upgrade to continue using MODEL MATCH AI.");
                    return;
                  }
                  runMatch(cat.prompt);
                }}
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#181B22] border border-[#262B36] hover:border-[#7C4DFF]/50 hover:bg-[#20232B] transition-all group active:scale-95 text-center cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-zinc-800/80 flex items-center justify-center text-lg mb-1.5 group-hover:scale-110 transition-transform">
                  <span>{cat.emoji}</span>
                </div>
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-white">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expanded 18 Task Categories Drawer */}
        {showAllCategories && (
          <div className="mt-3 p-3.5 rounded-2xl bg-[#181B22] border border-[#262B36] space-y-2 animate-fade-in">
            <div className="text-[11px] font-semibold text-zinc-400 mb-2">
              All 18 Specialized Task Modalities:
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto no-scrollbar pr-1">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    const sample = c.samplePrompts[0] || `Help me with ${c.name}`;
                    setInputVal(sample);
                    if (isFreeExhausted) {
                      openPricingModal("You've used your 2 free searches. Upgrade to continue using MODEL MATCH AI.");
                      return;
                    }
                    runMatch(sample);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#20232B] hover:bg-[#7C4DFF]/20 border border-zinc-700/80 hover:border-[#7C4DFF]/50 text-[11px] text-zinc-300 hover:text-white transition-colors text-left"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Popular Tasks Section */}
      <div>
        <div className="flex items-center gap-1.5 mb-3 px-1 text-zinc-300">
          <TrendingUp className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Popular Tasks
          </span>
        </div>

        <div className="space-y-2">
          {POPULAR_TASKS.map((t, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPopular(t.full)}
              className="w-full text-left p-3 rounded-xl bg-[#181B22] border border-[#262B36] hover:border-[#3B82F6]/50 hover:bg-[#20232B] transition-all flex items-center justify-between group active:scale-[0.99] cursor-pointer"
            >
              <div className="pr-2">
                <div className="text-xs font-medium text-zinc-200 group-hover:text-white line-clamp-1">
                  "{t.label}"
                </div>
                <div className="text-[10px] text-zinc-500 line-clamp-1 mt-0.5">
                  {t.full}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 group-hover:text-zinc-200 border border-zinc-700">
                  {t.tag}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-[#7C4DFF] group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
