import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Plus, Trash2, Edit2, RotateCcw, Check, Sparkles, Sliders } from 'lucide-react';
import { AIModel } from '../types';

export const AdminModal: React.FC = () => {
  const { 
    isAdminOpen, 
    setIsAdminOpen, 
    models, 
    addModel, 
    updateModel, 
    deleteModel, 
    resetModelsToDefault,
    showToast 
  } = useApp();

  const [editingModel, setEditingModel] = useState<AIModel | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Form fields for add/edit
  const [formName, setFormName] = useState('');
  const [formProvider, setFormProvider] = useState('');
  const [formCategory, setFormCategory] = useState('Reasoning');
  const [formDesc, setFormDesc] = useState('');
  const [formSpeed, setFormSpeed] = useState<number>(4);
  const [formQuality, setFormQuality] = useState<number>(5);
  const [formCost, setFormCost] = useState<'Free' | 'Very Low ($)' | 'Low ($)' | 'Moderate ($$)' | 'High ($$$)' | 'Enterprise ($$$$)'>('Moderate ($$)');
  const [formContext, setFormContext] = useState('1M tokens');
  const [formStrengths, setFormStrengths] = useState('Photorealism, Low latency');
  const [formWeaknesses, setFormWeaknesses] = useState('Expensive, Slower generation');

  if (!isAdminOpen) return null;

  const handleOpenAdd = () => {
    setEditingModel(null);
    setFormName('');
    setFormProvider('');
    setFormCategory('Reasoning');
    setFormDesc('');
    setFormSpeed(4);
    setFormQuality(5);
    setFormCost('Moderate ($$)');
    setFormContext('1M tokens');
    setFormStrengths('High precision, Low latency');
    setFormWeaknesses('Moderate cost');
    setIsAddingNew(true);
  };

  const handleOpenEdit = (m: AIModel) => {
    setEditingModel(m);
    setFormName(m.name);
    setFormProvider(m.provider);
    setFormCategory(m.category);
    setFormDesc(m.description);
    setFormSpeed(m.speedRating);
    setFormQuality(m.qualityRating);
    setFormCost(m.costCategory);
    setFormContext(m.contextCapability);
    setFormStrengths(m.strengths.join(', '));
    setFormWeaknesses(m.weaknesses.join(', '));
    setIsAddingNew(true);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formProvider.trim()) {
      showToast('Name and Provider are required');
      return;
    }

    const strengthsArray = formStrengths.split(',').map(s => s.trim()).filter(Boolean);
    const weaknessesArray = formWeaknesses.split(',').map(w => w.trim()).filter(Boolean);

    if (editingModel) {
      await updateModel(editingModel.id, {
        name: formName.trim(),
        provider: formProvider.trim(),
        category: formCategory,
        description: formDesc.trim(),
        speedRating: formSpeed as any,
        qualityRating: formQuality as any,
        costCategory: formCost,
        contextCapability: formContext,
        strengths: strengthsArray,
        weaknesses: weaknessesArray,
        lastUpdatedDate: new Date().toISOString().split('T')[0]
      });
    } else {
      const newId = formName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
      const newModel: AIModel = {
        id: newId,
        name: formName.trim(),
        provider: formProvider.trim(),
        category: formCategory,
        description: formDesc.trim(),
        supportedTasks: ['General intelligence', 'Code', 'Creative'],
        inputTypes: ['text'],
        outputTypes: ['text'],
        speedRating: formSpeed as any,
        qualityRating: formQuality as any,
        costCategory: formCost,
        contextCapability: formContext,
        scores: {
          video: formCategory === 'AI Video' ? 95 : 10,
          image: formCategory === 'AI Image' ? 95 : 10,
          writing: 90,
          coding: formCategory === 'Coding' ? 95 : 80,
          reasoning: 90,
          context: 85,
          speed: formSpeed * 20,
          easeOfUse: 85,
          costEfficiency: 80
        },
        strengths: strengthsArray,
        weaknesses: weaknessesArray,
        lastUpdatedDate: new Date().toISOString().split('T')[0],
        latestVerifiedStatus: 'Verified Active',
        isTrending: true,
        isNew: true
      };
      await addModel(newModel);
    }

    setIsAddingNew(false);
    setEditingModel(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-[#181B22] border-t sm:border border-[#262B36] rounded-t-3xl sm:rounded-2xl max-h-[92vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="p-4 border-b border-[#262B36] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] flex items-center justify-center text-white">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Model Management Database</h2>
              <p className="text-[10px] text-zinc-400">Add, edit, or curate AI models ({models.length} active)</p>
            </div>
          </div>
          <button 
            onClick={() => {
              setIsAdminOpen(false);
              setIsAddingNew(false);
            }}
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto no-scrollbar flex-1 space-y-4">
          {/* Action Row */}
          {!isAddingNew && (
            <div className="flex items-center justify-between">
              <button
                onClick={handleOpenAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white text-xs font-bold shadow-md shadow-[#7C4DFF]/20 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add AI Model</span>
              </button>

              <button
                onClick={resetModelsToDefault}
                className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-2 py-1 rounded-lg hover:bg-zinc-800"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Defaults</span>
              </button>
            </div>
          )}

          {/* Form for Add/Edit */}
          {isAddingNew ? (
            <form onSubmit={handleSaveForm} className="space-y-3 bg-[#111318] p-4 rounded-2xl border border-[#262B36]">
              <div className="flex items-center justify-between border-b border-[#262B36] pb-2">
                <span className="text-xs font-bold text-white">
                  {editingModel ? `Edit ${editingModel.name}` : 'Register New AI Model'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNew(false)}
                  className="text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">Model Name</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Claude 3.7 Sonnet"
                    className="w-full bg-[#181B22] border border-[#2c3240] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">Provider / Lab</label>
                  <input
                    type="text"
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                    placeholder="e.g. Anthropic"
                    className="w-full bg-[#181B22] border border-[#2c3240] rounded-lg px-2.5 py-1.5 text-xs text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full bg-[#181B22] border border-[#2c3240] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="AI Video">AI Video</option>
                    <option value="AI Image">AI Image</option>
                    <option value="Coding">Coding</option>
                    <option value="Reasoning">Reasoning</option>
                    <option value="Writing">Writing</option>
                    <option value="Research">Research</option>
                    <option value="Thumbnails">Thumbnails</option>
                    <option value="Audio">Audio</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">Cost Category</label>
                  <select
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value as any)}
                    className="w-full bg-[#181B22] border border-[#2c3240] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  >
                    <option value="Free">Free</option>
                    <option value="Very Low ($)">Very Low ($)</option>
                    <option value="Low ($)">Low ($)</option>
                    <option value="Moderate ($$)">Moderate ($$)</option>
                    <option value="High ($$$)">High ($$$)</option>
                    <option value="Enterprise ($$$$)">Enterprise ($$$$)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">Description</label>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Summary of capabilities and release features..."
                  rows={2}
                  className="w-full bg-[#181B22] border border-[#2c3240] rounded-lg p-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">Speed Rating (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={formSpeed}
                    onChange={(e) => setFormSpeed(Number(e.target.value))}
                    className="w-full bg-[#181B22] border border-[#2c3240] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-400 block mb-0.5">Quality Rating (1-5)</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    value={formQuality}
                    onChange={(e) => setFormQuality(Number(e.target.value))}
                    className="w-full bg-[#181B22] border border-[#2c3240] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">Strengths (comma separated)</label>
                <input
                  type="text"
                  value={formStrengths}
                  onChange={(e) => setFormStrengths(e.target.value)}
                  className="w-full bg-[#181B22] border border-[#2c3240] rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-0.5">Weaknesses (comma separated)</label>
                <input
                  type="text"
                  value={formWeaknesses}
                  onChange={(e) => setFormWeaknesses(e.target.value)}
                  className="w-full bg-[#181B22] border border-[#2c3240] rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white text-xs font-bold"
                >
                  Save Model Specifications
                </button>
              </div>
            </form>
          ) : (
            /* Model List */
            <div className="space-y-2">
              {models.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-[#111318] border border-[#20232B] flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-bold text-white">{m.name}</div>
                    <div className="text-[10px] text-zinc-400">
                      {m.provider} • {m.category} • {m.costCategory}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(m)}
                      className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white"
                      title="Edit model"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteModel(m.id)}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-950/50 text-zinc-400 hover:text-red-400"
                      title="Delete model"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
