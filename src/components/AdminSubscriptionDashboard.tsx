import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  AdminSubscriptionStats, 
  GooglePlayTestScenario, 
  SubscriptionPlan 
} from '../types/subscription';
import { 
  ShieldAlert, 
  Terminal, 
  RefreshCw, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  UserCheck, 
  Clock, 
  History, 
  ChevronRight,
  Database,
  Search,
  Filter
} from 'lucide-react';

export const AdminSubscriptionDashboard: React.FC = () => {
  const { profile, refreshSubscription, showToast } = useApp();
  const [stats, setStats] = useState<AdminSubscriptionStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [runningScenario, setRunningScenario] = useState<string | null>(null);
  const [scenarioOutput, setScenarioOutput] = useState<{
    scenario: string;
    message: string;
    details: string;
    resultState: any;
  } | null>(null);

  // Audited override form
  const [selectedUser, setSelectedUser] = useState(profile.id);
  const [overrideAction, setOverrideAction] = useState<'GRANT_PLAN' | 'RESET_SEARCH_COUNTER'>('GRANT_PLAN');
  const [targetPlan, setTargetPlan] = useState<SubscriptionPlan>('pro');
  const [auditReason, setAuditReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/subscriptions');
      if (res.ok) {
        const json = await res.json();
        setStats(json.data);
      }
    } catch (err) {
      console.error('Error loading admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const runTestScenario = async (scenario: GooglePlayTestScenario) => {
    setRunningScenario(scenario);
    try {
      const res = await fetch('/api/admin/subscriptions/test-scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': profile.id
        },
        body: JSON.stringify({ scenario })
      });

      const json = await res.json();
      if (json.success) {
        setScenarioOutput(json.data);
        showToast(`Executed: ${scenario}`);
        await refreshSubscription();
        await fetchStats();
      } else {
        showToast(`Failed: ${json.error}`);
      }
    } catch (err: any) {
      showToast(`Error running scenario: ${err.message}`);
    } finally {
      setRunningScenario(null);
    }
  };

  const handleAuditedAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditReason.trim()) {
      showToast('Mandatory audit reason is required for any admin action.');
      return;
    }

    setSubmittingAction(true);
    try {
      const res = await fetch('/api/admin/subscriptions/action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-email': 'admin@modelmatch.ai'
        },
        body: JSON.stringify({
          userId: selectedUser,
          action: overrideAction,
          reason: auditReason.trim(),
          plan: overrideAction === 'GRANT_PLAN' ? targetPlan : undefined
        })
      });

      const json = await res.json();
      if (json.success) {
        showToast('Audited admin action logged and applied.');
        setAuditReason('');
        await refreshSubscription();
        await fetchStats();
      } else {
        showToast(`Admin error: ${json.error}`);
      }
    } catch (err: any) {
      showToast(`Admin request error: ${err.message}`);
    } finally {
      setSubmittingAction(false);
    }
  };

  const testScenarios: { id: GooglePlayTestScenario; name: string; category: string; description: string }[] = [
    {
      id: 'successful_purchase',
      name: '1. Successful Purchase (PRO)',
      category: 'Purchase Flow',
      description: 'Simulate Google Play approval test card & 30-day active entitlement verification.'
    },
    {
      id: 'canceled_purchase',
      name: '2. Canceled Purchase',
      category: 'Purchase Flow',
      description: 'User cancels inside Google Play payment bottom sheet. Free plan preserved.'
    },
    {
      id: 'pending_purchase',
      name: '3. Pending Purchase (Slow Test Card)',
      category: 'Purchase Flow',
      description: 'Transaction pending banking confirmation. Premium features remain locked.'
    },
    {
      id: 'failed_payment',
      name: '4. Failed Payment',
      category: 'Purchase Flow',
      description: 'Card declined / insufficient funds. Returns error without unlocking.'
    },
    {
      id: 'renewal',
      name: '5. Google Play Renewal',
      category: 'Lifecycle',
      description: 'Simulates automatic monthly renewal webhook, extending expiry by 30 days.'
    },
    {
      id: 'expiration',
      name: '6. Subscription Expiration',
      category: 'Lifecycle',
      description: 'Simulates expired billing period. Drops to Free tier without resetting search count.'
    },
    {
      id: 'cancellation',
      name: '7. User Cancellation',
      category: 'Lifecycle',
      description: 'Turns off auto-renewal; keeps premium access active until expiry date.'
    },
    {
      id: 'restore_purchase',
      name: '8. Restore Purchases',
      category: 'Lifecycle',
      description: 'Queries purchase token index to restore active subscription entitlement.'
    },
    {
      id: 'upgrade_starter_to_pro',
      name: '9. Upgrade Starter -> Pro',
      category: 'Tier Switching',
      description: 'Prorated upgrade via Google Play replacement mode.'
    },
    {
      id: 'upgrade_pro_to_max',
      name: '10. Upgrade Pro -> Max ($100)',
      category: 'Tier Switching',
      description: 'Upgrade to MAX tier; unlocks maximum limits & complete AI discovery.'
    },
    {
      id: 'downgrade_max_to_pro',
      name: '11. Downgrade Max -> Pro',
      category: 'Tier Switching',
      description: 'Downgrade to PRO for next billing cycle.'
    },
    {
      id: 'downgrade_pro_to_starter',
      name: '12. Downgrade Pro -> Starter',
      category: 'Tier Switching',
      description: 'Downgrade to STARTER tier.'
    },
    {
      id: 'account_hold',
      name: '13. Account Hold',
      category: 'Payment Recovery',
      description: 'Payment failed, Google Play placed in Account Hold. Access paused.'
    },
    {
      id: 'grace_period',
      name: '14. Grace Period',
      category: 'Payment Recovery',
      description: 'Payment retrying, Grace Period active. Access temporarily maintained.'
    },
    {
      id: 'reinstall_app',
      name: '15. Reinstalling App',
      category: 'Client State',
      description: 'Re-authenticates and verifies backend persistence of used searches & plan.'
    },
    {
      id: 'another_device_login',
      name: '16. Multi-Device Sign-in',
      category: 'Client State',
      description: 'Syncs verified Google Play subscription on a second concurrent client device.'
    }
  ];

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Top Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-[#1b1c24] to-[#12131a] border border-[#2f3342] shadow-xl flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black text-white uppercase tracking-wider">
              Google Play Billing Engine
            </h2>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
            Official Google Play license tester harness, real-time developer notification audit, and backend database telemetry.
          </p>
        </div>

        <button
          onClick={fetchStats}
          disabled={loading}
          className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
          title="Refresh stats"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Metrics overview */}
      {stats && (
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-2xl bg-[#181B22] border border-[#262B36]">
            <div className="text-[10px] font-bold text-zinc-400 uppercase">Total Accounts</div>
            <div className="text-lg font-black text-white font-mono mt-1">{stats.totalUsers}</div>
            <div className="text-[10px] text-emerald-400 font-medium mt-0.5">
              {stats.totalSubscribers} active paid ({stats.maxUsers} Max, {stats.proUsers} Pro, {stats.starterUsers} Starter)
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#181B22] border border-[#262B36]">
            <div className="text-[10px] font-bold text-zinc-400 uppercase">Monthly Run Rate</div>
            <div className="text-lg font-black text-white font-mono mt-1">${stats.estimatedMonthlyRevenueUsd}</div>
            <div className="text-[10px] text-zinc-400 font-medium mt-0.5">
              {stats.freeUsers} free tier users
            </div>
          </div>
        </div>
      )}

      {/* Test Scenarios Harness */}
      <div className="p-4 rounded-3xl bg-[#181B22] border border-[#262B36] space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#7C4DFF]" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Google Play License Test Scenarios (16 Suites)
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Sandbox Verified</span>
        </div>

        <p className="text-[11px] text-zinc-400">
          Execute any Google Play license test case. Results will execute against your authenticated account and update state authoritative on the server.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-72 overflow-y-auto pr-1">
          {testScenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => runTestScenario(sc.id)}
              disabled={runningScenario !== null}
              className="p-2.5 rounded-xl bg-[#13151b] hover:bg-[#1a1d26] border border-zinc-800 hover:border-zinc-700 text-left transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-zinc-200 group-hover:text-white">
                  <span>{sc.name}</span>
                  <Play className="w-3 h-3 text-zinc-500 group-hover:text-emerald-400 shrink-0" />
                </div>
                <div className="text-[10px] text-zinc-400 mt-1 leading-snug">
                  {sc.description}
                </div>
              </div>
              <span className="text-[9px] font-semibold text-[#7C4DFF] mt-2 block">
                {sc.category}
              </span>
            </button>
          ))}
        </div>

        {/* Live Scenario Result Output */}
        {scenarioOutput && (
          <div className="p-3 rounded-2xl bg-zinc-900 border border-[#7C4DFF]/40 space-y-2 animate-fade-in mt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Result for {scenarioOutput.scenario}:</span>
            </div>
            <div className="text-xs font-semibold text-emerald-300">
              {scenarioOutput.message}
            </div>
            <div className="text-[11px] text-zinc-400">
              {scenarioOutput.details}
            </div>
          </div>
        )}
      </div>

      {/* Audited Admin Actions (Customer Support & Manual Overrides) */}
      <div className="p-4 rounded-3xl bg-[#181B22] border border-[#262B36] space-y-3 shadow-lg">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-black text-white uppercase tracking-wider">
            Audited Administrative Action
          </h3>
        </div>
        <p className="text-[11px] text-zinc-400">
          Manual customer support overrides are logged in the tamper-evident audit ledger with administrator identity and justification.
        </p>

        <form onSubmit={handleAuditedAction} className="space-y-2.5">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 block mb-1">Target Action</label>
              <select
                value={overrideAction}
                onChange={(e: any) => setOverrideAction(e.target.value)}
                className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs"
              >
                <option value="GRANT_PLAN">Grant Subscription Plan</option>
                <option value="RESET_SEARCH_COUNTER">Reset Free Search Counter</option>
              </select>
            </div>

            {overrideAction === 'GRANT_PLAN' && (
              <div>
                <label className="text-[10px] font-bold text-zinc-400 block mb-1">Plan Tier</label>
                <select
                  value={targetPlan}
                  onChange={(e: any) => setTargetPlan(e.target.value)}
                  className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs"
                >
                  <option value="starter">STARTER ($15/mo)</option>
                  <option value="pro">PRO ($29/mo)</option>
                  <option value="max">MAX ($100/mo)</option>
                  <option value="free">FREE ($0/mo)</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-400 block mb-1">
              Mandatory Audit Reason <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. VIP test grant / Customer support ticket #482"
              value={auditReason}
              onChange={(e) => setAuditReason(e.target.value)}
              className="w-full p-2 rounded-xl bg-zinc-900 border border-zinc-700 text-white text-xs placeholder:text-zinc-600"
            />
          </div>

          <button
            type="submit"
            disabled={submittingAction}
            className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>Apply Audited Change</span>
          </button>
        </form>
      </div>

      {/* Real-time Audit Log Stream */}
      <div className="p-4 rounded-3xl bg-[#181B22] border border-[#262B36] space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-zinc-400" />
            <h3 className="text-xs font-black text-white uppercase tracking-wider">
              Audit Event Stream (Last 10)
            </h3>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">Immutable Log</span>
        </div>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {stats?.recentEvents && stats.recentEvents.length > 0 ? (
            stats.recentEvents.slice(0, 10).map((evt) => (
              <div
                key={evt.id}
                className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 text-[11px] space-y-1 font-mono"
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-amber-400">{evt.eventType}</span>
                  <span className="text-zinc-500">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                </div>
                <div className="text-zinc-300 font-sans">{evt.details}</div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-sans">
                  <span>Actor: {evt.actor}</span>
                  {evt.plan && <span className="text-sky-400">• Plan: {evt.plan.toUpperCase()}</span>}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-xs text-zinc-500 font-sans">
              No audit events recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
