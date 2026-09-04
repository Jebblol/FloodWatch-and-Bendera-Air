import { CountryFloodData, RiverStation } from '../data/aseanData';
import { ThreatAssessment, ThreatLevel } from '../types';

export function calculateThreatAssessment(
  country: CountryFloodData,
  station: RiverStation | undefined,
  rainfallMmH: number,
  waterLevelM: number
): ThreatAssessment {
  // If data is unavailable (Singapore, Brunei)
  if (!country.dataAvailable || !station) {
    return {
      level: 'LOW',
      score: 0,
      historicalRiskComponent: 0,
      realTimeRiskComponent: 0,
      rainfallContribution: 0,
      waterLevelContribution: 0,
      statusTitle: 'Data Unavailable / Normal Baseline',
      actionSummary: 'Insufficient historical baseline for automated risk index computation.',
      recommendedActions: ['Prepare'],
      color: 'text-slate-600',
      bgBadge: 'bg-slate-100 text-slate-600 border-slate-200',
      borderColor: 'border-slate-200',
      pulseColor: 'bg-slate-400'
    };
  }

  // 1. Calculate Historical Vulnerability Index (0 - 100)
  // Max normalizers across ASEAN empirical range:
  const maxEvents = 200; // Indonesia max recorded = 195
  const maxAvgAffected = 700000; // Thailand max avg affected = 642k
  const maxPoverty = 50; // Timor-Leste max poverty = 43.35%
  const maxDensity = 400; // Philippines density = 328.7/km²

  const freqScore = Math.min(100, ((country.events || 0) / maxEvents) * 100);
  const popScore = Math.min(100, ((country.avgAffected || 0) / maxAvgAffected) * 100);
  const povScore = country.povertyRate !== null 
    ? Math.min(100, (country.povertyRate / maxPoverty) * 100)
    : 30; // Transparent neutral baseline if unrecorded
  const densityScore = country.density !== null
    ? Math.min(100, (country.density / maxDensity) * 100)
    : 35; // Neutral baseline

  // Deterministic 4-indicator historical vulnerability:
  // 35% Flood Frequency + 35% Average Affected + 15% Poverty Headcount + 15% Population Density
  const historicalVulnerability = Math.round(
    0.35 * freqScore + 
    0.35 * popScore + 
    0.15 * povScore + 
    0.15 * densityScore
  );

  // 2. Calculate Real-Time Environmental Hazard (0 - 100)
  // Rainfall index (0-120 mm/h scale)
  const rainScore = Math.min(100, (rainfallMmH / 120) * 100);

  // River water level stage ratio (relative to station normal and danger levels)
  const normal = station.normalLevel;
  const danger = station.dangerLevel;
  const range = Math.max(1, danger - normal);
  const waterScore = Math.max(0, Math.min(100, ((waterLevelM - normal) / range) * 100));

  // Real-time component: 45% Precipitation + 55% River Stage
  const realTimeHazard = Math.round(0.45 * rainScore + 0.55 * waterScore);

  // 3. Composite Flood Threat Score (0 - 100)
  // 35% Historical Baseline Vulnerability + 65% Live Sensor Telemetry
  const compositeScore = Math.min(100, Math.round(0.35 * historicalVulnerability + 0.65 * realTimeHazard));

  // 4. Map Score & Thresholds to Tiered Action Directives:
  // LOW (0-34): Routine monitoring / preparation
  // MODERATE (35-59): Flood readiness / preparation
  // HIGH (60-79): Evacuation readiness / stage transport
  // CRITICAL (80-100): Immediate evacuation / seek shelter
  let level: ThreatLevel = 'LOW';
  let statusTitle = 'Low Threat — Routine Surveillance';
  let actionSummary = 'Monitor conditions, check drainage infrastructure, and maintain routine meteorological tracking.';
  let recommendedActions: ('Prepare' | 'Evacuate' | 'Seek Shelter')[] = ['Prepare'];
  let color = 'text-emerald-700';
  let bgBadge = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let borderColor = 'border-emerald-300';
  let pulseColor = 'bg-emerald-500';

  if (compositeScore >= 80 || waterLevelM >= station.dangerLevel || rainfallMmH >= 130) {
    level = 'CRITICAL';
    statusTitle = 'Critical Threat — Immediate Action Required';
    actionSummary = 'Evacuate high-risk lowlands immediately and seek designated reinforced storm shelters.';
    recommendedActions = ['Evacuate', 'Seek Shelter'];
    color = 'text-red-700';
    bgBadge = 'bg-red-50 text-red-800 border-red-200';
    borderColor = 'border-red-400';
    pulseColor = 'bg-red-600';
  } else if (compositeScore >= 60 || waterLevelM >= station.warningLevel || rainfallMmH >= 75) {
    level = 'HIGH';
    statusTitle = 'High Threat — Evacuation Readiness';
    actionSummary = 'Prepare for rapid evacuation. Stage emergency responders and mobilize community flood barriers.';
    recommendedActions = ['Prepare', 'Evacuate'];
    color = 'text-orange-700';
    bgBadge = 'bg-orange-50 text-orange-800 border-orange-200';
    borderColor = 'border-orange-300';
    pulseColor = 'bg-orange-500';
  } else if (compositeScore >= 35 || waterLevelM >= station.alertLevel || rainfallMmH >= 35) {
    level = 'MODERATE';
    statusTitle = 'Moderate Threat — Flood Readiness';
    actionSummary = 'Prepare emergency kits, verify local drainage channels, and monitor hourly basin advisories.';
    recommendedActions = ['Prepare'];
    color = 'text-amber-800';
    bgBadge = 'bg-amber-50 text-amber-800 border-amber-200';
    borderColor = 'border-amber-300';
    pulseColor = 'bg-amber-500';
  }

  return {
    level,
    score: compositeScore,
    historicalRiskComponent: historicalVulnerability,
    realTimeRiskComponent: realTimeHazard,
    rainfallContribution: Math.round(rainScore),
    waterLevelContribution: Math.round(waterScore),
    statusTitle,
    actionSummary,
    recommendedActions,
    color,
    bgBadge,
    borderColor,
    pulseColor
  };
}
