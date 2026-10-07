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
      <header className="w-full bg-[var(--panel)] border-b border-[var(--line)] sticky top-0 z-30">
        {/* Mobile Header Top Brand Bar (< md) */}
        <div className="md:hidden px-3 py-2 border-b border-[var(--line)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src="/ews-logo.png" 
              alt="FloodWatch Logo" 
              className="w-[28px] h-[28px] rounded-[8px] object-cover shadow-xs"
            />
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

        {/* Controls Container - Full width aligned with sidebar and content */}
        <div className="w-full px-3 sm:px-6 py-2.5 sm:py-[12px] flex flex-col md:flex-row md:items-center gap-2.5 sm:gap-[10px] justify-between">
          {/* Desktop Title */}
          <h1 className="hidden md:block text-[18px] font-semibold text-[var(--ink)] m-0 mr-auto">
            {TAB_TITLES[activeTab] || 'Overview'}
          </h1>

          {/* Selectors and Action Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 w-full md:w-auto">
            {/* Top row on mobile: Country and Scenario dropdowns sharing width equally */}
            <div className="grid grid-cols-2 gap-2 w-full sm:w-auto sm:flex sm:items-center">
              <label className="text-[12px] text-[var(--muted)] flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 font-medium text-[11px] sm:text-[12px]">Country</span>
                <select
                  value={selectedCountry.name}
                  onChange={(e) => {
                    const found = ASEAN_COUNTRIES.find(c => c.name === e.target.value);
                    if (found) setSelectedCountryId(found.id);
                  }}
                  aria-label="Country"
                  className="bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] rounded-[6px] px-2 py-1.5 text-[12px] outline-none cursor-pointer w-full sm:w-[130px] truncate"
                >
                  {ASEAN_COUNTRIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-[12px] text-[var(--muted)] flex items-center gap-1.5 min-w-0">
                <span className="shrink-0 font-medium text-[11px] sm:text-[12px]">Scenario</span>
                <select
                  value={selectedScenarioTitle}
                  onChange={handleScenarioChange}
                  aria-label="Scenario"
                  className="bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] rounded-[6px] px-2 py-1.5 text-[12px] outline-none cursor-pointer w-full sm:w-[150px] truncate"
                >
                  <option value="Live feed">Live feed</option>
                  <option value="IDN — Critical: Monsoon flash surge">IDN — Critical</option>
                  <option value="THA — High: Monsoon inflow">THA — High Inflow</option>
                  <option value="PHL — Moderate: Typhoon outer rainbands">PHL — Moderate</option>
                </select>
              </label>
            </div>

            {/* Action buttons row */}
            <div className="flex items-center gap-2 justify-end sm:justify-start pt-1 sm:pt-0 border-t sm:border-t-0 border-[var(--line)]/50">
              <button
                onClick={startPresentationTour}
                className="flex-1 sm:flex-initial text-center bg-[var(--sea)] text-white border border-[var(--sea)] rounded-[6px] px-3 py-1.5 text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-95"
              >
                Take the tour
              </button>

              <button
                onClick={() => setShowSimInfo(true)}
                title="Flood forecasts, risk scores and sensor readings are simulated for demonstration, not real-time predictions."
                className="flex-1 sm:flex-initial text-center bg-[var(--bg)] border border-[var(--mod)] text-[var(--ink)] rounded-[6px] px-3 py-1.5 text-[12px] font-medium cursor-pointer"
              >
                Simulated data
              </button>

              <button
                onClick={() => setIsDark(!isDark)}
                aria-label="Toggle dark mode"
                className="hidden md:inline-block bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] rounded-[6px] px-3 py-1.5 text-[12px] font-medium cursor-pointer min-w-[50px] text-center"
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
