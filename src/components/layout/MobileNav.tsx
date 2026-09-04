import React, { useState } from 'react';
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
  X,
  AlertTriangle
} from 'lucide-react';
import { useEWS } from '../../context/EWSContext';
import { NavigationTab } from '../../types';

interface MobileNavItem {
  id: NavigationTab;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  { id: 'overview', label: 'Overview', shortLabel: 'Overview', icon: LayoutDashboard },
  { id: 'risk-map', label: 'Risk Map', shortLabel: 'Map', icon: Map },
  { id: 'live-monitoring', label: 'Live Monitoring', shortLabel: 'Live', icon: Radio },
  { id: 'risk-analysis', label: 'Risk Analysis', shortLabel: 'Risk', icon: SlidersHorizontal },
  { id: 'alerts', label: 'Alerts', shortLabel: 'Alerts', icon: BellRing },
  { id: 'emergency-actions', label: 'Emergency Actions', shortLabel: 'Actions', icon: ShieldCheck },
  { id: 'historical-data', label: 'Historical Data', shortLabel: 'History', icon: Database },
];

export const MobileNav: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    threatAssessment
  } = useEWS();

  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-1 sm:px-2 py-1.5 flex items-center justify-between safe-area-bottom"
      >
        <div className="flex items-center justify-around flex-1">
          {MOBILE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isAlert = item.id === 'alerts';
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 min-w-0 py-1 px-0.5 rounded-lg transition-all relative ${
                  isActive
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-4.5 h-4.5 transition-transform ${isActive ? 'scale-110 text-blue-600' : 'text-slate-500'}`} />
                  {isAlert && threatAssessment.level !== 'LOW' && (
                    <span className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${threatAssessment.pulseColor}`} />
                  )}
                </div>
                <span className="text-[10px] tracking-tight truncate w-full text-center mt-0.5 leading-tight">
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>

        {/* Small Elegant Prototype "!" Info Indicator Badge on Right Edge */}
        <div className="pl-1 pr-1 border-l border-slate-200/80 flex items-center">
          <button
            onClick={() => setIsDisclaimerOpen(true)}
            aria-label="View prototype disclaimer"
            title="Prototype / Demo Notice"
            className="w-7 h-7 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-300/90 text-amber-900 flex items-center justify-center shadow-xs transition-transform active:scale-95 shrink-0"
          >
            <span className="font-extrabold text-xs font-mono leading-none text-amber-800">!</span>
          </button>
        </div>
      </nav>

      {/* Small Prototype Disclaimer Popover / Modal (< 430px optimized) */}
      {isDisclaimerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 animate-in fade-in duration-150">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsDisclaimerOpen(false)}
          />

          {/* Modal Popover Content */}
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-4 sm:p-5 shadow-2xl border border-slate-200 space-y-3.5 animate-in slide-in-from-bottom-4 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0">
                  <AlertTriangle className="w-3.5 h-3.5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Prototype / Demo Only
                </h3>
              </div>

              <button
                onClick={() => setIsDisclaimerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close popover"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <p className="text-xs text-slate-600 leading-relaxed">
              This EWS is an ASEAN DSE prototype. Flood forecasts, risk scores, and sensor readings are simulated for demonstration purposes and are not real-time predictions.
            </p>

            {/* Action Buttons */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={() => {
                  setIsDisclaimerOpen(false);
                  setActiveTab('disclaimer');
                }}
                className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1 shadow-sm transition-colors"
              >
                <span>View Full Disclaimer</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsDisclaimerOpen(false)}
                className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
