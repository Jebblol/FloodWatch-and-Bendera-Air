import React from 'react';
import { EWSProvider, useEWS } from './context/EWSContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { PresentationBanner } from './components/demo/PresentationBanner';

import { OverviewPage } from './pages/OverviewPage';
import { HistoricalDataPage } from './pages/HistoricalDataPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { AlertsPage } from './pages/AlertsPage';
import { EmergencyActionsPage } from './pages/EmergencyActionsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';

const DashboardContent: React.FC = () => {
  const { activeTab } = useEWS();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'historical-data':
        return <HistoricalDataPage />;
      case 'risk-map':
        return <RiskMapPage />;
      case 'live-monitoring':
        return <LiveMonitoringPage />;
      case 'risk-analysis':
        return <RiskAnalysisPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'emergency-actions':
        return <EmergencyActionsPage />;
      case 'disclaimer':
        return <DisclaimerPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="fw-app">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Column */}
      <div className="flex flex-col min-w-0 min-h-screen overflow-x-hidden bg-[var(--bg)]">
        {/* Top Header */}
        <Header />

        {/* Main Content Area - Aligned directly with header and sidebar */}
        <main className="flex-1 w-full py-[16px] sm:py-[20px] pb-[90px] md:pb-[24px]">
          <div className="w-full px-3 sm:px-6">
            {renderActivePage()}
          </div>
        </main>

        {/* Mobile Navigation */}
        <MobileNav />

        {/* Guided Presentation Walkthrough Banner */}
        <PresentationBanner />
      </div>
    </div>
  );
};

export function App() {
  return (
    <EWSProvider>
      <DashboardContent />
    </EWSProvider>
  );
}

export default App;
