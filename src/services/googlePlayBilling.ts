import { 
  GooglePlayProduct, 
  GooglePlayProductId, 
  GooglePlayPurchase, 
  SubscriptionVerificationResponse, 
  SubscriptionStatusResponse,
  PurchaseState 
} from '../types/subscription';

declare global {
  interface Window {
    AndroidGooglePlayBilling?: {
      launchBillingFlow: (productId: string, accountId: string) => void;
      queryPurchases: () => string;
      isBillingSupported: () => boolean;
    };
    getDigitalGoodsService?: (service: string) => Promise<any>;
  }
}

export const GooglePlayBilling = {
  /**
   * Check if native Android Google Play Billing is available
   */
  isNativeAndroidBillingAvailable(): boolean {
    return Boolean(
      (typeof window !== 'undefined' && window.AndroidGooglePlayBilling?.isBillingSupported?.()) ||
      (typeof window !== 'undefined' && typeof window.getDigitalGoodsService === 'function')
    );
  },

  /**
   * Fetch authoritative products from backend (configured from Google Play Console)
   */
  async getProducts(): Promise<GooglePlayProduct[]> {
    try {
      const res = await fetch('/api/subscriptions/products');
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          return json.data;
        }
      }
    } catch (err) {
      console.warn('Error fetching Google Play products from backend:', err);
    }
    // Fallback default definitions matching requirements
    return [
      {
        productId: 'modelmatch_starter',
        plan: 'starter',
        title: 'MODEL MATCH AI Starter',
        displayName: 'STARTER',
        price: 15,
        currency: 'USD',
        formattedPrice: '$15/month',
        billingPeriod: 'MONTHLY',
        badge: 'LIMITED-TIME DISCOUNT',
        description: 'Essential paid AI model discovery with prompt tuning and comparisons.',
        features: [
          'Paid model searches (unlimited)',
          'Prompt optimization',
          'Side-by-side model comparison',
          'Full search history',
          'Saved prompts library'
        ]
      },
      {
        productId: 'modelmatch_pro',
        plan: 'pro',
        title: 'MODEL MATCH AI Pro',
        displayName: 'PRO',
        price: 29,
        currency: 'USD',
        formattedPrice: '$29/month',
        billingPeriod: 'MONTHLY',
        description: 'Advanced multi-modal model intelligence with deep benchmark dossiers.',
        features: [
          'Advanced model matching',
          'Advanced prompt optimization',
          'Advanced comparisons',
          'Full prompt history & vault folders',
          'Detailed model analysis',
          'Multi-format export directives'
        ]
      },
      {
        productId: 'modelmatch_max',
        plan: 'max',
        title: 'MODEL MATCH AI Max',
        displayName: 'MAX',
        price: 100,
        currency: 'USD',
        formattedPrice: '$100/month',
        billingPeriod: 'MONTHLY',
        badge: 'MOST POPULAR',
        description: 'The complete AI discovery experience with priority frontier model insights.',
        features: [
          'Everything in PRO tier',
          'Maximum usage limits',
          'Advanced personalization',
          'Extended model insights',
          'Priority access to newly supported models',
          'Premium experimental features'
        ]
      }
    ];
  },

  /**
   * Fetch current subscription & entitlement status
   */
  async getSubscriptionStatus(userId: string): Promise<SubscriptionStatusResponse | null> {
    try {
      const res = await fetch('/api/subscriptions/status', {
        headers: { 'x-user-id': userId }
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Error fetching subscription status:', err);
    }
    return null;
  },

  /**
   * Send Google Play Purchase token to backend for server-side verification
   */
  async verifyPurchaseOnBackend(params: {
    userId: string;
    productId: GooglePlayProductId;
    purchaseToken: string;
    orderId?: string;
  }): Promise<SubscriptionVerificationResponse> {
    try {
      const res = await fetch('/api/subscriptions/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': params.userId
        },
        body: JSON.stringify(params)
      });

      const json = await res.json();
      if (!res.ok) {
        return {
          success: false,
          purchaseState: 'FAILED',
          subscriptionStatus: 'expired',
          plan: 'free',
          message: json.error || "We couldn't complete your purchase. Please try again.",
          error: json.error
        };
      }

      return json;
    } catch (err: any) {
      return {
        success: false,
        purchaseState: 'FAILED',
        subscriptionStatus: 'expired',
        plan: 'free',
        message: "We couldn't complete your purchase. Please try again.",
        error: err.message
      };
    }
  },

  /**
   * Restore Purchases
   */
  async restorePurchases(userId: string): Promise<{
    success: boolean;
    restored: boolean;
    message: string;
    entitlements?: any;
  }> {
    try {
      const res = await fetch('/api/subscriptions/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ userId })
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        restored: false,
        message: 'Could not connect to Google Play to restore purchases.'
      };
    }
  },

  /**
   * Cancel Subscription (Directs user to Google Play or flags auto-renewal off)
   */
  async cancelSubscription(userId: string): Promise<{
    success: boolean;
    message: string;
    subscription?: any;
    entitlements?: any;
  }> {
    try {
      const res = await fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ userId })
      });
      return await res.json();
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Error updating subscription status.'
      };
    }
  }
};
