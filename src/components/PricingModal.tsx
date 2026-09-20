import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { AppLogo } from './AppLogo';
import { 
  GooglePlayProduct, 
  SubscriptionPlan, 
  PurchaseState 
} from '../types/subscription';
import { GooglePlayBilling } from '../services/googlePlayBilling';
import { GooglePlayBottomSheet } from './GooglePlayBottomSheet';
import { 
  X, 
  Check, 
  Crown, 
  Sparkles, 
  ShieldCheck, 
  RotateCcw, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Zap,
  ArrowRight
} from 'lucide-react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightReason?: string;
}

export const PricingModal: React.FC<PricingModalProps> = ({
  isOpen,
  onClose,
  highlightReason
}) => {
  const { 
    profile, 
    entitlements, 
    refreshSubscription, 
    showToast 
  } = useApp();

  const [products, setProducts] = useState<GooglePlayProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<GooglePlayProduct | null>(null);
  const [isGooglePlaySheetOpen, setIsGooglePlaySheetOpen] = useState(false);
  const [purchaseStatusBanner, setPurchaseStatusBanner] = useState<{
    type: 'success' | 'pending' | 'canceled' | 'failed';
    title: string;
    description: string;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    if (isOpen) {
      GooglePlayBilling.getProducts().then(prods => {
        setProducts(prods);
      });
      setPurchaseStatusBanner(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSelectPlan = (product: GooglePlayProduct) => {
    setSelectedProduct(product);
    setIsGooglePlaySheetOpen(true);
  };

  const handlePurchaseCompleted = async (result: {
    state: PurchaseState;
    purchaseToken?: string;
    orderId?: string;
  }) => {
    setIsGooglePlaySheetOpen(false);

    if (result.state === 'CANCELED') {
      setPurchaseStatusBanner({
        type: 'canceled',
        title: 'Purchase canceled',
        description: 'No charges were made. You can choose a plan whenever you are ready.'
      });
      return;
    }

    if (result.state === 'FAILED') {
      setPurchaseStatusBanner({
        type: 'failed',
        title: "We couldn't complete your purchase. Please try again.",
        description: 'Google Play reported a payment authorization failure.'
      });
      return;
    }

    if (result.state === 'PENDING') {
      setPurchaseStatusBanner({
        type: 'pending',
        title: 'Payment pending',
        description: 'Your subscription will activate after Google Play confirms the payment.'
      });
      // Also register on backend
      if (selectedProduct && result.purchaseToken) {
        await GooglePlayBilling.verifyPurchaseOnBackend({
          userId: profile.id,
          productId: selectedProduct.productId,
          purchaseToken: result.purchaseToken,
          orderId: result.orderId
        });
        await refreshSubscription();
      }
      return;
    }

    if (result.state === 'PURCHASED' && selectedProduct && result.purchaseToken) {
      setIsVerifying(true);
      try {
        // Official backend verification
        const verifyRes = await GooglePlayBilling.verifyPurchaseOnBackend({
          userId: profile.id,
          productId: selectedProduct.productId,
          purchaseToken: result.purchaseToken,
          orderId: result.orderId
        });

        await refreshSubscription();

        if (verifyRes.success && verifyRes.subscriptionStatus === 'active') {
          if (selectedProduct.plan === 'max') {
            setPurchaseStatusBanner({
              type: 'success',
              title: 'MAX ACTIVATED',
              description: 'Welcome to the complete AI discovery experience.'
            });
            showToast('MAX Activated - Welcome to frontier AI intelligence!');
          } else {
            setPurchaseStatusBanner({
              type: 'success',
              title: 'Subscription Activated',
              description: `You're now on ${selectedProduct.displayName}.`
            });
            showToast(`Subscription Activated: You're now on ${selectedProduct.displayName}.`);
          }
        } else {
          setPurchaseStatusBanner({
            type: 'failed',
            title: "We couldn't complete your purchase. Please try again.",
            description: verifyRes.message || 'Verification could not be completed.'
          });
        }
      } catch (err: any) {
        setPurchaseStatusBanner({
          type: 'failed',
          title: "We couldn't complete your purchase. Please try again.",
          description: err.message || 'Network error verifying with Google Play.'
        });
      } finally {
        setIsVerifying(false);
      }
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const res = await GooglePlayBilling.restorePurchases(profile.id);
      await refreshSubscription();
      if (res.restored) {
        setPurchaseStatusBanner({
          type: 'success',
          title: 'Purchases restored successfully',
          description: res.message
        });
        showToast('Purchases restored successfully');
      } else {
        showToast('No active Google Play subscription found to restore.');
      }
    } catch {
      showToast('Error communicating with Google Play.');
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-sm bg-[#14171d] border border-[#262B36] rounded-3xl p-5 space-y-4 shadow-2xl relative animate-scale-up my-auto max-h-[95vh] overflow-y-auto no-scrollbar">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-2 flex flex-col items-center">
          <div className="mb-2">
            <AppLogo size={46} withGlow className="shadow-lg shadow-orange-500/20 ring-1 ring-orange-500/30" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7C4DFF]/15 text-[#7C4DFF] text-[10px] font-extrabold uppercase tracking-wider mb-1.5 border border-[#7C4DFF]/30">
            <Sparkles className="w-3 h-3" />
            <span>Google Play Subscription</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Choose Your Plan
          </h2>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            {highlightReason || 'Find the right frontier AI models and unlock precision prompt synthesis.'}
          </p>
        </div>

        {/* Status Notification Banner */}
        {purchaseStatusBanner && (
          <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 animate-slide-down ${
            purchaseStatusBanner.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
              : purchaseStatusBanner.type === 'pending'
              ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
              : purchaseStatusBanner.type === 'canceled'
              ? 'bg-zinc-800/80 border-zinc-700 text-zinc-300'
              : 'bg-rose-500/10 border-rose-500/40 text-rose-300'
          }`}>
            {purchaseStatusBanner.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
            {purchaseStatusBanner.type === 'pending' && <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
            {purchaseStatusBanner.type === 'canceled' && <AlertCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />}
            {purchaseStatusBanner.type === 'failed' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
            <div className="space-y-0.5">
              <div className="font-bold text-white">{purchaseStatusBanner.title}</div>
              <div className="text-[11px] leading-relaxed">{purchaseStatusBanner.description}</div>
            </div>
          </div>
        )}

        {/* Free Plan Status Indicator */}
        <div className="p-3 rounded-2xl bg-[#1a1d24] border border-zinc-800 flex items-center justify-between text-xs">
          <div>
            <div className="font-bold text-zinc-300">FREE PLAN</div>
            <div className="text-[10px] text-zinc-400">
              {entitlements.freeSearchesUsed} of {entitlements.freeSearchLimit} free AI searches used
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
            entitlements.canSearch 
              ? 'bg-zinc-800 text-zinc-300' 
              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
          }`}>
            {entitlements.canSearch ? 'Active' : 'Exhausted'}
          </span>
        </div>

        {/* Products List */}
        <div className="space-y-3 pt-1">
          {products.map((p) => {
            const isCurrentPlan = entitlements.plan === p.plan && entitlements.isPaid;
            const isMax = p.plan === 'max';
            const isPro = p.plan === 'pro';

            return (
              <div
                key={p.productId}
                className={`p-4 rounded-2xl border transition-all relative overflow-hidden ${
                  isMax 
                    ? 'bg-gradient-to-br from-[#1a162b] to-[#12141f] border-[#7C4DFF]/60 shadow-lg shadow-[#7C4DFF]/15' 
                    : isPro
                    ? 'bg-gradient-to-br from-[#161a2b] to-[#12141f] border-[#3B82F6]/50'
                    : 'bg-[#181B22] border-[#262B36]'
                }`}
              >
                {/* Badge if present */}
                {p.badge && (
                  <div className="absolute top-0 right-0">
                    <span className="text-[9px] font-black px-2.5 py-0.5 rounded-bl-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white uppercase tracking-wider shadow-sm">
                      {p.badge}
                    </span>
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-base font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                      {isMax && <Crown className="w-4 h-4 text-amber-400" />}
                      <span>{p.displayName}</span>
                    </div>
                    <div className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-300 font-mono mt-0.5">
                      {p.formattedPrice}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-zinc-300 leading-relaxed mb-3">
                  {p.description}
                </p>

                {/* Features */}
                <div className="space-y-1.5 mb-3.5">
                  {p.features.map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-zinc-300">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handleSelectPlan(p)}
                  disabled={isCurrentPlan || isVerifying}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md cursor-pointer ${
                    isCurrentPlan
                      ? 'bg-zinc-800 text-zinc-400 border border-zinc-700 cursor-default'
                      : isMax
                      ? 'bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white hover:opacity-95 shadow-[#7C4DFF]/30'
                      : 'bg-[#20232B] hover:bg-zinc-800 text-white border border-zinc-700'
                  }`}
                >
                  {isCurrentPlan ? (
                    <span>Current Plan</span>
                  ) : (
                    <>
                      <span>GET {p.displayName}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* Restore Purchases & Security Footer */}
        <div className="pt-2 border-t border-[#262B36] flex items-center justify-between text-[11px] text-zinc-400">
          <button
            onClick={handleRestore}
            disabled={isRestoring}
            className="flex items-center gap-1.5 text-zinc-300 hover:text-white font-medium hover:underline"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
            <span>Restore Purchases</span>
          </button>

          <div className="flex items-center gap-1 text-[10px] text-zinc-500">
            <ShieldCheck className="w-3 h-3 text-[#00c37b]" />
            <span>Google Play Verified</span>
          </div>
        </div>
      </div>

      {/* Official Google Play Native Bottom Sheet Modal */}
      {selectedProduct && (
        <GooglePlayBottomSheet
          product={selectedProduct}
          isOpen={isGooglePlaySheetOpen}
          onClose={() => setIsGooglePlaySheetOpen(false)}
          onPurchaseComplete={handlePurchaseCompleted}
          userEmail={profile.email}
        />
      )}
    </div>
  );
};
