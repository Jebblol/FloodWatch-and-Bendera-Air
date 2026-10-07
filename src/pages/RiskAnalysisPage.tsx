import React from 'react';
import { 
  Database, 
  Radio, 
  ShieldAlert, 
  Sparkles, 
  Scale, 
  Sliders, 
  Activity, 
  ArrowRight, 
  Layers,
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { useEWS } from '../context/EWSContext';

export const RiskAnalysisPage: React.FC = () => {
  const { 
    selectedCountry, 
    selectedStation, 
    simulatedRainfall, 
    setSimulatedRainfall, 
    simulatedWaterLevel, 
    setSimulatedWaterLevel, 
    threatAssessment,
    setActiveTab
  } = useEWS();

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'var(--crit)';
      case 'HIGH': return 'var(--high)';
      case 'MODERATE': return 'var(--mod)';
      case 'LOW': default: return 'var(--low)';
    }
  };

  const threatColor = getThreatColor(threatAssessment.level);

  return (
    <div className="space-y-[20px] w-full">
      {/* Top Banner Header */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <div className="flex items-center gap-[8px]">
            <span className="px-[8px] py-[3px] rounded-[4px] text-[11px] font-bold bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">
              STAGE 4: RISK SYNTHESIS
            </span>
            <span className="text-[12px] text-[var(--muted)]">
              Deterministic Multi-Hazard Decision Matrix
            </span>
          </div>

          <h2 className="text-[18px] font-bold text-[var(--ink)] m-0 mt-[4px]">
            Integrated Flood Risk Matrix & Analysis
          </h2>
          <p className="text-[13px] text-[var(--muted)] m-0 mt-[2px]">
            Synthesizing 24-year historical vulnerability records (35%) with real-time hydraulic sensor telemetry (65%).
          </p>
        </div>

        {/* Threat Level Badge */}
        <div 
          className="px-[14px] py-[8px] rounded-[6px] border flex items-center gap-[10px]"
          style={{ 
            borderColor: threatColor,
            background: 'var(--bg)'
          }}
        >
          <span className="w-[10px] h-[10px] rounded-full animate-pulse" style={{ background: threatColor }} />
          <div>
            <span className="text-[11px] text-[var(--muted)] block font-medium">Computed Composite Risk</span>
            <span className="text-[15px] font-bold" style={{ color: threatColor }}>
              {threatAssessment.level} ({threatAssessment.score}/100)
            </span>
          </div>
        </div>
      </div>

      {/* Mathematical Model Formula Banner */}
      <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px]">
        <div className="flex items-center justify-between flex-wrap gap-[10px]">
          <div className="flex items-center gap-[8px]">
            <Scale className="w-5 h-5 text-[var(--sea)]" />
            <h3 className="text-[14px] font-bold text-[var(--ink)] m-0">
              Risk Decision Formula: R_composite = (0.35 × Baseline Vulnerability) + (0.65 × Live Hazard)
            </h3>
          </div>
          <span className="text-[12px] text-[var(--muted)]">
            Transparent deterministic weighting for disaster officials
          </span>
        </div>
      </section>

      {/* Main 3-Column Risk Fusion Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[20px]">
        {/* COLUMN 1: Component A - Historical Vulnerability (35% weight) */}
        <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[18px] flex flex-col justify-between space-y-[16px]">
          <div>
            <div className="flex items-center justify-between pb-[10px] border-b border-[var(--line)]">
              <div className="flex items-center gap-[8px]">
                <div className="w-[32px] h-[32px] rounded-[6px] bg-[color-mix(in_srgb,var(--sea)_12%,transparent)] flex items-center justify-center text-[var(--sea)]">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[var(--ink)] m-0">Component A: Historical</h3>
                  <span className="text-[11px] text-[var(--muted)]">35% Composite Weight</span>
                </div>
              </div>
              <b className="text-[16px] text-[var(--sea)] font-bold">
                {threatAssessment.historicalRiskComponent}/100
              </b>
            </div>

            <p className="text-[12px] text-[var(--muted)] my-[10px] leading-relaxed">
              Baseline vulnerability indicators synthesized from ASEAN disaster data (2000–2023):
            </p>

            <div className="space-y-[10px]">
              {/* Metric 1: Flood Frequency */}
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[10px]">
                <div className="flex justify-between text-[12px] mb-[4px]">
                  <span className="text-[var(--muted)]">1. Flood Frequency (35%)</span>
                  <b className="text-[var(--ink)]">
                    {selectedCountry.events !== null ? `${selectedCountry.events} events` : 'N/A'}
                  </b>
                </div>
                <div className="h-[6px] bg-[var(--line)] rounded-[3px] overflow-hidden">
                  <div 
                    className="h-full bg-[var(--sea)] rounded-[3px]"
                    style={{ width: `${Math.min(100, ((selectedCountry.events || 0) / 200) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: Population Exposure */}
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[10px]">
                <div className="flex justify-between text-[12px] mb-[4px]">
                  <span className="text-[var(--muted)]">2. Avg Affected Pop (35%)</span>
                  <b className="text-amber-700">
                    {selectedCountry.avgAffected ? `${Math.round(selectedCountry.avgAffected).toLocaleString()} /event` : 'N/A'}
                  </b>
                </div>
                <div className="h-[6px] bg-[var(--line)] rounded-[3px] overflow-hidden">
                  <div 
                    className="h-full bg-[var(--mod)] rounded-[3px]"
                    style={{ width: `${Math.min(100, ((selectedCountry.avgAffected || 0) / 700000) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Metric 3: Poverty Rate */}
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[10px]">
                <div className="flex justify-between text-[12px] mb-[4px]">
                  <span className="text-[var(--muted)]">3. Poverty Headcount (15%)</span>
                  <b className="text-emerald-700">
                    {selectedCountry.povertyRate !== null ? `${selectedCountry.povertyRate}%` : 'N/A'}
                  </b>
                </div>
                <div className="h-[6px] bg-[var(--line)] rounded-[3px] overflow-hidden">
                  <div 
                    className="h-full bg-[var(--low)] rounded-[3px]"
                    style={{ width: `${Math.min(100, ((selectedCountry.povertyRate || 15) / 50) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Metric 4: Population Density */}
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[10px]">
                <div className="flex justify-between text-[12px] mb-[4px]">
                  <span className="text-[var(--muted)]">4. Population Density (15%)</span>
                  <b className="text-[var(--ink)]">
                    {selectedCountry.density !== null ? `${selectedCountry.density} /km²` : 'N/A'}
                  </b>
                </div>
                <div className="h-[6px] bg-[var(--line)] rounded-[3px] overflow-hidden">
                  <div 
                    className="h-full bg-indigo-600 rounded-[3px]"
                    style={{ width: `${Math.min(100, ((selectedCountry.density || 50) / 400) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-[10px] border-t border-[var(--line)] text-[11px] text-[var(--muted)]">
            Country: <strong>{selectedCountry.name}</strong> · Vulnerability Level: <strong>{selectedCountry.vulnerabilityLevel}</strong>
          </div>
        </section>

        {/* COLUMN 2: Component B - Real-Time Telemetry (65% weight) */}
        <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[18px] flex flex-col justify-between space-y-[16px]">
          <div>
            <div className="flex items-center justify-between pb-[10px] border-b border-[var(--line)]">
              <div className="flex items-center gap-[8px]">
                <div className="w-[32px] h-[32px] rounded-[6px] bg-[color-mix(in_srgb,var(--sea)_12%,transparent)] flex items-center justify-center text-[var(--sea)]">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[var(--ink)] m-0">Component B: Real-Time</h3>
                  <span className="text-[11px] text-[var(--muted)]">65% Composite Weight</span>
                </div>
              </div>
              <b className="text-[16px] text-[var(--sea)] font-bold">
                {threatAssessment.realTimeRiskComponent}/100
              </b>
            </div>

            <p className="text-[12px] text-[var(--muted)] my-[10px] leading-relaxed">
              Hydraulic inputs streaming from basin Doppler radar and river stage sensors:
            </p>

            <div className="space-y-[14px]">
              {/* Rainfall Slider & Reading */}
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[12px] space-y-[6px]">
                <div className="flex justify-between text-[12px]">
                  <span className="text-[var(--muted)]">Precipitation Inflow (45% of B):</span>
                  <b className="text-[var(--ink)]">{simulatedRainfall} mm/h</b>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={simulatedRainfall}
                  onChange={(e) => setSimulatedRainfall(parseInt(e.target.value))}
                  className="w-full accent-[var(--sea)] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--muted)]">
                  <span>0 mm/h (Dry)</span>
                  <span>50 mm/h</span>
                  <span>100 mm/h</span>
                  <span className="font-bold text-[var(--crit)]">200 mm/h</span>
                </div>
              </div>

              {/* Water Level Slider & Reading */}
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[12px] space-y-[6px]">
                <div className="flex justify-between text-[12px]">
                  <span className="text-[var(--muted)]">River Water Stage (55% of B):</span>
                  <b className="text-[var(--ink)]">{simulatedWaterLevel.toFixed(1)} m</b>
                </div>
                <input
                  type="range"
                  min={selectedStation ? (selectedStation.normalLevel * 0.5).toFixed(1) : "0.5"}
                  max={selectedStation ? (selectedStation.dangerLevel * 1.4).toFixed(1) : "10"}
                  step="0.1"
                  value={simulatedWaterLevel}
                  onChange={(e) => setSimulatedWaterLevel(parseFloat(e.target.value))}
                  className="w-full accent-[var(--sea)] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[var(--muted)]">
                  <span>Normal: {selectedStation?.normalLevel}m</span>
                  <span className="text-amber-600">Alert: {selectedStation?.alertLevel}m</span>
                  <span className="text-red-600 font-bold">Danger: {selectedStation?.dangerLevel}m</span>
                </div>
              </div>

              {/* Live Status Summary */}
              <div className="p-[10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[12px] space-y-[4px]">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Rainfall Hazard Contribution:</span>
                  <b>{threatAssessment.rainfallContribution.toFixed(0)} / 100</b>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Water Level Crest Contribution:</span>
                  <b>{threatAssessment.waterLevelContribution.toFixed(0)} / 100</b>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-[10px] border-t border-[var(--line)] text-[11px] text-[var(--sea)] flex items-center gap-[4px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive sensitivity adjustment</span>
          </div>
        </section>

        {/* COLUMN 3: Composite Flood Risk Output & Decision */}
        <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[18px] flex flex-col justify-between space-y-[16px]">
          <div>
            <div className="flex items-center justify-between pb-[10px] border-b border-[var(--line)]">
              <div className="flex items-center gap-[8px]">
                <div 
                  className="w-[32px] h-[32px] rounded-[6px] flex items-center justify-center text-white"
                  style={{ background: threatColor }}
                >
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-[var(--ink)] m-0">Output: Composite Risk</h3>
                  <span className="text-[11px] text-[var(--muted)]">Dynamic Decision Result</span>
                </div>
              </div>

              <span 
                className="px-[8px] py-[3px] rounded-[4px] text-[12px] font-bold text-white"
                style={{ background: threatColor }}
              >
                {threatAssessment.score}/100
              </span>
            </div>

            {/* Score Radial / Progress Meter */}
            <div className="my-[14px] bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[14px] text-center space-y-[8px]">
              <span className="text-[12px] text-[var(--muted)] block">Calculated Threat Category</span>
              <b className="text-[24px] font-bold block" style={{ color: threatColor }}>
                {threatAssessment.level}
              </b>
              <p className="text-[12px] text-[var(--muted)] m-0">
                {threatAssessment.actionSummary}
              </p>

              {/* Progress bar */}
              <div className="h-[8px] bg-[var(--line)] rounded-[4px] overflow-hidden mt-[10px]">
                <div 
                  className="h-full rounded-[4px] transition-all duration-300"
                  style={{
                    width: `${threatAssessment.score}%`,
                    background: threatColor
                  }}
                />
              </div>
            </div>

            {/* Recommended SOP Actions List */}
            <div>
              <span className="text-[12px] font-bold text-[var(--ink)] block mb-[6px]">
                Triggered Emergency Directives:
              </span>
              <div className="space-y-[6px]">
                {threatAssessment.recommendedActions.map((action, i) => (
                  <div 
                    key={i}
                    className="p-[8px_12px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[12px] flex items-center justify-between"
                  >
                    <span className="font-semibold text-[var(--ink)] flex items-center gap-[6px]">
                      <span className="w-[6px] h-[6px] rounded-full" style={{ background: threatColor }} />
                      Protocol {i + 1}: {action}
                    </span>
                    <span className="text-[10px] font-bold px-[6px] py-[2px] rounded text-white" style={{ background: threatColor }}>
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action transition button */}
          <div className="pt-[10px] border-t border-[var(--line)]">
            <button
              onClick={() => setActiveTab('alerts')}
              className="w-full py-[8px] px-[12px] bg-[var(--sea)] text-white rounded-[6px] text-[12px] font-bold flex items-center justify-center gap-[6px] hover:opacity-95 cursor-pointer shadow-xs"
            >
              <span>Transmit Alert & View Directives &rarr;</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
