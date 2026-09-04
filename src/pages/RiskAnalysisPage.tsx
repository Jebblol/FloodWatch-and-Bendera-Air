import React from 'react';
import { 
  SlidersHorizontal, 
  Database, 
  Radio, 
  ShieldAlert, 
  Sparkles, 
  Info,
  ChevronRight,
  Scale
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
              Stage 4: Risk Synthesis
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
              Prototype Risk Model
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            Integrated Flood Risk Matrix & Analysis
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Demonstrating how multi-decade historical vulnerability synthesizes with real-time hydraulic conditions to determine threat severity.
          </p>
        </div>

        {/* Threat Level Quick Badge */}
        <div className={`px-4 py-2 rounded-xl border flex items-center gap-2.5 shadow-sm ${threatAssessment.bgBadge}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${threatAssessment.pulseColor}`} />
          <div>
            <span className="text-[10px] font-medium text-slate-500 block">Computed Threat</span>
            <span className={`text-sm font-bold ${threatAssessment.color}`}>
              {threatAssessment.level} ({threatAssessment.score}/100)
            </span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Risk Fusion Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Column 1: Historical Vulnerability Sub-Model (4 Cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-blue-700">
                    Component A: Historical Risk
                  </h3>
                  <span className="text-[11px] text-slate-400">Weight: 35% in Composite Score</span>
                </div>
              </div>
              <span className="text-sm font-bold text-blue-700">
                {threatAssessment.historicalRiskComponent} / 100
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Baseline vulnerability derived from historical dataset indicators (Weight: 35%):
            </p>

            <div className="space-y-2.5">
              {/* Metric 1: Flood Frequency */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">1. Flood Frequency (35%)</span>
                  <span className="font-semibold text-slate-900">
                    {selectedCountry.events !== null ? `${selectedCountry.events} events` : 'N/A'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${Math.min(100, ((selectedCountry.events || 0) / 200) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Metric 2: Population Exposure */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">2. Avg Affected Pop (35%)</span>
                  <span className="font-semibold text-amber-700">
                    {selectedCountry.avgAffected ? `${Math.round(selectedCountry.avgAffected).toLocaleString()}` : 'N/A'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full" 
                    style={{ width: `${Math.min(100, ((selectedCountry.avgAffected || 0) / 700000) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Metric 3: Poverty Rate */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">3. Poverty Headcount (15%)</span>
                  <span className="font-semibold text-emerald-700">
                    {selectedCountry.povertyRate !== null ? `${selectedCountry.povertyRate}%` : 'N/A (30% baseline)'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${Math.min(100, ((selectedCountry.povertyRate || 15) / 50) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Metric 4: Population Density */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">4. Population Density (15%)</span>
                  <span className="font-semibold text-purple-700">
                    {selectedCountry.density !== null ? `${selectedCountry.density} /km²` : 'N/A'}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full" 
                    style={{ width: `${Math.min(100, ((selectedCountry.density || 50) / 400) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            *Deterministic formula combining frequency, exposure, poverty, and density.
          </div>
        </div>

        {/* Column 2: Real-Time Telemetry & Sliders (4 Cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-blue-700">
                    Component B: Real-Time Telemetry
                  </h3>
                  <span className="text-[11px] text-slate-400">Weight: 65% in Composite Score</span>
                </div>
              </div>
              <span className="text-sm font-bold text-blue-700">
                {threatAssessment.realTimeRiskComponent} / 100
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Adjust live environmental inputs to test the dynamic threat response:
            </p>

            <div className="space-y-4">
              {/* Rainfall Slider */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-semibold">Precipitation Rate:</span>
                  <span className="font-bold text-blue-600">
                    {simulatedRainfall} mm/h
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={simulatedRainfall}
                  onChange={(e) => setSimulatedRainfall(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0 mm/h</span>
                  <span>50 mm/h</span>
                  <span>100 mm/h</span>
                  <span>200 mm/h</span>
                </div>
              </div>

              {/* Water Level Slider */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-700 font-semibold">Water Level Stage:</span>
                  <span className="font-bold text-blue-600">
                    {simulatedWaterLevel.toFixed(1)} m
                  </span>
                </div>
                <input
                  type="range"
                  min={selectedStation ? selectedStation.normalLevel * 0.5 : 0}
                  max={selectedStation ? selectedStation.dangerLevel * 1.4 : 10}
                  step="0.1"
                  value={simulatedWaterLevel}
                  onChange={(e) => setSimulatedWaterLevel(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Normal: {selectedStation?.normalLevel}m</span>
                  <span className="text-red-600 font-semibold">Danger: {selectedStation?.dangerLevel}m</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-blue-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive real-time slider controls</span>
          </div>
        </div>

        {/* Column 3: Composite Flood Risk Output (4 Cols) */}
        <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${threatAssessment.bgBadge}`}>
                  <ShieldAlert className={`w-4 h-4 ${threatAssessment.color}`} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800">
                    Result: Composite Flood Risk
                  </h3>
                  <span className="text-[11px] text-slate-400">Dynamic Threat Decision</span>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${threatAssessment.bgBadge}`}>
                {threatAssessment.level}
              </span>
            </div>

            {/* Score Radial/Progress Representation */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-2">
              <span className="text-[10px] font-medium text-slate-500 tracking-wider">
                Composite Risk Score
              </span>
              <div className="flex items-center justify-center gap-1.5">
                <span className={`text-4xl font-extrabold tracking-tight ${threatAssessment.color}`}>
                  {threatAssessment.score}
                </span>
                <span className="text-sm font-semibold text-slate-400">/ 100</span>
              </div>

              {/* Progress Tier Bar */}
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: '35%' }} title="Low Risk (0-35)" />
                <div className="h-full bg-amber-400" style={{ width: '25%' }} title="Moderate Risk (35-60)" />
                <div className="h-full bg-orange-500" style={{ width: '20%' }} title="High Risk (60-80)" />
                <div className="h-full bg-red-500" style={{ width: '20%' }} title="Critical Risk (80-100)" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                <span>0 Low</span>
                <span>35 Mod</span>
                <span>60 High</span>
                <span>80+ Crit</span>
              </div>
            </div>

            {/* Risk Assessment Summary */}
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-900">{threatAssessment.statusTitle}</h4>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {threatAssessment.actionSummary}
              </p>
            </div>
          </div>

          {/* Action Link to Alerts View */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('alerts')}
              className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <span>View Adaptive Alerts</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Model Transparency & Formula Breakdown */}
      <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
          <Scale className="w-4 h-4 text-blue-600" />
          <span>Transparent EWS Risk Calculation Formula</span>
        </div>
        <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200/80 leading-relaxed font-mono">
          Composite Score (0–100) = [0.35 × (0.35·Freq + 0.35·AvgAff + 0.15·Pov + 0.15·Density)] + [0.65 × (0.45·Rainfall + 0.55·WaterStage)]
        </p>
        <div className="flex items-start gap-2 text-[11px] text-slate-500 pt-1">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>
            <strong>Decision Logic:</strong> Scores map deterministically to 4 actionable tiers: <strong>LOW (0–34)</strong> [Routine monitoring/preparation], <strong>MODERATE (35–59)</strong> [Flood readiness/preparation], <strong>HIGH (60–79)</strong> [Evacuation readiness/barrier deployment], and <strong>CRITICAL (80–100)</strong> [Immediate evacuation & seek high-ground shelter].
          </span>
        </div>
      </div>
    </div>
  );
};
