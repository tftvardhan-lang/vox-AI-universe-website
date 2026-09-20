import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  UserSubscription, 
  SubscriptionPlan, 
  SubscriptionStatus, 
  GooglePlayProductId, 
  SubscriptionEntitlements, 
  SubscriptionEvent, 
  AdminSubscriptionStats 
} from '../src/types/subscription';

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  freeSearchesUsed: number;
  freeSearchLimit: number;
  activeSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'subscriptions-db.json');

interface DatabaseSchema {
  users: Record<string, UserRecord>;
  subscriptions: Record<string, UserSubscription>;
  events: SubscriptionEvent[];
}

let dbCache: DatabaseSchema = {
  users: {},
  subscriptions: {},
  events: []
};

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Could not create data directory:', err);
  }
}

function loadDatabase() {
  ensureDataDir();
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      dbCache = JSON.parse(raw);
    } else {
      // Seed initial default user
      const defaultUser: UserRecord = {
        id: 'usr-default',
        email: 'tftvardhan@gmail.com',
        name: 'Vardhan',
        freeSearchesUsed: 0,
        freeSearchLimit: 2,
        activeSubscriptionId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      dbCache.users[defaultUser.id] = defaultUser;
      saveDatabase();
    }
  } catch (err) {
    console.warn('Error loading subscriptions database, using memory cache:', err);
  }
}

function saveDatabase() {
  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Error saving subscriptions database to file:', err);
  }
}

// Initial load
loadDatabase();

export const SubscriptionDb = {
  getUserOrCreate(id: string, email = 'tftvardhan@gmail.com', name = 'Vardhan'): UserRecord {
    if (!dbCache.users[id]) {
      dbCache.users[id] = {
        id,
        email,
        name,
        freeSearchesUsed: 0,
        freeSearchLimit: 2,
        activeSubscriptionId: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      saveDatabase();
    }
    return dbCache.users[id];
  },

  getUser(id: string): UserRecord | null {
    return dbCache.users[id] || null;
  },

  incrementFreeSearches(userId: string): { allowed: boolean; used: number; limit: number } {
    const user = this.getUserOrCreate(userId);
    const entitlements = this.getEntitlements(userId);

    // If on active paid plan, searches are not limited by free count
    if (entitlements.isPaid) {
      return { allowed: true, used: user.freeSearchesUsed, limit: user.freeSearchLimit };
    }

    if (user.freeSearchesUsed >= user.freeSearchLimit) {
      return { allowed: false, used: user.freeSearchesUsed, limit: user.freeSearchLimit };
    }

    user.freeSearchesUsed += 1;
    user.updatedAt = new Date().toISOString();
    saveDatabase();

    return { 
      allowed: true, 
      used: user.freeSearchesUsed, 
      limit: user.freeSearchLimit 
    };
  },

  getActiveSubscription(userId: string): UserSubscription | null {
    const user = this.getUserOrCreate(userId);
    if (!user.activeSubscriptionId) {
      // Look up any active subscription for this user
      const found = Object.values(dbCache.subscriptions).find(
        s => s.userId === userId && ['active', 'in_grace_period', 'on_hold'].includes(s.subscriptionStatus)
      );
      if (found) {
        user.activeSubscriptionId = found.id;
        saveDatabase();
        return this.verifyAndCheckExpiry(found);
      }
      return null;
    }

    const sub = dbCache.subscriptions[user.activeSubscriptionId];
    if (!sub) return null;

    return this.verifyAndCheckExpiry(sub);
  },

  verifyAndCheckExpiry(sub: UserSubscription): UserSubscription {
    if (sub.expiryTime) {
      const now = new Date().getTime();
      const expiry = new Date(sub.expiryTime).getTime();
      if (now > expiry && sub.subscriptionStatus !== 'expired') {
        sub.subscriptionStatus = 'expired';
        sub.updatedAt = new Date().toISOString();
        
        // Log expiration event
        this.logEvent({
          userId: sub.userId,
          eventType: 'SUBSCRIPTION_EXPIRED',
          productId: sub.productId || undefined,
          plan: sub.plan,
          details: `Subscription ${sub.id} expired at ${sub.expiryTime}. User returned to Free plan.`,
          actor: 'system'
        });

        saveDatabase();
      }
    }
    return sub;
  },

  getEntitlements(userId: string): SubscriptionEntitlements {
    const user = this.getUserOrCreate(userId);
    const activeSub = this.getActiveSubscription(userId);

    if (activeSub && activeSub.subscriptionStatus === 'active') {
      const plan = activeSub.plan;
      return {
        plan,
        isPaid: true,
        canSearch: true,
        freeSearchesUsed: user.freeSearchesUsed,
        freeSearchLimit: user.freeSearchLimit,
        remainingSearches: Infinity,
        hasPaidModelSearches: true,
        hasPromptOptimization: plan === 'starter' ? 'basic' : plan === 'pro' ? 'advanced' : 'maximum',
        hasModelComparison: true,
        hasDetailedAnalysis: plan === 'pro' || plan === 'max',
        hasPriorityAccess: plan === 'max',
        hasExperimentalFeatures: plan === 'max',
        status: activeSub.subscriptionStatus,
        expiryTime: activeSub.expiryTime,
        autoRenewing: activeSub.autoRenewing
      };
    }

    // In Grace Period: Keep access active temporarily while Google Play retries payment
    if (activeSub && activeSub.subscriptionStatus === 'in_grace_period') {
      const plan = activeSub.plan;
      return {
        plan,
        isPaid: true,
        canSearch: true,
        freeSearchesUsed: user.freeSearchesUsed,
        freeSearchLimit: user.freeSearchLimit,
        remainingSearches: Infinity,
        hasPaidModelSearches: true,
        hasPromptOptimization: plan === 'starter' ? 'basic' : 'advanced',
        hasModelComparison: true,
        hasDetailedAnalysis: plan === 'pro' || plan === 'max',
        hasPriorityAccess: false,
        hasExperimentalFeatures: false,
        status: 'in_grace_period',
        expiryTime: activeSub.expiryTime,
        autoRenewing: false
      };
    }

    // Free plan calculation
    const remaining = Math.max(0, user.freeSearchLimit - user.freeSearchesUsed);
    return {
      plan: 'free',
      isPaid: false,
      canSearch: remaining > 0,
      freeSearchesUsed: user.freeSearchesUsed,
      freeSearchLimit: user.freeSearchLimit,
      remainingSearches: remaining,
      hasPaidModelSearches: false,
      hasPromptOptimization: 'basic',
      hasModelComparison: false,
      hasDetailedAnalysis: false,
      hasPriorityAccess: false,
      hasExperimentalFeatures: false,
      status: activeSub ? activeSub.subscriptionStatus : 'active',
      expiryTime: null,
      autoRenewing: false
    };
  },

  isTokenReplay(purchaseToken: string, requestingUserId: string): boolean {
    const existing = Object.values(dbCache.subscriptions).find(
      s => s.purchaseToken === purchaseToken && s.userId !== requestingUserId
    );
    return Boolean(existing);
  },

  findSubscriptionByToken(purchaseToken: string): UserSubscription | null {
    return Object.values(dbCache.subscriptions).find(s => s.purchaseToken === purchaseToken) || null;
  },

  saveSubscription(sub: UserSubscription): UserSubscription {
    dbCache.subscriptions[sub.id] = sub;
    const user = this.getUserOrCreate(sub.userId);
    if (sub.subscriptionStatus === 'active' || sub.subscriptionStatus === 'in_grace_period') {
      user.activeSubscriptionId = sub.id;
    }
    saveDatabase();
    return sub;
  },

  cancelSubscription(userId: string): { success: boolean; subscription?: UserSubscription; message: string } {
    const sub = this.getActiveSubscription(userId);
    if (!sub) {
      return { success: false, message: 'No active subscription found to cancel.' };
    }

    sub.autoRenewing = false;
    sub.cancellationTime = new Date().toISOString();
    sub.updatedAt = new Date().toISOString();
    saveDatabase();

    this.logEvent({
      userId,
      eventType: 'SUBSCRIPTION_CANCELED',
      productId: sub.productId || undefined,
      plan: sub.plan,
      details: `User canceled auto-renewal. Access remains active until ${sub.expiryTime || 'end of billing cycle'}.`,
      actor: 'user'
    });

    return { 
      success: true, 
      subscription: sub, 
      message: `Subscription auto-renewal canceled. Access remains active until ${sub.expiryTime ? new Date(sub.expiryTime).toLocaleDateString() : 'expiry'}.` 
    };
  },

  logEvent(eventData: Omit<SubscriptionEvent, 'id' | 'timestamp'>): SubscriptionEvent {
    const event: SubscriptionEvent = {
      id: 'evt-' + crypto.randomUUID().slice(0, 8),
      timestamp: new Date().toISOString(),
      ...eventData
    };
    dbCache.events.unshift(event);
    // Keep max 200 events
    if (dbCache.events.length > 200) {
      dbCache.events = dbCache.events.slice(0, 200);
    }
    saveDatabase();
    return event;
  },

  getAdminStats(): AdminSubscriptionStats {
    const allUsers = Object.values(dbCache.users);
    const allSubs = Object.values(dbCache.subscriptions);

    let freeUsers = 0;
    let starterUsers = 0;
    let proUsers = 0;
    let maxUsers = 0;
    let activeSubs = 0;
    let expiredSubs = 0;
    let canceledSubs = 0;
    let pendingSubs = 0;
    let onHoldSubs = 0;
    let graceSubs = 0;
    let estimatedRevenue = 0;

    allUsers.forEach(u => {
      const ent = this.getEntitlements(u.id);
      if (ent.plan === 'free') freeUsers++;
      else if (ent.plan === 'starter') starterUsers++;
      else if (ent.plan === 'pro') proUsers++;
      else if (ent.plan === 'max') maxUsers++;
    });

    allSubs.forEach(s => {
      if (s.subscriptionStatus === 'active') {
        activeSubs++;
        if (s.plan === 'starter') estimatedRevenue += 15;
        if (s.plan === 'pro') estimatedRevenue += 29;
        if (s.plan === 'max') estimatedRevenue += 100;
      } else if (s.subscriptionStatus === 'expired') {
        expiredSubs++;
      } else if (s.subscriptionStatus === 'canceled' || !s.autoRenewing) {
        canceledSubs++;
      } else if (s.subscriptionStatus === 'pending') {
        pendingSubs++;
      } else if (s.subscriptionStatus === 'on_hold') {
        onHoldSubs++;
      } else if (s.subscriptionStatus === 'in_grace_period') {
        graceSubs++;
      }
    });

    return {
      totalUsers: allUsers.length,
      totalSubscribers: starterUsers + proUsers + maxUsers,
      freeUsers,
      starterUsers,
      proUsers,
      maxUsers,
      activeSubscriptions: activeSubs,
      expiredSubscriptions: expiredSubs,
      canceledSubscriptions: canceledSubs,
      pendingTransactions: pendingSubs,
      onHoldSubscriptions: onHoldSubs,
      gracePeriodSubscriptions: graceSubs,
      estimatedMonthlyRevenueUsd: estimatedRevenue,
      recentEvents: dbCache.events.slice(0, 50)
    };
  },

  // Audited administrative plan adjustment (strictly logged)
  adminAuditedAction(
    adminEmail: string, 
    userId: string, 
    action: string, 
    reason: string, 
    plan?: SubscriptionPlan
  ) {
    const user = this.getUserOrCreate(userId);

    if (action === 'grant_plan' && plan && plan !== 'free') {
      const productId: GooglePlayProductId = 
        plan === 'starter' ? 'modelmatch_starter' :
        plan === 'pro' ? 'modelmatch_pro' : 'modelmatch_max';

      const now = new Date();
      const expiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const sub: UserSubscription = {
        id: 'sub-admin-' + crypto.randomUUID().slice(0, 8),
        userId,
        productId,
        plan,
        purchaseToken: 'tok-admin-grant-' + crypto.randomUUID(),
        subscriptionStatus: 'active',
        startTime: now.toISOString(),
        expiryTime: expiry.toISOString(),
        autoRenewing: true,
        cancellationTime: null,
        lastVerifiedAt: now.toISOString(),
        orderId: 'GPA.ADMIN-' + Date.now(),
        priceAmountMicros: plan === 'starter' ? 15000000 : plan === 'pro' ? 29000000 : 100000000,
        priceCurrencyCode: 'USD',
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      };

      this.saveSubscription(sub);

      this.logEvent({
        userId,
        eventType: 'ADMIN_AUDITED_ACTION',
        productId,
        plan,
        details: `Admin ${adminEmail} granted plan ${plan} to user ${userId}. Reason: ${reason}. Order: ${sub.orderId}`,
        actor: 'admin'
      });

      return sub;
    }

    if (action === 'reset_free_searches') {
      user.freeSearchesUsed = 0;
      user.updatedAt = new Date().toISOString();
      saveDatabase();

      this.logEvent({
        userId,
        eventType: 'ADMIN_AUDITED_ACTION',
        details: `Admin ${adminEmail} reset free search counter to 0 for user ${userId}. Reason: ${reason}.`,
        actor: 'admin'
      });

      return user;
    }

    throw new Error('Unsupported admin audited action: ' + action);
  }
};
