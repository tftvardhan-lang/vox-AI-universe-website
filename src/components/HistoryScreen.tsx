import React from 'react';
import { useApp } from '../context/AppContext';
import { Clock, Trash2, ArrowRight, Sparkles, ChevronRight } from 'lucide-react';

export const HistoryScreen: React.FC = () => {
  const { history, clearHistory, deleteHistoryItem, openHistoryItem } = useApp();

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-12 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#7C4DFF]" />
            <span>Search History</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Revisit past model recommendations and prompts
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1 text-xs text-zinc-400 hover:text-red-400 transition-colors py-1 px-2 rounded-lg hover:bg-zinc-800"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="py-16 text-center text-zinc-500 space-y-2">
          <Clock className="w-8 h-8 mx-auto opacity-30" />
          <div className="text-xs font-medium">No search history yet</div>
          <p className="text-[11px] text-zinc-600 max-w-xs mx-auto">
            Your matched tasks and recommendations will be logged here chronologically.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              onClick={() => openHistoryItem(item)}
              className="p-4 rounded-2xl bg-[#181B22] border border-[#262B36] hover:border-[#7C4DFF]/40 transition-all cursor-pointer group active:scale-[0.99] space-y-2.5 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="pr-2">
                  <div className="text-xs font-semibold text-white group-hover:text-[#7C4DFF] transition-colors line-clamp-1">
                    "{item.task}"
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">
                    {item.date} • {item.category}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-white font-mono">
                    {item.matchScore}%
                  </div>
                  <div className="text-[9px] text-zinc-400 font-medium">
                    Task Fit
                  </div>
                </div>
              </div>

              {/* Recommended Model Highlight */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#111318] border border-[#20232B]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#7C4DFF]" />
                  <span className="text-xs font-bold text-zinc-200">
                    {item.recommendedModel}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-zinc-400 group-hover:text-white transition-colors">
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Delete item button */}
              <div className="flex justify-end pt-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHistoryItem(item.id);
                  }}
                  className="text-[10px] text-zinc-600 hover:text-red-400 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
