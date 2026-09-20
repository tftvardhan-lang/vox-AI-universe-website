import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  Search, 
  Sparkles, 
  Film, 
  Image as ImageIcon, 
  Code, 
  BookOpen, 
  Flame, 
  Plus, 
  GitCompare, 
  Clock, 
  ShieldCheck, 
  X,
  ChevronRight,
  Zap,
  Gauge,
  DollarSign
} from 'lucide-react';
import { AIModel } from '../types';

export const ExploreScreen: React.FC = () => {
  const { models, toggleCompareModel, comparedModelIds, runMatch, setActiveTab, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [selectedDetailModel, setSelectedDetailModel] = useState<AIModel | null>(null);

  // Filtered models
  const filteredModels = models.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.supportedTasks.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = 
      activeCategoryFilter === 'all' ||
      m.category.toLowerCase().includes(activeCategoryFilter.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const trendingModels = models.filter(m => m.isTrending);
  const videoModels = models.filter(m => m.category === 'AI Video');
  const imageModels = models.filter(m => m.category === 'AI Image' || m.category === 'Thumbnails');
  const codingModels = models.filter(m => m.category === 'Coding');
  const researchModels = models.filter(m => m.category === 'Research');
  const newModels = models.filter(m => m.isNew);

  const renderModelCard = (model: AIModel) => {
    const isCompared = comparedModelIds.includes(model.id);

    return (
      <div
        key={model.id}
        className="p-4 rounded-2xl bg-[#181B22] border border-[#262B36] hover:border-[#7C4DFF]/50 transition-all flex flex-col justify-between space-y-3 shadow-md group"
      >
        <div>
          {/* Header Row */}
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[10px] text-[#7C4DFF] font-semibold uppercase tracking-wider">
                {model.provider}
              </span>
              <h3 className="text-sm font-bold text-white group-hover:text-[#7C4DFF] transition-colors">
                {model.name}
              </h3>
            </div>
            {model.badge && (
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
                {model.badge}
              </span>
            )}
          </div>

          <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1.5 leading-relaxed">
            {model.description}
          </p>

          {/* Primary Strengths Tag List */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {model.strengths.slice(0, 2).map((s, idx) => (
              <span key={idx} className="text-[10px] bg-[#111318] text-zinc-300 px-2 py-0.5 rounded-md border border-white/5">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="pt-2.5 border-t border-[#262B36] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1 text-[10px] text-zinc-400">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span>{model.lastUpdatedDate}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => toggleCompareModel(model.id)}
              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                isCompared
                  ? 'bg-[#7C4DFF] text-white border-[#7C4DFF]'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white'
              }`}
              title={isCompared ? 'Remove from compare' : 'Add to compare'}
            >
              <GitCompare className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setSelectedDetailModel(model)}
              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-12 space-y-6 animate-fade-in">
      {/* Search Header */}
      <div>
        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2 mb-1">
          <Compass className="w-5 h-5 text-[#3B82F6]" />
          <span>Explore AI Models</span>
        </h2>
        <p className="text-xs text-zinc-400">
          Discover verified models, benchmarks, and specialized architectures.
        </p>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search models, providers, tasks…"
            className="w-full bg-[#181B22] border border-[#262B36] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#7C4DFF]"
          />
        </div>

        {/* Quick Filter Chips */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'All Models' },
            { id: 'video', label: 'AI Video' },
            { id: 'image', label: 'AI Image' },
            { id: 'coding', label: 'Coding' },
            { id: 'research', label: 'Research' },
            { id: 'audio', label: 'Audio & Music' },
            { id: 'voice', label: 'Voice' }
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => setActiveCategoryFilter(chip.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                activeCategoryFilter === chip.id
                  ? 'bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white shadow-sm'
                  : 'bg-[#181B22] border border-[#262B36] text-zinc-400 hover:text-white'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* If Searching, show unified grid */}
      {searchQuery || activeCategoryFilter !== 'all' ? (
        <div className="space-y-3">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Filtered Results ({filteredModels.length})
          </div>
          <div className="space-y-3">
            {filteredModels.map(renderModelCard)}
          </div>
        </div>
      ) : (
        /* Sectioned Layout */
        <div className="space-y-7">
          {/* Trending Models */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Trending Models</span>
            </div>
            <div className="space-y-3">
              {trendingModels.slice(0, 3).map(renderModelCard)}
            </div>
          </div>

          {/* Popular for Video */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <Film className="w-4 h-4 text-[#3B82F6]" />
              <span>Popular for Video</span>
            </div>
            <div className="space-y-3">
              {videoModels.map(renderModelCard)}
            </div>
          </div>

          {/* Popular for Images */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <ImageIcon className="w-4 h-4 text-[#EC4899]" />
              <span>Popular for Images</span>
            </div>
            <div className="space-y-3">
              {imageModels.map(renderModelCard)}
            </div>
          </div>

          {/* Popular for Coding */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <Code className="w-4 h-4 text-emerald-400" />
              <span>Popular for Coding</span>
            </div>
            <div className="space-y-3">
              {codingModels.map(renderModelCard)}
            </div>
          </div>

          {/* Popular for Research */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-[#0EA5E9]" />
              <span>Popular for Research</span>
            </div>
            <div className="space-y-3">
              {researchModels.map(renderModelCard)}
            </div>
          </div>

          {/* New Releases */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#7C4DFF]" />
              <span>New Models & Major Updates</span>
            </div>
            <div className="space-y-3">
              {newModels.map(renderModelCard)}
            </div>
          </div>
        </div>
      )}

      {/* Model Detail Modal */}
      {selectedDetailModel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-[420px] bg-[#181B22] border-t sm:border border-[#262B36] rounded-t-3xl sm:rounded-2xl max-h-[88vh] flex flex-col overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-[#262B36] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#7C4DFF] font-bold uppercase tracking-wider">
                  {selectedDetailModel.provider}
                </span>
                <h3 className="text-base font-bold text-white">{selectedDetailModel.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedDetailModel(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto no-scrollbar space-y-4 flex-1">
              <p className="text-xs text-zinc-300 leading-relaxed">
                {selectedDetailModel.description}
              </p>

              {/* Score Badges */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#111318] border border-[#20232B] text-center">
                <div>
                  <div className="text-[10px] text-zinc-400">Speed</div>
                  <div className="text-xs font-bold text-white mt-0.5">{selectedDetailModel.speedRating}/5</div>
                </div>
                <div className="border-x border-[#20232B]">
                  <div className="text-[10px] text-zinc-400">Quality</div>
                  <div className="text-xs font-bold text-white mt-0.5">{selectedDetailModel.qualityRating}/5</div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">Cost</div>
                  <div className="text-xs font-bold text-white mt-0.5">{selectedDetailModel.costCategory}</div>
                </div>
              </div>

              {/* Verified Benchmark */}
              {selectedDetailModel.benchmarkScore && (
                <div className="p-3 rounded-xl bg-[#14161c] border border-blue-500/20 text-xs space-y-1">
                  <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                    {selectedDetailModel.benchmarkScore.name}
                  </div>
                  <div className="text-sm font-black text-white font-mono">
                    {selectedDetailModel.benchmarkScore.value}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {selectedDetailModel.benchmarkScore.description}
                  </div>
                  <div className="text-[10px] text-zinc-400 pt-1">
                    Verified on: {selectedDetailModel.benchmarkScore.verifiedDate}
                  </div>
                </div>
              )}

              {/* Strengths */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-emerald-400">Key Strengths</div>
                <div className="space-y-1">
                  {selectedDetailModel.strengths.map((s, idx) => (
                    <div key={idx} className="text-xs text-zinc-300 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-400">Trade-offs & Constraints</div>
                <div className="space-y-1">
                  {selectedDetailModel.weaknesses.map((w, idx) => (
                    <div key={idx} className="text-xs text-zinc-400 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specifications */}
              <div className="space-y-1.5 text-xs text-zinc-400 pt-2 border-t border-[#262B36]">
                <div><strong className="text-zinc-200">Context Window:</strong> {selectedDetailModel.contextCapability}</div>
                <div><strong className="text-zinc-200">Inputs:</strong> {selectedDetailModel.inputTypes.join(', ')}</div>
                <div><strong className="text-zinc-200">Outputs:</strong> {selectedDetailModel.outputTypes.join(', ')}</div>
                <div><strong className="text-zinc-200">Status:</strong> {selectedDetailModel.latestVerifiedStatus} ({selectedDetailModel.lastUpdatedDate})</div>
              </div>
            </div>

            <div className="p-3 border-t border-[#262B36] bg-[#14161c] flex items-center gap-2">
              <button
                onClick={() => {
                  toggleCompareModel(selectedDetailModel.id);
                  setSelectedDetailModel(null);
                  setActiveTab('compare');
                }}
                className="px-3 py-2 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white"
              >
                Compare
              </button>
              <button
                onClick={() => {
                  const sample = `Create high quality output using ${selectedDetailModel.name}`;
                  setSelectedDetailModel(null);
                  runMatch(sample);
                }}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span>Find Tasks for This Model</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
