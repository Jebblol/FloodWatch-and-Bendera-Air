import React, { useMemo } from 'react';
import { 
  AreaChart, 
  Area, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Radio, 
  CloudRain, 
  Droplets, 
  Sliders, 
  MapPin, 
  RotateCcw
} from 'lucide-react';
import { useEWS } from '../context/EWSContext';

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

  // Determine rainfall intensity level
  const rainfallIntensity = useMemo(() => {
    if (simulatedRainfall < 10) return { label: 'Light Precipitation', badge: 'bg-slate-100 text-slate-700 border-slate-200' };
    if (simulatedRainfall < 35) return { label: 'Moderate Rain', badge: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (simulatedRainfall < 75) return { label: 'Heavy Monsoon Rain', badge: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: 'Torrential Rainfall / Cloudburst', badge: 'bg-red-50 text-red-800 border-red-200 font-bold' };
  }, [simulatedRainfall]);

  // Determine water level stage status
  const waterStageStatus = useMemo(() => {
    if (!selectedStation) return { label: 'Nominal', badge: 'bg-slate-100 text-slate-600 border-slate-200' };
    if (simulatedWaterLevel >= selectedStation.dangerLevel) {
      return { label: 'Danger Level (Bank Overtopping)', badge: 'bg-red-50 text-red-800 border-red-200 font-bold' };
    }
    if (simulatedWaterLevel >= selectedStation.warningLevel) {
      return { label: 'Warning Level (Bankfull Flow)', badge: 'bg-orange-50 text-orange-800 border-orange-200' };
    }
    if (simulatedWaterLevel >= selectedStation.alertLevel) {
      return { label: 'Alert Level (Rising Channel)', badge: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
    return { label: 'Normal Water Level', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
  }, [selectedStation, simulatedWaterLevel]);

  // Generate synthetic 24h trend data reflecting current simulated values
  const telemetryTrendData = useMemo(() => {
    const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', 'Now'];
    const baseRain = Math.max(0, simulatedRainfall * 0.2);
    const currentRain = simulatedRainfall;
    const baseWater = selectedStation ? selectedStation.normalLevel : 2.0;
    const currentWater = simulatedWaterLevel;

    return hours.map((hour, idx) => {
      const progress = idx / (hours.length - 1);
      const rainVal = Math.round(baseRain + (currentRain - baseRain) * Math.pow(progress, 1.4) + (Math.sin(idx) * 3));
      const waterVal = Number((baseWater + (currentWater - baseWater) * Math.pow(progress, 1.2) + (Math.sin(idx * 0.8) * 0.12)).toFixed(2));
      return {
        time: hour,
        rainfall: Math.max(0, rainVal),
        waterLevel: Math.max(0, waterVal)
      };
    });
  }, [simulatedRainfall, simulatedWaterLevel, selectedStation]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
              Stage 3: Real-Time Data Inflow
            </span>
            {/* Clear Simulation Notice */}
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-blue-50/80 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-600" />
              SIMULATED REAL-TIME DATA
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            Live Monitoring
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Real-time rainfall intensity and river water-level measurements feeding into the EWS Risk Analysis engine.
          </p>
        </div>

        {/* Station Selector Dropdown & Reset */}
        <div className="flex items-center gap-3">
          {selectedCountry.riverStations.length > 0 ? (
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
              <MapPin className="w-4 h-4 text-blue-600" />
              <select
                value={selectedStation?.id}
                onChange={(e) => setSelectedStationId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
              >
                {selectedCountry.riverStations.map((st) => (
                  <option key={st.id} value={st.id} className="bg-white text-slate-800">
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <span className="text-xs text-slate-400 italic">No telemetry stations for {selectedCountry.name}</span>
          )}

          <button
            onClick={resetSimulationToDefaults}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium border border-slate-200 shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Baseline</span>
          </button>
        </div>
      </div>

      {/* Interactive Simulation Sliders / Controls Panel */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-semibold text-slate-800">
              Interactive Prototype Controls (Simulated Real-Time Inputs)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Adjust rainfall and river level to observe immediate changes in the Risk Analysis stage
          </span>
        </div>

        {/* Sensor Adjustment Sliders: 2 Parallel Input Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {/* Slider 1: Simulated Rainfall Intensity */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-600" />
                🌧️ Rainfall Intensity
              </span>
              <span className="font-bold text-sm text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                {simulatedRainfall} mm/h
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="200"
              value={simulatedRainfall}
              onChange={(e) => setSimulatedRainfall(Number(e.target.value))}
              className="w-full h-3 sm:h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 touch-pan-x"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 mm/h (Dry)</span>
              <span>35 mm/h (Monsoon)</span>
              <span>75 mm/h (Heavy)</span>
              <span>130+ mm/h (Extreme)</span>
            </div>
          </div>

          {/* Slider 2: River Water Level */}
          <div className="p-3.5 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-blue-600" />
                🌊 River Water Level
              </span>
              <span className="font-bold text-sm text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
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
              className="w-full h-3 sm:h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 touch-pan-x"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Normal: {selectedStation?.normalLevel}m</span>
              <span className="text-amber-600 font-medium">Alert: {selectedStation?.alertLevel}m</span>
              <span className="text-red-600 font-bold">Danger: {selectedStation?.dangerLevel}m</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Main Parallel Telemetry Sensor Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Rainfall Monitoring */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <CloudRain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  🌧️ Rainfall Monitoring
                </h3>
                <p className="text-xs text-slate-500">Basin Doppler Radar & Telemetric Pluviometer</p>
              </div>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${rainfallIntensity.badge}`}>
              {rainfallIntensity.label}
            </span>
          </div>

          {/* Current Rainfall Display */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-500">Rainfall Intensity</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {simulatedRainfall} <span className="text-xs font-normal text-slate-500">mm/h</span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-500">24h Cumulative</span>
              <p className="text-xl font-bold text-slate-900 mt-0.5">
                {(simulatedRainfall * 6.2).toFixed(0)} <span className="text-xs font-normal text-slate-500">mm</span>
              </p>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-500">Classification</span>
              <p className="text-xs font-bold text-blue-700 mt-2 truncate" title={rainfallIntensity.label}>
                {rainfallIntensity.label.split('/')[0].trim()}
              </p>
            </div>
          </div>

          {/* 24h Rainfall Trend Chart */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">24-Hour Rainfall Trend (mm/h)</span>
              <span className="text-[11px] text-slate-400">Atmospheric precipitation series</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={telemetryTrendData}>
                  <defs>
                    <linearGradient id="rainGradientLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="time" stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <YAxis stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '12px', borderRadius: '8px' }}
                    labelStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="rainfall" 
                    name="Rainfall Intensity (mm/h)" 
                    stroke="#2563EB" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#rainGradientLight)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Panel 2: River Water-Level Monitoring */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  🌊 River Water-Level Monitoring
                </h3>
                <p className="text-xs text-slate-500">Acoustic Doppler Stage Sensor & River Gauge</p>
              </div>
            </div>
            <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border ${waterStageStatus.badge}`}>
              {waterStageStatus.label}
            </span>
          </div>

          {/* Current Water Level Display with Alert/Warning/Danger Thresholds */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-medium text-slate-500">Current Level</span>
              <p className="text-lg font-bold text-blue-700 mt-0.5">
                {simulatedWaterLevel.toFixed(1)}m
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-medium text-amber-700">Alert Mark</span>
              <p className="text-base font-bold text-amber-800 mt-0.5">
                {selectedStation?.alertLevel}m
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-medium text-orange-700">Warning Mark</span>
              <p className="text-base font-bold text-orange-800 mt-0.5">
                {selectedStation?.warningLevel}m
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-medium text-red-700">Danger Mark</span>
              <p className="text-base font-bold text-red-800 mt-0.5">
                {selectedStation?.dangerLevel}m
              </p>
            </div>
          </div>

          {/* 24h River Level Trend Chart */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700">24-Hour River Level Trend (m)</span>
              <span className="text-[11px] text-slate-400">Flow: {selectedStation?.flowRate}</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={telemetryTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="time" stroke="#94A3B8" tick={{ fill: '#64748B', fontSize: 10 }} />
                  <YAxis 
                    stroke="#94A3B8" 
                    tick={{ fill: '#64748B', fontSize: 10 }}
                    domain={[
                      (selectedStation ? selectedStation.normalLevel * 0.8 : 0), 
                      (selectedStation ? selectedStation.dangerLevel * 1.2 : 10)
                    ]}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', fontSize: '12px', borderRadius: '8px' }}
                    labelStyle={{ color: '#0F172A', fontWeight: 'bold' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="waterLevel" 
                    name="River Water Level (m)" 
                    stroke="#2563EB" 
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#2563EB' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Clear Transition Callout to Risk Analysis */}
      <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span>Real-Time Conditions → Risk Analysis</span>
          </h4>
          <p className="text-xs text-slate-600 mt-1">
            Rainfall and river-level conditions are combined with historical vulnerability to calculate the current flood threat.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('risk-analysis')}
          className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5"
        >
          <span>Proceed to Risk Analysis</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
