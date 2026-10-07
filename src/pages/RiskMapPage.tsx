import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  GeoJSON, 
  Circle, 
  CircleMarker, 
  Tooltip, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  ShieldAlert, 
  MapPin, 
  Flame, 
  Layers,
  CloudRain,
  Waves,
  History,
  Satellite,
  Maximize2,
  Gauge,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Activity
} from 'lucide-react';
import { useEWS } from '../context/EWSContext';
import { ASEAN_COUNTRIES, CountryFloodData, RiverStation } from '../data/aseanData';
import { ASEAN_GEOJSON } from '../data/aseanGeoJson';
// Map baseRiskScore to the standard hazard tiers
export const getHazardTier = (score: number | null) => {
  if (score === null) {
    return {
      tier: 'NO_DATA' as const,
      label: 'Limited Data / Excluded',
      fillColor: '#94A3B8',
      badgeBg: 'bg-slate-100 text-slate-600 border-slate-200'
    };
  }
  if (score >= 80) {
    return {
      tier: 'CRITICAL' as const,
      label: 'Critical',
      fillColor: 'var(--crit)',
      badgeBg: 'bg-red-50 text-red-800 border-red-200'
    };
  }
  if (score >= 65) {
    return {
      tier: 'HIGH' as const,
      label: 'High',
      fillColor: 'var(--high)',
      badgeBg: 'bg-orange-50 text-orange-800 border-orange-200'
    };
  }
  if (score >= 50) {
    return {
      tier: 'MODERATE' as const,
      label: 'Moderate',
      fillColor: 'var(--mod)',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200'
    };
  }
  return {
    tier: 'LOW' as const,
    label: 'Low',
    fillColor: 'var(--low)',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200'
  };
};
export const STATION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Indonesia
  'IDN-STA-01': { lat: -6.985, lng: 107.625 }, // Citarum River - Dayeuhkolot Station, Bandung
  'IDN-STA-02': { lat: -7.562, lng: 110.855 }, // Bengawan Solo - Jurug Hydro Station, Surakarta
  // Philippines
  'PHL-STA-01': { lat: 14.633, lng: 121.096 }, // Marikina River - Sto. Niño Station, Metro Manila
  'PHL-STA-02': { lat: 17.613, lng: 121.727 }, // Cagayan River - Tuguegarao Station, Cagayan
  // Viet Nam
  'VNM-STA-01': { lat: 10.793, lng: 105.244 }, // Mekong Delta - Tan Chau Station, An Giang
  'VNM-STA-02': { lat: 21.042, lng: 105.858 }, // Red River - Hanoi Hydro Station, Long Bien
  // Thailand
  'THA-STA-01': { lat: 15.696, lng: 100.125 }, // Chao Phraya - C.2 Nakhon Sawan
  'THA-STA-02': { lat: 14.212, lng: 100.498 }, // Chao Phraya - C.29A Bang Sai, Ayutthaya
  // Malaysia
  'MYS-STA-01': { lat: 5.533, lng: 102.200 },  // Kelantan River - Tangga Krai
  'MYS-STA-02': { lat: 3.518, lng: 102.748 },  // Pahang River - Lubuk Paku
  // Myanmar
  'MMR-STA-01': { lat: 21.975, lng: 96.083 },  // Ayeyarwady River - Mandalay
  'MMR-STA-02': { lat: 17.335, lng: 96.481 },  // Bago River - Bago Station
  // Cambodia
  'KHM-STA-01': { lat: 11.815, lng: 104.805 }, // Tonle Sap - Prek Kdam Station
  'KHM-STA-02': { lat: 11.558, lng: 104.935 }, // Mekong - Chaktomuk Station, Phnom Penh
  // Lao PDR
  'LAO-STA-01': { lat: 17.963, lng: 102.613 }, // Mekong River - Vientiane Hydro Station
  'LAO-STA-02': { lat: 18.925, lng: 102.448 }, // Nam Song - Vang Vieng Station
};

const PROTOTYPE_COUNTRY_IDS = ['IDN', 'PHL', 'VNM', 'THA', 'MYS', 'MMR', 'KHM', 'LAO', 'TLS'];

type HeatmapLayerType = 'composite' | 'rainfall' | 'river' | 'history';
type BasemapType = 'osm' | 'satellite' | 'dark';

// Basemap Tile Providers
const BASEMAP_TILES: Record<BasemapType, { url: string; attribution: string }> = {
  osm: {
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Maxar, Earthstar Geographics'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB & OpenStreetMap'
  }
};

// Map View Controller for animated flight
const MapViewController: React.FC<{ 
  targetCoords: [number, number] | null; 
  zoomLevel?: number;
}> = ({ targetCoords, zoomLevel }) => {
  const map = useMap();
  useEffect(() => {
    if (targetCoords) {
      map.flyTo(targetCoords, zoomLevel || 6, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [targetCoords, zoomLevel, map]);
  return null;
};

export const RiskMapPage: React.FC = () => {
  const {
    selectedCountry,
    setSelectedCountryId,
    selectedStation,
    setSelectedStationId,
    simulatedRainfall,
    setSimulatedRainfall,
    simulatedWaterLevel,
    setSimulatedWaterLevel,
    threatAssessment,
    setActiveTab
  } = useEWS();

  const [activeHeatmapLayer, setActiveHeatmapLayer] = useState<HeatmapLayerType>('composite');
  const [activeBasemap, setActiveBasemap] = useState<BasemapType>('osm');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'warning_danger' | 'danger_only'>('all');
  const [hoveredCountry, setHoveredCountry] = useState<CountryFloodData | null>(null);
  const [hoveredStation, setHoveredStation] = useState<RiverStation | null>(null);

  // Active target for map camera
  const mapTarget = useMemo<[number, number] | null>(() => {
    if (selectedStation && STATION_COORDINATES[selectedStation.id]) {
      const coords = STATION_COORDINATES[selectedStation.id];
      return [coords.lat, coords.lng];
    }
    if (selectedCountry && selectedCountry.lat && selectedCountry.lng) {
      return [selectedCountry.lat, selectedCountry.lng];
    }
    return [4.5, 115.0];
  }, [selectedCountry, selectedStation]);

  // Aggregate all stations across monitored countries
  const allStations = useMemo(() => {
    const list: Array<{
      station: RiverStation;
      country: CountryFloodData;
      lat: number;
      lng: number;
      waterLevel: number;
      rainfall: number;
      severity: 'NORMAL' | 'ALERT' | 'WARNING' | 'DANGER';
      stageRatio: number;
    }> = [];

    ASEAN_COUNTRIES.forEach(country => {
      country.riverStations.forEach(st => {
        const coords = STATION_COORDINATES[st.id] || { lat: country.lat, lng: country.lng };
        // If this station is currently active in context, use the dynamic simulator value
        const isCurrentSelected = selectedStation?.id === st.id;
        const currentWater = isCurrentSelected ? simulatedWaterLevel : st.defaultWaterLevel;
        const currentRain = isCurrentSelected ? simulatedRainfall : st.defaultRainfall;

        let severity: 'NORMAL' | 'ALERT' | 'WARNING' | 'DANGER' = 'NORMAL';
        if (currentWater >= st.dangerLevel) severity = 'DANGER';
        else if (currentWater >= st.warningLevel) severity = 'WARNING';
        else if (currentWater >= st.alertLevel) severity = 'ALERT';

        const stageRatio = currentWater / st.dangerLevel;

        list.push({
          station: st,
          country,
          lat: coords.lat,
          lng: coords.lng,
          waterLevel: currentWater,
          rainfall: currentRain,
          severity,
          stageRatio
        });
      });
    });

    return list;
  }, [selectedStation, simulatedWaterLevel, simulatedRainfall]);

  // Filter stations based on severity filter
  const filteredStations = useMemo(() => {
    if (severityFilter === 'danger_only') {
      return allStations.filter(s => s.severity === 'DANGER');
    }
    if (severityFilter === 'warning_danger') {
      return allStations.filter(s => s.severity === 'DANGER' || s.severity === 'WARNING');
    }
    return allStations;
  }, [allStations, severityFilter]);

  // Dynamic Country Polygon Styling based on active heatmap layer
  const getCountryFillColor = (countryId: string) => {
    const country = ASEAN_COUNTRIES.find(c => c.id === countryId);
    if (!country || !country.dataAvailable) return '#94A3B8';

    const isCurrent = selectedCountry.id === countryId;

    if (activeHeatmapLayer === 'composite') {
      // In composite mode, the currently selected country dynamically reflects live simulation score!
      const score = isCurrent ? threatAssessment.score : (country.baseRiskScore || 50);
      if (score >= 80) return 'var(--crit)';
      if (score >= 65) return 'var(--high)';
      if (score >= 45) return 'var(--mod)';
      return 'var(--low)';
    }

    if (activeHeatmapLayer === 'rainfall') {
      const rain = isCurrent ? simulatedRainfall : (country.riverStations[0]?.defaultRainfall || 30);
      if (rain >= 100) return 'var(--crit)';
      if (rain >= 70) return 'var(--high)';
      if (rain >= 40) return 'var(--mod)';
      return 'var(--low)';
    }

    if (activeHeatmapLayer === 'river') {
      const st = country.riverStations[0];
      const water = isCurrent ? simulatedWaterLevel : (st?.defaultWaterLevel || 3);
      const danger = st?.dangerLevel || 6;
      const ratio = water / danger;
      if (ratio >= 1.0) return 'var(--crit)';
      if (ratio >= 0.85) return 'var(--high)';
      if (ratio >= 0.65) return 'var(--mod)';
      return 'var(--low)';
    }

    // Historical layer
    const events = country.events || 0;
    if (events >= 150) return 'var(--crit)';
    if (events >= 80) return 'var(--high)';
    if (events >= 30) return 'var(--mod)';
    return 'var(--low)';
  };

  const styleFeature = (feature: any) => {
    const countryId = feature.id || feature.properties?.iso_a3;
    const isSelected = selectedCountry?.id === countryId;
    const isHovered = hoveredCountry?.id === countryId;
    const isMonitored = PROTOTYPE_COUNTRY_IDS.includes(countryId);
    const fillColor = getCountryFillColor(countryId);

    return {
      fillColor,
      weight: isSelected ? 3.5 : isHovered ? 2.5 : 1.2,
      opacity: 1,
      color: isSelected ? '#0b5c8a' : isHovered ? '#2563eb' : 'var(--line)',
      dashArray: isMonitored ? '' : '3',
      fillOpacity: isSelected ? 0.65 : isHovered ? 0.55 : isMonitored ? 0.40 : 0.15
    };
  };

  const onEachFeature = (feature: any, layer: L.Layer) => {
    const countryId = feature.id || feature.properties?.iso_a3;
    const countryData = ASEAN_COUNTRIES.find(c => c.id === countryId);

    layer.on({
      mouseover: () => {
        if (countryData) setHoveredCountry(countryData);
      },
      mouseout: () => {
        setHoveredCountry(null);
      },
      click: () => {
        if (countryData && countryData.dataAvailable) {
          setSelectedCountryId(countryData.id);
        }
      }
    });

    if (countryData) {
      const score = countryData.id === selectedCountry.id ? threatAssessment.score : (countryData.baseRiskScore || 'N/A');
      const tooltipHtml = `
        <div style="font-family: inherit; font-size: 13px; padding: 2px 4px; color: #0f2233;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 2px;">
            ${countryData.name} (${countryData.id})
          </div>
          <div style="color: #4d6073; font-size: 12px;">
            Risk Score: <strong>${score}/100</strong>
          </div>
          <div style="color: #4d6073; font-size: 12px;">
            Basin: ${countryData.basin ? countryData.basin.split(' ')[0] : 'N/A'}
          </div>
          <div style="font-size: 11px; color: #0b5c8a; font-weight: 600; margin-top: 4px;">
            Click to select country &rarr;
          </div>
        </div>
      `;
      layer.bindTooltip(tooltipHtml, { sticky: true, className: 'ews-gis-tooltip' });
    }
  };

  // Station severity badge helper
  const getSeverityColor = (sev: 'NORMAL' | 'ALERT' | 'WARNING' | 'DANGER') => {
    switch (sev) {
      case 'DANGER': return 'var(--crit)';
      case 'WARNING': return 'var(--high)';
      case 'ALERT': return 'var(--mod)';
      case 'NORMAL': default: return 'var(--low)';
    }
  };

  return (
    <div className="space-y-[20px] w-full max-w-[1200px]">
      {/* Top Controls Header */}
      <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <h2 className="text-[18px] font-bold text-[var(--ink)] m-0 flex items-center gap-[8px]">
            <Layers className="w-5 h-5 text-[var(--sea)]" />
            Interactive Basin Flood Hazard & Risk Heatmap
          </h2>
          <p className="text-[13px] text-[var(--muted)] m-0 mt-[2px]">
            Multi-layer geospatial telemetry synthesizing real-time hydraulic sensors, storm radar, and historical disaster exposure.
          </p>
        </div>

        {/* Heatmap Layer Selectors */}
        <div className="flex items-center gap-[6px] bg-[var(--bg)] p-[4px] rounded-[6px] border border-[var(--line)] flex-wrap">
          <button
            onClick={() => setActiveHeatmapLayer('composite')}
            className={`px-[10px] py-[6px] rounded-[4px] text-[12px] font-semibold flex items-center gap-[6px] transition-colors ${
              activeHeatmapLayer === 'composite'
                ? 'bg-[var(--panel)] text-[var(--sea)] shadow-xs border border-[var(--line)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Composite Risk
          </button>

          <button
            onClick={() => setActiveHeatmapLayer('rainfall')}
            className={`px-[10px] py-[6px] rounded-[4px] text-[12px] font-semibold flex items-center gap-[6px] transition-colors ${
              activeHeatmapLayer === 'rainfall'
                ? 'bg-[var(--panel)] text-[var(--sea)] shadow-xs border border-[var(--line)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Rainfall Radar
          </button>

          <button
            onClick={() => setActiveHeatmapLayer('river')}
            className={`px-[10px] py-[6px] rounded-[4px] text-[12px] font-semibold flex items-center gap-[6px] transition-colors ${
              activeHeatmapLayer === 'river'
                ? 'bg-[var(--panel)] text-[var(--sea)] shadow-xs border border-[var(--line)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            River Stage
          </button>

          <button
            onClick={() => setActiveHeatmapLayer('history')}
            className={`px-[10px] py-[6px] rounded-[4px] text-[12px] font-semibold flex items-center gap-[6px] transition-colors ${
              activeHeatmapLayer === 'history'
                ? 'bg-[var(--panel)] text-[var(--sea)] shadow-xs border border-[var(--line)]'
                : 'text-[var(--muted)] hover:text-[var(--ink)]'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            Disaster History
          </button>
        </div>
      </div>

      {/* Main Map + Side Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-[20px]">
        {/* Left Column: Interactive Leaflet Heatmap Canvas */}
        <div className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] flex flex-col justify-between">
          {/* Map Top Bar Toolbar */}
          <div className="flex items-center justify-between gap-[10px] mb-[12px] flex-wrap">
            {/* Basemap Switcher */}
            <div className="flex items-center gap-[6px] text-[12px] text-[var(--muted)]">
              <span>Basemap:</span>
              <button
                onClick={() => setActiveBasemap('osm')}
                className={`px-[8px] py-[4px] rounded-[4px] border text-[11px] font-medium ${
                  activeBasemap === 'osm'
                    ? 'bg-[var(--sea)] text-white border-[var(--sea)]'
                    : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setActiveBasemap('satellite')}
                className={`px-[8px] py-[4px] rounded-[4px] border text-[11px] font-medium flex items-center gap-[3px] ${
                  activeBasemap === 'satellite'
                    ? 'bg-[var(--sea)] text-white border-[var(--sea)]'
                    : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]'
                }`}
              >
                <Satellite className="w-3 h-3" />
                Satellite
              </button>
              <button
                onClick={() => setActiveBasemap('dark')}
                className={`px-[8px] py-[4px] rounded-[4px] border text-[11px] font-medium ${
                  activeBasemap === 'dark'
                    ? 'bg-[var(--sea)] text-white border-[var(--sea)]'
                    : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]'
                }`}
              >
                Dark
              </button>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-[6px] text-[12px] text-[var(--muted)]">
              <span>Filter:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="bg-[var(--bg)] border border-[var(--line)] rounded-[4px] px-[8px] py-[3px] text-[11px] text-[var(--ink)] outline-none cursor-pointer"
              >
                <option value="all">All 16 Stations</option>
                <option value="warning_danger">Warning & Danger Only</option>
                <option value="danger_only">Danger Hotspots Only</option>
              </select>
            </div>
          </div>

          {/* Leaflet Map Canvas */}
          <div className="w-full h-[340px] sm:h-[420px] md:h-[480px] rounded-[6px] border border-[var(--line)] overflow-hidden relative z-0 shadow-inner">
            <MapContainer
              center={[4.5, 115.0]}
              zoom={4}
              minZoom={3}
              maxZoom={12}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '100%', background: 'var(--bg)' }}
            >
              {/* Basemap Tiles */}
              <TileLayer
                attribution={BASEMAP_TILES[activeBasemap].attribution}
                url={BASEMAP_TILES[activeBasemap].url}
              />

              {/* GeoJSON Regional Choropleth Boundaries */}
              <GeoJSON
                key={`${activeHeatmapLayer}-${selectedCountry.id}-${threatAssessment.score}-${activeBasemap}`}
                data={ASEAN_GEOJSON}
                style={styleFeature}
                onEachFeature={onEachFeature}
              />

              {/* FUNCTIONAL HEATMAP LAYER: Dynamic Thermal / Radial Hazard Circles */}
              {filteredStations.map(({ station, country, lat, lng, waterLevel, rainfall, severity, stageRatio }) => {
                const isSelected = selectedStation?.id === station.id;
                const heatColor = getSeverityColor(severity);

                // Radius calculation in meters based on active mode
                let baseRadius = 35000; // 35km base
                if (activeHeatmapLayer === 'rainfall') {
                  baseRadius = Math.max(25000, rainfall * 800);
                } else if (activeHeatmapLayer === 'river') {
                  baseRadius = Math.max(20000, stageRatio * 45000);
                } else if (activeHeatmapLayer === 'composite') {
                  baseRadius = Math.max(30000, (country.id === selectedCountry.id ? threatAssessment.score : (country.baseRiskScore || 50)) * 600);
                }

                return (
                  <React.Fragment key={station.id}>
                    {/* Outer Heat Halo (Dissipation Ring) */}
                    <Circle
                      center={[lat, lng]}
                      radius={baseRadius * 1.6}
                      pathOptions={{
                        color: heatColor,
                        fillColor: heatColor,
                        fillOpacity: isSelected ? 0.25 : 0.12,
                        weight: 0
                      }}
                    />

                    {/* Mid Heat Concentration Ring */}
                    <Circle
                      center={[lat, lng]}
                      radius={baseRadius}
                      pathOptions={{
                        color: heatColor,
                        fillColor: heatColor,
                        fillOpacity: isSelected ? 0.45 : 0.28,
                        weight: 1,
                        opacity: 0.6
                      }}
                    />

                    {/* Core Station Sensor Marker */}
                    <CircleMarker
                      center={[lat, lng]}
                      radius={isSelected ? 9 : 6}
                      pathOptions={{
                        color: '#ffffff',
                        fillColor: heatColor,
                        fillOpacity: 1,
                        weight: isSelected ? 3 : 2
                      }}
                      eventHandlers={{
                        click: () => {
                          setSelectedCountryId(country.id);
                          setSelectedStationId(station.id);
                        },
                        mouseover: () => setHoveredStation(station),
                        mouseout: () => setHoveredStation(null)
                      }}
                    >
                      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                        <div className="text-[12px] p-[2px]">
                          <strong className="block text-[13px]">{station.name}</strong>
                          <span className="block text-[var(--muted)]">{country.name} · {station.location}</span>
                          <div className="mt-1 pt-1 border-t border-[var(--line)] flex items-center justify-between gap-3">
                            <span>Stage: <strong>{waterLevel.toFixed(1)}m</strong> / {station.dangerLevel}m</span>
                            <span style={{ color: heatColor, fontWeight: 700 }}>{severity}</span>
                          </div>
                        </div>
                      </Tooltip>
                    </CircleMarker>
                  </React.Fragment>
                );
              })}

              {/* Smooth Camera Flight */}
              <MapViewController targetCoords={mapTarget} zoomLevel={selectedStation ? 7 : 5} />
            </MapContainer>

            {/* Floating Live Legend On Top of Map */}
            <div className="absolute top-3 left-12 sm:top-auto sm:left-3 sm:bottom-3 z-[400] max-w-[calc(100%-110px)] sm:max-w-none bg-[var(--panel)]/95 backdrop-blur-xs border border-[var(--line)] rounded-[6px] p-[6px_10px] sm:p-[10px_14px] text-[11px] sm:text-[12px] shadow-sm">
              <div className="font-bold text-[var(--ink)] mb-[3px] flex items-center justify-between gap-2">
                <span className="truncate">
                  {activeHeatmapLayer === 'composite' && 'Composite Risk Intensity'}
                  {activeHeatmapLayer === 'rainfall' && 'Rainfall Radar (mm/h)'}
                  {activeHeatmapLayer === 'river' && 'River Stage vs Bankfull'}
                  {activeHeatmapLayer === 'history' && 'Historical Disaster Exposure'}
                </span>
                <span className="text-[9px] sm:text-[10px] text-[var(--muted)] font-normal shrink-0 hidden sm:inline">Active Layer</span>
              </div>

              <div className="flex items-center gap-[6px] sm:gap-[12px] flex-wrap text-[10px] sm:text-[12px]">
                <span className="flex items-center gap-[3px]">
                  <i className="w-[7px] h-[7px] sm:w-[10px] sm:h-[10px] rounded-full inline-block" style={{ background: 'var(--low)' }} />
                  Low
                </span>
                <span className="flex items-center gap-[3px]">
                  <i className="w-[7px] h-[7px] sm:w-[10px] sm:h-[10px] rounded-full inline-block" style={{ background: 'var(--mod)' }} />
                  Alert
                </span>
                <span className="flex items-center gap-[3px]">
                  <i className="w-[7px] h-[7px] sm:w-[10px] sm:h-[10px] rounded-full inline-block" style={{ background: 'var(--high)' }} />
                  Warning
                </span>
                <span className="flex items-center gap-[3px]">
                  <i className="w-[7px] h-[7px] sm:w-[10px] sm:h-[10px] rounded-full inline-block" style={{ background: 'var(--crit)' }} />
                  Danger
                </span>
              </div>
            </div>

            {/* Quick Map Pan Center Button */}
            <button
              onClick={() => {
                if (selectedCountry && selectedCountry.lat) {
                  // Re-center
                }
              }}
              title="Reset View to ASEAN"
              className="absolute top-3 right-3 z-[400] bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)] p-[6px] rounded-[6px] shadow-xs hover:bg-[var(--bg)] cursor-pointer"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Focus Station Chips */}
          <div className="mt-[12px] pt-[10px] border-t border-[var(--line)]">
            <span className="text-[11px] font-semibold text-[var(--muted)] block mb-[6px]">
              Active Basin River Stations ({selectedCountry.name}):
            </span>
            <div className="flex flex-wrap gap-[6px]">
              {selectedCountry.riverStations.map((st) => {
                const isSelected = selectedStation?.id === st.id;
                const water = isSelected ? simulatedWaterLevel : st.defaultWaterLevel;
                const isDanger = water >= st.dangerLevel;
                const isWarning = water >= st.warningLevel;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStationId(st.id)}
                    className={`px-[10px] py-[6px] rounded-[6px] text-[12px] font-medium border flex items-center gap-[6px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[var(--sea)] text-white border-[var(--sea)] font-semibold shadow-xs'
                        : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--sea)_10%,transparent)]'
                    }`}
                  >
                    <span 
                      className="w-[8px] h-[8px] rounded-full" 
                      style={{ background: isDanger ? 'var(--crit)' : isWarning ? 'var(--high)' : 'var(--low)' }}
                    />
                    <span>{st.name.split(' - ')[0]}</span>
                    <small className="opacity-80">({water.toFixed(1)}m)</small>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Station Telemetry, Live Hydrograph & Simulation Controls */}
        <div className="space-y-[20px]">
          {/* Active Station Telemetry Card */}
          <section className="bg-[var(--panel)] border border-[var(--line)] rounded-[8px] p-[16px] space-y-[14px]">
            <div className="flex items-start justify-between gap-[10px]">
              <div>
                <span className="text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider block">
                  Station Hydro Telemetry
                </span>
                <h3 className="text-[16px] font-bold text-[var(--ink)] m-0 mt-[2px]">
                  {selectedStation ? selectedStation.name : 'No Station Selected'}
                </h3>
                <span className="text-[12px] text-[var(--muted)] block">
                  {selectedStation ? selectedStation.location : ''} · {selectedCountry.name}
                </span>
              </div>

              <span 
                className="px-[8px] py-[4px] rounded-[4px] text-[11px] font-bold text-white shrink-0"
                style={{
                  background: (simulatedWaterLevel >= (selectedStation?.dangerLevel || 6.8)) ? 'var(--crit)' :
                              (simulatedWaterLevel >= (selectedStation?.warningLevel || 5.5)) ? 'var(--high)' :
                              (simulatedWaterLevel >= (selectedStation?.alertLevel || 4.0)) ? 'var(--mod)' : 'var(--low)'
                }}
              >
                {(simulatedWaterLevel >= (selectedStation?.dangerLevel || 6.8)) ? 'DANGER' :
                 (simulatedWaterLevel >= (selectedStation?.warningLevel || 5.5)) ? 'WARNING' :
                 (simulatedWaterLevel >= (selectedStation?.alertLevel || 4.0)) ? 'ALERT' : 'NORMAL'}
              </span>
            </div>

            {/* Water Level Hydro Gauge Progress */}
            {selectedStation && (
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[12px] space-y-[8px]">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[var(--muted)]">River Water Level</span>
                  <b className="text-[18px] text-[var(--ink)]">
                    {simulatedWaterLevel.toFixed(1)} <small className="text-[12px] font-normal text-[var(--muted)]">/ {selectedStation.dangerLevel}m max</small>
                  </b>
                </div>

                {/* Multi-tier Level Meter Bar */}
                <div className="h-[10px] bg-[var(--line)] rounded-[5px] relative overflow-hidden">
                  <div 
                    className="h-full rounded-[5px] transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (simulatedWaterLevel / selectedStation.dangerLevel) * 100)}%`,
                      background: (simulatedWaterLevel >= selectedStation.dangerLevel) ? 'var(--crit)' :
                                  (simulatedWaterLevel >= selectedStation.warningLevel) ? 'var(--high)' :
                                  (simulatedWaterLevel >= selectedStation.alertLevel) ? 'var(--mod)' : 'var(--low)'
                    }}
                  />
                </div>

                {/* Threshold Markers */}
                <div className="flex justify-between text-[11px] text-[var(--muted)] pt-[2px]">
                  <span>Normal: {selectedStation.normalLevel}m</span>
                  <span>Alert: {selectedStation.alertLevel}m</span>
                  <span>Warning: {selectedStation.warningLevel}m</span>
                  <span className="font-bold text-[var(--crit)]">Danger: {selectedStation.dangerLevel}m</span>
                </div>
              </div>
            )}

            {/* Sensor Telemetry Stats */}
            <div className="grid grid-cols-2 gap-[10px]">
              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[10px]">
                <span className="text-[11px] text-[var(--muted)] block">Cloudburst Inflow</span>
                <b className="text-[16px] text-[var(--ink)] block mt-[2px]">{simulatedRainfall} mm/h</b>
                <span className="text-[11px] text-[var(--muted)]">
                  {simulatedRainfall > 70 ? 'Extreme Precip' : 'Moderate Inflow'}
                </span>
              </div>

              <div className="bg-[var(--bg)] border border-[var(--line)] rounded-[6px] p-[10px]">
                <span className="text-[11px] text-[var(--muted)] block">Discharge Rate</span>
                <b className="text-[16px] text-[var(--ink)] block mt-[2px]">
                  {selectedStation?.flowRate || '420 m³/s'}
                </b>
                <span className="text-[11px] text-[var(--muted)]">Estimated Hydrology</span>
              </div>
            </div>

            {/* Real-time Interactive Simulation Controls */}
            <div className="border-t border-[var(--line)] pt-[12px] space-y-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-bold text-[var(--ink)] flex items-center gap-[4px]">
                  <Sliders className="w-3.5 h-3.5 text-[var(--sea)]" />
                  Live Hydraulic Simulator
                </span>
                <span className="text-[11px] text-[var(--muted)]">Updates map in real-time</span>
              </div>

              {/* Water Level Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-[var(--muted)] mb-[2px]">
                  <span>Adjust River Stage</span>
                  <span className="font-bold text-[var(--ink)]">{simulatedWaterLevel.toFixed(1)} m</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max={selectedStation ? (selectedStation.dangerLevel + 2.5).toFixed(1) : "10.0"}
                  step="0.1"
                  value={simulatedWaterLevel}
                  onChange={(e) => setSimulatedWaterLevel(parseFloat(e.target.value))}
                  className="w-full accent-[var(--sea)] cursor-pointer"
                />
              </div>

              {/* Rainfall Slider */}
              <div>
                <div className="flex justify-between text-[11px] text-[var(--muted)] mb-[2px]">
                  <span>Adjust Precipitation</span>
                  <span className="font-bold text-[var(--ink)]">{simulatedRainfall} mm/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="180"
                  step="2"
                  value={simulatedRainfall}
                  onChange={(e) => setSimulatedRainfall(parseInt(e.target.value))}
                  className="w-full accent-[var(--sea)] cursor-pointer"
                />
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex gap-[6px] pt-[4px]">
                <button
                  onClick={() => {
                    if (selectedStation) {
                      setSimulatedWaterLevel(selectedStation.normalLevel);
                      setSimulatedRainfall(15);
                    }
                  }}
                  className="flex-1 py-[6px] px-[8px] bg-[var(--bg)] border border-[var(--line)] rounded-[4px] text-[11px] font-medium text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--sea)_10%,transparent)] cursor-pointer"
                >
                  Normal Flow
                </button>
                <button
                  onClick={() => {
                    if (selectedStation) {
                      setSimulatedWaterLevel(selectedStation.warningLevel);
                      setSimulatedRainfall(85);
                    }
                  }}
                  className="flex-1 py-[6px] px-[8px] bg-[var(--bg)] border border-[var(--mod)] rounded-[4px] text-[11px] font-medium text-[var(--ink)] hover:bg-[color-mix(in_srgb,var(--mod)_10%,transparent)] cursor-pointer"
                >
                  Bankfull Warning
                </button>
                <button
                  onClick={() => {
                    if (selectedStation) {
                      setSimulatedWaterLevel(selectedStation.dangerLevel + 0.6);
                      setSimulatedRainfall(145);
                    }
                  }}
                  className="flex-1 py-[6px] px-[8px] bg-[var(--crit)] text-white rounded-[4px] text-[11px] font-bold hover:opacity-90 cursor-pointer shadow-xs"
                >
                  Trigger Breach
                </button>
              </div>
            </div>

            {/* Direct SOP Navigation Button */}
            <div className="border-t border-[var(--line)] pt-[10px]">
              <button
                onClick={() => setActiveTab('emergency-actions')}
                className="w-full py-[8px] px-[12px] bg-[var(--sea)] text-white rounded-[6px] text-[13px] font-bold flex items-center justify-center gap-[6px] hover:opacity-95 cursor-pointer shadow-xs"
              >
                <span>View Emergency SOP Protocols &rarr;</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
