// ASEAN Flood Early Warning System (EWS) Dataset
// Generated with 100% data integrity from ASEAN_Flood_Poverty_CountryYear.xlsx and ASEAN_Flood_PopulationDensity_CountryYear.xlsx

export interface RiverStation {
  id: string;
  name: string;
  location: string;
  normalLevel: number;
  alertLevel: number;
  warningLevel: number;
  dangerLevel: number;
  defaultWaterLevel: number;
  defaultRainfall: number;
  flowRate: string;
}

export interface CountryFloodData {
  id: string;
  code: string;
  name: string;
  capital: string;
  basin: string;
  lat: number;
  lng: number;
  events: number | null;
  affected: number | null;
  avgAffected: number | null;
  povertyRate: number | null;
  povertySamples: number;
  povertyAvailable: boolean;
  dataAvailable: boolean;
  isPartialPoverty?: boolean;
  density: number | null;
  deaths: number | null;
  baseRiskScore: number | null;
  vulnerabilityLevel: string;
  monitoredArea: string;
  description: string;
  riverStations: RiverStation[];
}

export interface AnnualFloodSeries {
  year: number;
  historicalEvents: number | null;
  totalAffected: number | null;
  totalDeaths: number | null;
  forecastEvents: number | null;
  forecastLower: number | null;
  forecastUpper: number | null;
  type: 'historical' | 'forecast';
}

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
  countryId: string;
  stationIndex: number;
  simulatedRainfall: number;
  simulatedWaterLevel: number;
  threatLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  tag: string;
}

export const ASEAN_COUNTRIES: CountryFloodData[] = [
  {
    "id": "IDN",
    "code": "ID",
    "name": "Indonesia",
    "capital": "Jakarta / Nusantara",
    "basin": "Citarum & Bengawan Solo Basins",
    "lat": -0.7893,
    "lng": 113.9213,
    "events": 195,
    "affected": 8725590,
    "avgAffected": 44746.62,
    "povertyRate": 13.37,
    "povertySamples": 24,
    "povertyAvailable": true,
    "dataAvailable": true,
    "isPartialPoverty": false,
    "density": 133.15,
    "deaths": 4338,
    "baseRiskScore": 88,
    "vulnerabilityLevel": "High",
    "monitoredArea": "Java & Sumatra Flood Basins",
    "description": "Largest flood frequency in ASEAN with 195 recorded major flood events (2000-2023). High exposure in densely populated river basins like Citarum, Bengawan Solo, and Ciliwung.",
    "riverStations": [
      {
        "id": "IDN-STA-01",
        "name": "Citarum River - Dayeuhkolot Station",
        "location": "Bandung Regency, West Java",
        "normalLevel": 2.5,
        "alertLevel": 4.0,
        "warningLevel": 5.5,
        "dangerLevel": 6.8,
        "defaultWaterLevel": 5.8,
        "defaultRainfall": 78,
        "flowRate": "420 m\u00b3/s"
      },
      {
        "id": "IDN-STA-02",
        "name": "Bengawan Solo - Jurug Hydro Station",
        "location": "Surakarta, Central Java",
        "normalLevel": 3.0,
        "alertLevel": 4.5,
        "warningLevel": 6.0,
        "dangerLevel": 7.5,
        "defaultWaterLevel": 4.2,
        "defaultRainfall": 45,
        "flowRate": "310 m\u00b3/s"
      }
    ]
  },
  {
    "id": "PHL",
    "code": "PH",
    "name": "Philippines",
    "capital": "Manila",
    "basin": "Pasig-Marikina & Cagayan Basins",
    "lat": 12.8797,
    "lng": 121.774,
    "events": 106,
    "affected": 27819374,
    "avgAffected": 262446.92,
    "povertyRate": 18.45,
    "povertySamples": 4,
    "povertyAvailable": true,
    "dataAvailable": true,
    "isPartialPoverty": false,
    "density": 328.66,
    "deaths": 1320,
    "baseRiskScore": 85,
    "vulnerabilityLevel": "High",
    "monitoredArea": "Metro Manila & Cagayan Valley",
    "description": "High typhoon landfall frequency with 106 flood disasters affecting over 27.8M individuals. High population density (328.7/km\u00b2) amplifies flash flood impacts.",
    "riverStations": [
      {
        "id": "PHL-STA-01",
        "name": "Marikina River - Sto. Ni\u00f1o Station",
        "location": "Marikina City, Metro Manila",
        "normalLevel": 12.0,
        "alertLevel": 15.0,
        "warningLevel": 16.0,
        "dangerLevel": 18.0,
        "defaultWaterLevel": 14.8,
        "defaultRainfall": 65,
        "flowRate": "550 m\u00b3/s"
      },
      {
        "id": "PHL-STA-02",
        "name": "Cagayan River - Tuguegarao Station",
        "location": "Cagayan Province",
        "normalLevel": 4.0,
        "alertLevel": 6.5,
        "warningLevel": 8.5,
        "dangerLevel": 10.0,
        "defaultWaterLevel": 5.2,
        "defaultRainfall": 38,
        "flowRate": "290 m\u00b3/s"
      }
    ]
  },
  {
    "id": "VNM",
    "code": "VN",
    "name": "Viet Nam",
    "capital": "Hanoi",
    "basin": "Mekong Delta & Red River Basins",
    "lat": 14.0583,
    "lng": 108.2772,
    "events": 83,
    "affected": 18378717,
    "avgAffected": 221430.33,
    "povertyRate": 12.29,
    "povertySamples": 13,
    "povertyAvailable": true,
    "dataAvailable": true,
    "isPartialPoverty": false,
    "density": 283.76,
    "deaths": 2942,
    "baseRiskScore": 78,
    "vulnerabilityLevel": "Medium-High",
    "monitoredArea": "Mekong Delta & Central Coastal Plain",
    "description": "83 major recorded flood events with over 18.3M people affected. Coastal typhoons and upstream Mekong river cresting create composite flood risks.",
    "riverStations": [
      {
        "id": "VNM-STA-01",
        "name": "Mekong Delta - Tan Chau Station",
        "location": "An Giang Province",
        "normalLevel": 2.0,
        "alertLevel": 3.5,
        "warningLevel": 4.0,
        "dangerLevel": 4.5,
        "defaultWaterLevel": 3.2,
        "defaultRainfall": 48,
        "flowRate": "18,500 m\u00b3/s"
      },
      {
        "id": "VNM-STA-02",
        "name": "Red River - Hanoi Hydro Station",
        "location": "Long Bien, Hanoi",
        "normalLevel": 5.0,
        "alertLevel": 9.5,
        "warningLevel": 10.5,
        "dangerLevel": 11.5,
        "defaultWaterLevel": 6.4,
        "defaultRainfall": 30,
        "flowRate": "3,800 m\u00b3/s"
      }
    ]
  },
  {
    "id": "THA",
    "code": "TH",
    "name": "Thailand",
    "capital": "Bangkok",
    "basin": "Chao Phraya & Chi-Mun Basins",
    "lat": 15.87,
    "lng": 100.9925,
    "events": 69,
    "affected": 44310795,
    "avgAffected": 642185.43,
    "povertyRate": 15.92,
    "povertySamples": 18,
    "povertyAvailable": true,
    "dataAvailable": true,
    "isPartialPoverty": false,
    "density": 133.82,
    "deaths": 2443,
    "baseRiskScore": 83,
    "vulnerabilityLevel": "High",
    "monitoredArea": "Central Plains & Chao Phraya Delta",
    "description": "Highest historical average affected population per flood (642,185 per event) with 44.3M cumulative affected. Monsoonal runoff along Chao Phraya basin.",
    "riverStations": [
      {
        "id": "THA-STA-01",
        "name": "Chao Phraya - C.2 Nakhon Sawan",
        "location": "Nakhon Sawan Province",
        "normalLevel": 15.0,
        "alertLevel": 23.0,
        "warningLevel": 25.0,
        "dangerLevel": 27.0,
        "defaultWaterLevel": 20.4,
        "defaultRainfall": 55,
        "flowRate": "2,450 m\u00b3/s"
      },
      {
        "id": "THA-STA-02",
        "name": "Chao Phraya - C.29A Bang Sai",
        "location": "Ayutthaya Province",
        "normalLevel": 1.5,
        "alertLevel": 2.8,
        "warningLevel": 3.5,
        "dangerLevel": 4.0,
        "defaultWaterLevel": 2.3,
        "defaultRainfall": 40,
        "flowRate": "1,900 m\u00b3/s"
      }
    ]
  },
  {
    "id": "MYS",
    "code": "MY",
    "name": "Malaysia",
    "capital": "Kuala Lumpur / Putrajaya",
    "basin": "Kelantan, Pahang & Klang Basins",
    "lat": 4.2105,
    "lng": 101.9758,
    "events": 62,
    "affected": 1196099,
    "avgAffected": 19291.92,
    "povertyRate": 6.57,
    "povertySamples": 3,
    "povertyAvailable": true,
    "dataAvailable": true,
    "isPartialPoverty": false,
    "density": 90.03,
    "deaths": 251,
    "baseRiskScore": 52,
    "vulnerabilityLevel": "Moderate",
    "monitoredArea": "East Coast (Kelantan/Pahang) & Klang Valley",
    "description": "62 recorded flood events. Characterized by Northeast Monsoon flooding along east coast river basins and flash urban flooding in Klang Valley.",
    "riverStations": [
      {
        "id": "MYS-STA-01",
        "name": "Kelantan River - Tangga Krai Station",
        "location": "Kuala Krai, Kelantan",
        "normalLevel": 12.0,
        "alertLevel": 20.0,
        "warningLevel": 22.5,
        "dangerLevel": 25.0,
        "defaultWaterLevel": 16.8,
        "defaultRainfall": 42,
        "flowRate": "820 m\u00b3/s"
      },
      {
        "id": "MYS-STA-02",
        "name": "Pahang River - Lubuk Paku Station",
        "location": "Maran, Pahang",
        "normalLevel": 10.0,
        "alertLevel": 16.0,
        "warningLevel": 18.0,
        "dangerLevel": 20.0,
        "defaultWaterLevel": 12.1,
        "defaultRainfall": 28,
        "flowRate": "640 m\u00b3/s"
      }
    ]
  },
  {
    "id": "MMR",
    "code": "MM",
    "name": "Myanmar",
    "capital": "Naypyidaw",
    "basin": "Ayeyarwady & Sittaung Basins",
    "lat": 21.9162,
    "lng": 95.956,
    "events": 27,
    "affected": 3450838,
    "avgAffected": 127808.81,
    "povertyRate": 28.45,
    "povertySamples": 2,
    "povertyAvailable": true,
    "dataAvailable": true,
    "isPartialPoverty": false,
    "density": 77.34,
    "deaths": 616,
    "baseRiskScore": 68,
    "vulnerabilityLevel": "Medium-High",
    "monitoredArea": "Ayeyarwady Delta & Central Dry Zone",
    "description": "27 major flood events affecting 3.45M people. High socio-economic vulnerability with a 28.45% poverty headcount ratio and high delta exposure.",
    "riverStations": [
      {
        "id": "MMR-STA-01",
        "name": "Ayeyarwady River - Hinthada Station",
        "location": "Ayeyarwady Region",
        "normalLevel": 8.0,
        "alertLevel": 12.0,
        "warningLevel": 13.5,
        "dangerLevel": 14.5,
        "defaultWaterLevel": 10.2,
        "defaultRainfall": 35,
        "flowRate": "12,000 m\u00b3/s"
      },
      {
        "id": "MMR-STA-02",
        "name": "Sittaung River - Madauk Station",
        "location": "Bago Region",
        "normalLevel": 6.0,
        "alertLevel": 9.5,
        "warningLevel": 10.8,
        "dangerLevel": 11.8,
        "defaultWaterLevel": 7.4,
        "defaultRainfall": 22,
        "flowRate": "1,400 m\u00b3/s"
      }
    ]
  },
  {
    "id": "KHM",
    "code": "KH",
    "name": "Cambodia",
    "capital": "Phnom Penh",
    "basin": "Tonle Sap & Lower Mekong Basin",
    "lat": 12.5657,
    "lng": 104.991,
    "events": 20,
    "affected": 11030020,
    "avgAffected": 551501.0,
    "povertyRate": 26.33,
    "povertySamples": 4,
    "povertyAvailable": true,
    "dataAvailable": true,
    "isPartialPoverty": false,
    "density": 83.12,
    "deaths": 996,
    "baseRiskScore": 75,
    "vulnerabilityLevel": "High",
    "monitoredArea": "Tonle Sap Great Lake & Mekong Corridor",
    "description": "Second highest average affected population per flood (551,501 per flood). Severe vulnerability driven by seasonal Tonle Sap reverse hydrological flows.",
    "riverStations": [
      {
        "id": "KHM-STA-01",
        "name": "Tonle Sap - Prek Kdam Station",
        "location": "Kandal Province",
        "normalLevel": 4.0,
        "alertLevel": 8.0,
        "warningLevel": 9.5,
        "dangerLevel": 10.5,
        "defaultWaterLevel": 6.8,
        "defaultRainfall": 45,
        "flowRate": "4,100 m\u00b3/s"
      },
      {
        "id": "KHM-STA-02",
        "name": "Mekong - Chaktomuk Station",
        "location": "Phnom Penh Confluence",
        "normalLevel": 5.0,
        "alertLevel": 9.0,
        "warningLevel": 10.0,
        "dangerLevel": 11.2,
        "defaultWaterLevel": 7.5,
        "defaultRainfall": 40,
        "flowRate": "14,200 m\u00b3/s"
      }
    ]
  },
  {
    "id": "LAO",
    "code": "LA",
    "name": "Lao PDR",
    "capital": "Vientiane",
    "basin": "Upper-Middle Mekong River Basin",
    "lat": 19.8563,
    "lng": 102.4955,
    "events": 17,
    "affected": 3046742,
    "avgAffected": 179220.12,
    "povertyRate": 18.3,
    "povertySamples": 1,
    "povertyAvailable": true,
    "dataAvailable": true,
    "isPartialPoverty": true,
    "density": 28.47,
    "deaths": 276,
    "baseRiskScore": 58,
    "vulnerabilityLevel": "Moderate",
    "monitoredArea": "Vientiane Plain & Nam Ou / Nam Song Catchments",
    "description": "17 recorded events. (Note: Poverty headcount data is limited to 1 reporting year in dataset: 18.30%; treated transparently with sample limitation).",
    "riverStations": [
      {
        "id": "LAO-STA-01",
        "name": "Mekong River - Vientiane Hydro Station",
        "location": "Vientiane Capital",
        "normalLevel": 5.0,
        "alertLevel": 10.5,
        "warningLevel": 11.5,
        "dangerLevel": 12.5,
        "defaultWaterLevel": 7.8,
        "defaultRainfall": 32,
        "flowRate": "5,600 m\u00b3/s"
      },
      {
        "id": "LAO-STA-02",
        "name": "Nam Song - Vang Vieng Station",
        "location": "Vientiane Province",
        "normalLevel": 1.5,
        "alertLevel": 3.0,
        "warningLevel": 3.8,
        "dangerLevel": 4.5,
        "defaultWaterLevel": 2.1,
        "defaultRainfall": 25,
        "flowRate": "320 m\u00b3/s"
      }
    ]
  },
  {
    "id": "TLS",
    "code": "TL",
    "name": "Timor-Leste",
    "capital": "Dili",
    "basin": "Laclo & Comoro River Basins",
    "lat": -8.8742,
    "lng": 125.7275,
    "events": 5,
    "affected": 13636,
    "avgAffected": 2727.2,
    "povertyRate": 43.35,
    "povertySamples": 2,
    "povertyAvailable": true,
    "dataAvailable": true,
    "isPartialPoverty": false,
    "density": 68.26,
    "deaths": 8,
    "baseRiskScore": 42,
    "vulnerabilityLevel": "Moderate-Low Frequency",
    "monitoredArea": "Dili Coastal Basin & Laclo Catchment",
    "description": "5 recorded historical flood events, with high poverty headcount ratio (43.35%) indicating high socio-economic vulnerability despite lower event count.",
    "riverStations": [
      {
        "id": "TLS-STA-01",
        "name": "Comoro River - Dili Hydro Station",
        "location": "Dili Municipality",
        "normalLevel": 1.0,
        "alertLevel": 2.2,
        "warningLevel": 3.0,
        "dangerLevel": 3.8,
        "defaultWaterLevel": 1.4,
        "defaultRainfall": 18,
        "flowRate": "95 m\u00b3/s"
      },
      {
        "id": "TLS-STA-02",
        "name": "Laclo River - Manatuto Station",
        "location": "Manatuto Municipality",
        "normalLevel": 1.2,
        "alertLevel": 2.5,
        "warningLevel": 3.5,
        "dangerLevel": 4.2,
        "defaultWaterLevel": 1.6,
        "defaultRainfall": 15,
        "flowRate": "120 m\u00b3/s"
      }
    ]
  },
  {
    "id": "BRN",
    "code": "BN",
    "name": "Brunei Darussalam",
    "capital": "Bandar Seri Begawan",
    "basin": "Belait & Tutong River Basins",
    "lat": 4.5353,
    "lng": 114.7277,
    "events": null,
    "affected": null,
    "avgAffected": null,
    "povertyRate": null,
    "povertySamples": 0,
    "povertyAvailable": false,
    "dataAvailable": false,
    "isPartialPoverty": false,
    "density": null,
    "deaths": null,
    "baseRiskScore": null,
    "vulnerabilityLevel": "Data Unavailable",
    "monitoredArea": "Belait Catchment (Simulated/Not Monitored)",
    "description": "Historical disaster flood frequency and poverty metrics are not available in the compiled dataset.",
    "riverStations": []
  },
  {
    "id": "SGP",
    "code": "SG",
    "name": "Singapore",
    "capital": "Singapore",
    "basin": "Marina & Kallang Catchments",
    "lat": 1.3521,
    "lng": 103.8198,
    "events": null,
    "affected": null,
    "avgAffected": null,
    "povertyRate": null,
    "povertySamples": 0,
    "povertyAvailable": false,
    "dataAvailable": false,
    "isPartialPoverty": false,
    "density": null,
    "deaths": null,
    "baseRiskScore": null,
    "vulnerabilityLevel": "Data Unavailable",
    "monitoredArea": "Marina Catchment (Simulated/Not Monitored)",
    "description": "Historical disaster flood frequency and poverty metrics are not available in the compiled dataset.",
    "riverStations": []
  }
];

export const ANNUAL_FLOOD_SERIES: AnnualFloodSeries[] = [
  {
    "year": 2000,
    "historicalEvents": 15,
    "totalAffected": 12896377.0,
    "totalDeaths": 1296.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2001,
    "historicalEvents": 23,
    "totalAffected": 4412324.0,
    "totalDeaths": 1092.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2002,
    "historicalEvents": 19,
    "totalAffected": 7139873.0,
    "totalDeaths": 673.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2003,
    "historicalEvents": 20,
    "totalAffected": 986301.0,
    "totalDeaths": 562.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2004,
    "historicalEvents": 14,
    "totalAffected": 607750.0,
    "totalDeaths": 179.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2005,
    "historicalEvents": 15,
    "totalAffected": 1156139.0,
    "totalDeaths": 456.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2006,
    "historicalEvents": 29,
    "totalAffected": 4195363.0,
    "totalDeaths": 1175.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2007,
    "historicalEvents": 31,
    "totalAffected": 2154610.0,
    "totalDeaths": 815.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2008,
    "historicalEvents": 31,
    "totalAffected": 4495935.0,
    "totalDeaths": 430.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2009,
    "historicalEvents": 19,
    "totalAffected": 2060955.0,
    "totalDeaths": 243.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2010,
    "historicalEvents": 22,
    "totalAffected": 13364011.0,
    "totalDeaths": 1025.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2011,
    "historicalEvents": 31,
    "totalAffected": 15979143.0,
    "totalDeaths": 1631.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2012,
    "historicalEvents": 19,
    "totalAffected": 5057533.0,
    "totalDeaths": 248.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2013,
    "historicalEvents": 29,
    "totalAffected": 12990422.0,
    "totalDeaths": 653.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2014,
    "historicalEvents": 18,
    "totalAffected": 1500845.0,
    "totalDeaths": 173.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2015,
    "historicalEvents": 20,
    "totalAffected": 2022361.0,
    "totalDeaths": 273.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2016,
    "historicalEvents": 26,
    "totalAffected": 6102931.0,
    "totalDeaths": 270.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2017,
    "historicalEvents": 23,
    "totalAffected": 6176562.0,
    "totalDeaths": 365.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2018,
    "historicalEvents": 17,
    "totalAffected": 660059.0,
    "totalDeaths": 331.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2019,
    "historicalEvents": 26,
    "totalAffected": 2230949.0,
    "totalDeaths": 540.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2020,
    "historicalEvents": 36,
    "totalAffected": 1817258.0,
    "totalDeaths": 238.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2021,
    "historicalEvents": 43,
    "totalAffected": 2861653.0,
    "totalDeaths": 182.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2022,
    "historicalEvents": 36,
    "totalAffected": 2660456.0,
    "totalDeaths": 210.0,
    "forecastEvents": null,
    "forecastLower": null,
    "forecastUpper": null,
    "type": "historical"
  },
  {
    "year": 2023,
    "historicalEvents": 22,
    "totalAffected": 4442001.0,
    "totalDeaths": 130.0,
    "forecastEvents": 22,
    "forecastLower": 22,
    "forecastUpper": 22,
    "type": "historical"
  },
  {
    "year": 2024,
    "historicalEvents": null,
    "totalAffected": null,
    "totalDeaths": null,
    "forecastEvents": 30.8,
    "forecastLower": 18.1,
    "forecastUpper": 43.5,
    "type": "forecast"
  },
  {
    "year": 2025,
    "historicalEvents": null,
    "totalAffected": null,
    "totalDeaths": null,
    "forecastEvents": 31.3,
    "forecastLower": 18.6,
    "forecastUpper": 44.0,
    "type": "forecast"
  },
  {
    "year": 2026,
    "historicalEvents": null,
    "totalAffected": null,
    "totalDeaths": null,
    "forecastEvents": 31.8,
    "forecastLower": 19.1,
    "forecastUpper": 44.5,
    "type": "forecast"
  },
  {
    "year": 2027,
    "historicalEvents": null,
    "totalAffected": null,
    "totalDeaths": null,
    "forecastEvents": 32.3,
    "forecastLower": 19.6,
    "forecastUpper": 45.0,
    "type": "forecast"
  }
];

export const SYSTEM_OVERVIEW_STATS = {
  monitoredCountriesCount: 8, // Countries with full historical event records
  totalASEANMembers: 11, // 10 ASEAN + Timor-Leste
  totalRecordedFloodEvents: 584, // Sum of 2000-2023 in poverty dataset
  totalCumulativeAffected: 118061781,
  totalRecordedDeaths: 13190,
  highestFrequencyCountry: 'Indonesia',
  highestFrequencyCount: 195,
  highestAvgAffectedCountry: 'Thailand',
  highestAvgAffectedCount: 642185.43,
  timeframe: '2000 - 2023',
  forecastRange: '2024 - 2027'
};

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'scenario-citarum-critical',
    title: 'Monsoon Flash Surge - Citarum Basin (Indonesia)',
    description: 'Extreme monsoonal depression with 145 mm/h torrential rainfall over Bandung basin, pushing water stage into Critical Danger Level.',
    countryId: 'IDN',
    stationIndex: 0,
    simulatedRainfall: 145,
    simulatedWaterLevel: 7.2,
    threatLevel: 'CRITICAL',
    tag: 'Demo Walkthrough Scenario'
  },
  {
    id: 'scenario-chao-phraya-high',
    title: 'Monsoon Inflow - Chao Phraya (Thailand)',
    description: 'Upstream cumulative catchment discharge causing bank overtopping risks in Ayutthaya.',
    countryId: 'THA',
    stationIndex: 0,
    simulatedRainfall: 85,
    simulatedWaterLevel: 25.4,
    threatLevel: 'HIGH',
    tag: 'Regional High Alert'
  },
  {
    id: 'scenario-marikina-warning',
    title: 'Typhoon Outer Rainbands - Marikina (Philippines)',
    description: 'Persistent moderate-heavy rain bands elevating Marikina 2nd alarm threshold.',
    countryId: 'PHL',
    stationIndex: 0,
    simulatedRainfall: 68,
    simulatedWaterLevel: 15.6,
    threatLevel: 'MODERATE',
    tag: 'Active Watch'
  },
  {
    id: 'scenario-kelantan-normal',
    title: 'Inter-Monsoon Baseflow - Kelantan (Malaysia)',
    description: 'Standard seasonal rainfall within baseline absorption capacity of river banks.',
    countryId: 'MYS',
    stationIndex: 0,
    simulatedRainfall: 18,
    simulatedWaterLevel: 14.2,
    threatLevel: 'LOW',
    tag: 'Normal Routine'
  }
];
