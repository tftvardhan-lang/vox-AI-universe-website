import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, Bookmark, Clock, User, GitCompare } from 'lucide-react';

interface NavItem {
  id: 'home' | 'explore' | 'compare' | 'prompts' | 'history' | 'profile';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, history, savedPrompts, comparedModelIds } = useApp();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { 
      id: 'compare', 
      label: 'Compare', 
      icon: GitCompare,
      badge: comparedModelIds.length > 0 ? comparedModelIds.length : undefined 
    },
    { 
      id: 'prompts', 
      label: 'Prompts', 
      icon: Bookmark, 
      badge: savedPrompts.length > 0 ? savedPrompts.length : undefined 
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: Clock,
      badge: history.length > 0 ? history.length : undefined
    },
    { id: 'profile', label: 'Profile', icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#111318]/95 backdrop-blur-xl border-t border-[#20232B] px-2 py-1.5 max-w-[430px] mx-auto">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-white' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {/* Active Glow Pill */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-[#7C4DFF]/15 to-[#3B82F6]/15 rounded-xl -z-10 border border-[#7C4DFF]/30" />
              )}

              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-[#7C4DFF]' : ''}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[14px] h-[14px] px-1 flex items-center justify-center text-[9px] font-bold rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#3B82F6] text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium transition-colors ${isActive ? 'font-semibold text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
