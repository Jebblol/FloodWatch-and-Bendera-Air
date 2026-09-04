import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { 
  ASEAN_COUNTRIES, 
  CountryFloodData, 
  RiverStation, 
  PRESET_SCENARIOS, 
  PresetScenario 
} from '../data/aseanData';
import { NavigationTab, ThreatAssessment, PresentationStep } from '../types';
import { calculateThreatAssessment } from '../utils/ewsEngine';

interface EWSContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedCountry: CountryFloodData;
  setSelectedCountryId: (id: string) => void;
  selectedStation: RiverStation | undefined;
  setSelectedStationId: (id: string) => void;
  simulatedRainfall: number;
  setSimulatedRainfall: (val: number) => void;
  simulatedWaterLevel: number;
  setSimulatedWaterLevel: (val: number) => void;
  threatAssessment: ThreatAssessment;
  loadPresetScenario: (scenario: PresetScenario) => void;
  // Presentation tour
  isPresentationMode: boolean;
  presentationStep: number;
  presentationSteps: PresentationStep[];
  startPresentationTour: () => void;
  stopPresentationTour: () => void;
  nextPresentationStep: () => void;
  prevPresentationStep: () => void;
  setStepIndex: (index: number) => void;
  // Simulation reset
  resetSimulationToDefaults: () => void;
}

const EWSContext = createContext<EWSContextType | undefined>(undefined);

export const PRESENTATION_STEPS: PresentationStep[] = [
  {
    stepNumber: 1,
    title: 'Stage 1: Historical Disaster Intelligence',
    targetTab: 'historical-data',
    countryId: 'IDN',
    explanation: 'The EWS first accesses historical baseline flood records (2000–2023). Indonesia has the highest flood event frequency in ASEAN with 195 recorded major flood disasters and 8.7M+ affected individuals.',
    systemStage: 'Historical Data'
  },
  {
    stepNumber: 2,
    title: 'Stage 2: Regional Vulnerability Mapping',
    targetTab: 'risk-map',
    countryId: 'IDN',
    explanation: 'Historical event frequency, population exposure, and socio-economic poverty ratios are synthesized into regional vulnerability mapping. High population density along the Citarum basin elevates regional vulnerability.',
    systemStage: 'Risk Mapping'
  },
  {
    stepNumber: 3,
    title: 'Stage 3: Real-Time Environmental Inflow',
    targetTab: 'live-monitoring',
    countryId: 'IDN',
    rainfall: 145,
    waterLevel: 7.2,
    explanation: 'Simulated real-time IoT sensors ingest heavy monsoonal cloudburst data (145 mm/h) and rapid river stage rise (7.2 m at Citarum - Dayeuhkolot Station), breaching the 6.8 m Danger threshold.',
    systemStage: 'Risk Analysis'
  },
  {
    stepNumber: 4,
    title: 'Stage 4: Risk Analysis & Dynamic Threat Calculation',
    targetTab: 'risk-analysis',
    countryId: 'IDN',
    rainfall: 145,
    waterLevel: 7.2,
    explanation: 'The system computes the composite flood threat score by combining historical baseline vulnerability (88/100) with real-time hydraulic surge hazard (96/100), producing an overall score of 93/100.',
    systemStage: 'Risk Analysis'
  },
  {
    stepNumber: 5,
    title: 'Stage 5: Adaptive Flood Alert Level',
    targetTab: 'alerts',
    countryId: 'IDN',
    rainfall: 145,
    waterLevel: 7.2,
    explanation: 'The system elevates the warning tier to Critical Threat. Multi-agency alerts and public safety broadcasts are triggered with estimated flood arrival timing.',
    systemStage: 'Adaptive Alert'
  },
  {
    stepNumber: 6,
    title: 'Stage 6: Triggering Emergency SOP Actions',
    targetTab: 'emergency-actions',
    countryId: 'IDN',
    rainfall: 145,
    waterLevel: 7.2,
    explanation: 'The EWS translates the Critical alert into immediate operational response: evacuate designated floodplains, mobilize search and rescue, and activate community shelters.',
    systemStage: 'Emergency Action'
  }
];

export const EWSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [selectedCountryId, setSelectedCountryId] = useState<string>('IDN');
  const [selectedStationId, setSelectedStationId] = useState<string>('IDN-STA-01');
  
  // Simulated real-time sensor state
  const [simulatedRainfall, setSimulatedRainfall] = useState<number>(78);
  const [simulatedWaterLevel, setSimulatedWaterLevel] = useState<number>(5.8);

  // Presentation mode state
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [presentationStep, setPresentationStep] = useState<number>(0);

  // Get current country object
  const selectedCountry = useMemo(() => {
    const found = ASEAN_COUNTRIES.find(c => c.id === selectedCountryId);
    return found || ASEAN_COUNTRIES[0];
  }, [selectedCountryId]);

  // Get current river station object
  const selectedStation = useMemo(() => {
    if (!selectedCountry.riverStations || selectedCountry.riverStations.length === 0) {
      return undefined;
    }
    const found = selectedCountry.riverStations.find(s => s.id === selectedStationId);
    return found || selectedCountry.riverStations[0];
  }, [selectedCountry, selectedStationId]);

  // Auto-switch station and default values when country changes
  useEffect(() => {
    if (selectedCountry.riverStations && selectedCountry.riverStations.length > 0) {
      const defaultSt = selectedCountry.riverStations[0];
      setSelectedStationId(defaultSt.id);
      if (!isPresentationMode) {
        setSimulatedRainfall(defaultSt.defaultRainfall);
        setSimulatedWaterLevel(defaultSt.defaultWaterLevel);
      }
    }
  }, [selectedCountryId]);

  // Compute threat assessment dynamically
  const threatAssessment = useMemo(() => {
    return calculateThreatAssessment(
      selectedCountry,
      selectedStation,
      simulatedRainfall,
      simulatedWaterLevel
    );
  }, [selectedCountry, selectedStation, simulatedRainfall, simulatedWaterLevel]);

  const loadPresetScenario = (scenario: PresetScenario) => {
    setSelectedCountryId(scenario.countryId);
    const country = ASEAN_COUNTRIES.find(c => c.id === scenario.countryId);
    if (country && country.riverStations && country.riverStations[scenario.stationIndex]) {
      setSelectedStationId(country.riverStations[scenario.stationIndex].id);
    }
    setSimulatedRainfall(scenario.simulatedRainfall);
    setSimulatedWaterLevel(scenario.simulatedWaterLevel);
  };

  const resetSimulationToDefaults = () => {
    if (selectedStation) {
      setSimulatedRainfall(selectedStation.defaultRainfall);
      setSimulatedWaterLevel(selectedStation.defaultWaterLevel);
    }
  };

  const applyPresentationStep = (index: number) => {
    if (index >= 0 && index < PRESENTATION_STEPS.length) {
      const step = PRESENTATION_STEPS[index];
      setPresentationStep(index);
      setActiveTab(step.targetTab);
      if (step.countryId) {
        setSelectedCountryId(step.countryId);
      }
      if (step.rainfall !== undefined) {
        setSimulatedRainfall(step.rainfall);
      }
      if (step.waterLevel !== undefined) {
        setSimulatedWaterLevel(step.waterLevel);
      }
    }
  };

  const startPresentationTour = () => {
    setIsPresentationMode(true);
    applyPresentationStep(0);
  };

  const stopPresentationTour = () => {
    setIsPresentationMode(false);
  };

  const nextPresentationStep = () => {
    if (presentationStep < PRESENTATION_STEPS.length - 1) {
      applyPresentationStep(presentationStep + 1);
    } else {
      stopPresentationTour();
    }
  };

  const prevPresentationStep = () => {
    if (presentationStep > 0) {
      applyPresentationStep(presentationStep - 1);
    }
  };

  const setStepIndex = (index: number) => {
    applyPresentationStep(index);
  };

  return (
    <EWSContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedCountry,
        setSelectedCountryId,
        selectedStation,
        setSelectedStationId,
        simulatedRainfall,
        setSimulatedRainfall,
        simulatedWaterLevel,
        setSimulatedWaterLevel,
        threatAssessment,
        loadPresetScenario,
        isPresentationMode,
        presentationStep,
        presentationSteps: PRESENTATION_STEPS,
        startPresentationTour,
        stopPresentationTour,
        nextPresentationStep,
        prevPresentationStep,
        setStepIndex,
        resetSimulationToDefaults,
      }}
    >
      {children}
    </EWSContext.Provider>
  );
};

export const useEWS = () => {
  const context = useContext(EWSContext);
  if (!context) {
    throw new Error('useEWS must be used within an EWSProvider');
  }
  return context;
};
