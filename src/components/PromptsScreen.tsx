import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Bookmark, 
  Star, 
  Copy, 
  Trash2, 
  Edit3, 
  Folder, 
  Plus, 
  Sparkles, 
  Check, 
  Clock, 
  Search,
  X
} from 'lucide-react';
import { SavedPrompt } from '../types';

export const PromptsScreen: React.FC = () => {
  const { savedPrompts, deleteSavedPrompt, toggleFavoritePrompt, updateSavedPrompt, savePrompt, runMatch, showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'my' | 'favorites' | 'recent'>('my');
  const [activeFolder, setActiveFolder] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Edit modal
  const [editingPrompt, setEditingPrompt] = useState<SavedPrompt | null>(null);
  // New prompt modal
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newOriginal, setNewOriginal] = useState('');
  const [newOptimized, setNewOptimized] = useState('');
  const [newFolder, setNewFolder] = useState('General');

  const FOLDERS = ['All', 'Video & VFX', 'Coding & Tech', 'Research & Deep Dives', 'General'];

  // Filtering
  const filteredPrompts = savedPrompts.filter((p) => {
    if (activeTab === 'favorites' && !p.isFavorite) return false;
    if (activeFolder !== 'All' && p.folder !== activeFolder) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || 
             p.optimizedText.toLowerCase().includes(q) || 
             p.modelName.toLowerCase().includes(q);
    }
    return true;
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreatePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOptimized.trim()) {
      showToast('Title and prompt content are required.');
      return;
    }
    savePrompt({
      title: newTitle.trim(),
      originalText: newOriginal.trim() || newTitle.trim(),
      optimizedText: newOptimized.trim(),
      modelId: 'custom',
      modelName: 'User Crafted',
      category: 'General',
      folder: newFolder,
      isFavorite: false
    });
    setIsCreatingNew(false);
    setNewTitle('');
    setNewOriginal('');
    setNewOptimized('');
  };

  const handleSaveEdit = () => {
    if (editingPrompt) {
      updateSavedPrompt(editingPrompt.id, {
        title: editingPrompt.title,
        optimizedText: editingPrompt.optimizedText,
        folder: editingPrompt.folder
      });
      setEditingPrompt(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-12 space-y-5 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#3B82F6]" />
            <span>Prompt Library</span>
          </h2>
          <p className="text-xs text-zinc-400">
            Personal vault of optimized AI directives
          </p>
        </div>

        <button
          onClick={() => setIsCreatingNew(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white text-xs font-bold shadow-md shadow-[#7C4DFF]/20 active:scale-95 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Tabs: My Prompts | Favorites | Recent */}
      <div className="flex rounded-xl bg-[#181B22] p-1 border border-[#262B36]">
        {[
          { id: 'my', label: 'My Prompts' },
          { id: 'favorites', label: 'Favorites' },
          { id: 'recent', label: 'Recent' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Folder Filter */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved prompts…"
            className="w-full bg-[#181B22] border border-[#262B36] rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#7C4DFF]"
          />
        </div>

        {/* Folder Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {FOLDERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-colors ${
                activeFolder === f
                  ? 'bg-zinc-700 text-white'
                  : 'bg-[#181B22] border border-[#262B36] text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Prompts List */}
      {filteredPrompts.length === 0 ? (
        <div className="py-12 text-center text-zinc-500 space-y-2">
          <Bookmark className="w-8 h-8 mx-auto opacity-30" />
          <div className="text-xs font-medium">No prompts found</div>
          <p className="text-[11px] text-zinc-600 max-w-xs mx-auto">
            Save prompts from your Model Match results or click "+ New" above to add your own.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPrompts.map((prompt) => (
            <div
              key={prompt.id}
              className="p-4 rounded-2xl bg-[#181B22] border border-[#262B36] hover:border-[#7C4DFF]/40 transition-all space-y-3 shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white line-clamp-1">
                    {prompt.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 mt-0.5">
                    <span className="text-[#7C4DFF] font-semibold">{prompt.modelName}</span>
                    <span>•</span>
                    <span>{prompt.folder}</span>
                  </div>
                </div>

                <button
                  onClick={() => toggleFavoritePrompt(prompt.id)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-amber-400"
                >
                  <Star className={`w-4 h-4 ${prompt.isFavorite ? 'fill-amber-400 text-amber-400' : ''}`} />
                </button>
              </div>

              {/* Prompt Text Preview */}
              <div className="p-3 rounded-xl bg-[#111318] border border-[#20232B] text-[11px] text-zinc-300 font-mono line-clamp-3 leading-relaxed">
                {prompt.optimizedText}
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-1">
                <button
                  onClick={() => runMatch(prompt.originalText || prompt.optimizedText)}
                  className="flex items-center gap-1 text-[11px] text-[#7C4DFF] hover:underline font-semibold"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Re-Match Model</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(prompt.id, prompt.optimizedText)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="Copy prompt"
                  >
                    {copiedId === prompt.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setEditingPrompt(prompt)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                    title="Edit prompt"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteSavedPrompt(prompt.id)}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950/60 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Delete prompt"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Prompt Modal */}
      {isCreatingNew && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <form onSubmit={handleCreatePrompt} className="w-full max-w-[420px] bg-[#181B22] border-t sm:border border-[#262B36] rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-[#262B36] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Save New Prompt</h3>
              <button 
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto no-scrollbar flex-1">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Master Anamorphic Hollywood Shot"
                  className="w-full bg-[#111318] border border-[#2c3240] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Folder</label>
                <select
                  value={newFolder}
                  onChange={(e) => setNewFolder(e.target.value)}
                  className="w-full bg-[#111318] border border-[#2c3240] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                >
                  <option value="General">General</option>
                  <option value="Video & VFX">Video & VFX</option>
                  <option value="Coding & Tech">Coding & Tech</option>
                  <option value="Research & Deep Dives">Research & Deep Dives</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Optimized Prompt Text</label>
                <textarea
                  value={newOptimized}
                  onChange={(e) => setNewOptimized(e.target.value)}
                  rows={4}
                  placeholder="Enter the full optimized prompt…"
                  className="w-full bg-[#111318] border border-[#2c3240] rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#7C4DFF]"
                  required
                />
              </div>
            </div>

            <div className="p-3 border-t border-[#262B36] bg-[#14161c]">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white text-xs font-bold"
              >
                Save to Library
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Prompt Modal */}
      {editingPrompt && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-[420px] bg-[#181B22] border-t sm:border border-[#262B36] rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-[#262B36] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Edit Saved Prompt</h3>
              <button 
                onClick={() => setEditingPrompt(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 overflow-y-auto no-scrollbar flex-1">
              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Title</label>
                <input
                  type="text"
                  value={editingPrompt.title}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, title: e.target.value })}
                  className="w-full bg-[#111318] border border-[#2c3240] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Folder</label>
                <select
                  value={editingPrompt.folder}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, folder: e.target.value })}
                  className="w-full bg-[#111318] border border-[#2c3240] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#7C4DFF]"
                >
                  <option value="General">General</option>
                  <option value="Video & VFX">Video & VFX</option>
                  <option value="Coding & Tech">Coding & Tech</option>
                  <option value="Research & Deep Dives">Research & Deep Dives</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-medium text-zinc-400 block mb-1">Prompt Text</label>
                <textarea
                  value={editingPrompt.optimizedText}
                  onChange={(e) => setEditingPrompt({ ...editingPrompt, optimizedText: e.target.value })}
                  rows={4}
                  className="w-full bg-[#111318] border border-[#2c3240] rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-[#7C4DFF]"
                />
              </div>
            </div>

            <div className="p-3 border-t border-[#262B36] bg-[#14161c]">
              <button
                onClick={handleSaveEdit}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white text-xs font-bold"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
