import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { DevicesPage } from './pages/DevicesPage';
import { DeviceDetailPage } from './pages/DeviceDetailPage';
import { AlarmsPage } from './pages/AlarmsPage';
import { AIRCAPage } from './pages/AIRCAPage';
import { TopologyPage } from './pages/TopologyPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        {/* Default Redirect to Dashboard */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* 1. Dashboard */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* 2. Devices Fleet & Node Details */}
        <Route path="devices" element={<DevicesPage />} />
        <Route path="devices/:deviceId" element={<DeviceDetailPage />} />

        {/* 3. Alarms & Incident Console */}
        <Route path="alarms" element={<AlarmsPage />} />
        <Route path="alarms/:alarmId" element={<AlarmsPage />} />

        {/* 4. AI / Root Cause Analysis & Incidents */}
        <Route path="ai-rca" element={<AIRCAPage />} />
        <Route path="incidents" element={<AIRCAPage />} />
        <Route path="incidents/:incidentId" element={<AIRCAPage />} />

        {/* 5. Network Topology & Mesh Telemetry */}
        <Route path="topology" element={<TopologyPage />} />

        {/* DevOps Lead Profile & Appearance */}
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<Navigate to="/profile" replace />} />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
