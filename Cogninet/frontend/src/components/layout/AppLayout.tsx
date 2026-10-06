import React, { useCallback, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { getAlarms } from '../../services/api';

export const AppLayout: React.FC = () => {
  const [activeAlarmsCount, setActiveAlarmsCount] = useState(0);

  const refreshAlarmCount = useCallback(async () => {
    try {
      const alarms = await getAlarms();

      const activeCount = alarms.filter(
        alarm => alarm.status === 'active'
      ).length;

      setActiveAlarmsCount(activeCount);
    } catch (error) {
      console.error('Failed to refresh active alarm count:', error);
    }
  }, []);

  useEffect(() => {
    refreshAlarmCount();

    const interval = window.setInterval(() => {
      refreshAlarmCount();
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [refreshAlarmCount]);

  return (
    <div className="bg-background font-body-md text-on-surface w-full min-h-screen overflow-x-hidden m-0 p-0 flex flex-row box-border antialiased">
      {/* Permanently Fixed Left Sidebar */}
      <Sidebar activeAlarmsCount={activeAlarmsCount} />

      {/* Main Content Workspace with exact left offset to account for fixed 240px sidebar */}
      <div className="ml-[256px] flex-1 min-w-0 max-w-[calc(100vw-256px)] overflow-x-hidden px-5 pt-3 pb-6 box-border flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};
