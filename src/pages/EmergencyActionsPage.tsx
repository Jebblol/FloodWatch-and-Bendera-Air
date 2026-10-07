import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Home, 
  Truck, 
  CheckSquare, 
  Square,
  Sparkles, 
  RotateCcw,
  PhoneCall,
  CheckCircle2,
  Users,
  MapPin,
  AlertTriangle,
  Building2,
  Send
} from 'lucide-react';
import { useEWS } from '../context/EWSContext';

export const EmergencyActionsPage: React.FC = () => {
  const { 
    selectedCountry, 
    selectedStation,
    threatAssessment,
    setActiveTab
  } = useEWS();

  // Interactive checklists state
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

  const [directivesDispatched, setDirectivesDispatched] = useState<boolean>(false);

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isActionActive = (action: 'Prepare' | 'Evacuate' | 'Seek Shelter') => {
    return threatAssessment.recommendedActions.includes(action);
  };

  const totalTasks = Object.keys(checkedItems).length;
  const completedTasks = Object.values(checkedItems).filter(Boolean).length;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  const handleDispatchDirectives = () => {
    setDirectivesDispatched(true);
    setTimeout(() => setDirectivesDispatched(false), 5000);
  };

  return (
    <div className="space-y-[20px] w-full">
      {/* Top Banner Header */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <div className="flex items-center gap-[8px]">
            <span className="px-[8px] py-[3px] rounded-[4px] text-[11px] font-bold bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">
              STAGE 6: OPERATIONAL EXECUTION
            </span>
            <span className="text-[12px] text-[var(--muted)]">
              ASEAN Standard Operating Procedures for Disaster Relief (SASOP)
            </span>
          </div>

          <h2 className="text-[18px] font-bold text-[var(--ink)] m-0 mt-[4px]">
            Emergency Response SOP & Evacuation Directives
          </h2>
          <p className="text-[13px] text-[var(--muted)] m-0 mt-[2px]">
            Translating dynamic threat assessments into tactical emergency response protocols and field directives.
          </p>
        </div>

        {/* Current Active Status Pill */}
        <div className="flex items-center gap-[10px] bg-[var(--bg)] border border-[var(--line)] px-[14px] py-[8px] rounded-[6px]">
          <span className="text-[12px] text-[var(--muted)]">Active Protocol:</span>
          <b className="text-[14px] text-[var(--crit)] uppercase">
            {threatAssessment.recommendedActions.join(' + ') || 'Continuous Monitoring'}
          </b>
        </div>
      </div>

      {/* Progress & Quick Dispatch Action */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] flex flex-wrap items-center justify-between gap-[16px]">
        <div className="flex items-center gap-[16px] flex-1 min-w-[240px]">
          <div>
            <span className="text-[11px] text-[var(--muted)] block">SOP Execution Progress</span>
            <b className="text-[18px] text-[var(--ink)] block">
              {completedTasks} / {totalTasks} Tasks Completed ({progressPercent}%)
            </b>
          </div>
          <div className="flex-1 max-w-xs h-[8px] bg-[var(--line)] rounded-[4px] overflow-hidden">
            <div 
              className="h-full bg-emerald-600 rounded-[4px] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleDispatchDirectives}
          disabled={directivesDispatched}
          className={`px-[16px] py-[8px] rounded-[6px] text-[13px] font-bold text-white flex items-center gap-[6px] transition-all cursor-pointer shadow-xs ${
            directivesDispatched ? 'bg-emerald-600' : 'bg-[var(--sea)] hover:opacity-95'
          }`}
        >
          {directivesDispatched ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Directives Dispatched to Civil Defense Units!</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Transmit Directives to Emergency Response Units</span>
            </>
          )}
        </button>
      </div>

      {/* 3 Core Emergency Action Protocol Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
        {/* Protocol A: PREPARE */}
        <section 
          className={`bg-[var(--panel)] border rounded-[8px] p-[18px] flex flex-col justify-between space-y-[16px] transition-all ${
            isActionActive('Prepare')
              ? 'border-amber-400 ring-2 ring-amber-400/30'
              : 'border-[var(--line)] opacity-80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-[10px] border-b border-[var(--line)]">
              <div className="flex items-center gap-[8px]">
                <div className="w-[32px] h-[32px] rounded-[6px] bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[var(--ink)] m-0">Protocol A: PREPARE</h3>
                  <span className="text-[11px] text-[var(--muted)]">Phase 1: Mobilization</span>
                </div>
              </div>
              <span className={`px-[8px] py-[3px] rounded-[4px] text-[10px] font-bold text-white ${
                isActionActive('Prepare') ? 'bg-amber-600' : 'bg-slate-400'
              }`}>
                {isActionActive('Prepare') ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>

            <p className="text-[12px] text-[var(--muted)] my-[10px] leading-relaxed">
              Activate local community disaster management councils, inspect drainage sluices, and distribute sandbags.
            </p>

            <div className="space-y-[8px]">
              <button
                onClick={() => toggleCheck('prep-1')}
                className="w-full text-left p-[8px_10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[12px] flex items-center gap-[8px] cursor-pointer hover:bg-[color-mix(in_srgb,var(--sea)_6%,transparent)]"
              >
                {checkedItems['prep-1'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-[var(--muted)] shrink-0" />}
                <span className={checkedItems['prep-1'] ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)] font-medium'}>
                  1. Issue village alert broadcast via loudspeakers & SMS
                </span>
              </button>

              <button
                onClick={() => toggleCheck('prep-2')}
                className="w-full text-left p-[8px_10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[12px] flex items-center gap-[8px] cursor-pointer hover:bg-[color-mix(in_srgb,var(--sea)_6%,transparent)]"
              >
                {checkedItems['prep-2'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-[var(--muted)] shrink-0" />}
                <span className={checkedItems['prep-2'] ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)] font-medium'}>
                  2. Stage 2,500 sandbags at Citarum / Dayeuhkolot levee
                </span>
              </button>

              <button
                onClick={() => toggleCheck('prep-3')}
                className="w-full text-left p-[8px_10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[12px] flex items-center gap-[8px] cursor-pointer hover:bg-[color-mix(in_srgb,var(--sea)_6%,transparent)]"
              >
                {checkedItems['prep-3'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-[var(--muted)] shrink-0" />}
                <span className={checkedItems['prep-3'] ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)] font-medium'}>
                  3. Verify emergency backup generators & water pumps
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Protocol B: EVACUATE */}
        <section 
          className={`bg-[var(--panel)] border rounded-[8px] p-[18px] flex flex-col justify-between space-y-[16px] transition-all ${
            isActionActive('Evacuate')
              ? 'border-orange-500 ring-2 ring-orange-500/30'
              : 'border-[var(--line)] opacity-80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-[10px] border-b border-[var(--line)]">
              <div className="flex items-center gap-[8px]">
                <div className="w-[32px] h-[32px] rounded-[6px] bg-orange-500/10 flex items-center justify-center text-orange-600">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[var(--ink)] m-0">Protocol B: EVACUATE</h3>
                  <span className="text-[11px] text-[var(--muted)]">Phase 2: Egress</span>
                </div>
              </div>
              <span className={`px-[8px] py-[3px] rounded-[4px] text-[10px] font-bold text-white ${
                isActionActive('Evacuate') ? 'bg-orange-600' : 'bg-slate-400'
              }`}>
                {isActionActive('Evacuate') ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>

            <p className="text-[12px] text-[var(--muted)] my-[10px] leading-relaxed">
              Order phased evacuation along designated primary egress routes for high-risk floodplain residents.
            </p>

            <div className="space-y-[8px]">
              <button
                onClick={() => toggleCheck('evac-1')}
                className="w-full text-left p-[8px_10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[12px] flex items-center gap-[8px] cursor-pointer hover:bg-[color-mix(in_srgb,var(--sea)_6%,transparent)]"
              >
                {checkedItems['evac-1'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-[var(--muted)] shrink-0" />}
                <span className={checkedItems['evac-1'] ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)] font-medium'}>
                  1. Deploy 12 transport trucks & 8 rescue Zodiac boats
                </span>
              </button>

              <button
                onClick={() => toggleCheck('evac-2')}
                className="w-full text-left p-[8px_10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[12px] flex items-center gap-[8px] cursor-pointer hover:bg-[color-mix(in_srgb,var(--sea)_6%,transparent)]"
              >
                {checkedItems['evac-2'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-[var(--muted)] shrink-0" />}
                <span className={checkedItems['evac-2'] ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)] font-medium'}>
                  2. Prioritize elderly, disabled & pediatric populations
                </span>
              </button>

              <button
                onClick={() => toggleCheck('evac-3')}
                className="w-full text-left p-[8px_10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[12px] flex items-center gap-[8px] cursor-pointer hover:bg-[color-mix(in_srgb,var(--sea)_6%,transparent)]"
              >
                {checkedItems['evac-3'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-[var(--muted)] shrink-0" />}
                <span className={checkedItems['evac-3'] ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)] font-medium'}>
                  3. Secure electricity grid shutoff in inundated sectors
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Protocol C: SEEK SHELTER */}
        <section 
          className={`bg-[var(--panel)] border rounded-[8px] p-[18px] flex flex-col justify-between space-y-[16px] transition-all ${
            isActionActive('Seek Shelter')
              ? 'border-red-500 ring-2 ring-red-500/30'
              : 'border-[var(--line)] opacity-80'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-[10px] border-b border-[var(--line)]">
              <div className="flex items-center gap-[8px]">
                <div className="w-[32px] h-[32px] rounded-[6px] bg-red-500/10 flex items-center justify-center text-red-600">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[var(--ink)] m-0">Protocol C: SHELTER</h3>
                  <span className="text-[11px] text-[var(--muted)]">Phase 3: Refuge</span>
                </div>
              </div>
              <span className={`px-[8px] py-[3px] rounded-[4px] text-[10px] font-bold text-white ${
                isActionActive('Seek Shelter') ? 'bg-red-600' : 'bg-slate-400'
              }`}>
                {isActionActive('Seek Shelter') ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>

            <p className="text-[12px] text-[var(--muted)] my-[10px] leading-relaxed">
              Direct populations to designated multi-story concrete evacuation complexes above historical crest marks.
            </p>

            <div className="space-y-[8px]">
              <button
                onClick={() => toggleCheck('shelt-1')}
                className="w-full text-left p-[8px_10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[12px] flex items-center gap-[8px] cursor-pointer hover:bg-[color-mix(in_srgb,var(--sea)_6%,transparent)]"
              >
                {checkedItems['shelt-1'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-[var(--muted)] shrink-0" />}
                <span className={checkedItems['shelt-1'] ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)] font-medium'}>
                  1. Open Dayeuhkolot Central Community Shelter (Cap: 3,500)
                </span>
              </button>

              <button
                onClick={() => toggleCheck('shelt-2')}
                className="w-full text-left p-[8px_10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[12px] flex items-center gap-[8px] cursor-pointer hover:bg-[color-mix(in_srgb,var(--sea)_6%,transparent)]"
              >
                {checkedItems['shelt-2'] ? <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" /> : <Square className="w-4 h-4 text-[var(--muted)] shrink-0" />}
                <span className={checkedItems['shelt-2'] ? 'line-through text-[var(--muted)]' : 'text-[var(--ink)] font-medium'}>
                  2. Distribute emergency food rations & potable water supplies
                </span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Emergency Shelters Directory & Hotlines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[20px]">
        {/* Designated Shelters */}
        <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] space-y-[12px]">
          <h3 className="text-[14px] font-bold text-[var(--ink)] m-0 flex items-center gap-[6px]">
            <Building2 className="w-4 h-4 text-[var(--sea)]" />
            Active Regional Evacuation Shelters ({selectedCountry.name})
          </h3>

          <div className="space-y-[8px]">
            <div className="p-[10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] flex items-center justify-between text-[12px]">
              <div>
                <b className="text-[var(--ink)] block">SDN 03 Dayeuhkolot Community Center</b>
                <span className="text-[var(--muted)]">Bandung Regency · 1.2 km from riverbank</span>
              </div>
              <span className="px-[8px] py-[3px] rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Open (850/1,200)
              </span>
            </div>

            <div className="p-[10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] flex items-center justify-between text-[12px]">
              <div>
                <b className="text-[var(--ink)] block">Bale Endah Sports Complex</b>
                <span className="text-[var(--muted)]">Bandung Regency · High Elevation Zone</span>
              </div>
              <span className="px-[8px] py-[3px] rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                Open (1,400/2,500)
              </span>
            </div>
          </div>
        </section>

        {/* Emergency Hotlines */}
        <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] space-y-[12px]">
          <h3 className="text-[14px] font-bold text-[var(--ink)] m-0 flex items-center gap-[6px]">
            <PhoneCall className="w-4 h-4 text-red-600" />
            National Emergency Dispatch Hotlines
          </h3>

          <div className="grid grid-cols-2 gap-[10px]">
            <div className="p-[10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)]">
              <span className="text-[11px] text-[var(--muted)] block">Disaster Relief Agency</span>
              <b className="text-[16px] text-red-700 block mt-[2px]">117 (BNPB / NDRRMC)</b>
              <span className="text-[10px] text-[var(--muted)]">Toll-free emergency</span>
            </div>

            <div className="p-[10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)]">
              <span className="text-[11px] text-[var(--muted)] block">National Search & Rescue</span>
              <b className="text-[16px] text-[var(--sea)] block mt-[2px]">115 (BASARNAS)</b>
              <span className="text-[10px] text-[var(--muted)]">24/7 Water Rescue</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
