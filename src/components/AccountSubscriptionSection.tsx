import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GooglePlayBilling } from '../services/googlePlayBilling';
import { 
  Crown, 
  Sparkles, 
  RotateCcw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Check, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface AccountSubscriptionSectionProps {
  onOpenPricingModal: () => void;
}

export const AccountSubscriptionSection: React.FC<AccountSubscriptionSectionProps> = ({
  onOpenPricingModal
}) => {
  const { 
    profile, 
    entitlements, 
    activeSubscription, 
    refreshSubscription, 
    showToast 
  } = useApp();

  const [isRestoring, setIsRestoring] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

  const isPaid = entitlements.isPaid && entitlements.plan !== 'free';
  const isCanceled = activeSubscription && !activeSubscription.autoRenewing && activeSubscription.subscriptionStatus === 'active';
  const isPending = activeSubscription?.subscriptionStatus === 'pending';
  const isGrace = activeSubscription?.subscriptionStatus === 'in_grace_period';
  const isOnHold = activeSubscription?.subscriptionStatus === 'on_hold';

  const planName = entitlements.plan.toUpperCase();
  const expiryDate = activeSubscription?.expiryTime 
    ? new Date(activeSubscription.expiryTime).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Active';

  // Directs user to Google Play Subscriptions management center
  const handleManageSubscription = () => {
    const sku = activeSubscription?.productId || 'modelmatch_pro';
    const googlePlayUrl = `https://play.google.com/store/account/subscriptions?sku=${sku}&package=com.modelmatch.ai`;
    window.open(googlePlayUrl, '_blank');
  };

  const handleRestorePurchases = async () => {
    setIsRestoring(true);
    try {
      const res = await GooglePlayBilling.restorePurchases(profile.id);
      await refreshSubscription();
      if (res.restored) {
        showToast('Purchases restored successfully');
      } else {
        showToast('No active Google Play purchases found to restore.');
      }
    } catch {
      showToast('Error querying Google Play.');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleSimulateCancelAutoRenew = async () => {
    setIsCanceling(true);
    try {
      const res = await GooglePlayBilling.cancelSubscription(profile.id);
      await refreshSubscription();
      showToast(res.message);
    } catch (err: any) {
      showToast(err.message || 'Error updating subscription');
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
          YOUR PLAN
        </span>
        <span className="text-[10px] text-zinc-500 font-mono">
          Google Play Billing
        </span>
      </div>

      {isPaid ? (
        /* Paid Subscription Active (STARTER / PRO / MAX) */
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#1a1728] to-[#12141f] border border-[#7C4DFF]/40 relative overflow-hidden shadow-xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black text-white tracking-tight">
                  {planName}
                </h3>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isCanceled
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : isGrace
                    ? 'bg-amber-500/20 text-amber-300'
                    : isOnHold
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {isCanceled 
                    ? 'Canceled (Active until expiry)' 
                    : isGrace 
                    ? 'Grace Period' 
                    : isOnHold 
                    ? 'On Hold' 
                    : 'Active'}
                </span>

                <span className="text-xs text-zinc-300">
                  {isCanceled ? `Access until: ${expiryDate}` : `Renews: ${expiryDate}`}
                </span>
              </div>
            </div>

            <span className="text-xs font-mono font-bold text-amber-400">
              {entitlements.plan === 'starter' ? '$15/mo' : entitlements.plan === 'pro' ? '$29/mo' : '$100/mo'}
            </span>
          </div>

          {/* Cancellation Notice if auto-renew canceled */}
          {isCanceled && (
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-1">
              <div className="font-bold text-white">Subscription canceled</div>
              <p className="text-[11px] leading-relaxed text-zinc-300">
                Your {planName} access remains active until {expiryDate}.
              </p>
            </div>
          )}

          {/* Entitlement highlights */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[11px] font-semibold text-zinc-400">Active Entitlements:</div>
            {[
              'Unlimited AI Task Matching',
              entitlements.plan === 'starter' 
                ? 'Prompt Optimization & Comparison' 
                : 'Advanced Model Analysis & Prompt Engineering',
              entitlements.plan === 'max' 
                ? 'Priority Frontier Lab Routing & Extended Insights' 
                : 'Verified Frontier Benchmarks'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-zinc-200">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-2 h-2" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Buttons: Manage Subscription + Restore Purchases */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#262B36]">
            <button
              onClick={handleManageSubscription}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#7C4DFF]/20 cursor-pointer"
            >
              <span>Manage Subscription</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleRestorePurchases}
              disabled={isRestoring}
              className="py-2.5 px-3 rounded-xl bg-[#20232B] hover:bg-zinc-800 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all border border-zinc-700 cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
              <span>Restore Purchases</span>
            </button>
          </div>

          {/* Change Plan / Switch Tier Button */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <button
              onClick={onOpenPricingModal}
              className="text-[#7C4DFF] hover:underline font-semibold flex items-center gap-1"
            >
              <span>Change Subscription Tier (Upgrade / Downgrade)</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            {!isCanceled && (
              <button
                onClick={handleSimulateCancelAutoRenew}
                disabled={isCanceling}
                className="text-zinc-500 hover:text-zinc-300 text-[10px] underline"
              >
                Turn off Auto-Renew
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Free Plan Layout */
        <div className="p-5 rounded-3xl bg-[#181B22] border border-[#262B36] space-y-4 shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                FREE
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                {entitlements.freeSearchesUsed} of {entitlements.freeSearchLimit} free searches used
              </p>
            </div>

            <span className="text-xs font-mono font-bold text-zinc-400">
              $0/month
            </span>
          </div>

          {/* Progress meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-zinc-400">
              <span>Usage Limit</span>
              <span>{Math.max(0, entitlements.freeSearchLimit - entitlements.freeSearchesUsed)} remaining</span>
            </div>
            <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  entitlements.freeSearchesUsed >= entitlements.freeSearchLimit
                    ? 'bg-rose-500'
                    : 'bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6]'
                }`}
                style={{ width: `${Math.min(100, (entitlements.freeSearchesUsed / entitlements.freeSearchLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* Free searches exhausted message */}
          {entitlements.freeSearchesUsed >= entitlements.freeSearchLimit && (
            <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-white">You've used your 2 free searches.</div>
                <p className="text-[11px] text-zinc-300 mt-0.5">
                  Upgrade to continue using MODEL MATCH AI.
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2 pt-1">
            <button
              onClick={onOpenPricingModal}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] hover:opacity-95 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#7C4DFF]/30 cursor-pointer"
            >
              <span>Upgrade Plan</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleRestorePurchases}
              disabled={isRestoring}
              className="w-full py-2 text-center text-xs font-semibold text-zinc-400 hover:text-white flex items-center justify-center gap-1.5"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRestoring ? 'animate-spin' : ''}`} />
              <span>Restore Purchases</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
