import { initializeApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import xlsx from 'xlsx';

const firebaseConfig = {
  apiKey: 'AIzaSyA59FtyY0eF4vTmm2xdhBIcZRfrmtHQaq0',
  authDomain: 'ews-dashboard-3d185.firebaseapp.com',
  projectId: 'ews-dashboard-3d185',
  storageBucket: 'ews-dashboard-3d185.firebasestorage.app',
  messagingSenderId: '437173517420',
  appId: '1:437173517420:web:ef089cb3ae798a9690ec49',
  measurementId: 'G-5MCH5LCG41'
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
      if (existing.floodEvents === null && row.Total_Flood_Events !== undefined && row.Total_Flood_Events !== null) {
        existing.floodEvents = Number(row.Total_Flood_Events);
      }
      if (existing.totalAffected === null && row.Total_Affected !== undefined && row.Total_Affected !== null) {
        existing.totalAffected = Number(row.Total_Affected);
      }
      if (existing.totalDeaths === null && row.Total_Deaths !== undefined && row.Total_Deaths !== null) {
        existing.totalDeaths = Number(row.Total_Deaths);
      }
    }
  });

  const allRecords: CountryYearRecord[] = Array.from(recordsMap.values()).map(r => {
    let avg = null;
    if (r.floodEvents && r.floodEvents > 0 && r.totalAffected !== null && r.totalAffected !== undefined) {
      avg = Number((r.totalAffected / r.floodEvents).toFixed(2));
    }
    return {
      ...r,
      averageAffectedPerFlood: avg
    };
  });

  console.log('Prepared ' + allRecords.length + ' country-year records for Firestore migration.');

  const batchSize = 100;
  let batch = writeBatch(db);
  let count = 0;
  let totalBatches = 0;

  for (const record of allRecords) {
    const docId = record.isoCode + '_' + record.year;
    const docRef = doc(db, 'historicalData', docId);

    batch.set(docRef, {
      country: record.country,
      isoCode: record.isoCode,
      year: record.year,
      floodEvents: record.floodEvents,
      totalAffected: record.totalAffected,
      totalDeaths: record.totalDeaths,
      povertyRate: record.povertyRate,
      populationDensity: record.populationDensity,
      averageAffectedPerFlood: record.averageAffectedPerFlood
    });

    count++;
    if (count % batchSize === 0) {
      await batch.commit();
      totalBatches++;
      console.log('Committed batch ' + totalBatches + ' (' + count + '/' + allRecords.length + ' records)');
      batch = writeBatch(db);
    }
  }

  if (count % batchSize !== 0) {
    await batch.commit();
    totalBatches++;
    console.log('Committed final batch ' + totalBatches + ' (' + count + '/' + allRecords.length + ' records)');
  }

  console.log('Migration to Firestore historicalData collection completed successfully!');
  process.exit(0);
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
