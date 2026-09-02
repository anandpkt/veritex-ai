import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

import DashboardPage from './pages/DashboardPage';
import NewScreeningPage from './pages/NewScreeningPage';
import ScreeningDetailPage from './pages/ScreeningDetailPage';
import SyntheticLabPage from './pages/SyntheticLabPage';
import ForensicsStudioPage from './pages/ForensicsStudioPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import IdentityGraphPage from './pages/IdentityGraphPage';
import RiskSimulatorPage from './pages/RiskSimulatorPage';
import HistoryPage from './pages/HistoryPage';
import ReportsPage from './pages/ReportsPage';
import GuidelinesPage from './pages/GuidelinesPage';
import SystemStatusPage from './pages/SystemStatusPage';

export default function App() {
  return (
    <div className="min-h-screen bg-gov-bg text-gov-text flex flex-col font-sans">
      {/* 1. Official Government Header */}
      <Header />

      {/* 2. Main Page Container */}
      <main id="main-content" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/screening/new" element={<NewScreeningPage />} />
          <Route path="/screening/:id" element={<ScreeningDetailPage />} />
          <Route path="/synthetic-lab" element={<SyntheticLabPage />} />
          <Route path="/forensics" element={<ForensicsStudioPage />} />
          <Route path="/forensics/:id" element={<ForensicsStudioPage />} />
          <Route path="/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/digital-twin/:id" element={<DigitalTwinPage />} />
          <Route path="/identity-graph" element={<IdentityGraphPage />} />
          <Route path="/identity-graph/:id" element={<IdentityGraphPage />} />
          <Route path="/risk-simulator" element={<RiskSimulatorPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/system-status" element={<SystemStatusPage />} />
        </Routes>
      </main>

      {/* 3. Official Public Service Footer */}
      <Footer />
    </div>
  );
}
