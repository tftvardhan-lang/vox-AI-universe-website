export interface AIModel {
  id: string;
  name: string;
  provider: string;
  category: string;
  supportedTasks: string[];
  description: string;
  strengths: string[];
  weaknesses: string[];
  inputTypes: string[];
  outputTypes: string[];
  speedRating: 1 | 2 | 3 | 4 | 5;
  qualityRating: 1 | 2 | 3 | 4 | 5;
  costCategory: 'Free' | 'Very Low ($)' | 'Low ($)' | 'Moderate ($$)' | 'High ($$$)' | 'Enterprise ($$$$)';
  contextCapability: string;
  scores: {
    video: number;
    image: number;
    writing: number;
    coding: number;
    reasoning: number;
    context: number;
    easeOfUse: number;
    speed: number;
    costEfficiency: number;
  };
  benchmarkScore?: {
    name: string;
    value: string | number;
    verifiedDate: string;
    description: string;
  };
  latestVerifiedStatus: 'Verified Active' | 'New Release' | 'Updated' | 'Beta';
  lastUpdatedDate: string;
  isTrending: boolean;
  isNew: boolean;
  badge?: string;
  iconName?: string;
  color?: string;
}

export interface TaskCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  samplePrompts: string[];
}

export interface ModelAlternative {
  model: AIModel;
  matchScore: number;
  whyAlternative: string;
  differentiator: string;
}

export interface MatchResult {
  id: string;
  originalPrompt: string;
  detectedCategory: string;
  bestModel: AIModel;
  bestMatchScore: number; // Task Match Score (distinct from benchmark)
  whyRecommended: string;
  bestAt: string[];
  tradeOffs: string[];
  alternatives: ModelAlternative[];
  optimizedPrompt: string;
  promptOptimizationExplanation: string;
  clarificationNeeded?: boolean;
  clarificationQuestions?: string[];
  isWeakMatch?: boolean;
  weakMatchReason?: string;
  createdAt: string;
}

export interface SavedPrompt {
  id: string;
  title: string;
  originalText: string;
  optimizedText: string;
  modelId: string;
  modelName: string;
  category: string;
  folder: string;
  isFavorite: boolean;
  createdAt: string;
}

export interface SearchHistoryItem {
  id: string;
  task: string;
  recommendedModel: string;
  recommendedModelId: string;
  matchScore: number;
  category: string;
  optimizedPrompt: string;
  date: string;
  result: MatchResult;
}

export * from './types/subscription';
import { SubscriptionPlan } from './types/subscription';

export interface UserPreferences {
  speedVsQuality: 'speed' | 'balanced' | 'quality';
  budgetPreference: 'all' | 'free_low' | 'moderate' | 'unlimited';
  preferredProviders: string[];
  autoOptimizePrompt: boolean;
  includeTradeoffs: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  plan: SubscriptionPlan;
  freeSearchesUsed: number;
  freeSearchLimit: number;
  theme: 'graphite' | 'indigo' | 'cyber';
  notificationsEnabled: boolean;
  preferences: UserPreferences;
}
