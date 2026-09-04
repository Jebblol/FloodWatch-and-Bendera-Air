# Bendera Air Smart Flood Pole
> **A Data-Driven Community Flood Early Warning System (EWS)**  
> *Developed as an interactive academic prototype for the ASEAN Data Science Explorers (DSE) 2026 competition.*

---

## Overview

**Bendera Air Smart Flood Pole** is an interactive web dashboard demonstrating a data-driven community flood early warning workflow across Southeast Asian member states. The project integrates multi-decade empirical disaster records with real-time hydrological simulations to evaluate composite flood threat levels, trigger tiered community alerts, and recommend standard operating procedure (SOP) emergency actions.

---

## Problem

Floods represent one of the most frequent and economically devastating natural hazards across Southeast Asia. River basins such as the Citarum (Indonesia), Pasig-Marikina (Philippines), Chao Phraya (Thailand), and Mekong Delta (Viet Nam) endure recurrent seasonal inundations. However, conventional monitoring often suffers from:
- Siloed historical disaster data disconnected from day-to-day community awareness.
- A lack of transparent risk-scoring methodologies accessible to local residents and non-technical stakeholders.
- Alert mechanisms that fail to translate environmental readings into actionable, phased community emergency responses.

---

## Solution

Bendera Air provides a unified, transparent Early Warning System prototype that bridges empirical data and local preparedness through a structured 5-stage pipeline:

```
   Historical Data
          ↓
     Risk Mapping
          ↓
 Real-Time Monitoring
          ↓
    Risk Analysis
          ↓
    Adaptive Alert
          ↓
   Emergency Action
```

1. **Historical Vulnerability Baseline**: Evaluates 2000–2023 disaster event frequency, average affected population per flood, poverty headcount ratio, and population density.
2. **Real-Time Hydrological Simulation**: Incorporates rainfall intensity and river water-level measurements.
3. **Composite Risk Engine**: Combines 35% historical vulnerability with 65% real-time conditions to calculate a deterministic 0–100 Flood Threat Score.
4. **Actionable Emergency Protocols**: Automatically transitions alert states (LOW, MODERATE, HIGH, CRITICAL) and maps them to clear, community-level SOP checklists.

---

## Main Features

### 1. Historical Data Registry & Trends
- **Empirical Country-Year Data**: Integrates 2000–2023 flood disaster occurrences, casualty totals, and population displacement numbers compiled from official disaster databases and hosted on Cloud Firestore.
- **Statistical Trend Demonstration**: Illustrates long-term annual event trends (2000–2023) alongside conceptual linear trend projections (2024–2027) with 95% confidence intervals.
- **Missing Data Policy**: Explicitly preserves missing observations as unavailable (e.g. Singapore, Brunei, and partial poverty metrics for Lao PDR) rather than zeroing or fabricating data.

### 2. Geographic Information System (GIS) Risk Map
- **Regional Choropleth Map**: Built using Leaflet and accurate Natural Earth vector boundaries on an OpenStreetMap basemap.
- **Focus Country Analysis**: Highlights the 8 ASEAN member states with complete historical datasets (Indonesia, Philippines, Viet Nam, Thailand, Malaysia, Myanmar, Cambodia, Timor-Leste).
- **Interactive Tooltips & Profiles**: Hover and click interactions that seamlessly update the selected country's profile, monitored river basins, and connected hydrological stations.

### 3. Real-Time Telemetry Simulation
- **Interactive Environmental Controls**: Sliders allowing users to adjust simulated **Rainfall Intensity (mm/h)** and **River Water Level (m)**.
- **Baseline Water Levels**: River stations configured with normal, alert, warning, and danger level thresholds (e.g., Citarum River Dayeuhkolot Station, Marikina River Sto. Niño Station).
- **Station-Specific Inundation Dynamics**: Automatically recalculates water height variances relative to flood barrier crests.

### 4. Transparent Risk Analysis
- **Deterministic 0–100 Threat Score**: Real-time mathematical scoring formula:
  $$\text{Threat Score} = (0.35 \times \text{Historical Vulnerability}) + (0.65 \times \text{Real-Time Environmental Load})$$
- **Dynamic Threat Classifications**:
  - 🟢 **LOW (0–39)**: Normal baseline hydrological conditions.
  - 🟡 **MODERATE (40–64)**: Heightened readiness and localized monitoring.
  - 🟠 **HIGH (65–79)**: Warning stage; active preparation for vulnerable sectors.
  - 🔴 **CRITICAL (80–100)**: Immediate flood emergency and evacuation protocol.

### 5. Adaptive Community Alerts & SOP Emergency Actions
- **Visual Alert Banners**: Contextual threat badges, color transitions, and audio-visual cues tailored to the current threat score.
- **Role-Based Checklists**: Structured Standard Operating Procedures categorizing actions for local government, community leaders, and household residents.
- **Guided Demo Mode**: Built-in automated presentation tour stepping through the full disaster scenario lifecycle.

---

## Technology Stack

The project is built using modern, production-grade frontend and cloud technologies:

| Layer | Technology | Description |
|---|---|---|
| **Framework** | React 18 (`18.3.1`) | Functional component architecture with TypeScript |
| **Build Tool** | Vite 6 (`6.1.0`) | Fast developer server and optimized rollup bundling |
| **Styling** | Tailwind CSS (`3.4.17`) | Utility-first, responsive Figma-grade light theme design system |
| **GIS Mapping** | Leaflet (`1.9.4`) & React-Leaflet (`4.2.1`) | Interactive choropleth map with OpenStreetMap tiles |
| **Data Visualizations** | Recharts (`2.15.1`) | Responsive composed charts, area confidence bands, and bar charts |
| **Icons** | Lucide React (`0.475.0`) | Clean iconography |
| **Backend / Database** | Firebase SDK (`12.18.0`) & Cloud Firestore | Real-time NoSQL database holding empirical historical country-year records |
| **Data Processing** | SheetJS / XLSX (`0.18.5`) | Migration and parsing of empirical Excel datasets |

---

## Data & Methodology

1. **Vulnerability Index Calculation**:
   $$\text{Vulnerability} = 0.35 \times f(\text{Flood Events}) + 0.35 \times f(\text{Avg Affected}) + 0.15 \times f(\text{Poverty Rate}) + 0.15 \times f(\text{Pop Density})$$
2. **Real-Time Sensor Contribution**:
   $$\text{Real-Time Component} = 0.50 \times f(\text{Rainfall Intensity}) + 0.50 \times f(\text{River Water Level})$$
3. **Data Fallback Mechanism**: If Cloud Firestore is unreachable, the application automatically falls back to an internal verified local dataset without disrupting user interaction.

---

## Firebase & Firestore Configuration

- **Firestore Database**: Stores the `historicalData` collection (178 empirical country-year records from 2000–2023).
- **Security Rules (`firestore.rules`)**:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /historicalData/{document=**} {
        allow read: if true;
        allow write: if false;
      }
      match /{document=**} {
        allow read, write: if false;
      }
    }
  }
  ```
- **Public API Configuration**: The Firebase web app configuration in `src/firebase/config.ts` uses client-side public API keys intended for public frontend routing. All backend write access is blocked by security rules.

---

## Running the Project Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/bendera-air-floodwatch-ews.git
   cd bendera-air-floodwatch-ews
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

4. **Build for production**:
   ```bash
   npm run build
   ```
   The compiled assets will be output to the `dist/` directory.

5. **Preview production build locally**:
   ```bash
   npm run preview
   ```

---

## Deployment

The application is configured for Firebase Hosting via `firebase.json`:
```bash
# 1. Login to Firebase CLI
firebase login

# 2. Build production assets
npm run build

# 3. Deploy hosting & rules to Firebase
firebase deploy --only hosting,firestore:rules
```

---

## Prototype Disclaimer

> **IMPORTANT NOTICE:**  
> This project is a prototype developed specifically for the **ASEAN Data Science Explorers (DSE) 2026** competition. Real-time rainfall intensity and river water-level readings are simulated for interactive demonstration purposes and are not live physical telemetry measurements. Flood event forecasts, vulnerability indices, and threat scores are prototype analytical outputs and must not be interpreted as official meteorological forecasts or government disaster warnings. This system is not an operational emergency warning service and should not be used for real-world life-safety or evacuation decisions.
