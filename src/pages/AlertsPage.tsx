import React, { useState } from 'react';
import { 
  BellRing, 
  ShieldAlert, 
  Send, 
  Radio, 
  MapPin, 
  ChevronRight,
  Check
} from 'lucide-react';
import { useEWS } from '../context/EWSContext';
import { ThreatLevel } from '../types';

export const AlertsPage: React.FC = () => {
  const { 
    selectedCountry, 
    selectedStation, 
    threatAssessment,
    simulatedRainfall,
    simulatedWaterLevel,
    setActiveTab
  } = useEWS();

  const [broadcastSent, setBroadcastSent] = useState(false);

  const handleSimulateBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  const threatLevelsMeta: Record<ThreatLevel, { name: string; description: string; instruction: string; colorClass: string; badgeClass: string; borderClass: string; pingColor: string }> = {
    LOW: {
      name: 'Low Flood Threat',
      description: 'Atmospheric and hydrological conditions are stable.',
      instruction: 'Routine monitoring active. Maintain standard observation schedule.',
      colorClass: 'text-emerald-800',
      badgeClass: 'bg-emerald-50/80 border-emerald-200 text-emerald-900',
      borderClass: 'border-emerald-200',
      pingColor: 'bg-emerald-500'
    },
    MODERATE: {
      name: 'Moderate Flood Threat',
      description: 'Rainfall accumulation and river stages are rising toward alert thresholds.',
      instruction: 'Prepare for possible localized flooding. Check community drainage.',
      colorClass: 'text-amber-800',
      badgeClass: 'bg-amber-50/80 border-amber-200 text-amber-900',
      borderClass: 'border-amber-200',
      pingColor: 'bg-amber-500'
    },
    HIGH: {
      name: 'High Flood Threat',
      description: 'River stage has breached warning threshold; significant flood runoff expected.',
      instruction: 'Prepare to evacuate designated lowlands. Stage emergency transport and supplies.',
      colorClass: 'text-orange-800',
      badgeClass: 'bg-orange-50/80 border-orange-200 text-orange-900',
      borderClass: 'border-orange-300',
      pingColor: 'bg-orange-500'
    },
    CRITICAL: {
      name: 'Critical Flood Threat',
      description: 'Danger stage breached. Imminent catastrophic overtopping or flash flooding.',
      instruction: 'Evacuate immediately. Seek high-ground reinforced shelter.',
      colorClass: 'text-red-800',
      badgeClass: 'bg-red-50/80 border-red-200 text-red-900',
      borderClass: 'border-red-300',
      pingColor: 'bg-red-600'
    }
  };

  const currentMeta = threatLevelsMeta[threatAssessment.level];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200">
              Stage 5: Alerting & Warning
            </span>
            <span className="text-xs text-slate-500">
              ASEAN Disaster Emergency Response Network (ADINET Compatible)
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            Adaptive Regional Flood Threat Alert
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Dynamic tiered flood hazard classification responding instantly to real-time risk matrix calculations.
          </p>
        </div>

        {/* Region & Station Info */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm text-xs">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="text-slate-900 font-bold">{selectedCountry.name}</span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">{selectedStation?.name || 'Regional Catchment'}</span>
        </div>
      </div>

      {/* Hero Alert Panel (Large, Clean, Figma Grade) */}
      <div className={`rounded-2xl border p-6 md:p-8 shadow-sm transition-all duration-200 ${currentMeta.badgeClass}`}>
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${currentMeta.pingColor}`} />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Current Threat Assessment Status
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-white/80 px-2.5 py-1 rounded-md border border-slate-200">
              Composite Risk Score: {threatAssessment.score}/100
            </span>
          </div>

          <div>
            <h3 className={`text-2xl md:text-4xl font-extrabold tracking-tight ${currentMeta.colorClass}`}>
              {currentMeta.name}
            </h3>
            <p className="text-base md:text-lg font-semibold text-slate-900 mt-1">
              {threatAssessment.actionSummary}
            </p>
          </div>

          <p className="text-xs md:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {currentMeta.description} Active hydrological conditions show precipitation at <strong>{simulatedRainfall} mm/h</strong> and water stage at <strong>{simulatedWaterLevel.toFixed(1)} m</strong> for {selectedCountry.name}.
          </p>

          {/* Trigger Emergency Action Button */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('emergency-actions')}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-sm transition-all"
            >
              <span>View Emergency Action SOP Protocols</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleSimulateBroadcast}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-200 shadow-sm flex items-center gap-2 transition-colors"
            >
              {broadcastSent ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Alert Dispatched Successfully</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-blue-600" />
                  <span>Simulate Multi-Agency Alert Broadcast</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Threat Tiers Comparison Grid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            ASEAN Flood EWS Alert Tier Matrix
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Low Tier */}
          <div className={`p-4 rounded-xl border bg-white shadow-sm transition-all ${
            threatAssessment.level === 'LOW' ? 'ring-2 ring-emerald-500 border-emerald-300' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-[11px] text-slate-400 font-medium">0 – 35 Score</span>
            </div>
            <h4 className="text-sm font-bold text-emerald-800">🟢 Low</h4>
            <p className="text-xs text-slate-800 font-semibold mt-1">Monitor conditions</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Routine continuous monitoring of baseline river discharges and satellite precipitation.
            </p>
          </div>

          {/* Moderate Tier */}
          <div className={`p-4 rounded-xl border bg-white shadow-sm transition-all ${
            threatAssessment.level === 'MODERATE' ? 'ring-2 ring-amber-500 border-amber-300' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-[11px] text-slate-400 font-medium">35 – 60 Score</span>
            </div>
            <h4 className="text-sm font-bold text-amber-800">🟡 Moderate</h4>
            <p className="text-xs text-slate-800 font-semibold mt-1">Prepare for flooding</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Mobilize local disaster management units and issue community preparedness notices.
            </p>
          </div>

          {/* High Tier */}
          <div className={`p-4 rounded-xl border bg-white shadow-sm transition-all ${
            threatAssessment.level === 'HIGH' ? 'ring-2 ring-orange-500 border-orange-300' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
              <span className="text-[11px] text-slate-400 font-medium">60 – 80 Score</span>
            </div>
            <h4 className="text-sm font-bold text-orange-800">🟠 High</h4>
            <p className="text-xs text-slate-800 font-semibold mt-1">Prepare to evacuate</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Stage rescue assets, prepare evacuation transport, and alert vulnerable settlements.
            </p>
          </div>

          {/* Critical Tier */}
          <div className={`p-4 rounded-xl border bg-white shadow-sm transition-all ${
            threatAssessment.level === 'CRITICAL' ? 'ring-2 ring-red-500 border-red-300' : 'border-slate-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
              <span className="text-[11px] text-slate-400 font-medium">80 – 100 Score</span>
            </div>
            <h4 className="text-sm font-bold text-red-800">🔴 Critical</h4>
            <p className="text-xs text-slate-800 font-semibold mt-1">Evacuate / Seek Shelter</p>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
              Immediate mandatory evacuation of flood zones. Mobilize emergency response teams.
            </p>
          </div>
        </div>
      </div>

      {/* Public Safety Cell Broadcast Advisory Preview */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-600" />
          <h3 className="text-xs font-semibold text-slate-800">
              Public Safety Advisory — Simulated Preview
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">Sample broadcast content</span>
        </div>

        <div className="mt-3 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-2 text-slate-700">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="font-semibold text-slate-500 text-[11px]">ASEAN Early Warning Advisory</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${threatAssessment.bgBadge}`}>
              {threatAssessment.level}
            </span>
          </div>
          <p className="font-semibold text-slate-900">
            {selectedCountry.name} — {selectedStation?.name || 'Regional Catchment'}
          </p>
          <p className="text-slate-600">
            Flood risk score: {threatAssessment.score}/100. Current water stage: {simulatedWaterLevel.toFixed(1)} m.
          </p>
          <p className={`font-medium p-2 rounded border mt-1 ${threatAssessment.bgBadge}`}>
            Recommended action: {threatAssessment.actionSummary}
          </p>
        </div>
      </div>
    </div>
  );
};
