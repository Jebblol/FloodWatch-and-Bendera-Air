import React from 'react';
import { 
  Globe2, 
  Activity, 
  Flame, 
  Users, 
  ShieldAlert, 
  ArrowUpRight, 
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { useEWS } from '../context/EWSContext';
import { SYSTEM_OVERVIEW_STATS, ASEAN_COUNTRIES, PRESET_SCENARIOS } from '../data/aseanData';
import { ArchitectureFlow } from '../components/common/ArchitectureFlow';

export const OverviewPage: React.FC = () => {
  const { 
    threatAssessment, 
    selectedCountry, 
    setSelectedCountryId, 
    setActiveTab,
    loadPresetScenario,
    startPresentationTour
  } = useEWS();

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
              Overview Dashboard
            </span>
            <span className="text-xs text-slate-500">
              Historical Temporal Range: 2000–2023
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            ASEAN Regional Flood Monitoring Overview
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Integrated early warning interface synthesizing multi-decade historical disaster exposure with simulated real-time hydrological data.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={startPresentationTour}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch Demo Story Walkthrough</span>
          </button>
        </div>
      </div>

      {/* 5 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Countries Monitored */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Countries Monitored</span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                <Globe2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900">8</span>
              <span className="text-xs text-slate-500">/ 11 ASEAN States</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            8 full datasets; 2 unavail, 1 partial
          </p>
        </div>

        {/* Card 2: Total Recorded Flood Events */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Total Flood Events</span>
              <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-slate-900">
                {SYSTEM_OVERVIEW_STATS.totalRecordedFloodEvents}
              </span>
              <span className="text-xs text-slate-500">Events (2000–2023)</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            118.0M cumulative affected population
          </p>
        </div>

        {/* Card 3: Highest Flood Frequency */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Highest Frequency</span>
              <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900 truncate">Indonesia</span>
              <span className="text-xs font-bold text-red-600">195</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            33.4% of total recorded ASEAN events
          </p>
        </div>

        {/* Card 4: Highest Avg Affected Population */}
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-medium">Highest Avg Affected</span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-slate-900 truncate">Thailand</span>
              <span className="text-xs font-bold text-amber-700">642k</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            642,185 avg affected / flood disaster
          </p>
        </div>

        {/* Card 5: Current Threat Level (Soft Tinted Background) */}
        <div className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between transition-all ${threatAssessment.bgBadge}`}>
          <div>
            <div className="flex items-center justify-between text-slate-600 mb-2">
              <span className="text-xs font-semibold">Current Threat</span>
              <div className="w-7 h-7 rounded-lg bg-white/80 border border-current/20 flex items-center justify-center">
                <ShieldAlert className={`w-4 h-4 ${threatAssessment.color}`} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${threatAssessment.pulseColor}`} />
              <span className={`text-xl font-bold ${threatAssessment.color}`}>
                {threatAssessment.level}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-600 mt-2 truncate font-medium">
            {selectedCountry.name} (Score: {threatAssessment.score}/100)
          </p>
        </div>
      </div>

      {/* Interactive Core Architecture Flow */}
      <ArchitectureFlow />

      {/* Regional Status Grid & Demonstration Scenarios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Country Monitoring Status Table */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                ASEAN Country Disaster Profile & Baseline Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Select any country to synchronize active focus across all monitoring maps and analytical models
              </p>
            </div>
            <button
              onClick={() => setActiveTab('historical-data')}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
            >
              <span>Full Analytics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium text-[11px]">
                  <th className="pb-2 pl-2">Country</th>
                  <th className="pb-2 text-right">Flood Events</th>
                  <th className="pb-2 text-right">Avg Affected</th>
                  <th className="pb-2 text-right">Avg Poverty</th>
                  <th className="pb-2 text-right">Vulnerability Status</th>
                  <th className="pb-2 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ASEAN_COUNTRIES.map((country) => {
                  const isSelected = selectedCountry.id === country.id;
                  return (
                    <tr
                      key={country.id}
                      onClick={() => setSelectedCountryId(country.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-blue-50/70 text-blue-950 font-medium' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <td className="py-2.5 pl-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            !country.dataAvailable ? 'bg-slate-300' : isSelected ? 'bg-blue-600 ring-2 ring-blue-200' : 'bg-emerald-500'
                          }`} />
                          <span className="font-semibold text-slate-900">
                            {country.name}
                          </span>
                          {country.isPartialPoverty && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              partial pov
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 text-right font-medium">
                        {country.events !== null ? (
                          <span className="text-slate-900">{country.events}</span>
                        ) : (
                          <span className="text-slate-400 italic">Data unavail.</span>
                        )}
                      </td>
                      <td className="py-2.5 text-right text-slate-600">
                        {country.avgAffected !== null ? (
                          <span>{Math.round(country.avgAffected).toLocaleString()}</span>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="py-2.5 text-right text-slate-600">
                        {country.povertyRate !== null ? (
                          <span>{country.povertyRate}%</span>
                        ) : (
                          <span className="text-slate-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                          !country.dataAvailable
                            ? 'bg-slate-100 border-slate-200 text-slate-500'
                            : country.vulnerabilityLevel.includes('High')
                            ? 'bg-red-50 border-red-200 text-red-700'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        }`}>
                          {country.vulnerabilityLevel}
                        </span>
                      </td>
                      <td className="py-2.5 text-right pr-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCountryId(country.id);
                            setActiveTab('risk-map');
                          }}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-blue-600 text-[11px] text-slate-600 hover:text-white transition-colors"
                        >
                          View Map
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Quick Simulation Presets */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Simulation Presets</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Load preset weather scenarios to test the EWS dynamic response:
            </p>

            <div className="space-y-2">
              {PRESET_SCENARIOS.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => loadPresetScenario(preset)}
                  className="cursor-pointer p-3 rounded-lg bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-200 transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-700">
                      {preset.title}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                      preset.threatLevel === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' :
                      preset.threatLevel === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      preset.threatLevel === 'MODERATE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {preset.threatLevel}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {preset.description}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-600 font-medium">
                    <span>Rain: {preset.simulatedRainfall} mm/h</span>
                    <span>Stage: {preset.simulatedWaterLevel} m</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Custom simulation sliders:</span>
            <button
              onClick={() => setActiveTab('risk-analysis')}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
            >
              <span>Risk Controls</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
