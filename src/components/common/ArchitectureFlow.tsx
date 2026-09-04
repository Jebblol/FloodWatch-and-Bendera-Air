import React from 'react';
import { 
  Database, 
  Map, 
  SlidersHorizontal, 
  Radio, 
  BellRing, 
  ShieldCheck, 
  ArrowDown, 
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { useEWS } from '../../context/EWSContext';
import { NavigationTab } from '../../types';

export const ArchitectureFlow: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { 
    activeTab, 
    setActiveTab, 
    selectedCountry, 
    simulatedRainfall, 
    simulatedWaterLevel, 
    threatAssessment 
  } = useEWS();

  const handleNavigate = (tab: NavigationTab) => {
    setActiveTab(tab);
  };

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-5 shadow-sm relative ${compact ? 'py-4' : 'py-6'}`}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-semibold text-slate-500">
              System Architecture Flow
            </h2>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
              Core EWS Pipeline
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Demonstrating how multi-source historical disaster intelligence and real-time sensor telemetry synthesize into adaptive alerts and emergency actions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Active Context:</span>
          <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            {selectedCountry.name}
          </span>
        </div>
      </div>

      {/* Main Process Diagram Layout */}
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Stage 1: Historical Data (Blue Accent) */}
        <div 
          onClick={() => handleNavigate('historical-data')}
          className={`cursor-pointer group rounded-xl p-3.5 border transition-all ${
            activeTab === 'historical-data'
              ? 'bg-blue-50/60 border-blue-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-blue-600 block">
                  Stage 1
                </span>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                  Historical Data (2000–2023)
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                Frequency: <strong>{selectedCountry.events !== null ? `${selectedCountry.events} events` : 'N/A'}</strong>
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200 hidden sm:inline-block">
                Avg Affected: <strong>{selectedCountry.avgAffected ? `${Math.round(selectedCountry.avgAffected).toLocaleString()}` : 'N/A'}</strong>
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                Poverty: <strong>{selectedCountry.povertyRate !== null ? `${selectedCountry.povertyRate}%` : 'N/A'}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Clean Down Arrow */}
        <div className="flex justify-center text-slate-300 my-1">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Stage 2: Risk Mapping (Green Accent) */}
        <div 
          onClick={() => handleNavigate('risk-map')}
          className={`cursor-pointer group rounded-xl p-3.5 border transition-all ${
            activeTab === 'risk-map'
              ? 'bg-emerald-50/60 border-emerald-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Map className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-emerald-600 block">
                  Stage 2
                </span>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-600">
                  Risk Mapping (Spatial Vulnerability)
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Regional Vulnerability:</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                {selectedCountry.vulnerabilityLevel}
              </span>
              <span className="text-slate-500 text-[11px] hidden md:inline-block">
                Basin: {selectedCountry.basin.split('&')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Clean Down Arrow */}
        <div className="flex justify-center text-slate-300 my-1">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Stage 3: Risk Analysis (Amber Accent) + Real-Time Telemetry Side Box */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8">
            <div 
              onClick={() => handleNavigate('risk-analysis')}
              className={`cursor-pointer group rounded-xl p-3.5 border transition-all ${
                activeTab === 'risk-analysis'
                  ? 'bg-amber-50/60 border-amber-400 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-amber-600 block">
                      Stage 3
                    </span>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-600">
                      Risk Analysis
                    </h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">Composite Threat</span>
                  <span className="text-xs font-bold text-amber-700">
                    Score: {threatAssessment.score}/100
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Inflow Card */}
          <div className="md:col-span-4 flex items-center gap-2">
            <div className="hidden md:flex text-slate-300">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <div 
              onClick={() => handleNavigate('live-monitoring')}
              className={`cursor-pointer group flex-1 rounded-xl p-3 border transition-all ${
                activeTab === 'live-monitoring'
                  ? 'bg-blue-50/60 border-blue-400 shadow-sm'
                  : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-slate-700 font-semibold text-[11px]">
                <Radio className="w-3.5 h-3.5 text-blue-600" />
                <span>Real-Time Data</span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div className="flex justify-between">
                  <span>Rainfall:</span>
                  <span className="font-semibold text-slate-800">{simulatedRainfall} mm/h</span>
                </div>
                <div className="flex justify-between">
                  <span>Stage:</span>
                  <span className="font-semibold text-slate-800">{simulatedWaterLevel.toFixed(1)} m</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clean Down Arrow */}
        <div className="flex justify-center text-slate-300 my-1">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Stage 4: Adaptive Alert (Orange Accent) */}
        <div 
          onClick={() => handleNavigate('alerts')}
          className={`cursor-pointer group rounded-xl p-3.5 border transition-all ${
            activeTab === 'alerts'
              ? 'bg-orange-50/60 border-orange-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-orange-600 block">
                  Stage 4
                </span>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-orange-600">
                  Adaptive Flood Alert
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Triggered Level:</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase border ${threatAssessment.bgBadge}`}>
                {threatAssessment.level} Threat
              </span>
            </div>
          </div>
        </div>

        {/* Clean Down Arrow */}
        <div className="flex justify-center text-slate-300 my-1">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Stage 5: Emergency Action (Red Accent) */}
        <div 
          onClick={() => handleNavigate('emergency-actions')}
          className={`cursor-pointer group rounded-xl p-3.5 border transition-all ${
            activeTab === 'emergency-actions'
              ? 'bg-red-50/60 border-red-400 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-semibold text-red-600 block">
                  Stage 5
                </span>
                <h3 className="text-xs font-bold text-slate-900 group-hover:text-red-600">
                  Emergency Action Directives
                </h3>
              </div>
            </div>

            {/* 3 Action Badges */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className={`px-2 py-0.5 rounded border font-medium ${
                threatAssessment.recommendedActions.includes('Prepare')
                  ? 'bg-amber-100 border-amber-300 text-amber-800 font-bold'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}>
                Prepare
              </span>
              <span className={`px-2 py-0.5 rounded border font-medium ${
                threatAssessment.recommendedActions.includes('Evacuate')
                  ? 'bg-red-100 border-red-300 text-red-800 font-bold'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}>
                Evacuate
              </span>
              <span className={`px-2 py-0.5 rounded border font-medium ${
                threatAssessment.recommendedActions.includes('Seek Shelter')
                  ? 'bg-purple-100 border-purple-300 text-purple-800 font-bold'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}>
                Seek Shelter
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
