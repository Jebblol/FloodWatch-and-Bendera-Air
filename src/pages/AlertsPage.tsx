import React, { useState } from 'react';
import { 
  BellRing, 
  ShieldAlert, 
  Send, 
  Radio, 
  MapPin, 
  ChevronRight,
  Check,
  Clock,
  Volume2,
  AlertTriangle,
  Flame,
  CheckCircle2,
  ExternalLink
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
  const [filterTier, setFilterTier] = useState<'all' | 'active' | 'resolved'>('active');
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Record<string, boolean>>({});

  const handleSimulateBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  const toggleAcknowledge = (id: string) => {
    setAcknowledgedAlerts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const threatLevelsMeta: Record<ThreatLevel, { name: string; description: string; instruction: string; colorVar: string }> = {
    LOW: {
      name: 'Low Flood Threat (Advisory)',
      description: 'Atmospheric and hydrological conditions remain within safe baseline margins.',
      instruction: 'Routine monitoring active. Maintain standard observation schedule.',
      colorVar: 'var(--low)'
    },
    MODERATE: {
      name: 'Moderate Flood Threat (Watch)',
      description: 'Rainfall accumulation and river stages are rising toward alert thresholds.',
      instruction: 'Prepare for possible localized inundation. Inspect community drainage and riverbanks.',
      colorVar: 'var(--mod)'
    },
    HIGH: {
      name: 'High Flood Threat (Warning)',
      description: 'River stage has breached warning threshold; significant floodplain inundation expected.',
      instruction: 'Prepare to evacuate designated lowlands. Stage emergency transport and mobilize local relief.',
      colorVar: 'var(--high)'
    },
    CRITICAL: {
      name: 'Critical Flood Threat (Evacuation Order)',
      description: 'Danger stage breached. Imminent catastrophic overtopping or flash flooding.',
      instruction: 'Evacuate immediately along designated routes. Seek high-ground reinforced shelters.',
      colorVar: 'var(--crit)'
    }
  };

  const currentMeta = threatLevelsMeta[threatAssessment.level];

  // Simulated list of regional station alerts
  const sampleAlerts = [
    {
      id: 'alt-01',
      title: `${selectedStation?.name || 'Citarum River - Dayeuhkolot'} · ${selectedCountry.name}`,
      level: threatAssessment.level,
      score: threatAssessment.score,
      time: 'Just now',
      stage: `${simulatedWaterLevel.toFixed(1)}m`,
      danger: `${selectedStation?.dangerLevel || 6.8}m`,
      rain: `${simulatedRainfall} mm/h`,
      desc: currentMeta.description,
      instruction: currentMeta.instruction,
      isPrimary: true
    },
    {
      id: 'alt-02',
      title: 'Bengawan Solo - Jurug Hydro Station · Indonesia',
      level: 'HIGH' as ThreatLevel,
      score: 72,
      time: '18 min ago',
      stage: '6.4m',
      danger: '7.5m',
      rain: '68 mm/h',
      desc: 'Upstream reservoir spillway discharge accelerating bank erosion.',
      instruction: 'Stage community rescue boats and alert downstream villages.',
      isPrimary: false
    },
    {
      id: 'alt-03',
      title: 'Marikina River - Sto. Niño Station · Philippines',
      level: 'CRITICAL' as ThreatLevel,
      score: 88,
      time: '34 min ago',
      stage: '18.4m',
      danger: '18.0m',
      rain: '110 mm/h',
      desc: 'Typhoon outer bands causing rapid cresting past bankfull capacity.',
      instruction: 'Enforce mandatory evacuation of low-lying riverside communities.',
      isPrimary: false
    }
  ];

  return (
    <div className="space-y-[20px] w-full max-w-[1200px]">
      {/* Top Banner Header */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <div className="flex items-center gap-[8px]">
            <span className="px-[8px] py-[3px] rounded-[4px] text-[11px] font-bold bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">
              STAGE 5: ADAPTIVE ALERTS
            </span>
            <span className="text-[12px] text-[var(--muted)]">
              ASEAN Disaster Emergency Response Network (ADINET Compatible)
            </span>
          </div>

          <h2 className="text-[18px] font-bold text-[var(--ink)] m-0 mt-[4px]">
            Multi-Agency Early Warning & Flood Threat Broadcast
          </h2>
          <p className="text-[13px] text-[var(--muted)] m-0 mt-[2px]">
            Dynamic tiered warning protocols triggered automatically by composite risk scoring.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-[6px] bg-[var(--bg)] p-[4px] rounded-[6px] border border-[var(--line)]">
          <button
            onClick={() => setFilterTier('active')}
            className={`px-[10px] py-[4px] rounded-[4px] text-[12px] font-semibold transition-colors ${
              filterTier === 'active' 
                ? 'bg-[var(--panel)] text-[var(--crit)] shadow-xs border border-[var(--line)]' 
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            Active Alerts (3)
          </button>
          <button
            onClick={() => setFilterTier('all')}
            className={`px-[10px] py-[4px] rounded-[4px] text-[12px] font-semibold transition-colors ${
              filterTier === 'all' 
                ? 'bg-[var(--panel)] text-[var(--sea)] shadow-xs border border-[var(--line)]' 
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            All Regional Feeds
          </button>
          <button
            onClick={() => setFilterTier('resolved')}
            className={`px-[10px] py-[4px] rounded-[4px] text-[12px] font-semibold transition-colors ${
              filterTier === 'resolved' 
                ? 'bg-[var(--panel)] text-emerald-600 shadow-xs border border-[var(--line)]' 
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      {/* Main Active Banner Card */}
      <section 
        className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[20px] transition-all"
        style={{ borderLeft: `8px solid ${currentMeta.colorVar}` }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
          <div>
            <div className="flex items-center gap-[8px]">
              <span className="w-[10px] h-[10px] rounded-full animate-ping" style={{ background: currentMeta.colorVar }} />
              <span className="text-[12px] font-bold uppercase tracking-wide" style={{ color: currentMeta.colorVar }}>
                Active Threat Tier: {threatAssessment.level}
              </span>
              <span className="text-[12px] text-[var(--muted)]">· Score {threatAssessment.score}/100</span>
            </div>

            <h3 className="text-[20px] font-bold text-[var(--ink)] m-0 mt-[4px]">
              {currentMeta.name}
            </h3>
            <p className="text-[13px] text-[var(--muted)] m-0 mt-[4px] max-w-2xl leading-relaxed">
              {currentMeta.description}
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex gap-[8px] shrink-0">
            <button
              onClick={() => setActiveTab('emergency-actions')}
              className="py-[10px] px-[16px] text-white rounded-[6px] text-[13px] font-bold shadow-xs hover:opacity-95 transition-opacity cursor-pointer flex items-center gap-[6px]"
              style={{ background: currentMeta.colorVar }}
            >
              <span>Execute Emergency SOP &rarr;</span>
            </button>
          </div>
        </div>

        {/* Operational Directive Instruction Callout */}
        <div className="mt-[14px] pt-[12px] border-t border-[var(--line)] flex items-start gap-[10px]">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: currentMeta.colorVar }} />
          <p className="text-[13px] text-[var(--ink)] font-medium m-0">
            <strong>Command Directive:</strong> {currentMeta.instruction}
          </p>
        </div>
      </section>

      {/* Regional Active Alerts Feed List */}
      <div className="space-y-[12px]">
        <h3 className="text-[14px] font-bold text-[var(--ink)] m-0">
          Regional River Station Telemetric Alerts Feed
        </h3>

        {sampleAlerts.map((alt) => {
          const isAck = acknowledgedAlerts[alt.id];
          const altColor = alt.level === 'CRITICAL' ? 'var(--crit)' :
                           alt.level === 'HIGH' ? 'var(--high)' :
                           alt.level === 'MODERATE' ? 'var(--mod)' : 'var(--low)';

          return (
            <div 
              key={alt.id}
              className={`bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] transition-all flex flex-col md:flex-row md:items-center justify-between gap-[16px] ${
                isAck ? 'opacity-65' : ''
              }`}
              style={{ borderLeft: `6px solid ${altColor}` }}
            >
              <div className="space-y-[6px]">
                <div className="flex items-center gap-[8px] flex-wrap">
                  <b className="text-[15px] text-[var(--ink)]">{alt.title}</b>
                  <span className="px-[6px] py-[2px] rounded text-[11px] font-bold text-white" style={{ background: altColor }}>
                    {alt.level}
                  </span>
                  <span className="text-[11px] text-[var(--muted)] flex items-center gap-[4px]">
                    <Clock className="w-3.5 h-3.5" />
                    {alt.time}
                  </span>
                </div>

                <p className="text-[12px] text-[var(--muted)] m-0 leading-relaxed">
                  {alt.desc}
                </p>

                <div className="flex gap-[16px] text-[12px] text-[var(--muted)] pt-[2px]">
                  <span>Stage: <strong className="text-[var(--ink)]">{alt.stage}</strong> (Danger: {alt.danger})</span>
                  <span>Rain: <strong className="text-[var(--ink)]">{alt.rain}</strong></span>
                  <span>Composite Score: <strong className="text-[var(--ink)]">{alt.score}/100</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-[8px] shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => toggleAcknowledge(alt.id)}
                  className={`flex-1 sm:flex-initial px-[12px] py-[8px] rounded-[6px] text-[12px] font-semibold border transition-colors cursor-pointer text-center ${
                    isAck 
                      ? 'bg-[var(--bg)] border-[var(--line)] text-emerald-700 font-bold'
                      : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--sea)_10%,transparent)]'
                  }`}
                >
                  {isAck ? '✓ Acknowledged' : 'Acknowledge'}
                </button>

                <button
                  onClick={() => setActiveTab('emergency-actions')}
                  className="flex-1 sm:flex-initial px-[12px] py-[8px] rounded-[6px] text-[12px] font-bold text-white cursor-pointer shadow-xs hover:opacity-95 text-center"
                  style={{ background: altColor }}
                >
                  View Actions
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Multi-Agency Broadcast Simulator Panel */}
      <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] space-y-[12px]">
        <div className="flex items-center justify-between flex-wrap gap-[8px]">
          <div>
            <h3 className="text-[14px] font-bold text-[var(--ink)] m-0 flex items-center gap-[6px]">
              <Volume2 className="w-4 h-4 text-[var(--sea)]" />
              Emergency Multi-Channel Broadcast Transmitter (CAP Protocol)
            </h3>
            <span className="text-[12px] text-[var(--muted)]">
              Broadcasts Common Alerting Protocol payload to SMS, Cell Broadcast, Siren Towers, and ADINET Network
            </span>
          </div>

          <button
            onClick={handleSimulateBroadcast}
            disabled={broadcastSent}
            className={`px-[14px] py-[8px] rounded-[6px] text-[12px] font-bold text-white flex items-center gap-[6px] transition-all cursor-pointer shadow-xs ${
              broadcastSent ? 'bg-emerald-600' : 'bg-[var(--sea)] hover:opacity-95'
            }`}
          >
            {broadcastSent ? (
              <>
                <Check className="w-4 h-4" />
                <span>Broadcast Dispatched to 142k Citizens!</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Simulate Emergency Public Broadcast</span>
              </>
            )}
          </button>
        </div>

        {broadcastSent && (
          <div className="p-[12px] rounded-[6px] bg-emerald-50 border border-emerald-200 text-emerald-900 text-[12px] space-y-[4px] animate-in fade-in">
            <b>Transmission Verified:</b>
            <p className="m-0 text-[11px] text-emerald-800">
              Cell Broadcast sent to cell towers covering {selectedCountry.name} ({selectedStation?.location}). Emergency sirens triggered at Dayeuhkolot & Jurug Hydro Stations. ADINET Incident #EWS-2026-042 created.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
