export type NavigationTab = 
  | 'overview' 
  | 'risk-map' 
  | 'historical-data' 
  | 'live-monitoring' 
  | 'risk-analysis' 
  | 'alerts' 
  | 'emergency-actions'
  | 'disclaimer';

export type ThreatLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface ThreatAssessment {
  level: ThreatLevel;
  score: number; // 0 - 100
  historicalRiskComponent: number; // 0 - 100
  realTimeRiskComponent: number; // 0 - 100
  rainfallContribution: number;
  waterLevelContribution: number;
  statusTitle: string;
  actionSummary: string;
  recommendedActions: ('Prepare' | 'Evacuate' | 'Seek Shelter')[];
  color: string;
  bgBadge: string;
  borderColor: string;
  pulseColor: string;
}

export interface PresentationStep {
  stepNumber: number;
  title: string;
  targetTab: NavigationTab;
  countryId?: string;
  rainfall?: number;
  waterLevel?: number;
  explanation: string;
  systemStage: 'Historical Data' | 'Risk Mapping' | 'Risk Analysis' | 'Adaptive Alert' | 'Emergency Action';
}
