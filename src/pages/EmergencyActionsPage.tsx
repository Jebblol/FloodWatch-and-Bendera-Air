import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Home, 
  Truck, 
  CheckSquare, 
  Square,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { useEWS } from '../context/EWSContext';

export const EmergencyActionsPage: React.FC = () => {
  const { 
    selectedCountry, 
    threatAssessment,
    setActiveTab,
    startPresentationTour
  } = useEWS();

  // Interactive checklists
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    'prep-1': true,
    'prep-2': true,
    'prep-3': false,
    'evac-1': false,
    'evac-2': false,
    'evac-3': false,
    'shelt-1': false,
    'shelt-2': false
  });

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isActionActive = (action: 'Prepare' | 'Evacuate' | 'Seek Shelter') => {
    return threatAssessment.recommendedActions.includes(action);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              Stage 6: Operational Execution
            </span>
            <span className="text-xs text-slate-500">
              ASEAN Standard Operating Procedures for Disaster Relief (SASOP)
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            Emergency Response & Evacuation Directives
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Final stage of the EWS architecture: Translating dynamic threat assessments into tactical emergency response protocols.
          </p>
        </div>

        {/* Current Active Summary */}
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-3.5 py-1.5 shadow-sm text-xs">
          <span className="text-slate-500">Current Threat:</span>
          <span className={`font-bold uppercase ${threatAssessment.color}`}>
            {threatAssessment.level}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-800 font-semibold">
            {threatAssessment.recommendedActions.join(' + ') || 'Continuous Monitoring'}
          </span>
        </div>
      </div>

      {/* 3 Core Emergency Action Cards (Prepare, Evacuate, Seek Shelter) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Action 1: Prepare */}
        <div className={`rounded-xl border bg-white p-5 shadow-sm flex flex-col justify-between transition-all ${
          isActionActive('Prepare')
            ? 'ring-2 ring-amber-500 border-amber-300 bg-amber-50/20'
            : 'border-slate-200 opacity-70'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActionActive('Prepare') ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400">
                    Protocol A
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Prepare
                  </h3>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase border ${
                isActionActive('Prepare') ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {isActionActive('Prepare') ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Recommended for <strong>Moderate to High Threat</strong> levels. Activate community emergency readiness plans and secure flood defenses.
            </p>

            {/* Checklist */}
            <div className="space-y-2 text-xs pt-1">
              <span className="text-[10px] font-medium text-slate-400 block">
                Standard SOP Checklist:
              </span>
              <div 
                onClick={() => toggleCheck('prep-1')}
                className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                {checkedItems['prep-1'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Inspect drainage outfalls & deploy sandbag barriers</span>
              </div>
              <div 
                onClick={() => toggleCheck('prep-2')}
                className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                {checkedItems['prep-2'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Verify emergency 72-hour family sustenance kits</span>
              </div>
              <div 
                onClick={() => toggleCheck('prep-3')}
                className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                {checkedItems['prep-3'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Stage community rescue boats in low-lying barangays</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Applies: Moderate & High Threats
          </div>
        </div>

        {/* Action 2: Evacuate */}
        <div className={`rounded-xl border bg-white p-5 shadow-sm flex flex-col justify-between transition-all ${
          isActionActive('Evacuate')
            ? 'ring-2 ring-red-500 border-red-300 bg-red-50/20'
            : 'border-slate-200 opacity-70'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActionActive('Evacuate') ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400">
                    Protocol B
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Evacuate
                  </h3>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase border ${
                isActionActive('Evacuate') ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {isActionActive('Evacuate') ? 'MANDATORY' : 'STANDBY'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Triggered at <strong>High and Critical Threat</strong> levels. Order organized evacuation of vulnerable floodplains and flood-fringe communities.
            </p>

            {/* Checklist */}
            <div className="space-y-2 text-xs pt-1">
              <span className="text-[10px] font-medium text-slate-400 block">
                Evacuation Directives:
              </span>
              <div 
                onClick={() => toggleCheck('evac-1')}
                className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                {checkedItems['evac-1'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Activate predetermined high-ground evacuation routes</span>
              </div>
              <div 
                onClick={() => toggleCheck('evac-2')}
                className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                {checkedItems['evac-2'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Prioritize assisted transport for elderly & vulnerable citizens</span>
              </div>
              <div 
                onClick={() => toggleCheck('evac-3')}
                className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                {checkedItems['evac-3'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Cut electrical power to inundated riverbank corridors</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-red-700 font-medium">
            Applies: High & Critical Threats
          </div>
        </div>

        {/* Action 3: Seek Shelter */}
        <div className={`rounded-xl border bg-white p-5 shadow-sm flex flex-col justify-between transition-all ${
          isActionActive('Seek Shelter')
            ? 'ring-2 ring-purple-500 border-purple-300 bg-purple-50/20'
            : 'border-slate-200 opacity-70'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActionActive('Seek Shelter') ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'
                }`}>
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400">
                    Protocol C
                  </span>
                  <h3 className="text-base font-bold text-slate-900">
                    Seek Shelter
                  </h3>
                </div>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase border ${
                isActionActive('Seek Shelter') ? 'bg-purple-100 text-purple-700 border-purple-300' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}>
                {isActionActive('Seek Shelter') ? 'URGENT' : 'STANDBY'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Mandatory at <strong>Critical Threat</strong> level. Move to certified multi-story reinforced emergency disaster shelters above flood levels.
            </p>

            {/* Checklist */}
            <div className="space-y-2 text-xs pt-1">
              <span className="text-[10px] font-medium text-slate-400 block">
                Shelter Management Directives:
              </span>
              <div 
                onClick={() => toggleCheck('shelt-1')}
                className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                {checkedItems['shelt-1'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Open designated civic centers & high-ground school gyms</span>
              </div>
              <div 
                onClick={() => toggleCheck('shelt-2')}
                className="cursor-pointer flex items-center gap-2.5 p-2 rounded-lg bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700"
              >
                {checkedItems['shelt-2'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-slate-400 shrink-0" />}
                <span>Dispatch potable water tankers & emergency medical teams</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-purple-700 font-medium">
            Applies: Critical Threat Stage
          </div>
        </div>
      </div>

      {/* Full EWS Demonstration Summary Card */}
      <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              End-to-End EWS Conceptual Demonstration Completed
            </h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            You have observed the entire 6-stage lifecycle of the ASEAN Flood Early Warning System: From empirical historical baseline records, to spatial risk mapping, real-time sensor inflow, risk analysis calculation, dynamic adaptive alert, and tactical emergency actions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={startPresentationTour}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Replay Demo Walkthrough</span>
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setActiveTab('overview')}
            className="px-4 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-xs border border-slate-200 shadow-sm transition-colors"
          >
            Return to Overview
          </button>
        </div>
      </div>
    </div>
  );
};
