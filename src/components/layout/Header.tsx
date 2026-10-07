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
        <div className="max-w-[1200px] mx-auto px-[24px] py-[12px] flex items-center gap-[10px] flex-wrap">
          <h1 className="text-[18px] font-semibold text-[var(--ink)] m-0 mr-auto">
            {TAB_TITLES[activeTab] || 'Overview'}
          </h1>

          <label className="text-[12px] text-[var(--muted)] flex items-center gap-[6px]">
            <span>Country</span>
            <select
              value={selectedCountry.name}
              onChange={(e) => {
                const found = ASEAN_COUNTRIES.find(c => c.name === e.target.value);
                if (found) setSelectedCountryId(found.id);
              }}
              aria-label="Country"
              className="bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] rounded-[6px] px-[10px] py-[6px] cursor-pointer text-[13px] outline-none"
            >
              {ASEAN_COUNTRIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-[12px] text-[var(--muted)] flex items-center gap-[6px]">
            <span>Scenario</span>
            <select
              value={selectedScenarioTitle}
              onChange={handleScenarioChange}
              aria-label="Scenario"
              className="bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] rounded-[6px] px-[10px] py-[6px] cursor-pointer text-[13px] outline-none"
            >
              <option value="Live feed">Live feed</option>
              <option value="IDN — Critical: Monsoon flash surge">IDN — Critical: Monsoon flash surge</option>
              <option value="THA — High: Monsoon inflow">THA — High: Monsoon inflow</option>
              <option value="PHL — Moderate: Typhoon outer rainbands">PHL — Moderate: Typhoon outer rainbands</option>
            </select>
          </label>

          <button
            onClick={startPresentationTour}
            className="bg-[var(--sea)] text-white border border-[var(--sea)] rounded-[6px] px-[12px] py-[6px] text-[13px] font-medium cursor-pointer transition-opacity hover:opacity-95"
          >
            Take the tour
          </button>

          <button
            onClick={() => setShowSimInfo(true)}
            title="Flood forecasts, risk scores and sensor readings are simulated for demonstration, not real-time predictions."
            className="bg-[var(--bg)] border border-[var(--mod)] text-[var(--ink)] rounded-[6px] px-[10px] py-[6px] text-[13px] cursor-pointer hover:bg-[color-mix(in_srgb,var(--mod)_10%,transparent)] transition-colors"
          >
            Simulated data
          </button>

          <button
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle dark mode"
            className="bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] rounded-[6px] px-[10px] py-[6px] text-[13px] cursor-pointer hover:bg-[color-mix(in_srgb,var(--sea)_8%,transparent)] transition-colors min-w-[50px] text-center"
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>
      </header>

      {/* Simulated Data Modal Dialog */}
      {showSimInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
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
                className="px-3 py-1.5 text-xs text-[var(--sea)] underline font-medium"
              >
                View Full Disclaimer
              </button>
              <button
                onClick={() => setShowSimInfo(false)}
                className="px-4 py-1.5 text-xs font-semibold rounded bg-[var(--sea)] text-white"
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
