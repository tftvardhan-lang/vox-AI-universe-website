import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/DeviceFrame';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { LoadingScreen } from './components/LoadingScreen';
import { ResultsScreen } from './components/ResultsScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { CompareScreen } from './components/CompareScreen';
import { PromptsScreen } from './components/PromptsScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { AdminModal } from './components/AdminModal';
import { OnboardingModal } from './components/OnboardingModal';
import { PricingModal } from './components/PricingModal';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    isAnalyzing, 
    analysisStep, 
    currentPrompt, 
    currentResult, 
    toast,
    isPricingModalOpen,
    setIsPricingModalOpen,
    pricingHighlightReason
  } = useApp();

  return (
    <DeviceFrame>
      {/* Top Application Header */}
      <Header />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-zinc-900/95 border border-[#7C4DFF]/50 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 backdrop-blur-md animate-slide-down">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Main View Router */}
      <main className="flex-1 flex flex-col">
        {isAnalyzing ? (
          <LoadingScreen step={analysisStep} taskPrompt={currentPrompt} />
        ) : (
          <>
            {activeTab === 'home' && (
              currentResult ? <ResultsScreen /> : <HomeScreen />
            )}
            {activeTab === 'explore' && <ExploreScreen />}
            {activeTab === 'compare' && <CompareScreen />}
            {activeTab === 'prompts' && <PromptsScreen />}
            {activeTab === 'history' && <HistoryScreen />}
            {activeTab === 'profile' && <ProfileScreen />}
          </>
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav />

      {/* Overlays & Modals */}
      <AdminModal />
      <OnboardingModal />
      <PricingModal
        isOpen={isPricingModalOpen}
        onClose={() => setIsPricingModalOpen(false)}
        highlightReason={pricingHighlightReason}
      />
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
