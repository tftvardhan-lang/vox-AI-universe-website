import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from './AppLogo';
import { AccountSubscriptionSection } from './AccountSubscriptionSection';
import { AdminSubscriptionDashboard } from './AdminSubscriptionDashboard';
import { 
  User, 
  Shield, 
  Check, 
  Zap, 
  Gauge, 
  DollarSign, 
  Sliders, 
  HelpCircle, 
  RotateCcw, 
  ExternalLink,
  Crown,
  Terminal,
  X
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { 
    profile, 
    updateProfile, 
    entitlements, 
    openPricingModal, 
    setIsAdminOpen, 
    setShowOnboarding, 
    showToast 
  } = useApp();

  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showGooglePlayAdminModal, setShowGooglePlayAdminModal] = useState(false);

  const isPaid = entitlements.isPaid && entitlements.plan !== 'free';

  return (
    <div className="flex-1 flex flex-col px-4 pt-3 pb-12 space-y-6 animate-fade-in">
      {/* Header Profile Card */}
      <div className="p-4 rounded-3xl bg-[#181B22] border border-[#262B36] flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#7C4DFF] to-[#3B82F6] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[#7C4DFF]/30">
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">{profile.name}</h2>
              <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isPaid 
                  ? 'bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white shadow-sm'
                  : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
                {entitlements.plan}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-0.5">{profile.email}</p>
          </div>
        </div>

        <button
          onClick={() => openPricingModal()}
          className="text-xs font-semibold text-[#7C4DFF] hover:underline cursor-pointer"
        >
          {isPaid ? 'Change Tier' : 'Upgrade Plan'}
        </button>
      </div>

      {/* Production Google Play Subscription Section */}
      <AccountSubscriptionSection onOpenPricingModal={() => openPricingModal()} />

      {/* Matching Preferences */}
      <div className="space-y-4 rounded-3xl bg-[#181B22] border border-[#262B36] p-5 shadow-xl">
        <div className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
          Recommendation Preferences
        </div>

        {/* Speed vs Quality Priority */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium text-zinc-400 flex items-center justify-between">
            <span>Optimization Priority</span>
            <span className="text-white capitalize">{profile.preferences.speedVsQuality}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateProfile({
                preferences: { ...profile.preferences, speedVsQuality: 'quality' }
              })}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                profile.preferences.speedVsQuality === 'quality'
                  ? 'bg-[#7C4DFF]/15 border-[#7C4DFF] text-white'
                  : 'bg-[#20232B] border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Gauge className="w-3.5 h-3.5 text-[#7C4DFF]" />
              <span>Highest Quality</span>
            </button>
            <button
              onClick={() => updateProfile({
                preferences: { ...profile.preferences, speedVsQuality: 'speed' }
              })}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                profile.preferences.speedVsQuality === 'speed'
                  ? 'bg-[#7C4DFF]/15 border-[#7C4DFF] text-white'
                  : 'bg-[#20232B] border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Fastest Speed</span>
            </button>
          </div>
        </div>

        {/* Budget Preference */}
        <div className="space-y-2">
          <label className="text-[11px] font-medium text-zinc-400 block">
            Budget Constraint
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'all', label: 'Any Cost' },
              { id: 'free_only', label: 'Free Only' },
              { id: 'low_cost', label: 'Low Cost ($)' }
            ].map((b) => (
              <button
                key={b.id}
                onClick={() => updateProfile({
                  preferences: { ...profile.preferences, budgetPreference: b.id as any }
                })}
                className={`py-2 rounded-xl border text-[11px] font-medium transition-all ${
                  profile.preferences.budgetPreference === b.id
                    ? 'bg-[#7C4DFF]/15 border-[#7C4DFF] text-white'
                    : 'bg-[#20232B] border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Admin Portal & Tools */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider px-1">
          Developer & Subscription Diagnostics
        </div>

        <button
          onClick={() => setShowGooglePlayAdminModal(true)}
          className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-[#1d1b29] to-[#161a29] border border-[#7C4DFF]/40 hover:border-[#7C4DFF] text-left flex items-center justify-between text-xs font-semibold text-white transition-all group shadow-md"
        >
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-[#7C4DFF]" />
            <div>
              <div className="text-white font-bold">Google Play License Test Harness</div>
              <div className="text-[10px] text-zinc-400">16 test scenarios, RTDN events, backend audit log</div>
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 group-hover:text-white">Run →</span>
        </button>

        <button
          onClick={() => setIsAdminOpen(true)}
          className="w-full p-3.5 rounded-2xl bg-[#181B22] border border-[#262B36] hover:border-zinc-700 text-left flex items-center justify-between text-xs font-semibold text-white transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-zinc-400" />
            <span>Admin Model Catalog Database</span>
          </div>
          <span className="text-[10px] text-zinc-400 group-hover:text-white">Open →</span>
        </button>

        <button
          onClick={() => setShowOnboarding(true)}
          className="w-full p-3.5 rounded-2xl bg-[#181B22] border border-[#262B36] hover:border-zinc-700 text-left flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white transition-all"
        >
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-zinc-400" />
            <span>Replay Welcome Tour</span>
          </div>
          <span className="text-[10px] text-zinc-400">Launch</span>
        </button>

        <button
          onClick={() => setShowAboutModal(true)}
          className="w-full p-3.5 rounded-2xl bg-[#181B22] border border-[#262B36] hover:border-zinc-700 text-left flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white transition-all"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            <span>About Model Match AI</span>
          </div>
          <span className="text-[10px] text-zinc-400">Info</span>
        </button>
      </div>

      {/* Google Play Admin & Test Scenarios Modal */}
      {showGooglePlayAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in overflow-y-auto">
          <div className="w-full max-w-lg bg-[#14171d] border border-[#262B36] rounded-3xl p-5 space-y-4 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#7C4DFF]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Google Play Testing & Subscription Backend
                </h3>
              </div>
              <button
                onClick={() => setShowGooglePlayAdminModal(false)}
                className="w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <AdminSubscriptionDashboard />
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#181B22] border border-[#262B36] rounded-3xl p-6 space-y-4 animate-scale-up text-center flex flex-col items-center">
            <AppLogo size={64} withGlow className="mb-1 shadow-2xl shadow-orange-500/25 ring-2 ring-orange-500/40" />
            <div>
              <h3 className="text-base font-bold text-white">MODEL MATCH AI</h3>
              <p className="text-[11px] text-orange-400 font-mono font-bold mt-0.5">Frontier Intelligence Edition</p>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed text-left">
              MODEL MATCH AI removes the cognitive burden of choosing AI models. By analyzing task semantics, modality constraints, and verified frontier benchmarks, we route your creative and analytical workflows to the optimal model with customized prompt directives.
            </p>
            <div className="w-full text-[11px] text-zinc-400 space-y-1 pt-3 border-t border-[#262B36] text-left">
              <div>Version 3.2.0 Frontier Edition</div>
              <div>Data refreshed daily from verified AI safety & research labs</div>
            </div>
            <button
              onClick={() => setShowAboutModal(false)}
              className="w-full py-2.5 rounded-xl bg-zinc-800 text-xs font-bold text-white hover:bg-zinc-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
