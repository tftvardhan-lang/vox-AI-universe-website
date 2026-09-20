import React, { useState } from 'react';
import { AppLogo } from './AppLogo';
import { 
  GooglePlayProduct, 
  PurchaseState 
} from '../types/subscription';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  X, 
  ChevronRight, 
  ShieldCheck, 
  CreditCard, 
  Smartphone,
  Check
} from 'lucide-react';

interface GooglePlayBottomSheetProps {
  product: GooglePlayProduct;
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: (result: {
    state: PurchaseState;
    purchaseToken?: string;
    orderId?: string;
  }) => void;
  userEmail: string;
}

type TestPaymentOption = 
  | 'google_pay_visa'
  | 'google_play_balance'
  | 'test_card_approve'
  | 'test_card_pending'
  | 'test_card_decline';

export const GooglePlayBottomSheet: React.FC<GooglePlayBottomSheetProps> = ({
  product,
  isOpen,
  onClose,
  onPurchaseComplete,
  userEmail
}) => {
  const [selectedPayment, setSelectedPayment] = useState<TestPaymentOption>('test_card_approve');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentPicker, setShowPaymentPicker] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      if (selectedPayment === 'test_card_decline') {
        onPurchaseComplete({
          state: 'FAILED',
          purchaseToken: `tok_test_fail_declined_${Date.now()}`
        });
        return;
      }

      if (selectedPayment === 'test_card_pending') {
        const orderId = `GPA.${Math.floor(Math.random() * 8999 + 1000)}-${Math.floor(Math.random() * 8999 + 1000)}-${Math.floor(Math.random() * 89999 + 10000)}`;
        onPurchaseComplete({
          state: 'PENDING',
          purchaseToken: `tok_test_pending_slow_test_card_${Date.now()}`,
          orderId
        });
        return;
      }

      // Success approval: standard or test
      const orderId = `GPA.${Math.floor(Math.random() * 8999 + 1000)}-${Math.floor(Math.random() * 8999 + 1000)}-${Math.floor(Math.random() * 89999 + 10000)}`;
      const purchaseToken = `tok_googleplay_${product.productId}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      onPurchaseComplete({
        state: 'PURCHASED',
        purchaseToken,
        orderId
      });
    }, 1200);
  };

  const handleCancel = () => {
    onPurchaseComplete({
      state: 'CANCELED'
    });
    onClose();
  };

  const paymentMethods = [
    {
      id: 'test_card_approve' as const,
      name: 'Google Play License Test (Always Approves)',
      sub: 'Official Google Play Developer Sandbox Account',
      tag: 'TESTER READY'
    },
    {
      id: 'google_pay_visa' as const,
      name: 'Google Pay •••• 4122',
      sub: 'Visa via Google Account',
      tag: 'GOOGLE PAY'
    },
    {
      id: 'google_play_balance' as const,
      name: 'Google Play Balance: $45.00',
      sub: 'Available credit on Google Play',
      tag: 'PLAY BALANCE'
    },
    {
      id: 'test_card_pending' as const,
      name: 'Test Card (Payment Pending / Slow Card)',
      sub: 'Simulates delayed payment clearance',
      tag: 'TEST PENDING'
    },
    {
      id: 'test_card_decline' as const,
      name: 'Test Card (Payment Declined)',
      sub: 'Simulates insufficient funds / bank decline',
      tag: 'TEST DECLINE'
    }
  ];

  const currentPayment = paymentMethods.find(m => m.id === selectedPayment) || paymentMethods[0];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-[430px] mx-auto bg-[#1f2125] text-white rounded-t-3xl border-t border-zinc-700/60 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]"
      >
        {/* Top Google Play Sheet Drag Handle */}
        <div className="flex items-center justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-600/80" />
        </div>

        {/* Google Play App Bar */}
        <div className="px-5 py-2.5 flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-2">
            {/* Google Play Triangle Logo */}
            <div className="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
                <path d="M3.6 1.8A1.8 1.8 0 0 0 3 3.3v17.4c0 .6.2 1.1.6 1.5l.1.1 9.8-9.8v-.2L3.7 1.7l-.1.1z" fill="#00C3FF"/>
                <path d="M17.1 15.7l-3.6-3.6v-.2l3.6-3.6.1.1 4.3 2.5c1.2.7 1.2 1.8 0 2.5l-4.4 2.3z" fill="#FFD400"/>
                <path d="M13.5 12.1L3.6 22.2c.4.4 1.1.4 1.8 0l11.7-6.5-3.6-3.6z" fill="#FF334B"/>
                <path d="M13.5 11.9l3.6-3.6L5.4 1.8c-.7-.4-1.4-.4-1.8 0L13.5 11.9z" fill="#00F27A"/>
              </svg>
            </div>
            <span className="text-xs font-medium text-zinc-300">Google Play</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-zinc-400 font-mono">{userEmail}</span>
            <button 
              onClick={handleCancel}
              className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Summary Header */}
        <div className="px-5 pt-4 pb-3 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <AppLogo size={42} withGlow className="shadow-md shadow-orange-500/20 ring-1 ring-orange-500/30" />
            <div className="space-y-0.5">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                MODEL MATCH AI
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {product.displayName} Subscription
              </h2>
              <p className="text-xs text-zinc-300">
                {product.formattedPrice}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-[#00875a]/20 text-[#00c37b] border border-[#00875a]/40 uppercase tracking-wider">
              Play Store
            </span>
          </div>
        </div>

        {/* Terms details */}
        <div className="px-5 py-2.5 mx-5 rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-[11px] text-zinc-300 space-y-1.5">
          <div className="flex justify-between font-medium">
            <span>Starting today</span>
            <span className="text-white font-bold">{product.formattedPrice}</span>
          </div>
          <div className="flex justify-between text-zinc-400 text-[10px]">
            <span>Billing cycle</span>
            <span>Monthly, auto-renewing</span>
          </div>
          <p className="text-[10px] text-zinc-400 leading-normal pt-1 border-t border-zinc-700/40">
            Cancel anytime in <span className="text-sky-400 font-medium">Subscriptions</span> on Google Play. No contract.
          </p>
        </div>

        {/* Payment Method Selector */}
        <div className="px-5 pt-3 pb-2">
          <label className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block mb-1.5">
            Payment Method
          </label>

          {!showPaymentPicker ? (
            <button
              type="button"
              onClick={() => setShowPaymentPicker(true)}
              className="w-full p-3 rounded-xl bg-zinc-800/90 border border-zinc-700 hover:border-zinc-500 text-left flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-700 flex items-center justify-center text-zinc-300">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{currentPayment.name}</span>
                  </div>
                  <div className="text-[10px] text-zinc-400">{currentPayment.sub}</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-400" />
            </button>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {paymentMethods.map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => {
                    setSelectedPayment(method.id);
                    setShowPaymentPicker(false);
                  }}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                    selectedPayment === method.id 
                      ? 'bg-sky-500/10 border-sky-500 text-white' 
                      : 'bg-zinc-800/60 border-zinc-700/70 text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-xs text-white">{method.name}</div>
                    <div className="text-[10px] text-zinc-400">{method.sub}</div>
                  </div>
                  {selectedPayment === method.id && (
                    <Check className="w-4 h-4 text-sky-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Security & Official Notice */}
        <div className="px-5 py-2 flex items-center gap-2 text-[10px] text-zinc-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00c37b] shrink-0" />
          <span>Secured by Google Play Billing. Authoritative price charged by Google.</span>
        </div>

        {/* Bottom Actions */}
        <div className="p-5 pt-2 space-y-2 bg-[#1f2125]">
          <button
            type="button"
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full py-3 px-4 rounded-full bg-[#00875a] hover:bg-[#00744d] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authorizing with Google Play…</span>
              </>
            ) : (
              <span>Subscribe • {product.formattedPrice}</span>
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-full py-2 text-center text-xs font-semibold text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
