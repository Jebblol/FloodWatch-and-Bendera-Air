import React, { useEffect, useState } from 'react';
import { useEWS } from '../../context/EWSContext';
import { ASEAN_COUNTRIES, PRESET_SCENARIOS } from '../../data/aseanData';

const TAB_TITLES: Record<string, string> = {
  'overview': 'Overview',
  'historical-data': 'Historical data',
  'risk-map': 'Risk map',
  'live-monitoring': 'Live monitoring',
  'risk-analysis': 'Risk analysis',
  'alerts': 'Alerts',
  'emergency-actions': 'Emergency actions',
  'disclaimer': 'Disclaimer'
};

export const Header: React.FC = () => {
  const {
    activeTab,
    selectedCountry,
    setSelectedCountryId,
    loadPresetScenario,
    startPresentationTour,
    setActiveTab
  } = useEWS();

  // Dark / Light Mode state
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('fw-theme');
      if (saved) return saved === 'dark';
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('fw-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
      localStorage.setItem('fw-theme', 'light');
    }
  }, [isDark]);

  const [selectedScenarioTitle, setSelectedScenarioTitle] = useState<string>('Live feed');
  const [showSimInfo, setShowSimInfo] = useState<boolean>(false);

  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedScenarioTitle(val);
    if (val === 'Live feed') {
      // Keep or reset
    } else if (val.includes('IDN')) {
      const scen = PRESET_SCENARIOS.find(s => s.countryId === 'IDN') || PRESET_SCENARIOS[0];
      loadPresetScenario(scen);
    } else if (val.includes('THA')) {
      const scen = PRESET_SCENARIOS.find(s => s.countryId === 'THA') || PRESET_SCENARIOS[1];
      loadPresetScenario(scen);
    } else if (val.includes('PHL')) {
      const scen = PRESET_SCENARIOS.find(s => s.countryId === 'PHL') || PRESET_SCENARIOS[2];
      loadPresetScenario(scen);
    }
  };

  return (
    <>
      <header className="w-full bg-[var(--panel)] border-b border-[var(--line)]">
        {/* Mobile Header Top Brand Bar (< md) */}
        <div className="md:hidden px-3 py-2 border-b border-[var(--line)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-[28px] h-[28px] rounded-[8px] bg-[#1d63ff] flex items-center justify-center text-white shadow-xs">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 15c3-2 6-2 9 0s6 2 9 0" />
                <path d="M3 9c3-2 6-2 9 0s6 2 9 0" />
              </svg>
            </div>
            <span className="font-bold text-[16px] text-[var(--ink)] tracking-tight">FloodWatch</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--sea)]">
              {TAB_TITLES[activeTab] || 'Overview'}
            </span>
          </div>

          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle dark mode"
            className="bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] rounded-[6px] px-2.5 py-1 text-[11px] font-medium"
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Controls Container */}
        <div className="max-w-[1200px] mx-auto px-3 sm:px-[24px] py-2 sm:py-[12px] flex items-center gap-2 sm:gap-[10px] flex-wrap justify-between md:justify-start">
          {/* Desktop Title */}
          <h1 className="hidden md:block text-[18px] font-semibold text-[var(--ink)] m-0 mr-auto">
            {TAB_TITLES[activeTab] || 'Overview'}
          </h1>

          {/* Selectors and Action Controls */}
          <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-between md:justify-end">
            <label className="text-[11px] sm:text-[12px] text-[var(--muted)] flex items-center gap-1.5">
              <span className="hidden sm:inline">Country</span>
              <select
                value={selectedCountry.name}
                onChange={(e) => {
                  const found = ASEAN_COUNTRIES.find(c => c.name === e.target.value);
                  if (found) setSelectedCountryId(found.id);
                }}
                aria-label="Country"
                className="bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] rounded-[6px] px-2 sm:px-[10px] py-1.5 text-[12px] sm:text-[13px] outline-none cursor-pointer max-w-[110px] sm:max-w-none truncate"
              >
                {ASEAN_COUNTRIES.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-[11px] sm:text-[12px] text-[var(--muted)] flex items-center gap-1.5">
              <span className="hidden sm:inline">Scenario</span>
              <select
                value={selectedScenarioTitle}
                onChange={handleScenarioChange}
                aria-label="Scenario"
                className="bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] rounded-[6px] px-2 sm:px-[10px] py-1.5 text-[12px] sm:text-[13px] outline-none cursor-pointer max-w-[115px] sm:max-w-none truncate"
              >
                <option value="Live feed">Live feed</option>
                <option value="IDN — Critical: Monsoon flash surge">IDN — Critical Surge</option>
                <option value="THA — High: Monsoon inflow">THA — High Inflow</option>
                <option value="PHL — Moderate: Typhoon outer rainbands">PHL — Moderate Typhoon</option>
              </select>
            </label>

            <div className="flex items-center gap-1.5 ml-auto md:ml-0">
              <button
                onClick={startPresentationTour}
                className="bg-[var(--sea)] text-white border border-[var(--sea)] rounded-[6px] px-2.5 sm:px-[12px] py-1.5 text-[11px] sm:text-[13px] font-medium cursor-pointer transition-opacity hover:opacity-95"
              >
                Tour
              </button>

              <button
                onClick={() => setShowSimInfo(true)}
                title="Flood forecasts, risk scores and sensor readings are simulated for demonstration, not real-time predictions."
                className="bg-[var(--bg)] border border-[var(--mod)] text-[var(--ink)] rounded-[6px] px-2 sm:px-[10px] py-1.5 text-[11px] sm:text-[13px] cursor-pointer"
              >
                Simulated
              </button>

              <button
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle dark mode"
                className="hidden md:inline-block bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] rounded-[6px] px-[10px] py-1.5 text-[13px] cursor-pointer min-w-[50px] text-center"
              >
                {isDark ? 'Light' : 'Dark'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Simulated Data Modal Dialog */}
      {showSimInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] max-w-md w-full rounded-lg p-5 shadow-lg space-y-4">
            <h3 className="text-base font-bold text-[var(--ink)] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--mod)]"></span>
              Simulation Notice
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              All forecasts, risk scores, and hydrological sensor readings within this interface are simulated for academic demonstration purposes and ASEAN Data Science Explorers (DSE) 2026 presentation. They are not official real-time meteorological predictions.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                onClick={() => {
                  setShowSimInfo(false);
                  setActiveTab('disclaimer');
                }}
                className="px-3 py-1.5 text-xs text-[var(--sea)] underline font-medium cursor-pointer"
              >
                View Full Disclaimer
              </button>
              <button
                onClick={() => setShowSimInfo(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded bg-[var(--sea)] text-white cursor-pointer"
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
