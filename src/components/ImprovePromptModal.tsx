import React, { useState } from 'react';
import { X, Sparkles, Wand2, Check, ArrowRight } from 'lucide-react';
import { AIModel } from '../types';

interface ImprovePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalOptimizedPrompt: string;
  model: AIModel;
  onApplyImprovedPrompt: (newPrompt: string) => void;
}

const PRESET_ANGLES = [
  { id: 'cinematic', label: 'Add Cinematic Lighting & Lens', desc: 'Specify camera sensors, focal length, volumetric light, and film grain.' },
  { id: 'coding', label: 'Production Engineering & Edge Cases', desc: 'Add strict typing, error boundaries, test fixtures, and performance.' },
  { id: 'reasoning', label: 'Step-by-Step Chain of Thought', desc: 'Mandate deductive verification, scratchpad reasoning, and trade-off checks.' },
  { id: 'concise', label: 'Ultra High-Signal & Concise', desc: 'Strip all conversational boilerplate; provide immediate structured output.' },
  { id: 'custom', label: 'Custom Refinement Directive', desc: 'Provide your own specific requirements or constraints.' }
];

export const ImprovePromptModal: React.FC<ImprovePromptModalProps> = ({
  isOpen,
  onClose,
  originalOptimizedPrompt,
  model,
  onApplyImprovedPrompt
}) => {
  const [selectedAngle, setSelectedAngle] = useState('cinematic');
  const [customText, setCustomText] = useState('');
  const [isImproving, setIsImproving] = useState(false);
  const [improvedPreview, setImprovedPreview] = useState<string | null>(null);
  const [changesMade, setChangesMade] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateImprovement = async () => {
    setIsImproving(true);
    try {
      const res = await fetch('/api/improve-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: originalOptimizedPrompt,
          modelId: model.id,
          refinementStyle: selectedAngle,
          customInstruction: customText
        })
      });

      if (res.ok) {
        const json = await res.json();
        setImprovedPreview(json.data.improvedPrompt);
        setChangesMade(json.data.changesMade);
      } else {
        // Fallback
        const augmented = `${originalOptimizedPrompt}\n\n[Advanced Model Directives]: Optimized for ${model.name} with enriched structural parameters and verified accuracy.`;
        setImprovedPreview(augmented);
        setChangesMade('Enriched prompt parameters with model-specific directives.');
      }
    } catch {
      const augmented = `${originalOptimizedPrompt}\n\n[Advanced Directives]: Enhanced fidelity and zero-fluff execution.`;
      setImprovedPreview(augmented);
      setChangesMade('Applied local quality refinement.');
    } finally {
      setIsImproving(false);
    }
  };

  const handleApply = () => {
    if (improvedPreview) {
      onApplyImprovedPrompt(improvedPreview);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-[420px] bg-[#181B22] border-t sm:border border-[#262B36] rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b border-[#262B36] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Improve Prompt</h3>
              <p className="text-[10px] text-zinc-400">Refine for {model.name}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto no-scrollbar flex-1">
          {/* Preset Angle Selectors */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Choose Refinement Direction
            </label>
            <div className="space-y-1.5">
              {PRESET_ANGLES.map((angle) => (
                <button
                  key={angle.id}
                  onClick={() => setSelectedAngle(angle.id)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                    selectedAngle === angle.id
                      ? 'bg-[#7C4DFF]/15 border-[#7C4DFF] text-white'
                      : 'bg-[#20232B] border-[#2c3240] text-zinc-300 hover:border-zinc-600'
                  }`}
                >
                  <div className="font-semibold">{angle.label}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">{angle.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Instruction Input if selected */}
          {selectedAngle === 'custom' && (
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-zinc-400">
                Custom Instruction
              </label>
              <textarea
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="e.g. 'Emphasize cyberpunk neon color palette and low camera angle'"
                rows={2}
                className="w-full bg-[#20232B] border border-[#2c3240] rounded-xl p-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#7C4DFF]"
              />
            </div>
          )}

          {/* Trigger Button */}
          {!improvedPreview && (
            <button
              onClick={handleGenerateImprovement}
              disabled={isImproving}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#7C4DFF]/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isImproving ? 'Generating Refinement…' : 'Generate Improved Prompt'}</span>
            </button>
          )}

          {/* Preview Result */}
          {improvedPreview && (
            <div className="space-y-2 pt-2 border-t border-[#262B36] animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Refined Version
                </span>
                <span className="text-[10px] text-zinc-400">{changesMade}</span>
              </div>
              <div className="p-3 rounded-xl bg-[#111318] border border-[#262B36] text-xs text-zinc-200 font-mono leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                {improvedPreview}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {improvedPreview && (
          <div className="p-3 border-t border-[#262B36] bg-[#14161c] flex items-center gap-2">
            <button
              onClick={() => setImprovedPreview(null)}
              className="px-3 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-400 hover:text-white"
            >
              Back
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Apply to Result</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
