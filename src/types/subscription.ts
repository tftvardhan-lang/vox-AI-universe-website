export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'max';

export type GooglePlayProductId = 'modelmatch_starter' | 'modelmatch_pro' | 'modelmatch_max';

export type SubscriptionStatus = 
  | 'free'
  | 'active' 
  | 'pending' 
  | 'canceled' 
  | 'expired' 
  | 'in_grace_period' 
  | 'on_hold';

export type PurchaseState = 'PURCHASED' | 'PENDING' | 'CANCELED' | 'FAILED';

export interface GooglePlayProduct {
  productId: GooglePlayProductId;
  plan: SubscriptionPlan;
  title: string;
  displayName: string;
  price: number;
  currency: string;
  formattedPrice: string;
  billingPeriod: 'MONTHLY';
  badge?: 'LIMITED-TIME DISCOUNT' | 'MOST POPULAR';
  description: string;
  features: string[];
}

export interface GooglePlayPurchase {
  orderId: string;
  packageName: string;
  productId: GooglePlayProductId;
  purchaseTime: number;
  purchaseState: PurchaseState;
  purchaseToken: string;
  autoRenewing: boolean;
  acknowledged: boolean;
  obfuscatedAccountId?: string;
  obfuscatedProfileId?: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  productId: GooglePlayProductId | null;
  plan: SubscriptionPlan;
  purchaseToken?: string;
  subscriptionStatus: SubscriptionStatus;
  startTime: string | null;
  expiryTime: string | null;
  autoRenewing: boolean;
  cancellationTime: string | null;
  lastVerifiedAt: string;
  orderId?: string;
  priceAmountMicros?: number;
  priceCurrencyCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionEntitlements {
  plan: SubscriptionPlan;
  isPaid: boolean;
  canSearch: boolean;
  freeSearchesUsed: number;
  freeSearchLimit: number;
  remainingSearches: number; // For free: 2 - used. For paid: Infinity
  hasPaidModelSearches: boolean;
  hasPromptOptimization: 'basic' | 'advanced' | 'maximum';
  hasModelComparison: boolean;
  hasDetailedAnalysis: boolean;
  hasPriorityAccess: boolean;
  hasExperimentalFeatures: boolean;
  status: SubscriptionStatus;
  expiryTime: string | null;
  autoRenewing: boolean;
}

export interface SubscriptionStatusResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    freeSearchesUsed: number;
    freeSearchLimit: number;
  };
  subscription: UserSubscription | null;
  entitlements: SubscriptionEntitlements;
  products: GooglePlayProduct[];
}

export interface SubscriptionVerificationRequest {
  userId: string;
  productId: GooglePlayProductId;
  purchaseToken: string;
  orderId?: string;
  oldPurchaseToken?: string; // for upgrades / downgrades
  replacementMode?: number; // ProrationMode
}

export interface SubscriptionVerificationResponse {
  success: boolean;
  purchaseState: PurchaseState;
  subscriptionStatus: SubscriptionStatus;
  plan: SubscriptionPlan;
  message: string;
  subscription?: UserSubscription;
  entitlements?: SubscriptionEntitlements;
  error?: string;
}

export interface SubscriptionEvent {
  id: string;
  userId: string;
  eventType: 
    | 'PURCHASE_VERIFIED'
    | 'SUBSCRIPTION_RENEWED'
    | 'SUBSCRIPTION_CANCELED'
    | 'SUBSCRIPTION_EXPIRED'
    | 'PAYMENT_PENDING'
    | 'PAYMENT_FAILED'
    | 'ON_HOLD'
    | 'GRACE_PERIOD'
    | 'PLAN_CHANGED'
    | 'PURCHASES_RESTORED'
    | 'RTDN_NOTIFICATION'
    | 'ADMIN_AUDITED_ACTION';
  productId?: string;
  plan?: string;
  details: string;
  timestamp: string;
  actor: 'user' | 'google_play' | 'system' | 'admin';
}

export interface AdminSubscriptionStats {
  totalUsers: number;
  totalSubscribers: number;
  freeUsers: number;
  starterUsers: number;
  proUsers: number;
  maxUsers: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
  canceledSubscriptions: number;
  pendingTransactions: number;
  onHoldSubscriptions: number;
  gracePeriodSubscriptions: number;
  estimatedMonthlyRevenueUsd: number;
  recentEvents: SubscriptionEvent[];
}

export type GooglePlayTestScenario = 
  | 'successful_purchase'
  | 'canceled_purchase'
  | 'pending_purchase'
  | 'failed_payment'
  | 'renewal'
  | 'expiration'
  | 'cancellation'
  | 'restore_purchase'
  | 'upgrade_starter_to_pro'
  | 'upgrade_pro_to_max'
  | 'downgrade_max_to_pro'
  | 'downgrade_pro_to_starter'
  | 'account_hold'
  | 'grace_period'
  | 'reinstall_app'
  | 'another_device_login';
