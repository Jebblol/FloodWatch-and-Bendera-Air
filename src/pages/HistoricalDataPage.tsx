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
  Sparkles
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

  // Fetch Firestore historicalData collection
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
            console.warn('Firestore historicalData collection returned 0 records; falling back to local dataset.');
          }
        }
      } catch (err: any) {
        console.error('Error fetching historicalData from Firestore, using local fallback:', err);
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

  // Compute Annual series from Firestore dynamically (2000-2023 historical + 2024-2027 linear forecast)
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
        const curr = yearMap.get(r.year)!;
        if (r.floodEvents !== null) curr.events += r.floodEvents;
        if (r.totalAffected !== null) curr.affected += r.totalAffected;
        if (r.totalDeaths !== null) curr.deaths += r.totalDeaths;
      }
    });

    const series = ANNUAL_FLOOD_SERIES.map(item => {
      if (item.type === 'historical' && yearMap.has(item.year)) {
        const yData = yearMap.get(item.year)!;
        return {
          ...item,
          historicalEvents: yData.events,
          totalAffected: yData.affected,
          totalDeaths: yData.deaths,
        };
      }
      return item;
    });

    return series;
  }, [firestoreData]);

  const barChartData = dynamicCountries
    .filter(c => c.events !== null)
    .sort((a, b) => (b.events || 0) - (a.events || 0))
    .map(c => ({
      id: c.id,
      name: c.name,
      events: c.events,
      avgAffected: c.avgAffected ? Math.round(c.avgAffected) : 0,
      povertyRate: c.povertyRate,
      isSelected: selectedCountry.id === c.id
    }));

  const comparisonData = dynamicCountries
    .filter(c => c.dataAvailable)
    .map(c => ({
      id: c.id,
      name: c.name,
      events: c.events,
      avgAffected: c.avgAffected ? Math.round(c.avgAffected) : null,
      povertyRate: c.povertyRate,
      isSelected: selectedCountry.id === c.id
    }));

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-lg text-xs space-y-1 z-50">
          <p className="font-bold text-slate-900">{data.name}</p>
          <p className="text-blue-600 font-medium">
            Total Flood Events: <strong>{data.events}</strong>
          </p>
          {data.avgAffected > 0 && (
            <p className="text-amber-600 font-medium">
              Avg Affected / Flood: <strong>{data.avgAffected.toLocaleString()}</strong>
            </p>
          )}
          {data.povertyRate !== null && (
            <p className="text-emerald-600 font-medium">
              Avg Poverty Rate: <strong>{data.povertyRate}%</strong>
            </p>
          )}
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
            Click to select country in EWS
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
        <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-lg text-xs space-y-1 z-50">
          <p className="font-bold text-slate-900 flex items-center gap-2">
            Year {label}
            {isForecast ? (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-50 text-purple-700 border border-purple-200">
                Forecast Demo
              </span>
            ) : (
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                Historical Record
              </span>
            )}
          </p>
          {point.historicalEvents !== null && (
            <p className="text-blue-600 font-medium">
              Recorded Events: <strong>{point.historicalEvents}</strong>
            </p>
          )}
          {point.forecastEvents !== null && (
            <>
              <p className="text-purple-700 font-medium">
                Projected Events: <strong>{point.forecastEvents}</strong>
              </p>
              {point.forecastLower !== null && (
                <p className="text-slate-500 text-[10px]">
                  95% Confidence Band: [{point.forecastLower} — {point.forecastUpper}]
                </p>
              )}
            </>
          )}
          {point.totalAffected && (
            <p className="text-slate-500 text-[10px]">
              Total Affected: {point.totalAffected.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
              Stage 1: Historical Intelligence
            </span>
            <span className="text-xs text-slate-500">
              {isUsingFirestore ? (
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Connected to Firestore (historicalData)
                </span>
              ) : (
                <span>Source: Compiled ASEAN Flood Dataset (2000–2023)</span>
              )}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            Historical Flood Analytics & Forecasting
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Empirical baseline disaster records feeding the vulnerability model. Exact historical values preserved with transparent missing-data handling.
          </p>
        </div>

        {/* Selected Country Badge */}
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm text-xs">
          <span className="text-slate-500">Highlighted Country:</span>
          <span className="font-bold text-blue-600">
            {selectedCountry.name}
          </span>
        </div>
      </div>

      {/* Loading Skeleton / Subtle Indicator */}
      {loading && (
        <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100 text-xs text-blue-800 flex items-center gap-2 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></div>
          <span>Loading empirical country-year records from Firestore...</span>
        </div>
      )}

      {/* Error Fallback Notification (Non-blocking) */}
      {error && !isUsingFirestore && (
        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Firestore query unavailable ({error}). Operating seamlessly on verified local dataset fallback.</span>
        </div>
      )}

      {/* Main Chart 1: Total Flood Events by Country (Full-width Horizontal Bar Chart) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              Total Flood Events by Country (2000–2023)
            </h3>
            <p className="text-xs text-slate-500">
              Frequency ranking across ASEAN member states. Click any bar to select country focus.
            </p>
          </div>
          <span className="text-[11px] text-slate-400">
            X: Total Flood Events | Y: Country
          </span>
        </div>

        {/* Recharts Horizontal Bar Chart */}
        <div className="h-80 w-full">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#94A3B8" 
                tick={{ fill: '#64748B', fontSize: 11 }}
                label={{ value: 'Total Flood Events (2000–2023)', position: 'insideBottom', offset: -10, fill: '#64748B', fontSize: 11 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#94A3B8" 
                tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }}
                width={90}
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
                    fill={entry.id === selectedCountry.id ? '#2563EB' : '#93C5FD'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-600"></span>
              <span>Active Selected Country</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-200"></span>
              <span>Other Member States</span>
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Total Recorded: 584 Events
          </span>
        </div>
      </div>

      {/* Data Integrity & Coverage Panel (Dedicated section below primary frequency chart) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Data Integrity & Coverage Registry
              </h3>
              <p className="text-xs text-slate-500">
                Strict data integrity standards: missing observations are preserved as unavailable rather than zeroed or fabricated.
              </p>
            </div>
          </div>

          <div className="p-2 px-3 rounded-lg bg-blue-50/80 border border-blue-100 text-[11px] text-blue-900 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span>Formula: <code className="font-semibold text-blue-950">Avg Affected = Total Affected / Total Flood Events</code></span>
          </div>
        </div>

        {/* 3 Coverage / Exception Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Singapore */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
              <span>Singapore (SGP)</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600 font-medium">
                Data unavailable
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Disaster frequency and poverty headcounts not recorded in compiled source dataset. Treated explicitly as unavailable.
            </p>
          </div>

          {/* Brunei */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
              <span>Brunei Darussalam (BRN)</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-200 text-slate-600 font-medium">
                Data unavailable
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Disaster frequency and poverty headcounts not recorded in compiled source dataset. Treated explicitly as unavailable.
            </p>
          </div>

          {/* Lao PDR */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
              <span>Lao PDR (LAO)</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-medium">
                17 Events (Limited Poverty)
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              17 flood events recorded; poverty headcount ratio available for only 1 sample year (18.30%). Annotated with sample limitation note.
            </p>
          </div>
        </div>
      </div>

      {/* Chart 2: Average Affected Per Flood vs Average Poverty Rate (Comparison Chart) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              Average Affected Population Per Flood vs. Average Poverty Rate (%)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Dual-scale socio-economic vulnerability analysis by country. Comparing population exposure against poverty headcount.
            </p>
          </div>

          {/* View Filter Switcher */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('combined')}
              className={`px-3 py-1 rounded-md transition-colors font-medium ${
                viewMode === 'combined' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Combined View
            </button>
            <button
              onClick={() => setViewMode('affected')}
              className={`px-3 py-1 rounded-md transition-colors font-medium ${
                viewMode === 'affected' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Avg Affected Only
            </button>
            <button
              onClick={() => setViewMode('poverty')}
              className={`px-3 py-1 rounded-md transition-colors font-medium ${
                viewMode === 'poverty' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Poverty Rate Only
            </button>
          </div>
        </div>

        {/* Dual Axis / Comparison Chart */}
        <div className="h-80 w-full mt-4">
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
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis 
                dataKey="name" 
                stroke="#94A3B8" 
                tick={{ fill: '#334155', fontSize: 11 }}
              />
              
              {/* Left Y Axis: Avg Affected Population */}
              {(viewMode === 'combined' || viewMode === 'affected') && (
                <YAxis 
                  yAxisId="left"
                  stroke="#D97706"
                  tick={{ fill: '#D97706', fontSize: 11 }}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                  label={{ value: 'Avg Affected Per Flood (Persons)', angle: -90, position: 'insideLeft', fill: '#D97706', fontSize: 11 }}
                />
              )}

              {/* Right Y Axis: Poverty Rate (%) */}
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
                  name="Avg Affected Per Flood (Persons)" 
                  fill="#FBBF24" 
                  radius={[3, 3, 0, 0]}
                  cursor="pointer"
                >
                  {comparisonData.map((entry) => (
                    <Cell 
                      key={`comp-cell-${entry.id}`} 
                      fill={entry.id === selectedCountry.id ? '#D97706' : '#FCD34D'}
                    />
                  ))}
                </Bar>
              )}

              {(viewMode === 'combined' || viewMode === 'poverty') && (
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey="povertyRate" 
                  name="Avg Poverty Rate (%)" 
                  stroke="#059669" 
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#059669' }}
                  activeDot={{ r: 7 }}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Country Data Callout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-3 border-t border-slate-100">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-medium text-slate-400">Selected Focus</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">{selectedCountry.name}</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/80">
            <span className="text-[10px] font-medium text-amber-700">Avg Affected Per Flood</span>
            <p className="text-sm font-bold text-amber-900 mt-0.5">
              {selectedCountry.avgAffected ? `${Math.round(selectedCountry.avgAffected).toLocaleString()} persons` : 'N/A'}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/80">
            <span className="text-[10px] font-medium text-emerald-700">Avg Poverty Rate</span>
            <p className="text-sm font-bold text-emerald-900 mt-0.5">
              {selectedCountry.povertyRate !== null ? `${selectedCountry.povertyRate}% (bounded ≤100%)` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Chart 3: Historical Flood-Event Forecasting (2000–2023 Historical + 2024–2027 Forecast) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-bold text-slate-900">
                ASEAN Annual Total Flood Events & Predictive Forecast (2000–2027)
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                Conceptual Demonstration
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Solid line: Recorded annual flood disasters (2000–2023). Dashed line: Linear trend projection (2024–2027) with 95% confidence interval band.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-blue-600"></span>
              <span className="text-slate-600">Historical (2000–2023)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-purple-500"></span>
              <span className="text-purple-700 font-medium">Forecast (2024–2027)</span>
            </div>
          </div>
        </div>

        {/* Forecast Chart */}
        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={annualSeries}
              margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis 
                dataKey="year" 
                stroke="#94A3B8" 
                tick={{ fill: '#334155', fontSize: 11 }}
              />
              <YAxis 
                stroke="#94A3B8" 
                tick={{ fill: '#64748B', fontSize: 11 }}
                domain={[0, 55]}
                label={{ value: 'Annual Total Flood Disasters', angle: -90, position: 'insideLeft', fill: '#64748B', fontSize: 11 }}
              />
              <Tooltip content={<CustomForecastTooltip />} />

              {/* Confidence Band */}
              <Area 
                type="monotone" 
                dataKey="forecastUpper" 
                stroke="transparent" 
                fill="#8B5CF6" 
                fillOpacity={0.12} 
                name="95% Confidence Upper"
              />
              <Area 
                type="monotone" 
                dataKey="forecastLower" 
                stroke="transparent" 
                fill="#FFFFFF" 
                fillOpacity={0.9} 
                name="95% Confidence Lower"
              />

              {/* Historical Line (Solid Blue) */}
              <Line 
                type="monotone" 
                dataKey="historicalEvents" 
                name="Historical Flood Disasters (2000-2023)" 
                stroke="#2563EB" 
                strokeWidth={2.5}
                dot={{ r: 3.5, fill: '#2563EB' }}
                activeDot={{ r: 6 }}
                connectNulls={false}
              />

              {/* Forecast Line (Dashed Purple) */}
              <Line 
                type="monotone" 
                dataKey="forecastEvents" 
                name="Forecast Trend (2024-2027)" 
                stroke="#7C3AED" 
                strokeWidth={2.5}
                strokeDasharray="5 5"
                dot={{ r: 4, fill: '#7C3AED' }}
                activeDot={{ r: 6 }}
                connectNulls={true}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Prototype Disclaimer */}
        <div className="mt-3 p-3.5 rounded-lg bg-purple-50/70 border border-purple-100 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div className="text-xs text-purple-900 leading-relaxed">
            <strong className="text-purple-950">Prototype Forecast Disclaimer:</strong> The 2024–2027 forecast illustrates how the ASEAN EWS utilizes long-term statistical trends (slope = +0.51 events/year) to anticipate future flood activity for disaster preparedness planning. This is a conceptual demonstration and not a guaranteed meteorological prediction.
          </div>
        </div>
      </div>
    </div>
  );
};
