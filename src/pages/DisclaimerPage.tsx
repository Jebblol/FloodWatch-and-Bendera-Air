import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Database, 
  Radio, 
  TrendingUp, 
  SlidersHorizontal, 
  Map, 
  AlertTriangle, 
  FileText,
  Info,
  ChevronRight,
  ChevronDown,
  LayoutDashboard
} from 'lucide-react';
import { useEWS } from '../context/EWSContext';

interface MethodologySection {
  id: string;
  title: string;
  summary: string;
  details: string;
  badge: string;
  icon: React.ElementType;
  accentColor: string;
}

const SECTIONS: MethodologySection[] = [
  {
    id: 'purpose',
    title: 'Prototype Purpose',
    summary: 'Demonstrates end-to-end early warning workflow from data to action.',
    details: 'The dashboard shows how an early warning system works from start to finish: combining historical flood patterns with simulated real-time sensor readings to calculate a clear threat score, trigger color-coded alerts, and suggest practical emergency action steps.',
    badge: 'Demonstration Workflow',
    icon: FileText,
    accentColor: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    id: 'historical',
    title: 'Historical Data',
    summary: 'Official 2000–2023 disaster data with missing points preserved.',
    details: 'Past flood records (2000–2023) come from official disaster databases. To maintain honest data reporting, missing values (such as Singapore, Brunei, and partial poverty data for Laos) are clearly marked as unavailable instead of being filled with zeros or made-up numbers.',
    badge: 'Missing data clearly shown',
    icon: Database,
    accentColor: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    id: 'sensor',
    title: 'Simulated Sensor Data',
    summary: 'Rainfall and river water level readings are interactive simulation inputs.',
    details: 'Rainfall intensity (mm/h) and river water levels (m) shown in Live Monitoring are interactive simulation controls. Users can adjust rainfall and water level sliders to see how the system responds in real time. They are not connected to physical sensor hardware.',
    badge: 'Simulated sensor readings',
    icon: Radio,
    accentColor: 'text-amber-700 bg-amber-50 border-amber-200'
  },
  {
    id: 'forecasting',
    title: 'Forecasting',
    summary: 'Statistical trend demonstration with 95% confidence bands.',
    details: 'Future estimates for 2024–2027 in the Historical Data section show a simple statistical trend line (+0.51 events per year) with a 95% confidence range. These are for project demonstration and are not official weather forecasts.',
    badge: 'Statistical trend demo',
    icon: TrendingUp,
    accentColor: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    id: 'risk-score',
    title: 'Risk Score',
    summary: '0–100 threat score based on transparent weighted rules.',
    details: 'The 0–100 Threat Score and four threat levels (Low, Moderate, High, Critical) are calculated using transparent weighted rules: 35% from historical vulnerability and 65% from simulated real-time sensor readings. They are not official government disaster ratings.',
    badge: 'Risk score based on set rules',
    icon: SlidersHorizontal,
    accentColor: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  {
    id: 'risk-map',
    title: 'Risk Map',
    summary: 'Illustrative Southeast Asia map for regional risk context.',
    details: 'The Southeast Asia map is an illustrative visualization showing overall country-level risk indicators. It provides general regional context for the presentation and is not a local flood inundation map.',
    badge: 'Regional overview map',
    icon: Map,
    accentColor: 'text-emerald-600 bg-emerald-50 border-emerald-200'
  },
  {
    id: 'limitations',
    title: 'System Limitations',
    summary: 'Educational prototype not replacing official government disaster agencies.',
    details: 'This system is not intended to replace or override official early warnings issued by national weather agencies (such as PAGASA, BMKG, TMD, VDMA, or MMD), disaster management bodies (AHA Centre, BNPB, NDRRMC), or local emergency responders. During real flood events, citizens and authorities should always follow official government instructions.',
    badge: 'Official authority note',
    icon: ShieldAlert,
    accentColor: 'text-slate-700 bg-slate-100 border-slate-200'
  }
];

export const DisclaimerPage: React.FC = () => {
  const { setActiveTab } = useEWS();
  // On mobile accordion state: default first item open or all collapsible
  const [expandedSection, setExpandedSection] = useState<string | null>('purpose');

  const toggleSection = (id: string) => {
    setExpandedSection(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200 pb-8">
      {/* Page Header — Mobile optimized & desktop responsive */}
      <div className="space-y-2.5 pb-2 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Prototype Notice</span>
          </span>
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
            ASEAN DSE 2026
          </span>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            System Disclaimer & Methodology
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            How this prototype uses data, simulations, and risk calculations.
          </p>
        </div>

        {/* Compact Return to Dashboard Button */}
        <button
          onClick={() => setActiveTab('overview')}
          className="w-full sm:w-auto px-3.5 py-2 sm:py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-xs transition-colors flex items-center justify-center gap-1.5"
        >
          <LayoutDashboard className="w-3.5 h-3.5 text-slate-500" />
          <span>Return to Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Main Prototype Notice (Compact, Figma-grade Amber Panel) */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 shadow-xs flex items-start gap-2.5 sm:gap-3">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <h3 className="text-xs sm:text-sm font-bold text-amber-950">
            Prototype — For Demonstration Only
          </h3>
          <p className="text-[11px] sm:text-xs text-amber-900 leading-relaxed">
            This application was created for the ASEAN Data Science Explorers (DSE) competition. Flood forecasts, risk scores, and sensor readings are simulated for demonstration purposes and are not real-time predictions.
          </p>
        </div>
      </div>

      {/* Mobile-First Accordion / Desktop Card Grid View */}
      {/* 1. Mobile Accordion (< md) */}
      <div className="md:hidden space-y-2">
        <div className="px-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Methodology Breakdown (Tap to Expand)
        </div>
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const isExpanded = expandedSection === sec.id;
          return (
            <div 
              key={sec.id}
              className={`rounded-xl border transition-all overflow-hidden bg-white ${
                isExpanded ? 'border-blue-300 shadow-xs ring-1 ring-blue-100' : 'border-slate-200'
              }`}
            >
              <button
                onClick={() => toggleSection(sec.id)}
                className="w-full p-3 text-left flex items-center justify-between gap-2 transition-colors hover:bg-slate-50"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 ${sec.accentColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {sec.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 truncate">
                      {sec.summary}
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1 text-slate-400">
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-blue-600' : ''}`} />
                </div>
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 pt-1 border-t border-slate-100 space-y-2 text-[11px] text-slate-600 leading-relaxed animate-in fade-in duration-150">
                  <p>{sec.details}</p>
                  <div className="pt-1 flex items-center gap-1">
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {sec.badge}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Desktop Grid View (>= md) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SECTIONS.slice(0, 6).map((sec) => {
          const Icon = sec.icon;
          return (
            <div 
              key={sec.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${sec.accentColor}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-slate-900">
                  {sec.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {sec.details}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-blue-700 font-medium">
                <span className="text-[10px] font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {sec.badge}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Limitations Footer (>= md) */}
      <div className="hidden md:block p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2.5">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Official Warning Authority & System Limitations
          </h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          {SECTIONS[6].details}
        </p>
      </div>
    </div>
  );
};
