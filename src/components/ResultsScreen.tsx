import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Wand2, 
  Bookmark, 
  GitCompare, 
  ArrowLeft, 
  ShieldCheck, 
  Gauge, 
  DollarSign, 
  Zap,
  ChevronRight,
  AlertTriangle,
  Info,
  Clock
} from 'lucide-react';
import { ImprovePromptModal } from './ImprovePromptModal';

export const ResultsScreen: React.FC = () => {
  const { 
    currentResult, 
    setCurrentResult, 
    setActiveTab, 
    setComparedModelIds, 
    savePrompt, 
    showToast 
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [isImproveModalOpen, setIsImproveModalOpen] = useState(false);
  const [activeOptimizedPrompt, setActiveOptimizedPrompt] = useState(
    currentResult?.optimizedPrompt || ''
  );

  if (!currentResult) return null;

  const { bestModel, alternatives, originalPrompt, bestMatchScore, whyRecommended, bestAt, tradeOffs } = currentResult;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeOptimizedPrompt);
    setCopied(true);
    showToast('Optimized prompt copied to clipboard!');
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSaveToLibrary = () => {
    savePrompt({
      title: `${bestModel.name} - ${originalPrompt.slice(0, 30)}...`,
      originalText: originalPrompt,
      optimizedText: activeOptimizedPrompt,
      modelId: bestModel.id,
      modelName: bestModel.name,
      category: currentResult.detectedCategory,
      folder: bestModel.category === 'AI Video' ? 'Video & VFX' : bestModel.category === 'Coding' ? 'Coding & Tech' : 'General',
      isFavorite: false
    });
  };

  const handleCompareWithAlternatives = () => {
    const ids = [bestModel.id, ...alternatives.slice(0, 2).map(a => a.model.id)];
    setComparedModelIds(ids);
    setActiveTab('compare');
  };

  const handleSwitchToAlternative = (altModel: typeof bestModel, altScore: number) => {
    // Dynamically re-target the match screen to this alternative model
    setCurrentResult({
      ...currentResult,
      bestModel: altModel,
      bestMatchScore: altScore,
      whyRecommended: `Switched to ${altModel.name}. ${altModel.description}`,
      bestAt: altModel.strengths.slice(0, 4),
      tradeOffs: altModel.weaknesses.slice(0, 3)
    });
    showToast(`View updated for ${altModel.name}`);
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-10 space-y-5 animate-fade-in">
      {/* Top Breadcrumb & Try Another Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentResult(null)}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium py-1 px-2 rounded-lg hover:bg-zinc-800/60 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>New Search</span>
        </button>

        <span className="text-[11px] font-semibold tracking-wider uppercase text-zinc-400">
          Your AI Match
        </span>
      </div>

      {/* Weak Match Warning if applicable */}
      {currentResult.isWeakMatch && (
        <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-white">We couldn't find a strong match</div>
            <p className="text-zinc-300 text-[11px] mt-0.5">
              {currentResult.weakMatchReason || 'Closest candidate shown below. Try adding specific output format details.'}
            </p>
          </div>
        </div>
      )}

      {/* Hero Recommendation Card */}
      <div className="relative rounded-3xl bg-[#181B22] border border-[#2e3444] p-5 shadow-2xl overflow-hidden">
        {/* Subtle Purple-to-Blue Ambient Accent */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-gradient-to-br from-[#7C4DFF]/20 to-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10" />

        {/* Badge Header */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md shadow-[#7C4DFF]/30">
            <Sparkles className="w-3 h-3" />
            <span>BEST MATCH</span>
          </div>

          {/* Task Match Score Badge */}
          <div className="text-right">
            <div className="text-lg font-black text-white font-mono leading-none">
              {bestMatchScore}%
            </div>
            <div className="text-[9px] text-zinc-400 font-medium">
              Task Match Score
            </div>
          </div>
        </div>

        {/* Model Title & Provider */}
        <div className="mb-4">
          <h2 className="text-2xl font-black text-white tracking-tight">
            {bestModel.name}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-[#7C4DFF] font-semibold">
              {bestModel.provider}
            </span>
            <span className="text-zinc-600">•</span>
            <span className="text-xs text-zinc-400 font-medium">
              {bestModel.category}
            </span>
            {bestModel.badge && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="text-[10px] text-zinc-300 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                  {bestModel.badge}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Metrics Grid: Quality, Speed, Cost, Last Verified */}
        <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#111318] border border-[#20232B] mb-4 text-center">
          <div>
            <div className="text-[10px] text-zinc-400 font-medium flex items-center justify-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Speed</span>
            </div>
            <div className="text-xs font-bold text-white mt-0.5">
              {bestModel.speedRating}/5 Rating
            </div>
          </div>

          <div className="border-x border-[#20232B]">
            <div className="text-[10px] text-zinc-400 font-medium flex items-center justify-center gap-1">
              <Gauge className="w-3 h-3 text-blue-400" />
              <span>Quality</span>
            </div>
            <div className="text-xs font-bold text-white mt-0.5">
              {bestModel.qualityRating}/5 Star
            </div>
          </div>

          <div>
            <div className="text-[10px] text-zinc-400 font-medium flex items-center justify-center gap-1">
              <DollarSign className="w-3 h-3 text-emerald-400" />
              <span>Cost</span>
            </div>
            <div className="text-xs font-bold text-white mt-0.5">
              {bestModel.costCategory}
            </div>
          </div>
        </div>

        {/* Why this model? */}
        <div className="space-y-1.5 mb-4">
          <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#7C4DFF]" />
            <span>Why this model?</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed bg-[#111318]/60 p-3 rounded-xl border border-white/5">
            {whyRecommended}
          </p>
        </div>

        {/* Strengths (Best at) */}
        <div className="space-y-1.5 mb-4">
          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Best at</span>
          </div>
          <div className="space-y-1">
            {bestAt.map((strength, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trade-offs (Limitations) */}
        <div className="space-y-1.5 mb-4">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Trade-offs & Limitations</span>
          </div>
          <div className="space-y-1">
            {tradeOffs.map((to, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80 mt-1.5 shrink-0" />
                <span>{to}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Benchmark & Verification Bar */}
        <div className="pt-3 border-t border-[#262B36] flex items-center justify-between text-[10px] text-zinc-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span>Last verified: {bestModel.lastUpdatedDate}</span>
          </div>
          {bestModel.benchmarkScore && (
            <div className="text-right">
              <span className="text-zinc-400">Benchmark: </span>
              <span className="text-zinc-200 font-semibold">{bestModel.benchmarkScore.value}</span>
            </div>
          )}
        </div>
      </div>

      {/* Alternative Models Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
            Alternative Models
          </span>
          <span className="text-[10px] text-zinc-400">
            Click to switch preview
          </span>
        </div>

        <div className="space-y-2">
          {alternatives.map((alt, idx) => (
            <div
              key={alt.model.id}
              onClick={() => handleSwitchToAlternative(alt.model, alt.matchScore)}
              className="p-3.5 rounded-2xl bg-[#181B22] border border-[#262B36] hover:border-[#7C4DFF]/40 transition-all flex items-center justify-between group cursor-pointer active:scale-[0.99]"
            >
              <div className="pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-[#7C4DFF] transition-colors">
                    {idx + 1}. {alt.model.name}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {alt.matchScore}%
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                  {alt.differentiator}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Prompt Optimizer Section */}
      <div className="rounded-3xl bg-[#181B22] border border-[#262B36] p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs font-extrabold text-white tracking-wider uppercase font-mono">
              Prompt Optimizer
            </span>
          </div>
          <span className="text-[10px] text-[#7C4DFF] font-semibold bg-[#7C4DFF]/10 px-2 py-0.5 rounded-full border border-[#7C4DFF]/30">
            Tuned for {bestModel.name}
          </span>
        </div>

        {/* Original Prompt */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
            YOUR ORIGINAL PROMPT
          </div>
          <div className="text-xs text-zinc-300 bg-[#111318] p-3 rounded-xl border border-[#20232B] italic">
            "{originalPrompt}"
          </div>
        </div>

        {/* Optimized Prompt Display */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              OPTIMIZED PROMPT
            </span>
            <span className="text-[9px] text-zinc-400">
              Ready to copy & run
            </span>
          </div>
          <div className="relative rounded-2xl bg-[#111318] border border-[#2e3444] p-3.5 text-xs text-zinc-200 font-mono leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto no-scrollbar selection:bg-[#7C4DFF]/40">
            {activeOptimizedPrompt}
          </div>
        </div>

        {/* Explanation */}
        <div className="text-[11px] text-zinc-400 leading-snug">
          {currentResult.promptOptimizationExplanation}
        </div>

        {/* Prominent Action Bar */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleCopy}
            className={`py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
              copied
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white shadow-[#7C4DFF]/30 hover:opacity-95'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED!' : 'COPY PROMPT'}</span>
          </button>

          <button
            onClick={() => setIsImproveModalOpen(true)}
            className="py-3 px-4 rounded-xl font-semibold text-xs bg-[#20232B] hover:bg-[#282d38] border border-zinc-700 text-zinc-200 hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#7C4DFF]" />
            <span>IMPROVE PROMPT</span>
          </button>
        </div>

        {/* Secondary Save & Compare Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#262B36]">
          <button
            onClick={handleSaveToLibrary}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-medium py-1 px-2 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-[#3B82F6]" />
            <span>Save to Library</span>
          </button>

          <button
            onClick={handleCompareWithAlternatives}
            className="flex items-center gap-1.5 text-xs text-[#7C4DFF] hover:text-[#9d78ff] font-semibold py-1 px-2 rounded-lg hover:bg-[#7C4DFF]/10 transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Models</span>
          </button>
        </div>
      </div>

      {/* Improve Prompt Modal */}
      <ImprovePromptModal
        isOpen={isImproveModalOpen}
        onClose={() => setIsImproveModalOpen(false)}
        originalOptimizedPrompt={activeOptimizedPrompt}
        model={bestModel}
        onApplyImprovedPrompt={(newPrompt) => {
          setActiveOptimizedPrompt(newPrompt);
          showToast('Improved prompt applied!');
        }}
      />
    </div>
  );
};
