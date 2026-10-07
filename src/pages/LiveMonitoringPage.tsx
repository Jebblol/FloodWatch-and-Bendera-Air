import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  Radio, 
  CloudRain, 
  Droplets, 
  Sliders, 
  MapPin, 
  RotateCcw,
  Play,
  Pause,
  TrendingUp,
  TrendingDown,
  Activity,
  Zap,
  Wifi,
  BatteryCharging,
  Compass,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { useEWS } from '../context/EWSContext';

interface LiveTelemetryPoint {
  time: string;
  rainfall: number;
  waterLevel: number;
}

export const LiveMonitoringPage: React.FC = () => {
  const { 
    selectedCountry, 
    selectedStation, 
    setSelectedStationId,
    simulatedRainfall, 
    setSimulatedRainfall, 
    simulatedWaterLevel, 
    setSimulatedWaterLevel, 
    threatAssessment,
    resetSimulationToDefaults,
    setActiveTab
  } = useEWS();

  // Live streaming states
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [streamSpeed, setStreamSpeed] = useState<number>(2000); // 2s interval
  const [simulationTrend, setSimulationTrend] = useState<'fluctuate' | 'surge' | 'drain'>('fluctuate');
  
  // Real-time delta tracking
  const [waterDelta, setWaterDelta] = useState<number>(0.04);
  const [rainDelta, setRainDelta] = useState<number>(1.2);

  // Real-time rolling chart buffer
  const [liveStreamHistory, setLiveStreamHistory] = useState<LiveTelemetryPoint[]>(() => {
    const points: LiveTelemetryPoint[] = [];
    const now = new Date();
    for (let i = 9; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 15000);
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const jitterRain = Math.max(0, Math.round(simulatedRainfall + (Math.sin(i) * 3) - 2));
      const jitterWater = Number(Math.max(0.5, (simulatedWaterLevel + (Math.cos(i) * 0.08) - 0.04)).toFixed(2));
      points.push({ time: timeStr, rainfall: jitterRain, waterLevel: jitterWater });
    }
    return points;
  });

  // Reference values to compute relative trend
  const baseStation = selectedStation || selectedCountry.riverStations[0];

  // REAL-TIME FLUCTUATION ENGINE
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      // 1. Calculate water level delta
      let wDelta = (Math.random() - 0.49) * 0.08; // natural vibration [-0.04, +0.04]m
      if (simulationTrend === 'surge') {
        wDelta += 0.06; // upward trend
      } else if (simulationTrend === 'drain') {
        wDelta -= 0.06; // downward trend
      }

      // 2. Calculate rainfall delta
      let rDelta = (Math.random() - 0.49) * 3.5; // natural vibration [-1.7, +1.7] mm/h
      if (simulationTrend === 'surge') {
        rDelta += 2.5;
      } else if (simulationTrend === 'drain') {
        rDelta -= 2.5;
      }

      const nextW = Number(Math.max(0.4, simulatedWaterLevel + wDelta).toFixed(2));
      setWaterDelta(Number((nextW - simulatedWaterLevel).toFixed(2)));
      setSimulatedWaterLevel(nextW);

      const nextR = Math.max(0, Math.min(220, Math.round(simulatedRainfall + rDelta)));
      setRainDelta(nextR - simulatedRainfall);
      setSimulatedRainfall(nextR);

      // 3. Append to rolling 10-point telemetry stream
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLiveStreamHistory(prev => {
        const updated = [...prev.slice(1), {
          time: nowStr,
          rainfall: simulatedRainfall,
          waterLevel: simulatedWaterLevel
        }];
        return updated;
      });

    }, streamSpeed);

    return () => clearInterval(interval);
  }, [isStreaming, streamSpeed, simulationTrend, simulatedRainfall, simulatedWaterLevel, setSimulatedWaterLevel, setSimulatedRainfall]);

  // Classification badges
  const rainfallIntensity = useMemo(() => {
    if (simulatedRainfall < 15) return { label: 'Light Drizzle', color: 'var(--low)', desc: 'Ground absorption rate within capacity' };
    if (simulatedRainfall < 45) return { label: 'Moderate Rainfall', color: 'var(--mod)', desc: 'Surface runoff accumulating in tributaries' };
    if (simulatedRainfall < 85) return { label: 'Heavy Monsoon Storm', color: 'var(--high)', desc: 'Catchment inflow approaching basin capacity' };
    return { label: 'Torrential Cloudburst / Flash Surge', color: 'var(--crit)', desc: 'Extreme precipitation — acute overflow threat' };
  }, [simulatedRainfall]);

  const waterStageStatus = useMemo(() => {
    if (!baseStation) return { label: 'Nominal', color: 'var(--low)', desc: 'Normal baseflow' };
    if (simulatedWaterLevel >= baseStation.dangerLevel) {
      return { label: 'DANGER: Overtopping Floodplain', color: 'var(--crit)', desc: 'Critical hydraulic breach' };
    }
    if (simulatedWaterLevel >= baseStation.warningLevel) {
      return { label: 'WARNING: Bankfull Capacity', color: 'var(--high)', desc: 'Channel cresting rapidly' };
    }
    if (simulatedWaterLevel >= baseStation.alertLevel) {
      return { label: 'ALERT: Rising Water Level', color: 'var(--mod)', desc: 'Accelerated upstream discharge' };
    }
    return { label: 'NORMAL: Safe Baseflow', color: 'var(--low)', desc: 'Channel level within safe margins' };
  }, [baseStation, simulatedWaterLevel]);

  // Rate of rise calculation (cm/hr equivalent)
  const rateOfRise = (waterDelta * 30 * 100).toFixed(0);

  return (
    <div className="space-y-[20px] w-full max-w-[1200px]">
      {/* Top Banner & Live IoT Stream Controller Bar */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <div className="flex items-center gap-[8px]">
            <span className="flex items-center gap-[6px] px-[8px] py-[3px] rounded-[4px] text-[11px] font-bold bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">
              <span className={`w-[8px] h-[8px] rounded-full ${isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {isStreaming ? 'LIVE SENSOR STREAM ACTIVE' : 'STREAM PAUSED'}
            </span>
            <span className="text-[12px] text-[var(--muted)] flex items-center gap-[4px]">
              <Wifi className="w-3.5 h-3.5 text-emerald-600" />
              Telemetry 4G LTE · 99.8% Signal
            </span>
          </div>

          <h2 className="text-[18px] font-bold text-[var(--ink)] m-0 mt-[4px]">
            Real-Time River Basin Telemetry & Hydrological Inflow
          </h2>
          <p className="text-[13px] text-[var(--muted)] m-0 mt-[2px]">
            Simulated IoT sensor stream with realistic hydraulic fluctuation, bankfull thresholds, and cloudburst response.
          </p>
        </div>

        {/* Live Stream Controls */}
        <div className="flex items-center gap-[8px] flex-wrap">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsStreaming(!isStreaming)}
            className={`px-[12px] py-[6px] rounded-[6px] text-[13px] font-semibold border flex items-center gap-[6px] transition-colors cursor-pointer ${
              isStreaming 
                ? 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--sea)_10%,transparent)]'
                : 'bg-[var(--sea)] text-white border-[var(--sea)]'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-4 h-4 text-amber-600" />
                <span>Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          {/* Trend Modes */}
          <div className="flex items-center bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[2px]">
            <button
              onClick={() => setSimulationTrend('fluctuate')}
              title="Natural wave vibration"
              className={`px-[8px] py-[4px] rounded-[4px] text-[11px] font-medium transition-colors ${
                simulationTrend === 'fluctuate' ? 'bg-[var(--panel)] text-[var(--sea)] font-bold shadow-xs' : 'text-[var(--muted)]'
              }`}
            >
              〰 Natural
            </button>
            <button
              onClick={() => setSimulationTrend('surge')}
              title="Rising flood trend"
              className={`px-[8px] py-[4px] rounded-[4px] text-[11px] font-medium transition-colors ${
                simulationTrend === 'surge' ? 'bg-[var(--panel)] text-red-600 font-bold shadow-xs' : 'text-[var(--muted)]'
              }`}
            >
              ▲ Rising Surge
            </button>
            <button
              onClick={() => setSimulationTrend('drain')}
              title="Receding water trend"
              className={`px-[8px] py-[4px] rounded-[4px] text-[11px] font-medium transition-colors ${
                simulationTrend === 'drain' ? 'bg-[var(--panel)] text-emerald-600 font-bold shadow-xs' : 'text-[var(--muted)]'
              }`}
            >
              ▼ Receding
            </button>
          </div>

          {/* Reset Baseline */}
          <button
            onClick={resetSimulationToDefaults}
            title="Reset telemetry values to station normal"
            className="p-[6px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Station Selector Bar */}
      <div className="flex items-center gap-[8px] overflow-x-auto pb-[2px]">
        <span className="text-[12px] font-bold text-[var(--muted)] whitespace-nowrap">
          River Station:
        </span>
        {selectedCountry.riverStations.map((st) => {
          const isSelected = selectedStation?.id === st.id;
          return (
            <button
              key={st.id}
              onClick={() => setSelectedStationId(st.id)}
              className={`px-[12px] py-[6px] rounded-[6px] text-[12px] font-medium border whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[var(--sea)] text-white border-[var(--sea)] font-bold shadow-xs'
                  : 'bg-[var(--panel)] border-[var(--line)] text-[var(--ink)] hover:bg-[var(--bg)]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 inline mr-1" />
              {st.name.split(' - ')[0]}
              <small className="opacity-80 ml-1">({st.location.split(',')[0]})</small>
            </button>
          );
        })}
      </div>

      {/* Main Two Parallel Telemetry Panels: River Stage & Rainfall */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
        {/* PANEL 1: River Stage Hydrology Sensor */}
        <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[18px] space-y-[16px] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-[10px] border-b border-[var(--line)]">
              <div className="flex items-center gap-[10px]">
                <div className="w-[36px] h-[36px] rounded-[8px] bg-[color-mix(in_srgb,var(--sea)_12%,transparent)] flex items-center justify-center text-[var(--sea)]">
                  <Droplets className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[var(--ink)] m-0">
                    Acoustic River Stage Gauge
                  </h3>
                  <span className="text-[12px] text-[var(--muted)]">
                    {baseStation?.name} · {baseStation?.flowRate}
                  </span>
                </div>
              </div>

              <span 
                className="px-[8px] py-[4px] rounded-[4px] text-[11px] font-bold text-white shrink-0"
                style={{ background: waterStageStatus.color }}
              >
                {waterStageStatus.label.split(':')[0]}
              </span>
            </div>

            {/* Big Live Value & Delta Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] my-[14px]">
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[12px]">
                <span className="text-[11px] text-[var(--muted)] block">Current Water Stage</span>
                <div className="flex items-baseline gap-[6px] mt-[2px]">
                  <b className="text-[26px] font-bold text-[var(--ink)] tracking-tight">
                    {simulatedWaterLevel.toFixed(2)}
                  </b>
                  <span className="text-[13px] text-[var(--muted)] font-medium">meters</span>
                </div>
                {/* Fluctuation delta pill */}
                <span className={`inline-flex items-center text-[11px] font-bold mt-[2px] ${waterDelta >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                  {waterDelta >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                  {waterDelta >= 0 ? `+${waterDelta.toFixed(2)}` : waterDelta.toFixed(2)} m/step
                </span>
              </div>

              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[12px]">
                <span className="text-[11px] text-[var(--muted)] block">Danger Margin</span>
                <div className="flex items-baseline gap-[4px] mt-[2px]">
                  <b className="text-[20px] font-bold text-[var(--ink)]">
                    {baseStation ? (baseStation.dangerLevel - simulatedWaterLevel).toFixed(2) : '0.00'}
                  </b>
                  <span className="text-[12px] text-[var(--muted)]">m to breach</span>
                </div>
                <span className="text-[11px] text-[var(--muted)] block mt-[2px]">
                  Threshold: <strong>{baseStation?.dangerLevel}m</strong>
                </span>
              </div>

              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[12px]">
                <span className="text-[11px] text-[var(--muted)] block">Rate of Change</span>
                <div className="flex items-baseline gap-[4px] mt-[2px]">
                  <b className={`text-[20px] font-bold ${Number(rateOfRise) > 0 ? 'text-amber-700' : 'text-slate-700'}`}>
                    {Number(rateOfRise) > 0 ? `+${rateOfRise}` : rateOfRise}
                  </b>
                  <span className="text-[12px] text-[var(--muted)]">cm/hr</span>
                </div>
                <span className="text-[11px] text-[var(--muted)] block mt-[2px]">
                  {Number(rateOfRise) > 15 ? 'Rapid Rise' : 'Steady Flow'}
                </span>
              </div>
            </div>

            {/* Threshold Progress Bar */}
            <div className="space-y-[4px]">
              <div className="flex justify-between text-[11px] text-[var(--muted)]">
                <span>Normal: {baseStation?.normalLevel}m</span>
                <span style={{ color: 'var(--mod)' }}>Alert: {baseStation?.alertLevel}m</span>
                <span style={{ color: 'var(--high)' }}>Warning: {baseStation?.warningLevel}m</span>
                <span style={{ color: 'var(--crit)', fontWeight: 700 }}>Danger: {baseStation?.dangerLevel}m</span>
              </div>

              <div className="h-[10px] bg-[var(--line)] rounded-[5px] relative overflow-hidden">
                <div 
                  className="h-full rounded-[5px] transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(100, (simulatedWaterLevel / (baseStation?.dangerLevel || 6.8)) * 100)}%`,
                    background: waterStageStatus.color
                  }}
                />
              </div>
            </div>

            {/* Live Streaming Oscilloscope Chart */}
            <div className="mt-[16px]">
              <div className="flex items-center justify-between text-[12px] text-[var(--muted)] mb-[6px]">
                <span className="font-semibold text-[var(--ink)] flex items-center gap-[4px]">
                  <Activity className="w-3.5 h-3.5 text-[var(--sea)]" />
                  Live Water Stage Stream (m)
                </span>
                <span className="text-[11px]">Real-time rolling buffer</span>
              </div>

              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={liveStreamHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                    <XAxis dataKey="time" stroke="var(--muted)" tick={{ fontSize: 10 }} />
                    <YAxis 
                      stroke="var(--muted)" 
                      domain={[
                        (baseStation ? Math.max(0, baseStation.normalLevel - 1) : 0),
                        (baseStation ? baseStation.dangerLevel + 1.2 : 10)
                      ]}
                      tick={{ fontSize: 10 }} 
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)', fontSize: '12px', borderRadius: '6px' }}
                    />
                    {baseStation && (
                      <ReferenceLine y={baseStation.dangerLevel} stroke="var(--crit)" strokeDasharray="4 4" label={{ value: 'Danger', fill: 'var(--crit)', fontSize: 10 }} />
                    )}
                    {baseStation && (
                      <ReferenceLine y={baseStation.warningLevel} stroke="var(--high)" strokeDasharray="3 3" label={{ value: 'Warning', fill: 'var(--high)', fontSize: 10 }} />
                    )}
                    <Line 
                      type="monotone" 
                      dataKey="waterLevel" 
                      name="Water Level (m)"
                      stroke={waterStageStatus.color}
                      strokeWidth={2.5}
                      isAnimationActive={false}
                      dot={{ r: 3, fill: waterStageStatus.color }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Manual Fine Slider Adjustment */}
          <div className="pt-[10px] border-t border-[var(--line)]">
            <div className="flex justify-between text-[11px] text-[var(--muted)] mb-[2px]">
              <span>Manual Level Calibration</span>
              <span className="font-bold text-[var(--ink)]">{simulatedWaterLevel.toFixed(2)} m</span>
            </div>
            <input
              type="range"
              min="0.5"
              max={baseStation ? (baseStation.dangerLevel + 2.5).toFixed(1) : "10"}
              step="0.05"
              value={simulatedWaterLevel}
              onChange={(e) => setSimulatedWaterLevel(parseFloat(e.target.value))}
              className="w-full accent-[var(--sea)] cursor-pointer"
            />
          </div>
        </section>

        {/* PANEL 2: Precipitation Doppler Radar & Telemetric Pluviometer */}
        <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[18px] space-y-[16px] flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-[10px] border-b border-[var(--line)]">
              <div className="flex items-center gap-[10px]">
                <div className="w-[36px] h-[36px] rounded-[8px] bg-[color-mix(in_srgb,var(--sea)_12%,transparent)] flex items-center justify-center text-[var(--sea)]">
                  <CloudRain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[var(--ink)] m-0">
                    Basin Doppler Radar & Pluviometer
                  </h3>
                  <span className="text-[12px] text-[var(--muted)]">
                    Optical rain sensor & catchment radar
                  </span>
                </div>
              </div>

              <span 
                className="px-[8px] py-[4px] rounded-[4px] text-[11px] font-bold text-white shrink-0"
                style={{ background: rainfallIntensity.color }}
              >
                {rainfallIntensity.label.split('/')[0]}
              </span>
            </div>

            {/* Big Live Value & Delta Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] my-[14px]">
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[12px]">
                <span className="text-[11px] text-[var(--muted)] block">Rainfall Rate</span>
                <div className="flex items-baseline gap-[6px] mt-[2px]">
                  <b className="text-[26px] font-bold text-[var(--ink)] tracking-tight">
                    {simulatedRainfall}
                  </b>
                  <span className="text-[13px] text-[var(--muted)] font-medium">mm/h</span>
                </div>
                {/* Fluctuation delta pill */}
                <span className={`inline-flex items-center text-[11px] font-bold mt-[2px] ${rainDelta >= 0 ? 'text-blue-600' : 'text-slate-500'}`}>
                  {rainDelta >= 0 ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                  {rainDelta >= 0 ? `+${rainDelta}` : rainDelta} mm/step
                </span>
              </div>

              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[12px]">
                <span className="text-[11px] text-[var(--muted)] block">24h Cumulative</span>
                <div className="flex items-baseline gap-[4px] mt-[2px]">
                  <b className="text-[20px] font-bold text-[var(--ink)]">
                    {(simulatedRainfall * 5.8).toFixed(0)}
                  </b>
                  <span className="text-[12px] text-[var(--muted)]">mm</span>
                </div>
                <span className="text-[11px] text-[var(--muted)] block mt-[2px]">
                  Estimated volume
                </span>
              </div>

              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[12px]">
                <span className="text-[11px] text-[var(--muted)] block">Radar Reflectivity</span>
                <div className="flex items-baseline gap-[4px] mt-[2px]">
                  <b className="text-[20px] font-bold text-[var(--ink)]">
                    {Math.min(65, Math.round(25 + simulatedRainfall * 0.28))}
                  </b>
                  <span className="text-[12px] text-[var(--muted)]">dBZ</span>
                </div>
                <span className="text-[11px] text-[var(--muted)] block mt-[2px]">
                  {simulatedRainfall > 70 ? 'Severe Echo' : 'Stratiform Echo'}
                </span>
              </div>
            </div>

            {/* Intensity Progress Bar */}
            <div className="space-y-[4px]">
              <div className="flex justify-between text-[11px] text-[var(--muted)]">
                <span>0 mm/h (Dry)</span>
                <span>35 mm/h (Moderate)</span>
                <span>75 mm/h (Heavy)</span>
                <span className="font-bold text-[var(--crit)]">120+ mm/h (Cloudburst)</span>
              </div>

              <div className="h-[10px] bg-[var(--line)] rounded-[5px] relative overflow-hidden">
                <div 
                  className="h-full rounded-[5px] transition-all duration-500 ease-out"
                  style={{
                    width: `${Math.min(100, (simulatedRainfall / 140) * 100)}%`,
                    background: rainfallIntensity.color
                  }}
                />
              </div>
            </div>

            {/* Live Streaming Oscilloscope Area Chart */}
            <div className="mt-[16px]">
              <div className="flex items-center justify-between text-[12px] text-[var(--muted)] mb-[6px]">
                <span className="font-semibold text-[var(--ink)] flex items-center gap-[4px]">
                  <CloudRain className="w-3.5 h-3.5 text-[var(--sea)]" />
                  Precipitation Inflow Stream (mm/h)
                </span>
                <span className="text-[11px]">Real-time rolling buffer</span>
              </div>

              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={liveStreamHistory}>
                    <defs>
                      <linearGradient id="liveRainGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={rainfallIntensity.color} stopOpacity={0.35}/>
                        <stop offset="95%" stopColor={rainfallIntensity.color} stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
                    <XAxis dataKey="time" stroke="var(--muted)" tick={{ fontSize: 10 }} />
                    <YAxis stroke="var(--muted)" domain={[0, Math.max(120, simulatedRainfall + 25)]} tick={{ fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--panel)', borderColor: 'var(--line)', fontSize: '12px', borderRadius: '6px' }}
                    />
                    <ReferenceLine y={75} stroke="var(--high)" strokeDasharray="3 3" label={{ value: 'Heavy Rain', fill: 'var(--high)', fontSize: 10 }} />
                    <Area 
                      type="monotone" 
                      dataKey="rainfall" 
                      name="Rainfall (mm/h)"
                      stroke={rainfallIntensity.color}
                      strokeWidth={2}
                      fill="url(#liveRainGrad)"
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Manual Rainfall Calibration Slider */}
          <div className="pt-[10px] border-t border-[var(--line)]">
            <div className="flex justify-between text-[11px] text-[var(--muted)] mb-[2px]">
              <span>Manual Precipitation Inflow</span>
              <span className="font-bold text-[var(--ink)]">{simulatedRainfall} mm/h</span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              step="1"
              value={simulatedRainfall}
              onChange={(e) => setSimulatedRainfall(parseInt(e.target.value))}
              className="w-full accent-[var(--sea)] cursor-pointer"
            />
          </div>
        </section>
      </div>

      {/* Quick Action Scenario Simulation Triggers */}
      <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px]">
        <div className="flex items-center justify-between mb-[12px] flex-wrap gap-[8px]">
          <div>
            <h3 className="text-[14px] font-bold text-[var(--ink)] m-0 flex items-center gap-[6px]">
              <Zap className="w-4 h-4 text-amber-500" />
              Quick Disaster Scenarios (Instant Stress Testing)
            </h3>
            <span className="text-[12px] text-[var(--muted)]">
              Inject emergency conditions into live IoT telemetry to test early warning reaction
            </span>
          </div>

          <span className="text-[12px] font-semibold text-[var(--sea)]">
            Composite Threat: {threatAssessment.score}/100 ({threatAssessment.level})
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[10px]">
          <button
            onClick={() => {
              if (baseStation) {
                setSimulatedWaterLevel(baseStation.normalLevel);
                setSimulatedRainfall(10);
                setSimulationTrend('fluctuate');
              }
            }}
            className="p-[10px] bg-[var(--bg)] border border-[var(--line)] rounded-[6px] text-left hover:border-[var(--sea)] transition-colors cursor-pointer"
          >
            <span className="text-[12px] font-bold text-[var(--ink)] block">🟢 Normal Dry Season</span>
            <span className="text-[11px] text-[var(--muted)] block mt-[2px]">
              Baseflow ({baseStation?.normalLevel}m), minimal rainfall (10 mm/h)
            </span>
          </button>

          <button
            onClick={() => {
              if (baseStation) {
                setSimulatedWaterLevel(baseStation.alertLevel + 0.3);
                setSimulatedRainfall(55);
                setSimulationTrend('surge');
              }
            }}
            className="p-[10px] bg-[var(--bg)] border border-[var(--mod)] rounded-[6px] text-left hover:bg-[color-mix(in_srgb,var(--mod)_10%,transparent)] transition-colors cursor-pointer"
          >
            <span className="text-[12px] font-bold text-amber-800 block">🟡 Monsoonal Inflow</span>
            <span className="text-[11px] text-[var(--muted)] block mt-[2px]">
              Stage approaching alert mark with steady 55 mm/h rain
            </span>
          </button>

          <button
            onClick={() => {
              if (baseStation) {
                setSimulatedWaterLevel(baseStation.warningLevel + 0.4);
                setSimulatedRainfall(105);
                setSimulationTrend('surge');
              }
            }}
            className="p-[10px] bg-[var(--bg)] border border-[var(--high)] rounded-[6px] text-left hover:bg-[color-mix(in_srgb,var(--high)_10%,transparent)] transition-colors cursor-pointer"
          >
            <span className="text-[12px] font-bold text-orange-800 block">🟠 Bankfull Warning</span>
            <span className="text-[11px] text-[var(--muted)] block mt-[2px]">
              Heavy torrential rain (105 mm/h), river near capacity
            </span>
          </button>

          <button
            onClick={() => {
              if (baseStation) {
                setSimulatedWaterLevel(baseStation.dangerLevel + 0.8);
                setSimulatedRainfall(155);
                setSimulationTrend('surge');
              }
            }}
            className="p-[10px] bg-red-50 border border-[var(--crit)] rounded-[6px] text-left hover:bg-red-100 transition-colors cursor-pointer"
          >
            <span className="text-[12px] font-bold text-red-900 block">🔴 Flash Flood Breach</span>
            <span className="text-[11px] text-red-700 block mt-[2px]">
              Extreme cloudburst (155 mm/h), overtopping danger line
            </span>
          </button>
        </div>
      </section>

      {/* Bottom Transition Actions */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] flex flex-wrap items-center justify-between gap-[12px]">
        <div>
          <h4 className="text-[14px] font-bold text-[var(--ink)] m-0">
            Telemetry Inflow Feeds into Risk Analysis Engine
          </h4>
          <p className="text-[12px] text-[var(--muted)] m-0 mt-[2px]">
            Live river crest and storm rainfall calculations are dynamically fused with socio-economic vulnerability.
          </p>
        </div>

        <div className="flex items-center gap-[8px]">
          <button
            onClick={() => setActiveTab('risk-map')}
            className="px-[12px] py-[8px] bg-[var(--bg)] border border-[var(--line)] rounded-[6px] text-[12px] font-semibold text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--sea)_10%,transparent)] cursor-pointer"
          >
            View on Heatmap
          </button>
          <button
            onClick={() => setActiveTab('risk-analysis')}
            className="px-[14px] py-[8px] bg-[var(--sea)] text-white rounded-[6px] text-[12px] font-bold flex items-center gap-[4px] hover:opacity-95 cursor-pointer shadow-xs"
          >
            <span>Proceed to Risk Analysis</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
