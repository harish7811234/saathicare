import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { GuidedDemoBar } from './components/layout/GuidedDemoBar';
import { Toast } from './components/layout/Toast';
import { HealthcareDisclaimerBanner } from './components/common/HealthcareDisclaimerBanner';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { MedicationsPage } from './pages/MedicationsPage';
import { AdherencePage } from './pages/AdherencePage';
import { AppointmentsPage } from './pages/AppointmentsPage';
import { CareCirclePage } from './pages/CareCirclePage';
import { HealthProfilePage } from './pages/HealthProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { TimelinePage } from './pages/TimelinePage';
import { SettingsPage } from './pages/SettingsPage';

const AppShell: React.FC = () => {
  const { activePage, role } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showGuidedDemo, setShowGuidedDemo] = useState(true);

  if (activePage === 'landing') {
    return (
      <>
        <HealthcareDisclaimerBanner />
        <LandingPage />
        <Toast />
      </>
    );
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'medications':
        return <MedicationsPage />;
      case 'adherence':
        return <AdherencePage />;
      case 'appointments':
        return <AppointmentsPage />;
      case 'care-circle':
        return <CareCirclePage />;
      case 'profile':
        return <HealthProfilePage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'timeline':
        return <TimelinePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className={`min-h-screen bg-[#FAF8F2] text-[#30352F] flex flex-col overflow-x-hidden ${role === 'elderly' ? 'text-base' : 'text-sm'}`}>
      {/* Sidebar for Desktop & Mobile drawer */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        {/* Healthcare Prototype Notice */}
        <HealthcareDisclaimerBanner />

        {/* Topbar */}
        <Topbar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          showGuidedDemo={showGuidedDemo}
          setShowGuidedDemo={setShowGuidedDemo}
        />

        {/* Optional Guided Demo Walkthrough Bar */}
        {showGuidedDemo && (
          <GuidedDemoBar onClose={() => setShowGuidedDemo(false)} />
        )}

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>
      </div>

      {/* Floating Reassuring Toast Alerts */}
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
