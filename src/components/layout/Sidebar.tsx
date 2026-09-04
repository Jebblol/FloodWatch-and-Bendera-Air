import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Database, 
  Radio, 
  SlidersHorizontal, 
  BellRing, 
  ShieldCheck, 
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useEWS } from '../../context/EWSContext';
import { NavigationTab } from '../../types';
import { PRESET_SCENARIOS } from '../../data/aseanData';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'historical-data', label: 'Historical Data', icon: Database },
  { id: 'risk-map', label: 'Risk Map', icon: Map },
  { id: 'live-monitoring', label: 'Live Monitoring', icon: Radio, badge: 'Live' },
  { id: 'risk-analysis', label: 'Risk Analysis', icon: SlidersHorizontal },
  { id: 'alerts', label: 'Alerts', icon: BellRing },
  { id: 'emergency-actions', label: 'Emergency Actions', icon: ShieldCheck },
];

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    threatAssessment,
    selectedCountry,
    loadPresetScenario
  } = useEWS();

  return (
    <aside className="hidden md:flex w-60 bg-white border-r border-slate-200 flex-col justify-between flex-shrink-0 select-none">
      {/* Top Navigation Links */}
      <div className="p-3 space-y-6">
        {/* Navigation Section */}
        <div>
          <div className="px-3 pb-2 text-[11px] font-medium text-slate-400">
            Navigation
          </div>
          <nav className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-blue-100 text-blue-700">
                      {item.badge}
                    </span>
                  )}
                  {item.id === 'alerts' && threatAssessment.level !== 'LOW' && (
                    <span className={`w-2 h-2 rounded-full ${threatAssessment.pulseColor}`} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Demo Scenarios */}
        <div className="pt-3 border-t border-slate-100">
          <div className="px-3 pb-2 flex items-center justify-between text-[11px] font-medium text-slate-400">
            <span>Demo Scenarios</span>
          </div>
          <div className="space-y-1">
            {PRESET_SCENARIOS.slice(0, 3).map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => loadPresetScenario(scenario)}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-xs transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-700 font-medium group-hover:text-blue-600 truncate text-[11px]">
                    {scenario.countryId} — {scenario.threatLevel}
                  </span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform" />
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  {scenario.title.split(' - ')[0]}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2.5">
        {/* Prototype Disclaimer Notice (Figma-grade subtle amber style) */}
        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs space-y-1.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px]">
            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Prototype / Demo Only</span>
          </div>
          <p className="text-[10px] text-amber-800 leading-snug">
            This EWS is an ASEAN DSE prototype. Flood forecasts, risk scores, and sensor readings are simulated for demonstration purposes and are not real-time predictions.
          </p>
          <button
            onClick={() => setActiveTab('disclaimer')}
            className="text-[10px] font-semibold text-amber-900 hover:text-amber-950 flex items-center gap-0.5 hover:underline pt-0.5 transition-colors"
          >
            <span>View Full Disclaimer →</span>
          </button>
        </div>

        {/* Viewing Country Status */}
        <div className="p-2 rounded-lg bg-white border border-slate-200 text-xs">
          <div className="flex items-center justify-between text-slate-500 mb-0.5">
            <span className="text-[10px]">Viewing:</span>
            <span className="font-semibold text-slate-800 text-[11px]">{selectedCountry.name}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400 text-[10px]">
            <span>Recorded Events:</span>
            <span className="font-semibold text-slate-700">{selectedCountry.events !== null ? `${selectedCountry.events}` : 'N/A'}</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
