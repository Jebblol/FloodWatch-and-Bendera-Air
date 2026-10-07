import React, { useMemo } from 'react';
import { useEWS } from '../context/EWSContext';

interface CountryItem {
  name: string;
  code: string;
  score: number | null;
  level: 'low' | 'mod' | 'high' | 'crit' | 'na';
}

const COUNTRIES_LIST: CountryItem[] = [
  { name: 'Indonesia', code: 'IDN', score: 62, level: 'high' },
  { name: 'Thailand', code: 'THA', score: 55, level: 'high' },
  { name: 'Philippines', code: 'PHL', score: 44, level: 'mod' },
  { name: 'Vietnam', code: 'VNM', score: 38, level: 'mod' },
  { name: 'Malaysia', code: 'MYS', score: 27, level: 'low' },
  { name: 'Myanmar', code: 'MMR', score: 33, level: 'mod' },
  { name: 'Cambodia', code: 'CAM', score: 21, level: 'low' },
  { name: 'Laos', code: 'LAO', score: 18, level: 'low' },
  { name: 'Singapore', code: 'SGP', score: null, level: 'na' },
  { name: 'Brunei', code: 'BRN', score: null, level: 'na' },
  { name: 'Timor-Leste', code: 'TLS', score: null, level: 'na' },
];

export const OverviewPage: React.FC = () => {
  const {
    selectedCountry,
    setSelectedCountryId,
    selectedStation,
    simulatedRainfall,
    simulatedWaterLevel,
    threatAssessment
  } = useEWS();

  // Color mapping based on threat level
  const threatColorVar = useMemo(() => {
    switch (threatAssessment.level) {
      case 'CRITICAL': return 'var(--crit)';
      case 'HIGH': return 'var(--high)';
      case 'MODERATE': return 'var(--mod)';
      case 'LOW':
      default: return 'var(--low)';
    }
  }, [threatAssessment.level]);

  // Dynamic ranking list
  const rankedCountries = useMemo(() => {
    const list = COUNTRIES_LIST.map(c => {
      if (c.name === selectedCountry.name) {
        return {
          ...c,
          score: threatAssessment.score,
          level: (threatAssessment.level === 'CRITICAL' ? 'crit' :
                  threatAssessment.level === 'HIGH' ? 'high' :
                  threatAssessment.level === 'MODERATE' ? 'mod' : 'low') as CountryItem['level']
        };
      }
      return c;
    });

    return list
      .filter((c): c is CountryItem & { score: number } => c.score !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [selectedCountry.name, threatAssessment.score, threatAssessment.level]);

  return (
    <div className="space-y-[20px] w-full">
      {/* Hero Card */}
      <section 
        className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-[24px] items-center bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[18px_24px]"
        style={{ borderLeft: `8px solid ${threatColorVar}` }}
        aria-label="Current threat"
      >
        <div className="text-[30px] font-bold" style={{ color: threatColorVar }}>
          <span className="block text-[13px] font-normal text-[var(--muted)]">
            {selectedCountry.name}
          </span>
          {threatAssessment.level}
          <span className="block text-[13px] font-normal text-[var(--muted)]">
            Composite risk {threatAssessment.score}/100
          </span>
          <div className="h-[8px] bg-[var(--line)] rounded-[4px] mt-[6px] w-[140px] overflow-hidden">
            <i 
              className="block h-full rounded-[4px] transition-all duration-300" 
              style={{ width: `${Math.min(100, Math.max(5, threatAssessment.score))}%`, background: threatColorVar }}
            />
          </div>
        </div>

        <div className="flex gap-[32px] flex-wrap items-center">
          <div>
            <b className="block text-[24px] font-bold text-[var(--ink)]">
              {simulatedRainfall} mm/h
            </b>
            <span className="text-[13px] text-[var(--muted)]">Rainfall</span>
          </div>

          <div>
            <b className="block text-[24px] font-bold text-[var(--ink)]">
              {simulatedWaterLevel.toFixed(1)} m
            </b>
            <span className="text-[13px] text-[var(--muted)]">
              River stage · {selectedStation ? selectedStation.name.split(' - ')[0] : (selectedCountry.basin ? selectedCountry.basin.split(' ')[0] : 'basin')}
            </span>
          </div>

          <div>
            <b className="block text-[24px] font-bold text-[var(--ink)]">
              {selectedCountry.vulnerabilityLevel || 'High'}
            </b>
            <span className="text-[13px] text-[var(--muted)]">Regional vulnerability</span>
          </div>

          <div>
            <b className="block text-[24px] font-bold text-[var(--ink)]">
              14:21
            </b>
            <span className="text-[13px] text-[var(--muted)]">Last updated (simulated)</span>
          </div>
        </div>
      </section>

      {/* Grid: Risk by country & Highest risk now */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[20px]">
        {/* Risk by country */}
        <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px]">
          <h2 className="text-[15px] font-semibold text-[var(--ink)] m-0 mb-[4px]">Risk by country</h2>
          <p className="text-[13px] text-[var(--muted)] m-0 mb-[12px]">
            Select a country. Hatched = no dataset available.
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-[8px]">
            {COUNTRIES_LIST.map((c) => {
              const isSelected = c.name === selectedCountry.name;
              const isNa = c.level === 'na';
              const displayScore = isSelected ? threatAssessment.score : c.score;
              const currentLevel = isSelected ? 
                (threatAssessment.level === 'CRITICAL' ? 'crit' :
                 threatAssessment.level === 'HIGH' ? 'high' :
                 threatAssessment.level === 'MODERATE' ? 'mod' : 'low') : c.level;

              return (
                <button
                  key={c.code}
                  disabled={isNa}
                  title={c.name}
                  onClick={() => {
                    const countryMap: Record<string, string> = {
                      'IDN': 'IDN', 'THA': 'THA', 'PHL': 'PHL', 'VNM': 'VNM',
                      'MYS': 'MYS', 'MMR': 'MMR', 'CAM': 'KHM', 'LAO': 'LAO'
                    };
                    const targetId = countryMap[c.code] || c.code;
                    setSelectedCountryId(targetId);
                  }}
                  style={{
                    backgroundColor: isNa ? undefined : `var(--${currentLevel})`,
                    backgroundImage: isNa ? 'repeating-linear-gradient(45deg, var(--panel), var(--panel) 5px, var(--line) 5px, var(--line) 8px)' : undefined,
                    borderColor: isSelected ? 'var(--ink)' : 'transparent'
                  }}
                  className={`border-2 rounded-[6px] p-[10px_4px] text-center text-[13px] font-semibold transition-all ${
                    isNa ? 'text-[var(--muted)] cursor-default' : 'text-white cursor-pointer hover:opacity-90'
                  }`}
                >
                  {c.code}
                  <small className="block font-normal opacity-90 text-[11px] mt-0.5">
                    {displayScore !== null ? displayScore : 'n/a'}
                  </small>
                </button>
              );
            })}
          </div>

          <div className="flex gap-[14px] mt-[12px] text-[12px] text-[var(--muted)] flex-wrap items-center">
            <span className="flex items-center gap-[4px]">
              <i className="w-[10px] h-[10px] rounded-[2px] inline-block" style={{ background: 'var(--low)' }} />
              Low
            </span>
            <span className="flex items-center gap-[4px]">
              <i className="w-[10px] h-[10px] rounded-[2px] inline-block" style={{ background: 'var(--mod)' }} />
              Moderate
            </span>
            <span className="flex items-center gap-[4px]">
              <i className="w-[10px] h-[10px] rounded-[2px] inline-block" style={{ background: 'var(--high)' }} />
              High
            </span>
            <span className="flex items-center gap-[4px]">
              <i className="w-[10px] h-[10px] rounded-[2px] inline-block" style={{ background: 'var(--crit)' }} />
              Critical
            </span>
            <span className="ml-auto text-[var(--muted)]">
              8 full · 1 partial · 2 unavailable
            </span>
          </div>
        </section>

        {/* Highest risk now */}
        <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px]">
          <h2 className="text-[15px] font-semibold text-[var(--ink)] m-0 mb-[4px]">Highest risk now</h2>
          <p className="text-[13px] text-[var(--muted)] m-0 mb-[12px]">Ranked by composite score</p>

          <ol className="list-none m-0 p-0">
            {rankedCountries.map((c, idx) => {
              const levelLabel = c.level === 'high' ? 'High' : c.level === 'mod' ? 'Moderate' : c.level === 'crit' ? 'Critical' : 'Low';
              return (
                <li 
                  key={c.code}
                  className={`flex items-center gap-[10px] py-[8px] ${idx < rankedCountries.length - 1 ? 'border-b border-[var(--line)]' : ''}`}
                >
                  <span 
                    className="w-[10px] h-[10px] rounded-full flex-none" 
                    style={{ background: `var(--${c.level})` }}
                  />
                  <span className="font-medium text-[var(--ink)] text-[14px]">{c.name}</span>
                  <span className="text-[12px] text-[var(--muted)]">{levelLabel}</span>
                  <em className="ml-auto not-italic font-bold text-[var(--ink)] text-[14px]">
                    {c.score}
                  </em>
                </li>
              );
            })}
          </ol>
        </section>
      </div>

      {/* History section */}
      <div>
        <h3 className="m-0 mb-[8px] text-[13px] text-[var(--muted)] font-semibold">
          History · ASEAN-wide, 2000–2023
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
          {/* Card 1 */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] flex flex-col justify-between">
            <div>
              <span className="text-[13px] text-[var(--muted)] block">Recorded flood events</span>
              <b className="text-[22px] font-bold text-[var(--ink)] block mt-0.5">584</b>
              <span className="text-[13px] text-[var(--muted)] block">118.0M people affected</span>
            </div>
            <svg className="w-full h-[28px] mt-[6px]" viewBox="0 0 100 28" preserveAspectRatio="none">
              <polyline 
                fill="none" 
                stroke="var(--sea)" 
                strokeWidth="2" 
                points="0,22 10,20 20,24 30,15 40,17 50,10 60,14 70,8 80,12 90,5 100,9" 
              />
            </svg>
          </div>

          {/* Card 2 */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px]">
            <span className="text-[13px] text-[var(--muted)] block">Most events</span>
            <b className="text-[22px] font-bold text-[var(--ink)] block mt-0.5">Indonesia · 195</b>
            <span className="text-[13px] text-[var(--muted)] block">33.4% of ASEAN total</span>
          </div>

          {/* Card 3 */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px]">
            <span className="text-[13px] text-[var(--muted)] block">Most affected per flood</span>
            <b className="text-[22px] font-bold text-[var(--ink)] block mt-0.5">Thailand · 642k</b>
            <span className="text-[13px] text-[var(--muted)] block">average people</span>
          </div>

          {/* Card 4 */}
          <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px]">
            <span className="text-[13px] text-[var(--muted)] block">Data coverage</span>
            <b className="text-[22px] font-bold text-[var(--ink)] block mt-0.5">8 of 11</b>
            <span className="text-[13px] text-[var(--muted)] block">countries fully covered</span>
          </div>
        </div>
      </div>

      {/* Warning Pipeline section */}
      <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px]">
        <h2 className="text-[15px] font-semibold text-[var(--ink)] m-0 mb-[4px]">How a warning is produced</h2>
        <p className="text-[13px] text-[var(--muted)] m-0 mb-[12px]">
          Values shown for the selected country.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-0">
          <div className="p-[12px_12px_12px_16px] border-t-[3px]" style={{ borderColor: 'var(--sea)' }}>
            <b className="block text-[14px] text-[var(--ink)]">Historical</b>
            <span className="text-[13px] text-[var(--muted)] block">Events 2000–2023</span>
            <span className="text-[20px] font-bold text-[var(--ink)] block mt-[4px]">
              {selectedCountry.events ?? 195}
            </span>
          </div>

          <div className="p-[12px_12px_12px_16px] border-t-[3px]" style={{ borderColor: 'var(--sea)' }}>
            <b className="block text-[14px] text-[var(--ink)]">Spatial</b>
            <span className="text-[13px] text-[var(--muted)] block">Vulnerability</span>
            <span className="text-[20px] font-bold text-[var(--ink)] block mt-[4px]">
              {selectedCountry.vulnerabilityLevel ?? 'High'}
            </span>
          </div>

          <div className="p-[12px_12px_12px_16px] border-t-[3px]" style={{ borderColor: threatColorVar }}>
            <b className="block text-[14px] text-[var(--ink)]">Live sensors</b>
            <span className="text-[13px] text-[var(--muted)] block">Rainfall / stage</span>
            <span className="text-[20px] font-bold text-[var(--ink)] block mt-[4px]">
              {simulatedRainfall} mm/h
            </span>
          </div>

          <div className="p-[12px_12px_12px_16px] border-t-[3px]" style={{ borderColor: 'var(--sea)' }}>
            <b className="block text-[14px] text-[var(--ink)]">Risk score</b>
            <span className="text-[13px] text-[var(--muted)] block">Composite</span>
            <span className="text-[20px] font-bold text-[var(--ink)] block mt-[4px]">
              {threatAssessment.score}/100
            </span>
          </div>

          <div className="p-[12px_12px_12px_16px] border-t-[3px]" style={{ borderColor: 'var(--sea)' }}>
            <b className="block text-[14px] text-[var(--ink)]">Actions</b>
            <span className="text-[13px] text-[var(--muted)] block">Recommended</span>
            <span className="text-[20px] font-bold text-[var(--ink)] block mt-[4px]">
              {threatAssessment.recommendedActions.length} open
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};
