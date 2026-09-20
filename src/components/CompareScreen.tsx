import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, X, GitCompare, Zap, Gauge, DollarSign, Check, HelpCircle } from 'lucide-react';
import { AIModel } from '../types';

export const CompareScreen: React.FC = () => {
  const { models, comparedModelIds, toggleCompareModel, showToast } = useApp();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Selected models
  const selectedModels = models.filter(m => comparedModelIds.includes(m.id));

  const CRITERIA = [
    { key: 'quality', label: 'Output Quality', getVal: (m: AIModel) => m.qualityRating * 20, format: (m: AIModel) => `${m.qualityRating}/5` },
    { key: 'speed', label: 'Speed & Latency', getVal: (m: AIModel) => m.scores.speed, format: (m: AIModel) => `${m.scores.speed}%` },
    { key: 'coding', label: 'Coding Precision', getVal: (m: AIModel) => m.scores.coding, format: (m: AIModel) => `${m.scores.coding}%` },
    { key: 'reasoning', label: 'Logic & Reasoning', getVal: (m: AIModel) => m.scores.reasoning, format: (m: AIModel) => `${m.scores.reasoning}%` },
    { key: 'writing', label: 'Writing & Nuance', getVal: (m: AIModel) => m.scores.writing, format: (m: AIModel) => `${m.scores.writing}%` },
    { key: 'video', label: 'Video Generation', getVal: (m: AIModel) => m.scores.video, format: (m: AIModel) => `${m.scores.video}%` },
    { key: 'image', label: 'Image Photorealism', getVal: (m: AIModel) => m.scores.image, format: (m: AIModel) => `${m.scores.image}%` },
    { key: 'context', label: 'Context Length', getVal: (m: AIModel) => m.scores.context, format: (m: AIModel) => m.contextCapability.slice(0, 16) },
    { key: 'easeOfUse', label: 'Ease of Use', getVal: (m: AIModel) => m.scores.easeOfUse, format: (m: AIModel) => `${m.scores.easeOfUse}%` },
    { key: 'costEfficiency', label: 'Cost Efficiency', getVal: (m: AIModel) => m.scores.costEfficiency, format: (m: AIModel) => m.costCategory }
  ];

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-12 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-[#7C4DFF]" />
            <span>Model Comparison</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Compare 2 to 4 models across 10 benchmark dimensions
          </p>
        </div>

        {comparedModelIds.length < 4 && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white text-xs font-bold shadow-md shadow-[#7C4DFF]/20 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Model</span>
          </button>
        )}
      </div>

      {/* Model Selector Cards (Row) */}
      <div className="grid grid-cols-2 gap-2">
        {selectedModels.map((model) => (
          <div
            key={model.id}
            className="relative p-3 rounded-2xl bg-[#181B22] border border-[#2e3444] shadow-md flex flex-col justify-between"
          >
            {selectedModels.length > 2 && (
              <button
                onClick={() => toggleCompareModel(model.id)}
                className="absolute top-2 right-2 p-1 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800"
                title="Remove model"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <div>
              <div className="text-[10px] text-[#7C4DFF] font-semibold uppercase tracking-wider">
                {model.provider}
              </div>
              <h3 className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                {model.name}
              </h3>
              <div className="text-[10px] text-zinc-400 mt-0.5 line-clamp-1">
                {model.category}
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-[#262B36] flex items-center justify-between text-[10px]">
              <span className="text-zinc-500">{model.costCategory}</span>
              <span className="text-zinc-300 font-semibold">{model.lastUpdatedDate}</span>
            </div>
          </div>
        ))}

        {selectedModels.length < 4 && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="p-4 rounded-2xl border-2 border-dashed border-zinc-700 hover:border-[#7C4DFF]/60 hover:bg-[#181B22]/50 flex flex-col items-center justify-center text-zinc-400 hover:text-white transition-all min-h-[96px] cursor-pointer"
          >
            <Plus className="w-5 h-5 mb-1 text-[#7C4DFF]" />
            <span className="text-xs font-semibold">Add Model ({selectedModels.length}/4)</span>
          </button>
        )}
      </div>

      {/* Comparison Criteria Stack */}
      <div className="rounded-2xl bg-[#181B22] border border-[#262B36] p-4 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#262B36] pb-2">
          <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            Evaluation Matrix
          </span>
          <span className="text-[10px] text-zinc-400">
            Task-Fit & Benchmarks
          </span>
        </div>

        <div className="space-y-4">
          {CRITERIA.map((criterion) => (
            <div key={criterion.key} className="space-y-1.5">
              <div className="text-[11px] font-semibold text-zinc-300 flex items-center justify-between">
                <span>{criterion.label}</span>
              </div>

              {/* Progress bars for each selected model */}
              <div className="space-y-1.5">
                {selectedModels.map((m, idx) => {
                  const val = criterion.getVal(m);
                  const isNumber = typeof val === 'number';
                  const numericVal = isNumber ? val : 50;
                  const colors = ['from-[#7C4DFF] to-[#3B82F6]', 'from-[#EC4899] to-[#8B5CF6]', 'from-[#10B981] to-[#06B6D4]', 'from-[#F59E0B] to-[#F97316]'];
                  const barColor = colors[idx % colors.length];

                  return (
                    <div key={m.id} className="space-y-0.5">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-zinc-400 line-clamp-1 max-w-[150px]">{m.name}</span>
                        <span className="text-zinc-200 font-mono font-medium">{criterion.format(m)}</span>
                      </div>
                      <div className="w-full bg-[#111318] h-1.5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full bg-gradient-to-r ${barColor} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(100, Math.max(8, numericVal))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benchmark Explanatory Note */}
      <div className="p-3 rounded-xl bg-[#14161c] border border-zinc-800 text-zinc-400 text-[10px] flex items-start gap-2">
        <HelpCircle className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Scores reflect verified model capabilities and task-fit profiles across multimodal benchmarks. Scores are updated regularly and distinguish task adaptability from raw benchmark results.
        </p>
      </div>

      {/* Add Model Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-[420px] bg-[#181B22] border-t sm:border border-[#262B36] rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-[#262B36] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Select Model to Compare</h3>
                <p className="text-[10px] text-zinc-400">Choose up to 4 models</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto no-scrollbar space-y-2 flex-1">
              {models.map((m) => {
                const isSelected = comparedModelIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      toggleCompareModel(m.id);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#7C4DFF]/15 border-[#7C4DFF] text-white'
                        : 'bg-[#20232B] border-[#2c3240] text-zinc-300 hover:border-zinc-600'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{m.name}</div>
                      <div className="text-[10px] text-zinc-400">{m.provider} • {m.category}</div>
                    </div>
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#7C4DFF] text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </div>
                    ) : (
                      <Plus className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="p-3 border-t border-[#262B36] bg-[#14161c]">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
