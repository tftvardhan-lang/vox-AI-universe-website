import React from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from './AppLogo';
import { Sparkles, Shield, Smartphone, RefreshCw, PlusCircle, Sliders } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setCurrentResult, 
    profile, 
    viewportMode, 
    setViewportMode, 
    setIsAdminOpen,
    refreshModels,
    isLoadingModels 
  } = useApp();

  return (
    <header className="sticky top-0 z-30 w-full bg-[#111318]/95 backdrop-blur-md border-b border-[#20232B] px-4 py-3 flex items-center justify-between">
      {/* Brand Identity */}
      <div 
        className="flex items-center gap-2.5 cursor-pointer group"
        onClick={() => {
          setActiveTab('home');
          setCurrentResult(null);
        }}
      >
        <div className="relative group-hover:scale-105 transition-transform">
          <AppLogo size={34} withGlow className="shadow-lg shadow-orange-500/10" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-[15px] tracking-wider text-white font-mono">
              MODEL MATCH
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gradient-to-r from-orange-500/20 to-[#7C4DFF]/20 border border-orange-500/40 text-orange-400">
              AI
            </span>
          </div>
          <div className="text-[10px] text-zinc-400 font-medium tracking-tight -mt-0.5">
            Smart Model Discovery
          </div>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-1.5">
        {/* Device Switcher */}
        <div className="hidden sm:flex items-center bg-[#181B22] border border-[#262B36] rounded-lg p-0.5 text-xs text-zinc-400">
          <button
            onClick={() => setViewportMode('390x844')}
            className={`px-2 py-1 rounded transition-colors ${viewportMode === '390x844' ? 'bg-[#7C4DFF] text-white font-semibold' : 'hover:text-zinc-200'}`}
            title="iPhone 15 Pro (390×844)"
          >
            390
          </button>
          <button
            onClick={() => setViewportMode('430x932')}
            className={`px-2 py-1 rounded transition-colors ${viewportMode === '430x932' ? 'bg-[#7C4DFF] text-white font-semibold' : 'hover:text-zinc-200'}`}
            title="iPhone 15 Pro Max (430×932)"
          >
            430
          </button>
          <button
            onClick={() => setViewportMode('fluid')}
            className={`px-2 py-1 rounded transition-colors ${viewportMode === 'fluid' ? 'bg-[#7C4DFF] text-white font-semibold' : 'hover:text-zinc-200'}`}
            title="Fluid Full View"
          >
            Full
          </button>
        </div>

        {/* Pro Status */}
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
            profile.plan === 'pro'
              ? 'bg-[#7C4DFF]/15 border-[#7C4DFF]/40 text-[#c084fc] hover:bg-[#7C4DFF]/25'
              : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white'
          }`}
        >
          <Shield className="w-3 h-3 text-[#7C4DFF]" />
          <span>{profile.plan === 'pro' ? 'PRO' : 'FREE'}</span>
        </button>

        {/* Admin Portal Toggle */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="p-1.5 rounded-lg bg-[#181B22] border border-[#262B36] text-zinc-400 hover:text-white hover:border-[#7C4DFF]/50 transition-colors"
          title="Admin Model Database"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
