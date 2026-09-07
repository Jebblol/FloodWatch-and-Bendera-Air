import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import xlsx from 'xlsx';
import dotenv from 'dotenv';

dotenv.config();

// Load credentials safely from environment variables (process.env)
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || '',
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || '',
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID || ''
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const isoToName: Record<string, string> = {
  'IDN': 'Indonesia',
  'PHL': 'Philippines',
  'VNM': 'Viet Nam',
  'THA': 'Thailand',
  'MYS': 'Malaysia',
  'MMR': 'Myanmar',
  'KHM': 'Cambodia',
  'LAO': 'Lao PDR',
  'TLS': 'Timor-Leste',
  'BRN': 'Brunei Darussalam',
  'SGP': 'Singapore'
};

interface CountryYearRecord {
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

async function runMigration() {
  console.log('Starting data extraction from Excel files...');

  const wbP = xlsx.readFile('ASEAN_Flood_Poverty_CountryYear.xlsx');
  const pData: any[] = xlsx.utils.sheet_to_json(wbP.Sheets[wbP.SheetNames[0]]);

  const wbD = xlsx.readFile('ASEAN_Flood_PopulationDensity_CountryYear.xlsx');
  const dData: any[] = xlsx.utils.sheet_to_json(wbD.Sheets[wbD.SheetNames[0]]);

  const recordsMap = new Map<string, CountryYearRecord>();

  pData.forEach((row) => {
    const iso = (row.ISO3 || '').trim();
    if (!iso) return;
    const year = Number(row.Year);
    const key = iso + '_' + year;

    const floodEvents = row.Total_Flood_Events !== undefined && row.Total_Flood_Events !== null ? Number(row.Total_Flood_Events) : null;
    const totalAffected = row.Total_Affected !== undefined && row.Total_Affected !== null ? Number(row.Total_Affected) : null;
    const totalDeaths = row.Total_Deaths !== undefined && row.Total_Deaths !== null ? Number(row.Total_Deaths) : null;
    const povertyRate = row.Poverty_Headcount_Ratio !== undefined && row.Poverty_Headcount_Ratio !== null && !isNaN(Number(row.Poverty_Headcount_Ratio))
      ? Number(Number(row.Poverty_Headcount_Ratio).toFixed(2))
      : null;

    recordsMap.set(key, {
      country: isoToName[iso] || row.Country || iso,
      isoCode: iso,
      year: year,
      floodEvents: floodEvents,
      totalAffected: totalAffected,
      totalDeaths: totalDeaths,
      povertyRate: povertyRate,
      populationDensity: null,
      averageAffectedPerFlood: null
    });
  });

  dData.forEach((row) => {
    const iso = (row.ISO || '').trim();
    if (!iso) return;
    const year = Number(row.Year);
    const key = iso + '_' + year;

    const density = row.Population_Density_people_per_sqkm !== undefined && row.Population_Density_people_per_sqkm !== null && !isNaN(Number(row.Population_Density_people_per_sqkm))
      ? Number(Number(row.Population_Density_people_per_sqkm).toFixed(2))
      : null;

    if (!recordsMap.has(key)) {
      const floodEvents = row.Total_Flood_Events !== undefined && row.Total_Flood_Events !== null ? Number(row.Total_Flood_Events) : null;
      const totalAffected = row.Total_Affected !== undefined && row.Total_Affected !== null ? Number(row.Total_Affected) : null;
      const totalDeaths = row.Total_Deaths !== undefined && row.Total_Deaths !== null ? Number(row.Total_Deaths) : null;

      recordsMap.set(key, {
        country: isoToName[iso] || row.Country || iso,
        isoCode: iso,
        year: year,
        floodEvents: floodEvents,
        totalAffected: totalAffected,
        totalDeaths: totalDeaths,
        povertyRate: null,
        populationDensity: density,
        averageAffectedPerFlood: null
      });
    } else {
      const existing = recordsMap.get(key)!;
      existing.populationDensity = density;
    }
  });

  // Calculate averageAffectedPerFlood
  recordsMap.forEach((rec) => {
    if (rec.floodEvents !== null && rec.floodEvents > 0 && rec.totalAffected !== null) {
      rec.averageAffectedPerFlood = Number((rec.totalAffected / rec.floodEvents).toFixed(2));
    }
  });

  const allRecords = Array.from(recordsMap.values());
  console.log(`Total country-year records compiled: ${allRecords.length}`);

  // Push to Firestore in batches of 400
  const BATCH_SIZE = 400;
  for (let i = 0; i < allRecords.length; i += BATCH_SIZE) {
    const chunk = allRecords.slice(i, i + BATCH_SIZE);
    const batch = writeBatch(db);

    chunk.forEach((rec) => {
      const docId = `${rec.isoCode}_${rec.year}`;
      const docRef = doc(db, 'historicalData', docId);
      batch.set(docRef, rec);
    });

    await batch.commit();
    console.log(`Committed batch ${Math.floor(i / BATCH_SIZE) + 1} (${chunk.length} records)`);
  }

  console.log('Migration completed successfully.');
}

runMigration().catch(console.error);
