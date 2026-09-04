import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Map as MapIcon, 
  ShieldAlert, 
  MapPin, 
  Users, 
  Flame, 
  Percent, 
  ChevronRight,
  Info,
  X,
  Layers
} from 'lucide-react';
import { useEWS } from '../context/EWSContext';
import { ASEAN_COUNTRIES, CountryFloodData } from '../data/aseanData';
import { ASEAN_GEOJSON } from '../data/aseanGeoJson';

// The 8 ASEAN countries with sufficient historical and poverty data for prototype flood vulnerability analysis
const PROTOTYPE_COUNTRY_IDS = ['IDN', 'PHL', 'VNM', 'THA', 'MYS', 'MMR', 'KHM', 'TLS'];

const PROTOTYPE_MAP_COUNTRIES = ASEAN_COUNTRIES.filter(c => 
  PROTOTYPE_COUNTRY_IDS.includes(c.id)
);

// Helper component to handle view centering when selected country changes
const MapViewController: React.FC<{ selectedCountry: CountryFloodData }> = ({ selectedCountry }) => {
  const map = useMap();

  React.useEffect(() => {
    if (selectedCountry && selectedCountry.lat && selectedCountry.lng) {
      // Smoothly pan towards the selected country if it's one of the 8 monitored countries
      if (PROTOTYPE_COUNTRY_IDS.includes(selectedCountry.id)) {
        map.flyTo([selectedCountry.lat, selectedCountry.lng], Math.max(map.getZoom(), 4.5), {
          duration: 1.2
        });
      }
    }
  }, [selectedCountry, map]);

  return null;
};

export const RiskMapPage: React.FC = () => {
  const { 
    selectedCountry, 
    setSelectedCountryId, 
    threatAssessment,
    setActiveTab
  } = useEWS();

  const [hoveredCountry, setHoveredCountry] = useState<CountryFloodData | null>(null);

  // Choropleth color classification based on base flood risk score (0-100)
  const getChoroplethColor = (countryId: string, isSelected: boolean) => {
    if (isSelected) {
      return '#2563EB'; // Vibrant Royal Blue when selected
    }

    if (!PROTOTYPE_COUNTRY_IDS.includes(countryId)) {
      return '#E2E8F0'; // Neutral Slate for Brunei, Singapore, Laos (No Data / Out of Scope)
    }

    const countryData = ASEAN_COUNTRIES.find(c => c.id === countryId);
    if (!countryData || countryData.baseRiskScore === null) {
      return '#E2E8F0';
    }

    const score = countryData.baseRiskScore;
    if (score >= 80) return '#F87171'; // High Risk (Soft Red)
    if (score >= 65) return '#FB923C'; // Medium-High (Soft Orange)
    if (score >= 50) return '#FACC15'; // Moderate (Soft Yellow)
    return '#4ADE80'; // Baseline (<50) (Soft Green)
  };

  // GeoJSON styling function for GIS basemap
  const styleFeature = (feature: any) => {
    const countryId = feature.id || feature.properties?.iso_a3;
    const isSelected = selectedCountry.id === countryId;
    const isHovered = hoveredCountry?.id === countryId;
    const isMonitored = PROTOTYPE_COUNTRY_IDS.includes(countryId);

    const fillColor = getChoroplethColor(countryId, isSelected);

    return {
      fillColor: fillColor,
      weight: isSelected ? 2.5 : isHovered ? 2 : 1,
      opacity: 1,
      color: isSelected ? '#1D4ED8' : isHovered ? '#3B82F6' : '#94A3B8',
      dashArray: isMonitored ? '' : '3',
      fillOpacity: isSelected ? 0.85 : isMonitored ? 0.72 : 0.35
    };
  };

  // Event handlers for each GIS country polygon
  const onEachFeature = (feature: any, layer: L.Layer) => {
    const countryId = feature.id || feature.properties?.iso_a3;
    const countryData = ASEAN_COUNTRIES.find(c => c.id === countryId);
    const isMonitored = PROTOTYPE_COUNTRY_IDS.includes(countryId);

    layer.on({
      mouseover: (e) => {
        const target = e.target;
        if (countryData) {
          setHoveredCountry(countryData);
        }
        if (!selectedCountry || selectedCountry.id !== countryId) {
          target.setStyle({
            weight: 2,
            color: '#2563EB',
            fillOpacity: isMonitored ? 0.85 : 0.5
          });
        }
      },
      mouseout: (e) => {
        const target = e.target;
        setHoveredCountry(null);
        if (!selectedCountry || selectedCountry.id !== countryId) {
          target.setStyle(styleFeature(feature));
        }
      },
      click: () => {
        if (countryData) {
          setSelectedCountryId(countryData.id);
        }
      }
    });

    // Compact GIS tooltip on hover
    if (countryData) {
      const tooltipContent = `
        <div style="font-family: system-ui, sans-serif; font-size: 11px; padding: 2px 4px;">
          <div style="font-weight: 700; color: #0F172A; margin-bottom: 2px;">${countryData.name}</div>
          ${isMonitored 
            ? `<div style="color: #475569;">Vulnerability Score: <strong>${countryData.baseRiskScore}/100</strong> (${countryData.vulnerabilityLevel})</div>
               <div style="color: #64748B; font-size: 10px;">Click to view country intelligence</div>`
            : `<div style="color: #94A3B8; font-style: italic;">Excluded from risk prototype (limited/unavailable data)</div>`
          }
        </div>
      `;
      layer.bindTooltip(tooltipContent, {
        sticky: true,
        direction: 'auto',
        className: 'ews-gis-tooltip'
      });
    }
  };

  const activeDisplayCountry = hoveredCountry || selectedCountry;

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Simplified Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              Stage 2: Spatial Vulnerability
            </span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Based on countries with sufficient data for this prototype</span>
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 mt-1 tracking-tight">
            Regional Flood Vulnerability Map
          </h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            A regional GIS view of flood frequency, affected population, and poverty indicators.
          </p>
        </div>
      </div>

      {/* Main Map & Intelligence Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive GIS Map (Left 8 Cols) */}
        <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm flex flex-col justify-between">
          {/* Map Top Bar */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">
                Southeast Asia GIS Risk Choropleth
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/80">
              <Layers className="w-3 h-3 text-blue-600" />
              <span>OpenStreetMap GIS Basemap</span>
            </div>
          </div>

          {/* Interactive GIS Map Canvas Container */}
          <div className="w-full h-[380px] sm:h-[420px] relative rounded-xl border border-slate-200 overflow-hidden shadow-inner bg-slate-100 z-10">
            <MapContainer
              center={[4.5, 115.0]}
              zoom={4}
              minZoom={3}
              maxZoom={8}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%', background: '#F1F5F9' }}
              className="z-10"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors'
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />

              <GeoJSON
                key={selectedCountry.id + (hoveredCountry?.id || '')}
                data={ASEAN_GEOJSON}
                style={styleFeature}
                onEachFeature={onEachFeature}
              />

              <MapViewController selectedCountry={selectedCountry} />
            </MapContainer>

            {/* Hover Floating Mini Callout */}
            {hoveredCountry && (
              <div className="absolute top-3 right-3 z-20 pointer-events-none bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg border border-slate-200 shadow-md text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <MapPin className="w-3 h-3 text-blue-600" />
                  <span>{hoveredCountry.name}</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {PROTOTYPE_COUNTRY_IDS.includes(hoveredCountry.id) ? (
                    <>Vulnerability: <span className="font-semibold text-slate-800">{hoveredCountry.baseRiskScore}/100</span> ({hoveredCountry.vulnerabilityLevel})</>
                  ) : (
                    <span className="text-slate-400 italic">No risk score (limited data)</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Map Footer: Quick Select Buttons & Relevant Legend */}
          <div className="pt-3.5 mt-3 border-t border-slate-100 space-y-2.5">
            {/* Quick Country Selector Buttons (8 Analyzed Countries) */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-[11px] font-medium text-slate-500 mr-1">Focus Country:</span>
              {PROTOTYPE_MAP_COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCountryId(c.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                    selectedCountry.id === c.id
                      ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>

            {/* GIS Choropleth Legend */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-600 border-t border-slate-100/80">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#F87171] border border-red-300"></span> High Risk (≥80)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#FB923C] border border-orange-300"></span> Medium-High (65–79)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#FACC15] border border-yellow-300"></span> Moderate (50–64)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-sm bg-[#4ADE80] border border-emerald-300"></span> Baseline (&lt;50)
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-3 h-3 rounded-sm bg-slate-200 border border-slate-300 border-dashed"></span> Limited Data / Excluded
                </span>
              </div>

              <span className="text-[10px] text-slate-400 italic">
                Pan & scroll to zoom
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Inline Country Profile Summary (Directly Below GIS Map on < lg) */}
        <div className="lg:hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-3.5">
          {/* Mobile Profile Header */}
          <div className="pb-2.5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Selected Country Profile
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  !selectedCountry.dataAvailable
                    ? 'bg-slate-100 border-slate-200 text-slate-600'
                    : selectedCountry.vulnerabilityLevel.includes('High')
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                  {selectedCountry.vulnerabilityLevel}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                {selectedCountry.name}
                <span className="text-xs text-slate-500 font-normal">({selectedCountry.id})</span>
              </h3>
            </div>

            <div className="text-right text-xs text-slate-500">
              <span className="text-[10px] text-slate-400 block">Capital</span>
              <span className="font-semibold text-slate-800">{selectedCountry.capital}</span>
            </div>
          </div>

          {/* Mobile 2-Column Stats Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                <Flame className="w-3 h-3 text-red-500 shrink-0" />
                <span>Total Flood Events</span>
              </div>
              <p className="text-base font-bold text-slate-900 mt-1">
                {selectedCountry.events !== null ? `${selectedCountry.events}` : 'Data N/A'}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                <Users className="w-3 h-3 text-amber-500 shrink-0" />
                <span>Avg Affected / Flood</span>
              </div>
              <p className="text-base font-bold text-amber-700 mt-1 truncate">
                {selectedCountry.avgAffected ? `${Math.round(selectedCountry.avgAffected).toLocaleString()}` : 'Data N/A'}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                <Percent className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Avg Poverty Rate</span>
              </div>
              <p className="text-base font-bold text-emerald-700 mt-1">
                {selectedCountry.povertyRate !== null ? `${selectedCountry.povertyRate}%` : 'Data N/A'}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                <ShieldAlert className="w-3 h-3 text-blue-500 shrink-0" />
                <span>Current Threat</span>
              </div>
              <p className={`text-base font-bold mt-1 ${
                !selectedCountry.dataAvailable ? 'text-slate-400' : threatAssessment.color
              }`}>
                {!selectedCountry.dataAvailable ? 'Standby' : threatAssessment.level}
              </p>
            </div>
          </div>

          {/* Basin & Description */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
            <span className="text-[10px] font-semibold text-slate-400 block">
              Monitored River Basins:
            </span>
            <p className="text-slate-800 font-medium">{selectedCountry.basin}</p>
            <p className="text-slate-500 text-[11px] leading-relaxed pt-0.5">{selectedCountry.description}</p>
          </div>

          {/* Connected Sensor Stations */}
          {selectedCountry.riverStations.length > 0 && (
            <div>
              <span className="text-[10px] font-semibold text-slate-400 block mb-1">
                Connected Sensor Stations:
              </span>
              <div className="space-y-1">
                {selectedCountry.riverStations.map((station) => (
                  <div key={station.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="text-slate-700 font-medium truncate">{station.name}</span>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-600 shrink-0 ml-1">
                      {station.defaultWaterLevel}m / {station.dangerLevel}m
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={() => setActiveTab('live-monitoring')}
            className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors mt-2"
          >
            <span>Inspect Real-Time Sensors for {selectedCountry.name}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Country Intelligence Panel (Desktop 4 Cols) */}
        <div className="hidden lg:flex lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex-col justify-between">
          <div className="space-y-4">
            {/* Header */}
            <div className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-slate-400">
                  Country Profile
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                  !activeDisplayCountry.dataAvailable
                    ? 'bg-slate-100 border-slate-200 text-slate-600'
                    : activeDisplayCountry.vulnerabilityLevel.includes('High')
                    ? 'bg-red-50 border-red-200 text-red-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}>
                  {activeDisplayCountry.vulnerabilityLevel}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
                {activeDisplayCountry.name}
                <span className="text-xs text-slate-500 font-normal">({activeDisplayCountry.id})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Capital: <span className="text-slate-800 font-medium">{activeDisplayCountry.capital}</span>
              </p>
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                  <Flame className="w-3 h-3 text-red-500" />
                  <span>Total Flood Events</span>
                </div>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {activeDisplayCountry.events !== null ? activeDisplayCountry.events : 'Data N/A'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                  <Users className="w-3 h-3 text-amber-500" />
                  <span>Avg Affected / Flood</span>
                </div>
                <p className="text-lg font-bold text-amber-700 mt-1 truncate">
                  {activeDisplayCountry.avgAffected ? `${Math.round(activeDisplayCountry.avgAffected).toLocaleString()}` : 'Data N/A'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                  <Percent className="w-3 h-3 text-emerald-500" />
                  <span>Avg Poverty Rate</span>
                </div>
                <p className="text-lg font-bold text-emerald-700 mt-1">
                  {activeDisplayCountry.povertyRate !== null ? `${activeDisplayCountry.povertyRate}%` : 'Data N/A'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-1 text-[10px] font-medium text-slate-500">
                  <ShieldAlert className="w-3 h-3 text-blue-500" />
                  <span>Current Threat</span>
                </div>
                <p className={`text-lg font-bold mt-1 ${
                  !activeDisplayCountry.dataAvailable ? 'text-slate-400' : threatAssessment.color
                }`}>
                  {!activeDisplayCountry.dataAvailable ? 'Standby' : threatAssessment.level}
                </p>
              </div>
            </div>

            {/* Basin & Description */}
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1">
              <span className="text-[10px] font-medium text-slate-400 block">
                Monitored River Basins:
              </span>
              <p className="text-slate-800 font-medium">{activeDisplayCountry.basin}</p>
              <p className="text-slate-500 text-[11px] leading-relaxed pt-1">{activeDisplayCountry.description}</p>
            </div>

            {/* Active Telemetry Stations */}
            {activeDisplayCountry.riverStations.length > 0 && (
              <div>
                <span className="text-[10px] font-medium text-slate-400 block mb-1.5">
                  Connected Sensor Stations:
                </span>
                <div className="space-y-1.5">
                  {activeDisplayCountry.riverStations.map((station) => (
                    <div key={station.id} className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="text-slate-700 font-medium truncate">{station.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-blue-600 shrink-0">
                        {station.defaultWaterLevel}m / {station.dangerLevel}m
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('live-monitoring')}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <span>Inspect Real-Time Sensors for {activeDisplayCountry.name}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
