import React from 'react';
import { 
  Globe2, 
  PlayCircle, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  Info
} from 'lucide-react';
import { useEWS } from '../../context/EWSContext';
import { ASEAN_COUNTRIES } from '../../data/aseanData';

export const Header: React.FC = () => {
  const { 
    selectedCountry, 
    setSelectedCountryId, 
    threatAssessment,
    isPresentationMode,
    startPresentationTour,
    resetSimulationToDefaults
  } = useEWS();

  return (
    <header className="h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur-sm px-3 sm:px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30 transition-all">
      {/* Left: Refined EWS Logo & Status Indicator */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Minimal Flood / Wave EWS Brand Mark */}
        <div 
          className="group flex items-center gap-2 cursor-pointer select-none"
          title="ASEAN Early Warning System"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm shadow-blue-500/20 text-white transition-transform group-hover:scale-105 shrink-0">
            <svg 
              className="w-4.5 h-4.5 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M7 6a10 10 0 0 1 10 0" strokeOpacity="0.75" />
              <path d="M2 13c3.5-3.5 6.5 1.5 10-1.5s6.5-1.5 10 1.5" />
              <path d="M2 18c3.5-3.5 6.5 1.5 10-1.5s6.5-1.5 10 1.5" strokeOpacity="0.65" />
              <circle cx="12" cy="7.5" r="1.25" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Quiet System Status Indicator */}
        <div className="hidden xs:flex items-center gap-1.5 sm:gap-2 sm:pl-3 sm:border-l sm:border-slate-100 text-xs text-slate-500">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-40"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-slate-600 text-[11px] sm:text-xs">Live</span>
        </div>
      </div>

      {/* Right Controls: Country Selector, Reset, Guided Tour, Threat Status */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
        {/* Compact Country Selector Dropdown */}
        <div className="relative flex items-center bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 transition-colors max-w-[100px] xs:max-w-[125px] sm:max-w-none shrink min-w-0">
          <Globe2 className="w-3.5 h-3.5 text-slate-400 mr-1 sm:mr-1.5 shrink-0" />
          <select
            value={selectedCountry.id}
            onChange={(e) => setSelectedCountryId(e.target.value)}
            className="bg-transparent text-[11px] sm:text-xs font-medium text-slate-700 outline-none cursor-pointer pr-3.5 sm:pr-4 appearance-none truncate w-full"
            aria-label="Select Country"
          >
            {ASEAN_COUNTRIES.map((country) => (
              <option key={country.id} value={country.id} className="bg-white text-slate-800">
                {country.name} {!country.dataAvailable ? '(No Data)' : ''}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1 sm:right-2 pointer-events-none" />
        </div>

        {/* Reset Sensor Baseline Button */}
        <button
          onClick={resetSimulationToDefaults}
          title="Reset sensor simulation to defaults"
          className="p-1.5 sm:px-2.5 sm:py-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100/80 rounded-lg border border-slate-200/80 transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden lg:inline text-slate-600">Reset</span>
        </button>

        {/* Guided Demo Button */}
        {!isPresentationMode ? (
          <button
            onClick={startPresentationTour}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] sm:text-xs font-medium transition-colors shadow-sm shadow-blue-500/10 shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-100 shrink-0" />
            <span className="hidden sm:inline">Guided Tour</span>
            <span className="sm:hidden text-[10px] font-semibold">Tour</span>
          </button>
        ) : (
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-50 border border-blue-200/80 text-blue-700 text-[11px] sm:text-xs font-medium shrink-0">
            <PlayCircle className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="hidden sm:inline">Demo Mode</span>
            <span className="sm:hidden text-[10px] font-semibold">Demo</span>
          </div>
        )}

        {/* Threat Level Status Pill */}
        <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-lg border text-[11px] sm:text-xs font-medium shrink-0 ${threatAssessment.bgBadge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${threatAssessment.pulseColor}`} />
          <span className="font-semibold text-[10px] sm:text-xs">{threatAssessment.level}</span>
        </div>
      </div>
    </header>
  );
};

