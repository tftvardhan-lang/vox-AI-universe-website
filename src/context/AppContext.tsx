import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AIModel, 
  MatchResult, 
  SavedPrompt, 
  SearchHistoryItem, 
  UserProfile,
  SubscriptionEntitlements,
  UserSubscription,
  SubscriptionPlan
} from '../types';
import { INITIAL_MODELS, INITIAL_CATEGORIES } from '../data/models';
import { matchModelsLocally } from '../services/recommendationEngine';
import { GooglePlayBilling } from '../services/googlePlayBilling';

interface AppContextType {
  // Navigation
  activeTab: 'home' | 'explore' | 'prompts' | 'history' | 'profile' | 'compare';
  setActiveTab: (tab: 'home' | 'explore' | 'prompts' | 'history' | 'profile' | 'compare') => void;

  // Models Database
  models: AIModel[];
  categories: typeof INITIAL_CATEGORIES;
  isLoadingModels: boolean;
  refreshModels: () => Promise<void>;
  addModel: (model: AIModel) => Promise<boolean>;
  updateModel: (id: string, updates: Partial<AIModel>) => Promise<boolean>;
  deleteModel: (id: string) => Promise<boolean>;
  resetModelsToDefault: () => Promise<void>;

  // Current Matching Workflow
  currentPrompt: string;
  setCurrentPrompt: (prompt: string) => void;
  currentResult: MatchResult | null;
  setCurrentResult: (result: MatchResult | null) => void;
  isAnalyzing: boolean;
  analysisStep: number;
  runMatch: (promptText: string) => Promise<void>;

  // Comparison
  comparedModelIds: string[];
  setComparedModelIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleCompareModel: (modelId: string) => void;

  // Prompts Library
  savedPrompts: SavedPrompt[];
  savePrompt: (prompt: Omit<SavedPrompt, 'id' | 'createdAt'>) => void;
  deleteSavedPrompt: (id: string) => void;
  toggleFavoritePrompt: (id: string) => void;
  updateSavedPrompt: (id: string, updates: Partial<SavedPrompt>) => void;

  // History
  history: SearchHistoryItem[];
  clearHistory: () => void;
  deleteHistoryItem: (id: string) => void;
  openHistoryItem: (item: SearchHistoryItem) => void;

  // User & Subscriptions
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  entitlements: SubscriptionEntitlements;
  activeSubscription: UserSubscription | null;
  refreshSubscription: () => Promise<void>;

  // Pricing Modal
  isPricingModalOpen: boolean;
  setIsPricingModalOpen: (open: boolean) => void;
  pricingHighlightReason: string;
  openPricingModal: (reason?: string) => void;

  // Device & UI Frame
  viewportMode: '390x844' | '430x932' | '360x800' | 'fluid';
  setViewportMode: (mode: '390x844' | '430x932' | '360x800' | 'fluid') => void;
  showOnboarding: boolean;
  setShowOnboarding: (show: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;

  // Toast notifications
  toast: string | null;
  showToast: (msg: string) => void;
}

const defaultProfile: UserProfile = {
  id: 'usr-default',
  name: 'Creative Engineer',
  email: 'creator@modelmatch.ai',
  plan: 'free',
  freeSearchesUsed: 0,
  freeSearchLimit: 2,
  theme: 'graphite',
  notificationsEnabled: true,
  preferences: {
    speedVsQuality: 'quality',
    budgetPreference: 'all',
    preferredProviders: ['Google DeepMind', 'Anthropic', 'OpenAI', 'Black Forest Labs'],
    autoOptimizePrompt: true,
    includeTradeoffs: true
  }
};

const defaultEntitlements: SubscriptionEntitlements = {
  plan: 'free',
  isPaid: false,
  canSearch: true,
  freeSearchesUsed: 0,
  freeSearchLimit: 2,
  remainingSearches: 2,
  hasPaidModelSearches: false,
  hasPromptOptimization: 'basic',
  hasModelComparison: true,
  hasDetailedAnalysis: false,
  hasPriorityAccess: false,
  hasExperimentalFeatures: false,
  status: 'free',
  expiryTime: null,
  autoRenewing: false
};

const defaultInitialPrompts: SavedPrompt[] = [
  {
    id: 'sp-1',
    title: 'Hollywood Sci-Fi Anamorphic Scene',
    originalText: 'Create a cinematic Hollywood sci-fi action scene with anamorphic lens flare',
    optimizedText: 'Cinematic 1080p 24fps shot: Cyberpunk high-speed chase in Neo-Tokyo down rain-soaked neon corridors. 35mm anamorphic lens, shallow depth of field f/2.8, subtle volumetric haze. Camera movement: smooth forward dolly with controlled low-angle tilt, steady gimbal stabilization. Chiaroscuro key lighting with cyan rim accents.',
    modelId: 'google-veo-3-1',
    modelName: 'Google Veo 3.1',
    category: 'AI Video',
    folder: 'Video & VFX',
    isFavorite: true,
    createdAt: '2026-03-12T14:30:00Z'
  },
  {
    id: 'sp-2',
    title: 'Crypto Arbitrage WebSocket Bot',
    originalText: 'Write Python code for a high-frequency trading dashboard with WebSocket streams',
    optimizedText: 'Production-grade Python 3.11 asynchronous trading dashboard. Use asyncio with websockets to stream order book tick data for Binance and Coinbase. Implement sliding-window orderbook depth visualizer, real-time bid-ask spread anomaly calculation, robust exponential backoff reconnection logic, and atomic sqlite logging.',
    modelId: 'claude-3-7-sonnet',
    modelName: 'Claude 3.7 Sonnet',
    category: 'Coding & Development',
    folder: 'Engineering',
    isFavorite: true,
    createdAt: '2026-03-14T09:15:00Z'
  },
  {
    id: 'sp-3',
    title: 'Luxury Perfume Product Commercial',
    originalText: 'Generate a realistic product image of a luxury perfume bottle on wet black marble',
    optimizedText: 'Hyper-realistic commercial studio photography: Minimalist amber glass perfume bottle with debossed matte gold cap. Placed on polished wet obsidian black marble with subtle liquid ripples and water droplet reflections. 85mm f/1.4 lens, softbox rim lighting, cinematic volumetric shadows, 8K resolution, zero distortion.',
    modelId: 'flux-1-pro',
    modelName: 'FLUX 1.1 Pro',
    category: 'Image Generation',
    folder: 'Creative',
    isFavorite: false,
    createdAt: '2026-03-15T18:40:00Z'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'prompts' | 'history' | 'profile' | 'compare'>('home');

  // Models State
  const [models, setModels] = useState<AIModel[]>(INITIAL_MODELS);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // Workflow State
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentResult, setCurrentResult] = useState<MatchResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);

  // Comparison State
  const [comparedModelIds, setComparedModelIds] = useState<string[]>([
    'google-veo-3-1',
    'sora-turbo',
    'kling-1-5-pro'
  ]);

  // Library & History
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>(() => {
    const cached = localStorage.getItem('mm_saved_prompts');
    return cached ? JSON.parse(cached) : defaultInitialPrompts;
  });

  const [history, setHistory] = useState<SearchHistoryItem[]>(() => {
    const cached = localStorage.getItem('mm_history');
    return cached ? JSON.parse(cached) : [];
  });

  // User & Subscriptions
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [entitlements, setEntitlements] = useState<SubscriptionEntitlements>(defaultEntitlements);
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null);

  // Pricing Modal
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [pricingHighlightReason, setPricingHighlightReason] = useState('');

  // Device & Meta UI
  const [viewportMode, setViewportMode] = useState<'390x844' | '430x932' | '360x800' | 'fluid'>('fluid');
  const [showOnboarding, setShowOnboarding] = useState<boolean>(() => {
    return localStorage.getItem('mm_onboarding_completed') !== 'true';
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const openPricingModal = (reason?: string) => {
    setPricingHighlightReason(reason || '');
    setIsPricingModalOpen(true);
  };

  // Sync Subscription state from backend
  const refreshSubscription = async () => {
    try {
      const res = await GooglePlayBilling.getSubscriptionStatus(profile.id);
      if (res && res.success) {
        if (res.entitlements) {
          setEntitlements(res.entitlements);
        }
        if (res.subscription !== undefined) {
          setActiveSubscription(res.subscription);
        }
        if (res.user) {
          setProfile(prev => ({
            ...prev,
            plan: (res.entitlements?.plan || prev.plan) as SubscriptionPlan,
            freeSearchesUsed: res.user.freeSearchesUsed,
            freeSearchLimit: res.user.freeSearchLimit
          }));
        }
      }
    } catch (err) {
      console.warn('Could not sync subscription from backend:', err);
    }
  };

  // Initial load
  useEffect(() => {
    refreshModels();
    refreshSubscription();
  }, []);

  // Save prompts & history to localStorage
  useEffect(() => {
    localStorage.setItem('mm_saved_prompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  useEffect(() => {
    localStorage.setItem('mm_history', JSON.stringify(history));
  }, [history]);

  const refreshModels = async () => {
    setIsLoadingModels(true);
    try {
      const res = await fetch('/api/models');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          setModels(json.data);
        }
      }
    } catch {
      // Fallback
    } finally {
      setIsLoadingModels(false);
    }
  };

  const addModel = async (newModel: AIModel): Promise<boolean> => {
    try {
      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newModel)
      });
      if (res.ok) {
        setModels(prev => [newModel, ...prev]);
        showToast(`Added model ${newModel.name}`);
        return true;
      }
    } catch {
      setModels(prev => [newModel, ...prev]);
      showToast(`Added model ${newModel.name} (local)`);
      return true;
    }
    return false;
  };

  const updateModel = async (id: string, updates: Partial<AIModel>): Promise<boolean> => {
    try {
      const res = await fetch(`/api/models/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        setModels(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
        showToast(`Updated ${id}`);
        return true;
      }
    } catch {
      setModels(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
      showToast(`Updated ${id} (local)`);
      return true;
    }
    return false;
  };

  const deleteModel = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/models/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setModels(prev => prev.filter(m => m.id !== id));
        showToast('Model removed');
        return true;
      }
    } catch {
      setModels(prev => prev.filter(m => m.id !== id));
      showToast('Model removed (local)');
      return true;
    }
    return false;
  };

  const resetModelsToDefault = async () => {
    try {
      await fetch('/api/admin/reset', { method: 'POST' });
    } catch {
      // ignore
    }
    setModels(INITIAL_MODELS);
    showToast('Reset to default verified models.');
  };

  const runMatch = async (promptText: string) => {
    if (!promptText.trim()) return;

    // Check entitlement for Free users before analyzing
    if (!entitlements.isPaid && entitlements.freeSearchesUsed >= entitlements.freeSearchLimit) {
      openPricingModal("You've used your 2 free searches. Upgrade to continue using MODEL MATCH AI.");
      showToast("You've used your 2 free searches. Upgrade to continue.");
      return;
    }

    setCurrentPrompt(promptText);
    setIsAnalyzing(true);
    setAnalysisStep(0);

    // Multi-step loading experience
    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => (prev < 4 ? prev + 1 : prev));
    }, 450);

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': profile.id
        },
        body: JSON.stringify({ 
          prompt: promptText,
          userId: profile.id
        })
      });

      // Handle server-enforced free search limit
      if (res.status === 403) {
        clearInterval(stepInterval);
        setIsAnalyzing(false);
        const errJson = await res.json();
        openPricingModal(errJson.error || "You've used your 2 free searches. Upgrade to continue using MODEL MATCH AI.");
        showToast("You've used your 2 free searches. Upgrade to continue.");
        await refreshSubscription();
        return;
      }

      let matchData: MatchResult;

      if (res.ok) {
        const json = await res.json();
        matchData = json.data;

        // Sync backend search usage
        if (json.usage) {
          setEntitlements(prev => ({
            ...prev,
            freeSearchesUsed: json.usage.freeSearchesUsed,
            freeSearchLimit: json.usage.freeSearchLimit,
            remainingSearches: json.usage.remainingSearches,
            canSearch: json.usage.isPaid || json.usage.remainingSearches > 0
          }));
          setProfile(prev => ({
            ...prev,
            freeSearchesUsed: json.usage.freeSearchesUsed,
            freeSearchLimit: json.usage.freeSearchLimit
          }));
        }
      } else {
        matchData = matchModelsLocally(promptText, models);
      }

      // Complete steps animation cleanly
      clearInterval(stepInterval);
      setAnalysisStep(5);

      setTimeout(() => {
        setIsAnalyzing(false);
        setCurrentResult(matchData);
        setActiveTab('home');

        // Add to history
        const newHistoryItem: SearchHistoryItem = {
          id: 'hist-' + Date.now(),
          task: promptText,
          recommendedModel: matchData.bestModel.name,
          recommendedModelId: matchData.bestModel.id,
          matchScore: matchData.bestMatchScore,
          category: matchData.detectedCategory,
          optimizedPrompt: matchData.optimizedPrompt,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
          result: matchData
        };

        setHistory(prev => [newHistoryItem, ...prev.slice(0, 49)]);
      }, 500);

    } catch (err) {
      console.warn('API matching failed, using robust offline engine:', err);
      clearInterval(stepInterval);
      const local = matchModelsLocally(promptText, models);
      setIsAnalyzing(false);
      setCurrentResult(local);
    }
  };

  const toggleCompareModel = (modelId: string) => {
    setComparedModelIds(prev => {
      if (prev.includes(modelId)) {
        if (prev.length <= 2) {
          showToast('Keep at least 2 models for comparison.');
          return prev;
        }
        return prev.filter(id => id !== modelId);
      } else {
        if (prev.length >= 4) {
          showToast('You can compare up to 4 models simultaneously.');
          return prev;
        }
        return [...prev, modelId];
      }
    });
  };

  const savePrompt = (promptData: Omit<SavedPrompt, 'id' | 'createdAt'>) => {
    const newPrompt: SavedPrompt = {
      ...promptData,
      id: 'sp-' + Date.now(),
      createdAt: new Date().toISOString()
    };
    setSavedPrompts(prev => [newPrompt, ...prev]);
    showToast('Saved to Prompt Library');
  };

  const deleteSavedPrompt = (id: string) => {
    setSavedPrompts(prev => prev.filter(p => p.id !== id));
    showToast('Prompt removed');
  };

  const toggleFavoritePrompt = (id: string) => {
    setSavedPrompts(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
  };

  const updateSavedPrompt = (id: string, updates: Partial<SavedPrompt>) => {
    setSavedPrompts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Prompt updated');
  };

  const clearHistory = () => {
    setHistory([]);
    showToast('Search history cleared');
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  };

  const openHistoryItem = (item: SearchHistoryItem) => {
    setCurrentPrompt(item.task);
    setCurrentResult(item.result);
    setActiveTab('home');
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
    showToast('Preferences updated');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        models,
        categories,
        isLoadingModels,
        refreshModels,
        addModel,
        updateModel,
        deleteModel,
        resetModelsToDefault,
        currentPrompt,
        setCurrentPrompt,
        currentResult,
        setCurrentResult,
        isAnalyzing,
        analysisStep,
        runMatch,
        comparedModelIds,
        setComparedModelIds,
        toggleCompareModel,
        savedPrompts,
        savePrompt,
        deleteSavedPrompt,
        toggleFavoritePrompt,
        updateSavedPrompt,
        history,
        clearHistory,
        deleteHistoryItem,
        openHistoryItem,
        profile,
        updateProfile,
        entitlements,
        activeSubscription,
        refreshSubscription,
        isPricingModalOpen,
        setIsPricingModalOpen,
        pricingHighlightReason,
        openPricingModal,
        viewportMode,
        setViewportMode,
        showOnboarding,
        setShowOnboarding: (show) => {
          setShowOnboarding(show);
          if (!show) localStorage.setItem('mm_onboarding_completed', 'true');
        },
        isAdminOpen,
        setIsAdminOpen,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
