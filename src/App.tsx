import React from 'react';
import { EWSProvider, useEWS } from './context/EWSContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { PresentationBanner } from './components/demo/PresentationBanner';

import { OverviewPage } from './pages/OverviewPage';
import { HistoricalDataPage } from './pages/HistoricalDataPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { RiskAnalysisPage } from './pages/RiskAnalysisPage';
import { AlertsPage } from './pages/AlertsPage';
import { EmergencyActionsPage } from './pages/EmergencyActionsPage';
import { DisclaimerPage } from './pages/DisclaimerPage';

import { MobileNav } from './components/layout/MobileNav';

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
    <div className="flex h-screen w-screen overflow-hidden bg-[#F7F8FA]">
      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header />

        {/* Dynamic Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 pb-20 md:pb-24">
          <div className="max-w-7xl mx-auto">
            {renderActivePage()}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
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
