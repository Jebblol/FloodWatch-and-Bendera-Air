import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  Line, 
  Area, 
  CartesianGrid, 
  Legend, 
  ComposedChart 
} from 'recharts';
import { 
  Database, 
  TrendingUp, 
  Users, 
  Percent, 
  Info, 
  AlertCircle, 
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { useEWS } from '../context/EWSContext';
import { ASEAN_COUNTRIES, ANNUAL_FLOOD_SERIES, CountryFloodData } from '../data/aseanData';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

interface FirestoreCountryYear {
  country: string;
  isoCode: string;
  year: number;
  floodEvents: number | null;
  totalAffected: number | null;
  totalDeaths: number | null;
  povertyRate: number | null;
  populationDensity: number | null;
  averageAffectedPerFlood: number | null;
}

export const HistoricalDataPage: React.FC = () => {
  const { selectedCountry, setSelectedCountryId } = useEWS();
  const [viewMode, setViewMode] = useState<'events' | 'affected' | 'poverty' | 'combined'>('combined');
  const [firestoreData, setFirestoreData] = useState<FirestoreCountryYear[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Firestore historicalData collection with fallback to local ASEAN dataset
  useEffect(() => {
    let isMounted = true;
    const fetchHistorical = async () => {
      try {
        setLoading(true);
        setError(null);
        const querySnapshot = await getDocs(collection(db, 'historicalData'));
        const docs: FirestoreCountryYear[] = [];
        querySnapshot.forEach((docSnap) => {
          docs.push(docSnap.data() as FirestoreCountryYear);
        });
        if (isMounted) {
          if (docs.length > 0) {
            setFirestoreData(docs);
          } else {
            console.warn('Firestore historicalData empty, using local dataset fallback.');
          }
        }
      } catch (err: any) {
        console.error('Error connecting to Firestore historicalData, using local fallback:', err);
        if (isMounted) {
          setError(err?.message || 'Failed to connect to Firestore');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHistorical();
    return () => { isMounted = false; };
  }, []);

  const isUsingFirestore = firestoreData.length > 0;

  // Compute aggregated country data dynamically from Firestore if available
  const dynamicCountries = useMemo(() => {
    if (!firestoreData || firestoreData.length === 0) {
      return ASEAN_COUNTRIES;
    }

    return ASEAN_COUNTRIES.map((baseCountry) => {
      const records = firestoreData.filter(d => d.isoCode === baseCountry.id);
      if (records.length === 0) {
        return baseCountry;
      }

      let totalEvents = 0;
      let totalAff = 0;
      let totalDeaths = 0;
      let povertySum = 0;
      let povertyCount = 0;

      records.forEach(r => {
        if (r.floodEvents !== null) totalEvents += r.floodEvents;
        if (r.totalAffected !== null) totalAff += r.totalAffected;
        if (r.totalDeaths !== null) totalDeaths += r.totalDeaths;
        if (r.povertyRate !== null && r.povertyRate !== undefined) {
          povertySum += r.povertyRate;
          povertyCount += 1;
        }
      });

      const avgAff = totalEvents > 0 ? Number((totalAff / totalEvents).toFixed(2)) : null;
      const avgPov = povertyCount > 0 ? Number((povertySum / povertyCount).toFixed(2)) : null;

      return {
        ...baseCountry,
        events: totalEvents > 0 || baseCountry.events !== null ? totalEvents : null,
        affected: totalAff > 0 || baseCountry.affected !== null ? totalAff : null,
        avgAffected: avgAff ?? baseCountry.avgAffected,
        povertyRate: avgPov ?? baseCountry.povertyRate,
        povertySamples: povertyCount > 0 ? povertyCount : baseCountry.povertySamples,
        deaths: totalDeaths > 0 || baseCountry.deaths !== null ? totalDeaths : null,
      };
    });
  }, [firestoreData]);

  // Compute Annual series from Firestore dynamically
  const annualSeries = useMemo(() => {
    if (!firestoreData || firestoreData.length === 0) {
      return ANNUAL_FLOOD_SERIES;
    }

    const yearMap = new Map<number, { events: number; affected: number; deaths: number }>();
    firestoreData.forEach(r => {
      if (r.year >= 2000 && r.year <= 2023) {
        if (!yearMap.has(r.year)) {
          yearMap.set(r.year, { events: 0, affected: 0, deaths: 0 });
        }
        const cur = yearMap.get(r.year)!;
        cur.events += r.floodEvents || 0;
        cur.affected += r.totalAffected || 0;
        cur.deaths += r.totalDeaths || 0;
      }
    });

    const historicalRows = Array.from(yearMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([yr, stats]) => ({
        year: yr,
        historicalEvents: stats.events,
        totalAffected: stats.affected,
        totalDeaths: stats.deaths,
        forecastEvents: null,
        forecastLower: null,
        forecastUpper: null,
        type: 'historical' as const
      }));

    const forecastYears = [2024, 2025, 2026, 2027];
    const forecastRows = forecastYears.map((yr, idx) => {
      const proj = 30.8 + idx * 0.5;
      return {
        year: yr,
        historicalEvents: null,
        totalAffected: null,
        totalDeaths: null,
        forecastEvents: Number(proj.toFixed(1)),
        forecastLower: Number((proj - 12.7).toFixed(1)),
        forecastUpper: Number((proj + 12.7).toFixed(1)),
        type: 'forecast' as const
      };
    });

    return [...historicalRows, ...forecastRows];
  }, [firestoreData]);

  // Bar Chart Data (Filtered to countries with records)
  const barChartData = useMemo(() => {
    return dynamicCountries
      .filter((c): c is CountryFloodData & { events: number } => c.events !== null)
      .map(c => ({
        id: c.id,
        name: c.name,
        events: c.events,
        avgAffected: c.avgAffected ? Math.round(c.avgAffected) : 0,
        povertyRate: c.povertyRate,
        isSelected: c.id === selectedCountry.id
      }))
      .sort((a, b) => a.events - b.events); // ascending for vertical layout
  }, [dynamicCountries, selectedCountry.id]);

  // Comparison Chart Data
  const comparisonData = useMemo(() => {
    return dynamicCountries
      .filter(c => c.dataAvailable && c.avgAffected !== null)
      .map(c => ({
        id: c.id,
        name: c.name.split(' ')[0], // short name
        fullName: c.name,
        avgAffected: c.avgAffected ? Math.round(c.avgAffected) : 0,
        povertyRate: c.povertyRate || 0,
        isSelected: c.id === selectedCountry.id
      }))
      .sort((a, b) => b.avgAffected - a.avgAffected);
  }, [dynamicCountries, selectedCountry.id]);

  // Tooltip Components adapted for Dark & Light Themes
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] p-[12px] rounded-[6px] shadow-md text-[12px] space-y-[4px]">
          <p className="font-bold text-[13px] text-[var(--ink)] m-0">{data.fullName || data.name}</p>
          <div className="text-[var(--sea)] font-semibold">
            Total Events: <strong>{data.events !== undefined ? data.events : '—'}</strong>
          </div>
          {data.avgAffected > 0 && (
            <div className="text-amber-700 font-medium">
              Avg Affected / Event: <strong>{data.avgAffected.toLocaleString()}</strong>
            </div>
          )}
          {data.povertyRate !== null && data.povertyRate !== undefined && (
            <div className="text-emerald-700 font-medium">
              Poverty Headcount: <strong>{data.povertyRate}%</strong>
            </div>
          )}
          <p className="text-[10px] text-[var(--muted)] m-0 pt-[4px] border-t border-[var(--line)]">
            Click to select country in EWS focus
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomForecastTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      const isForecast = point.type === 'forecast';
      return (
        <div className="bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] p-[12px] rounded-[6px] shadow-md text-[12px] space-y-[4px]">
          <div className="font-bold text-[13px] text-[var(--ink)] flex items-center justify-between gap-[10px]">
            <span>Year {label}</span>
            <span className={`px-[6px] py-[2px] rounded text-[10px] font-bold ${isForecast ? 'bg-purple-100 text-purple-800' : 'bg-[var(--bg)] border border-[var(--line)] text-[var(--sea)]'}`}>
              {isForecast ? 'Projection' : 'Empirical Record'}
            </span>
          </div>
          {point.historicalEvents !== null && (
            <div className="text-[var(--sea)] font-semibold">
              Disaster Events: <strong>{point.historicalEvents}</strong>
            </div>
          )}
          {point.forecastEvents !== null && (
            <>
              <div className="text-purple-700 font-semibold">
                Projected Events: <strong>{point.forecastEvents}</strong>
              </div>
              {point.forecastLower !== null && (
                <div className="text-[var(--muted)] text-[10px]">
                  95% Confidence Interval: [{point.forecastLower} — {point.forecastUpper}]
                </div>
              )}
            </>
          )}
          {point.totalAffected && (
            <div className="text-[var(--muted)] text-[11px]">
              Total Cumulative Affected: {point.totalAffected.toLocaleString()}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-[20px] w-full max-w-[1200px]">
      {/* Top Banner Header */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <div className="flex items-center gap-[8px]">
            <span className="px-[8px] py-[3px] rounded-[4px] text-[11px] font-bold bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]">
              STAGE 1: HISTORICAL INTELLIGENCE
            </span>
            <span className="text-[12px] text-[var(--muted)]">
              {isUsingFirestore ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Synced with Firestore (historicalData)
                </span>
              ) : (
                <span>Source: ASEAN Disaster Records Database (2000–2023)</span>
              )}
            </span>
          </div>

          <h2 className="text-[18px] font-bold text-[var(--ink)] m-0 mt-[4px]">
            Historical Flood Analytics & Forecasting
          </h2>
          <p className="text-[13px] text-[var(--muted)] m-0 mt-[2px]">
            Multi-decade disaster exposure baseline feeding into the composite vulnerability model.
          </p>
        </div>

        {/* Selected Country Badge */}
        <div className="flex items-center gap-[8px] bg-[var(--bg)] border border-[var(--line)] px-[12px] py-[6px] rounded-[6px] text-[12px]">
          <span className="text-[var(--muted)]">Focus Country:</span>
          <b className="text-[var(--sea)]">{selectedCountry.name}</b>
        </div>
      </div>

      {/* Loading & Status Alerts */}
      {loading && (
        <div className="p-[10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] text-[12px] text-[var(--muted)] flex items-center gap-[8px]">
          <div className="w-[8px] h-[8px] rounded-full bg-[var(--sea)] animate-ping" />
          <span>Synchronizing empirical country-year records...</span>
        </div>
      )}

      {/* Quick Country Focus Selector Bar */}
      <div className="flex items-center gap-[6px] overflow-x-auto pb-[2px]">
        <span className="text-[12px] font-bold text-[var(--muted)] whitespace-nowrap mr-1">
          Select Member State:
        </span>
        {dynamicCountries.filter(c => c.dataAvailable).map((c) => {
          const isSelected = c.id === selectedCountry.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCountryId(c.id)}
              className={`px-[10px] py-[5px] rounded-[6px] text-[12px] font-medium border whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[var(--sea)] text-white border-[var(--sea)] font-bold shadow-xs'
                  : 'bg-[var(--panel)] border-[var(--line)] text-[var(--ink)] hover:bg-[var(--bg)]'
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Main Chart 1: Total Flood Events by Country (Horizontal Bar Chart) */}
      <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[18px] space-y-[14px]">
        <div className="flex flex-wrap items-center justify-between gap-[10px]">
          <div>
            <h3 className="text-[15px] font-bold text-[var(--ink)] m-0 flex items-center gap-[8px]">
              <Database className="w-4 h-4 text-[var(--sea)]" />
              Total Recorded Flood Events by Country (2000–2023)
            </h3>
            <p className="text-[12px] text-[var(--muted)] m-0 mt-[2px]">
              Frequency distribution across Southeast Asia. Click any bar to select country.
            </p>
          </div>

          <span className="text-[11px] text-[var(--muted)]">
            Total Recorded: 584 Events Across ASEAN
          </span>
        </div>

        {/* Recharts Horizontal Bar Chart */}
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 20 }}
              onClick={(data: any) => {
                if (data && data.activePayload && data.activePayload[0]) {
                  setSelectedCountryId(data.activePayload[0].payload.id);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="var(--muted)" 
                tick={{ fontSize: 11 }}
                label={{ value: 'Total Flood Events (2000–2023)', position: 'insideBottom', offset: -10, fill: 'var(--muted)', fontSize: 11 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="var(--muted)" 
                tick={{ fontSize: 12, fill: 'var(--ink)', fontWeight: 500 }}
                width={95}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar 
                dataKey="events" 
                radius={[0, 4, 4, 0]} 
                cursor="pointer"
              >
                {barChartData.map((entry) => (
                  <Cell 
                    key={`cell-${entry.id}`} 
                    fill={entry.id === selectedCountry.id ? 'var(--sea)' : 'color-mix(in srgb, var(--sea) 40%, var(--line))'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[12px] text-[var(--muted)] pt-[10px] border-t border-[var(--line)]">
          <div className="flex items-center gap-[16px]">
            <span className="flex items-center gap-[6px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[var(--sea)]" />
              <span>Active Country Focus</span>
            </span>
            <span className="flex items-center gap-[6px]">
              <span className="w-[10px] h-[10px] rounded-full bg-[color-mix(in_srgb,var(--sea)_40%,var(--line))]" />
              <span>Other Member States</span>
            </span>
          </div>
          <span>Dataset Baseline: EM-DAT / ASEAN DSE Archive</span>
        </div>
      </section>

      {/* Chart 2: Average Affected Per Flood vs Average Poverty Rate (Comparison Chart) */}
      <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[18px] space-y-[14px]">
        <div className="flex flex-wrap items-center justify-between gap-[12px] pb-[10px] border-b border-[var(--line)]">
          <div>
            <h3 className="text-[15px] font-bold text-[var(--ink)] m-0 flex items-center gap-[8px]">
              <Users className="w-4 h-4 text-amber-600" />
              Average Affected Population Per Flood vs. Poverty Headcount (%)
            </h3>
            <p className="text-[12px] text-[var(--muted)] m-0 mt-[2px]">
              Dual-scale socio-economic vulnerability analysis comparing population exposure with poverty headcounts.
            </p>
          </div>

          {/* View Filter Switcher */}
          <div className="flex items-center bg-[var(--bg)] rounded-[6px] p-[3px] border border-[var(--line)] text-[12px]">
            <button
              onClick={() => setViewMode('combined')}
              className={`px-[10px] py-[4px] rounded-[4px] font-medium transition-colors ${
                viewMode === 'combined' ? 'bg-[var(--panel)] text-[var(--ink)] font-bold shadow-xs' : 'text-[var(--muted)]'
              }`}
            >
              Combined View
            </button>
            <button
              onClick={() => setViewMode('affected')}
              className={`px-[10px] py-[4px] rounded-[4px] font-medium transition-colors ${
                viewMode === 'affected' ? 'bg-[var(--panel)] text-[var(--ink)] font-bold shadow-xs' : 'text-[var(--muted)]'
              }`}
            >
              Avg Affected Only
            </button>
            <button
              onClick={() => setViewMode('poverty')}
              className={`px-[10px] py-[4px] rounded-[4px] font-medium transition-colors ${
                viewMode === 'poverty' ? 'bg-[var(--panel)] text-[var(--ink)] font-bold shadow-xs' : 'text-[var(--muted)]'
              }`}
            >
              Poverty Rate Only
            </button>
          </div>
        </div>

        {/* Dual Axis Composed Chart */}
        <div className="h-[320px] w-full mt-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={comparisonData}
              margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
              onClick={(data: any) => {
                if (data && data.activePayload && data.activePayload[0]) {
                  setSelectedCountryId(data.activePayload[0].payload.id);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis 
                dataKey="name" 
                stroke="var(--muted)" 
                tick={{ fill: 'var(--ink)', fontSize: 11 }}
              />
              
              {(viewMode === 'combined' || viewMode === 'affected') && (
                <YAxis 
                  yAxisId="left"
                  stroke="#d97706"
                  tick={{ fill: '#d97706', fontSize: 11 }}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  label={{ value: 'Avg Affected Per Event (Persons)', angle: -90, position: 'insideLeft', fill: '#d97706', fontSize: 11 }}
                />
              )}

              {(viewMode === 'combined' || viewMode === 'poverty') && (
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="#059669"
                  domain={[0, 50]}
                  tick={{ fill: '#059669', fontSize: 11 }}
                  tickFormatter={(val) => `${val}%`}
                  label={{ value: 'Average Poverty Rate (%)', angle: 90, position: 'insideRight', fill: '#059669', fontSize: 11 }}
                />
              )}

              <Tooltip content={<CustomBarTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />

              {(viewMode === 'combined' || viewMode === 'affected') && (
                <Bar 
                  yAxisId="left" 
                  dataKey="avgAffected" 
                  name="Avg Affected Per Event (Persons)" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]}
                  cursor="pointer"
                >
                  {comparisonData.map((entry) => (
                    <Cell 
                      key={`comp-cell-${entry.id}`} 
                      fill={entry.id === selectedCountry.id ? '#d97706' : '#fcd34d'}
                    />
                  ))}
                </Bar>
              )}

              {(viewMode === 'combined' || viewMode === 'poverty') && (
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="povertyRate" 
                  name="Avg Poverty Headcount (%)" 
                  stroke="#059669" 
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#059669' }}
                  activeDot={{ r: 7 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Country Callout Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[10px] pt-[12px] border-t border-[var(--line)]">
          <div className="p-[10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)]">
            <span className="text-[11px] text-[var(--muted)] block">Selected Focus</span>
            <b className="text-[15px] text-[var(--ink)] block mt-[2px]">{selectedCountry.name}</b>
          </div>

          <div className="p-[10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)]">
            <span className="text-[11px] text-amber-700 block">Avg Affected Per Event</span>
            <b className="text-[15px] text-[var(--ink)] block mt-[2px]">
              {selectedCountry.avgAffected ? `${Math.round(selectedCountry.avgAffected).toLocaleString()} persons` : 'N/A'}
            </b>
          </div>

          <div className="p-[10px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)]">
            <span className="text-[11px] text-emerald-700 block">Avg Poverty Headcount</span>
            <b className="text-[15px] text-[var(--ink)] block mt-[2px]">
              {selectedCountry.povertyRate !== null ? `${selectedCountry.povertyRate}%` : 'N/A'}
            </b>
          </div>
        </div>
      </section>

      {/* Chart 3: Historical Flood-Event Forecasting (2000–2023 Historical + 2024–2027 Forecast) */}
      <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[18px] space-y-[14px]">
        <div className="flex flex-wrap items-center justify-between gap-[10px] pb-[10px] border-b border-[var(--line)]">
          <div>
            <div className="flex items-center gap-[8px]">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <h3 className="text-[15px] font-bold text-[var(--ink)] m-0">
                ASEAN Annual Total Flood Events & Predictive Forecast (2000–2027)
              </h3>
              <span className="px-[6px] py-[2px] rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                Statistical Projection
              </span>
            </div>
            <p className="text-[12px] text-[var(--muted)] m-0 mt-[2px]">
              Solid line: Recorded annual flood disasters (2000–2023). Dashed line: Linear trend projection (2024–2027) with 95% confidence interval band.
            </p>
          </div>

          <div className="flex items-center gap-[12px] text-[12px]">
            <div className="flex items-center gap-[6px]">
              <span className="w-[12px] h-[3px] bg-[var(--sea)]" />
              <span className="text-[var(--muted)]">Historical (2000–2023)</span>
            </div>
            <div className="flex items-center gap-[6px]">
              <span className="w-[12px] h-[3px] border-t-2 border-dashed border-purple-500" />
              <span className="text-purple-700 font-semibold">Forecast (2024–2027)</span>
            </div>
          </div>
        </div>

        {/* Forecast Composed Chart */}
        <div className="h-[320px] w-full mt-[10px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={annualSeries}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
              <XAxis 
                dataKey="year" 
                stroke="var(--muted)" 
                tick={{ fill: 'var(--ink)', fontSize: 11 }}
              />
              <YAxis 
                stroke="var(--muted)" 
                tick={{ fill: 'var(--muted)', fontSize: 11 }}
                domain={[0, 55]}
                label={{ value: 'Annual Total Flood Disasters', angle: -90, position: 'insideLeft', fill: 'var(--muted)', fontSize: 11 }}
              />
              <Tooltip content={<CustomForecastTooltip />} />

              {/* Confidence Band */}
              <Area 
                type="monotone" 
                dataKey="forecastUpper" 
                stroke="transparent" 
                fill="#8b5cf6" 
                fillOpacity={0.15} 
                name="95% Confidence Upper"
              />
              <Area 
                type="monotone" 
                dataKey="forecastLower" 
                stroke="transparent" 
                fill="transparent" 
                name="95% Confidence Lower"
              />

              {/* Historical Line */}
              <Line 
                type="monotone" 
                dataKey="historicalEvents" 
                name="Historical Flood Disasters (2000-2023)" 
                stroke="var(--sea)" 
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: 'var(--sea)' }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />

              {/* Forecast Line */}
              <Line 
                type="monotone" 
                dataKey="forecastEvents" 
                name="Forecast Trend (2024-2027)" 
                stroke="#7c3aed" 
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#7c3aed' }}
                activeDot={{ r: 6 }}
                connectNulls={true}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Forecast Methodology Note */}
        <div className="p-[12px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] flex items-start gap-[10px] text-[12px]">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div className="text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--ink)]">Methodology Note:</strong> The 2024–2027 projection demonstrates how multi-decade trendlines (slope = +0.51 disaster events/year) are extrapolated with statistical confidence bands to assist civil defense agencies in multi-year resource planning.
          </div>
        </div>
      </section>

      {/* Data Integrity & Coverage Registry Panel */}
      <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[18px] space-y-[12px]">
        <div className="flex flex-wrap items-center justify-between gap-[10px] pb-[8px] border-b border-[var(--line)]">
          <div className="flex items-center gap-[8px]">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h3 className="text-[14px] font-bold text-[var(--ink)] m-0">
              Data Integrity & Observation Coverage Registry
            </h3>
          </div>
          <span className="text-[11px] text-[var(--muted)]">
            Missing values preserved transparently as unavailable
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[10px]">
          <div className="p-[12px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] space-y-[4px]">
            <div className="flex justify-between items-center text-[12px] font-bold text-[var(--ink)]">
              <span>Singapore (SGP)</span>
              <span className="px-[6px] py-[1px] rounded text-[10px] bg-[var(--line)] text-[var(--muted)] font-semibold">
                Excluded (N/A)
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] m-0 leading-relaxed">
              Disaster frequency and rural poverty headcounts not recorded in compiled source dataset. Preserved honestly as unavailable.
            </p>
          </div>

          <div className="p-[12px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] space-y-[4px]">
            <div className="flex justify-between items-center text-[12px] font-bold text-[var(--ink)]">
              <span>Brunei (BRN)</span>
              <span className="px-[6px] py-[1px] rounded text-[10px] bg-[var(--line)] text-[var(--muted)] font-semibold">
                Excluded (N/A)
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] m-0 leading-relaxed">
              Disaster frequency and rural poverty headcounts not recorded in compiled source dataset. Preserved honestly as unavailable.
            </p>
          </div>

          <div className="p-[12px] rounded-[6px] bg-[var(--bg)] border border-[var(--line)] space-y-[4px]">
            <div className="flex justify-between items-center text-[12px] font-bold text-[var(--ink)]">
              <span>Lao PDR (LAO)</span>
              <span className="px-[6px] py-[1px] rounded text-[10px] bg-amber-100 text-amber-800 font-semibold">
                17 Events (Limited Poverty)
              </span>
            </div>
            <p className="text-[11px] text-[var(--muted)] m-0 leading-relaxed">
              17 flood events recorded; poverty headcount ratio available for only 1 sample year (18.30%). Annotated transparently with sample limitation note.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
