# Implementation Plan - ASEAN Flood Early Warning System (EWS) Interactive Demo

Build a high-fidelity, presentation-ready interactive web application for an **ASEAN Flood Early Warning System (EWS)** prototype. The application strictly follows the conceptual architecture:
$$\text{Historical Data} \rightarrow \text{Risk Mapping} \rightarrow \text{Risk Analysis (with Real-Time Data)} \rightarrow \text{Adaptive Alert} \rightarrow \text{Emergency Action}$$

---

## User Review Required

> [!IMPORTANT]
> - **Data Integrity Guaranteed**: The application will use the exact data extracted from `ASEAN_Flood_Poverty_CountryYear.xlsx` and `ASEAN_Flood_PopulationDensity_CountryYear.xlsx`.
> - **Explicit Missing Data Handling**: Singapore and Brunei will be marked as **"Data unavailable"** (not zeroed or fabricated). Laos will have appropriate notes indicating limited poverty sample size.
> - **Self-Contained Architecture**: The application will run as a modern Vite + React + Tailwind CSS single-page application with rich interactive visualizations (Recharts / Chart.js, interactive SVG/Geo vector mapping, live sensor controls, interactive guided demo tour, and reactive threat matrix).

---

## Proposed Architecture & Component Design

### 1. Data Layer (`src/data/`)
- `aseanHistoricalData.ts`: Exact country aggregates (2000–2023), annual event time series (2000–2023), linear forecast (2024–2027) with 95% confidence intervals, and country geographic metadata (coordinates, river basins, monitoring stations).
- `simulationPresets.ts`: Preset demo scenarios (e.g., *Normal Dry Season*, *Monsoon Inflow - Indonesia*, *Typhoon Surge - Philippines*, *Critical Flash Flood - Chao Phraya Thailand*).

### 2. State Management & EWS Logic Engine (`src/context/EWSContext.tsx`)
- **Selected Country State**: Globally synced across Historical charts, Risk Map, Live Sensors, Risk Analysis, Alert, and Emergency Actions.
- **Simulated Real-Time Inputs**:
  - Rainfall rate ($0 - 250\text{ mm/h}$) & 24h trend
  - Water Level ($0 - 8.0\text{ m}$) & warning threshold ($4.5\text{ m}$ Warning, $6.0\text{ m}$ Danger)
- **EWS Threat Level Calculator**:
  - Combines Historical Vulnerability Index (Frequency, Affected Pop, Poverty) with Real-Time Environmental Inputs.
  - Generates Threat Level: `LOW` (🟢), `MODERATE` (🟡), `HIGH` (🟠), `CRITICAL` (🔴).
- **Emergency Action Protocol Engine**:
  - Dynamically triggers action checklists and instructions (`Prepare`, `Evacuate`, `Seek Shelter`).

### 3. Application Layout & Navigation
- **Left Sidebar**: Minimal, sleek navigation with active pill indicators and icons:
  1. *Overview*
  2. *Risk Map*
  3. *Historical Data*
  4. *Live Monitoring*
  5. *Risk Analysis*
  6. *Alerts*
  7. *Emergency Actions*
- **Top Navigation Bar**:
  - Title: **ASEAN Flood Early Warning System**
  - Live Status Pill: `System Online` (pulsing green indicator)
  - Mode Switch: `Interactive Mode` / `Presentation Demo Tour` (1-click step-by-step walkthrough)
  - Quick Country Selector dropdown & Current Time indicator

### 4. Core Pages & Modules
1. **Overview Dashboard**:
   - 5 Clean Metric Cards: ASEAN Countries Monitored (8 active + 3 noted), Total Recorded Flood Events (584), Highest Frequency (Indonesia - 195), Highest Avg Affected (Thailand - 642k / flood), Current Dynamic Threat Level.
   - Interactive System Architecture diagram showing live data flow through the 5 stages.
   - ASEAN Regional Flood Snapshot Grid.
2. **Historical Data View**:
   - Horizontal Bar Chart: *Total Flood Events by Country (2000–2023)* with interactive selection.
   - Dual-View Comparative Analysis: *Average Affected Per Flood* vs. *Average Poverty Rate (%)* with distinct scales, tooltips, and non-zero handling.
   - *Forecasting Section*: Solid line for Historical (2000–2023) + Dashed line for Forecast (2024–2027) with shaded confidence envelope and explicit prototype disclaimer.
3. **Risk Map View**:
   - Visual map of ASEAN region with country hover/click, vulnerability choropleth shading.
   - Floating Country Intelligence Drawer: Country, Total Events, Avg Affected, Poverty Rate, Threat Level, Monitored River Basin.
   - Clearly labeled *Illustrative Risk Mapping (Prototype)*.
4. **Live Monitoring View**:
   - Prominent `SIMULATED REAL-TIME DATA` indicator.
   - Rainfall Sensor Panel: Live gauge, intensity badge (Light/Moderate/Heavy/Torrential), 24h trend sparkline.
   - Water Level Sensor Panel: Stage height gauge, threshold markers (Normal, Alert, Warning, Danger), hydrograph trend.
   - River Basin Station Switcher (Citarum, Chao Phraya, Mekong, Pasig, etc.).
5. **Risk Analysis View**:
   - Visual equation breakdown: $\text{Historical Vulnerability} \times w_1 + \text{Real-Time Conditions} \times w_2 \rightarrow \text{Flood Threat Score}$.
   - Interactive Sliders for Rainfall and Water Level with instant live feedback.
   - Composite Risk Score meter (0–100) and sensitivity diagnostic.
6. **Adaptive Flood Alert View**:
   - High-visibility dynamic alert banner with 4 threat levels (🟢 Low, 🟡 Moderate, 🟠 High, 🔴 Critical).
   - Alert summary, affected zone radius, response timeline, broadcast simulator.
7. **Emergency Action View**:
   - Connected action cards: `Prepare`, `Evacuate`, `Seek Shelter`.
   - Action status highlighting based on current threat level.
   - Practical SOP checklists (Community alerts, search & rescue, asset staging, shelter management).
8. **Presentation / Demo Mode**:
   - Guided 6-step interactive walkthrough that demonstrates the entire pipeline from historical data in Indonesia through sensor surge to critical alert and emergency evacuation.

---

## Verification Plan

### Automated Build & Lint Verification
- Run Vite production build (`npm run build`) to verify zero TypeScript or bundle errors.

### Manual Verification
- Test all navigation routes.
- Test interactive country selection across all views (Indonesia, Thailand, Philippines, etc.).
- Verify missing data display for Singapore, Brunei, and Laos.
- Verify real-time slider updates dynamically adjusting threat levels from Low $\rightarrow$ Critical.
- Verify Presentation Mode tour execution.
