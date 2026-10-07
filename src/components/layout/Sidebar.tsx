import React from 'react';
import { useEWS } from '../../context/EWSContext';
import { NavigationTab } from '../../types';

interface NavItem {
  id: NavigationTab;
  label: string;
  badge?: number;
  icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab } = useEWS();

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-[18px] h-[18px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="3" y="14" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/>
        </svg>
      )
    },
    {
      id: 'historical-data',
      label: 'Historical data',
      icon: (
        <svg className="w-[18px] h-[18px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="5" rx="8" ry="3"/>
          <path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6"/>
        </svg>
      )
    },
    {
      id: 'risk-map',
      label: 'Risk map',
      icon: (
        <svg className="w-[18px] h-[18px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14"/>
        </svg>
      )
    },
    {
      id: 'live-monitoring',
      label: 'Live monitoring',
      icon: (
        <svg className="w-[18px] h-[18px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="2"/>
          <path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/>
        </svg>
      )
    },
    {
      id: 'risk-analysis',
      label: 'Risk analysis',
      icon: (
        <svg className="w-[18px] h-[18px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7h10M18 7h2M4 17h2M10 17h10M4 12h4M12 12h8"/>
          <circle cx="16" cy="7" r="2"/>
          <circle cx="8" cy="17" r="2"/>
          <circle cx="10" cy="12" r="2"/>
        </svg>
      )
    },
    {
      id: 'alerts',
      label: 'Alerts',
      badge: 3,
      icon: (
        <svg className="w-[18px] h-[18px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
        </svg>
      )
    },
    {
      id: 'emergency-actions',
      label: 'Emergency actions',
      icon: (
        <svg className="w-[18px] h-[18px] flex-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 4 6v6c0 5 3.4 8 8 9 4.6-1 8-4 8-9V6l-8-3zM9 12l2 2 4-4"/>
        </svg>
      )
    }
  ];

  return (
    <nav 
      aria-label="Navigation"
      className="hidden md:flex flex-col w-[200px] flex-none bg-[var(--panel)] border-r border-[var(--line)] p-[20px_10px] h-screen sticky top-0 overflow-y-auto select-none z-30"
    >
      {/* Brand */}
      <div className="flex items-center gap-[10px] px-[12px] pt-[4px] pb-[20px] text-[19px] font-bold tracking-[-0.02em] text-[var(--ink)]">
        <div className="w-[34px] h-[34px] flex-none rounded-[10px] bg-[#1d63ff] flex items-center justify-center text-white shadow-sm">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 15c3-2 6-2 9 0s6 2 9 0" />
            <path d="M3 9c3-2 6-2 9 0s6 2 9 0" />
          </svg>
        </div>
        <span>FloodWatch</span>
      </div>

      {/* Nav links */}
      <div className="space-y-[2px]">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-[10px] px-[12px] py-[8px] rounded-[6px] text-[15px] transition-colors text-left ${
                isActive
                  ? 'bg-[color-mix(in_srgb,var(--sea)_14%,transparent)] text-[var(--ink)] font-semibold'
                  : 'text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--sea)_6%,transparent)]'
              }`}
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto bg-[var(--crit)] text-white rounded-[9px] px-[7px] text-[12px] font-semibold leading-[18px]">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
