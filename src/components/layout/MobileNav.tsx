import React, { useState } from 'react';
import { useEWS } from '../../context/EWSContext';
import { NavigationTab } from '../../types';
import { 
  Menu, 
  X, 
  Database, 
  SlidersHorizontal, 
  ShieldCheck, 
  FileText,
  ChevronRight
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useEWS();
  const [showMoreMenu, setShowMoreMenu] = useState<boolean>(false);

  const primaryItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      )
    },
    {
      id: 'risk-map',
      label: 'Map',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>
        </svg>
      )
    },
    {
      id: 'live-monitoring',
      label: 'Live',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="2"/>
          <path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/>
        </svg>
      )
    },
    {
      id: 'alerts',
      label: 'Alerts',
      badge: 3,
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
      )
    }
  ];

  const moreItems: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'historical-data', label: 'Historical Data & Analytics', icon: Database },
    { id: 'risk-analysis', label: 'Risk Analysis & Formula', icon: SlidersHorizontal },
    { id: 'emergency-actions', label: 'Emergency Actions & SASOP', icon: ShieldCheck },
    { id: 'disclaimer', label: 'System Disclaimer & Prototype Notice', icon: FileText }
  ];

  const isMoreActive = moreItems.some(i => i.id === activeTab);

  return (
    <>
      {/* Bottom Floating Navigation Bar */}
      <nav 
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[var(--panel)] border-t border-[var(--line)] grid grid-cols-5 text-[11px] py-1 text-[var(--muted)] shadow-lg select-none"
        style={{ paddingBottom: 'max(4px, env(safe-area-inset-bottom))' }}
      >
        {primaryItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShowMoreMenu(false);
              }}
              className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
                isActive ? 'text-[var(--sea)] font-semibold' : 'text-[var(--muted)]'
              }`}
            >
              {item.icon}
              <span className="mt-0.5">{item.label}</span>
              {item.badge !== undefined && (
                <span className="absolute top-0 right-[25%] bg-[var(--crit)] text-white rounded-full px-1 text-[10px] font-bold leading-tight">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* More Drawer Button */}
        <button
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isMoreActive || showMoreMenu ? 'text-[var(--sea)] font-semibold' : 'text-[var(--muted)]'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="mt-0.5">More</span>
        </button>
      </nav>

      {/* "More" Drawer Modal for Mobile Navigation */}
      {showMoreMenu && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/50 p-3 pb-20 animate-in fade-in duration-150">
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--line)]">
              <span className="text-xs font-bold text-[var(--ink)] uppercase tracking-wider">
                All Modules & Actions
              </span>
              <button 
                onClick={() => setShowMoreMenu(false)}
                className="p-1 rounded text-[var(--muted)] hover:text-[var(--ink)]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setShowMoreMenu(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                      isActive 
                        ? 'bg-[color-mix(in_srgb,var(--sea)_14%,transparent)] text-[var(--ink)]' 
                        : 'text-[var(--ink)] hover:bg-[var(--bg)]'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[var(--sea)]" />
                      <span>{item.label}</span>
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)]" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
