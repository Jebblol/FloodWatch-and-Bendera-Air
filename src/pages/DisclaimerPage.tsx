import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Database, 
  Radio, 
  TrendingUp, 
  SlidersHorizontal, 
  Map, 
  AlertTriangle, 
  FileText,
  Info,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  ExternalLink,
  Scale,
  Award
} from 'lucide-react';
import { useEWS } from '../context/EWSContext';

interface MethodologySection {
  id: string;
  title: string;
  summary: string;
  details: string;
  badge: string;
  icon: React.ElementType;
}

const SECTIONS: MethodologySection[] = [
  {
    id: 'purpose',
    title: 'Prototype Purpose',
    summary: 'End-to-end community flood early warning workflow demonstration.',
    details: 'This interface demonstrates an end-to-end disaster early warning pipeline: fusing empirical historical hazard exposure with real-time hydraulic sensor telemetry to compute transparent composite risk scores, trigger color-coded multi-agency alerts, and recommend standard operating procedure (SOP) community actions.',
    badge: 'Demonstration Pipeline',
    icon: FileText
  },
  {
    id: 'historical',
    title: 'Historical Data Integrity',
    summary: 'Official 2000–2023 disaster records with preserved missing values.',
    details: 'Past flood disaster records (2000–2023) are sourced from official disaster databases. To maintain scientific integrity and transparency, missing values (such as Singapore, Brunei, and limited single-sample poverty data for Lao PDR) are preserved and transparently marked as unavailable rather than imputed with synthetic zeros.',
    badge: 'Empirical Baseline Records',
    icon: Database
  },
  {
    id: 'sensor',
    title: 'Simulated Sensor Inflow',
    summary: 'Rainfall intensity and river stage levels are interactive simulation inputs.',
    details: 'Rainfall intensity (mm/h) and river water stage measurements (m) displayed across the Live Monitoring and Risk Map modules represent simulated telemetric inputs. Users can adjust rainfall and hydraulic stage sliders to test dynamic system reactivity. They are not tied to physical IoT river probe hardware.',
    badge: 'Simulated IoT Telemetry',
    icon: Radio
  },
  {
    id: 'forecasting',
    title: 'Statistical Forecasting',
    summary: 'Statistical trend projections with 95% confidence intervals.',
    details: 'Future projections for 2024–2027 in the Historical Data module illustrate a statistical linear trend progression (+0.51 events per year) bounded by 95% confidence intervals. These projections demonstrate predictive integration and do not constitute official national meteorological forecasts.',
    badge: 'Statistical Trend Projection',
    icon: TrendingUp
  },
  {
    id: 'risk-score',
    title: 'Deterministic Risk Model',
    summary: 'Transparent 0–100 composite scoring formula (35% baseline / 65% live).',
    details: 'The 0–100 composite flood threat score and 4-tier threat classification (Low, Moderate, High, Critical) are computed through a transparent weighted formulation: 35% from historical baseline vulnerability and 65% from real-time hydraulic sensor telemetry. They are academic decision models, not official civil defense ratings.',
    badge: 'Deterministic Weighted Matrix',
    icon: SlidersHorizontal
  },
  {
    id: 'risk-map',
    title: 'Regional Geospatial Scope',
    summary: 'Geographic GIS overview for regional context and basin monitoring.',
    details: 'The Southeast Asian GIS map provides regional visualization of river basins, monitored telemetry stations, and hazard choropleths. It is designed to demonstrate macro-level catchment situational awareness and does not replace micro-scale flood hydrodynamic modeling.',
    badge: 'Regional GIS Visualization',
    icon: Map
  }
];

export const DisclaimerPage: React.FC = () => {
  const { setActiveTab } = useEWS();
  const [expandedMobile, setExpandedMobile] = useState<string | null>('purpose');

  return (
    <div className="space-y-[20px] w-full max-w-[1200px]">
      {/* Top Banner Header */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <div className="flex items-center gap-[8px]">
            <span className="px-[8px] py-[3px] rounded-[4px] text-[11px] font-bold bg-[var(--bg)] border border-[var(--line)] text-amber-800 flex items-center gap-[4px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>PROTOTYPE NOTICE</span>
            </span>
            <span className="px-[8px] py-[3px] rounded-[4px] text-[11px] font-bold bg-[var(--bg)] border border-[var(--line)] text-[var(--sea)] flex items-center gap-[4px]">
              <Award className="w-3.5 h-3.5 text-[var(--sea)]" />
              <span>ASEAN DSE 2026 ACADEMIC PROTOTYPE</span>
            </span>
          </div>

          <h2 className="text-[18px] font-bold text-[var(--ink)] m-0 mt-[4px]">
            System Disclaimer & Scientific Methodology
          </h2>
          <p className="text-[13px] text-[var(--muted)] m-0 mt-[2px]">
            Transparency disclosure regarding data sources, simulation models, and operational limitations.
          </p>
        </div>

        {/* Return to Dashboard Button */}
        <button
          onClick={() => setActiveTab('overview')}
          className="px-[14px] py-[8px] rounded-[6px] bg-[var(--bg)] hover:bg-[color-mix(in_srgb,var(--sea)_10%,transparent)] text-[var(--ink)] text-[12px] font-semibold border border-[var(--line)] flex items-center gap-[6px] cursor-pointer transition-colors shadow-xs"
        >
          <LayoutDashboard className="w-4 h-4 text-[var(--sea)]" />
          <span>Return to Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5 text-[var(--muted)]" />
        </button>
      </div>

      {/* Prominent High-Visibility Amber Disclaimer Panel */}
      <section className="bg-[var(--panel)] border-l-[8px] border-amber-500 border-t border-r border-b border-[var(--line)] rounded-[8px] p-[18px] space-y-[6px]">
        <div className="flex items-center gap-[8px]">
          <Info className="w-5 h-5 text-amber-600" />
          <h3 className="text-[15px] font-bold text-[var(--ink)] m-0">
            Academic Prototype Notice — Demonstration & Research Use Only
          </h3>
        </div>
        <p className="text-[13px] text-[var(--muted)] leading-relaxed m-0 pl-[28px]">
          This application was developed as an interactive concept for the <strong>ASEAN Data Science Explorers (DSE) 2026</strong> competition. All real-time IoT hydrological sensor streams, radar cloudburst estimates, and composite threat scores are simulated for demonstration purposes. They do not constitute official meteorological forecasts or live governmental emergency warnings.
        </p>
      </section>

      {/* 6-Card Methodology Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          return (
            <div 
              key={sec.id}
              className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[18px] flex flex-col justify-between space-y-[14px] shadow-xs hover:border-[var(--sea)] transition-colors"
            >
              <div className="space-y-[8px]">
                <div className="flex items-center justify-between">
                  <div className="w-[32px] h-[32px] rounded-[6px] bg-[color-mix(in_srgb,var(--sea)_12%,transparent)] flex items-center justify-center text-[var(--sea)]">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold px-[8px] py-[2px] rounded bg-[var(--bg)] border border-[var(--line)] text-[var(--sea)]">
                    {sec.badge}
                  </span>
                </div>

                <h4 className="text-[15px] font-bold text-[var(--ink)] m-0">
                  {sec.title}
                </h4>

                <p className="text-[12px] text-[var(--muted)] leading-relaxed m-0">
                  {sec.details}
                </p>
              </div>

              <div className="pt-[10px] border-t border-[var(--line)] text-[11px] text-[var(--muted)] italic">
                {sec.summary}
              </div>
            </div>
          );
        })}
      </div>

      {/* Official Government Authority & Agency Boundaries Card */}
      <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[18px] space-y-[10px]">
        <div className="flex items-center gap-[8px] pb-[8px] border-b border-[var(--line)]">
          <ShieldAlert className="w-5 h-5 text-[var(--sea)]" />
          <h3 className="text-[15px] font-bold text-[var(--ink)] m-0">
            Official Warning Authority & Regulatory Jurisdiction
          </h3>
        </div>

        <p className="text-[13px] text-[var(--muted)] leading-relaxed m-0">
          This system is not intended to supersede or replace official flood alerts and evacuation directives issued by statutory national hydrometeorological agencies, including <strong>PAGASA</strong> (Philippines), <strong>BMKG</strong> (Indonesia), <strong>TMD</strong> (Thailand), <strong>NCHMF</strong> (Viet Nam), <strong>MMD</strong> (Malaysia), or disaster management mechanisms such as the <strong>AHA Centre</strong> (ASEAN Coordinating Centre for Humanitarian Assistance), <strong>BNPB</strong>, and <strong>NDRRMC</strong>. During active hydrometeorological events, emergency personnel and residents must strictly follow instructions from authorized government command centers.
        </p>

        <div className="pt-[6px] flex flex-wrap gap-[10px]">
          <button
            onClick={() => setActiveTab('overview')}
            className="px-[12px] py-[6px] rounded-[6px] bg-[var(--sea)] text-white text-[12px] font-bold hover:opacity-95 cursor-pointer shadow-xs"
          >
            Go to Overview Dashboard
          </button>
          <button
            onClick={() => setActiveTab('risk-map')}
            className="px-[12px] py-[6px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)] text-[12px] font-semibold hover:bg-[color-mix(in_srgb,var(--sea)_8%,transparent)] cursor-pointer"
          >
            Explore GIS Heatmap
          </button>
        </div>
      </section>
    </div>
  );
};
