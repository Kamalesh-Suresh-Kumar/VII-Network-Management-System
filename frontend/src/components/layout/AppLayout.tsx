import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppLayout: React.FC = () => {
  return (
    <div className="bg-background font-body-md text-on-surface w-full min-h-screen overflow-x-hidden m-0 p-0 flex flex-row box-border antialiased">
      {/* Permanently Fixed Left Sidebar */}
      <Sidebar />

      {/* Main Content Workspace with exact left offset to account for fixed 240px sidebar */}
      <div className="ml-[256px] flex-1 min-w-0 max-w-[calc(100vw-256px)] overflow-x-hidden px-5 pt-3 pb-6 box-border flex flex-col min-h-screen">
        <Outlet />
      </div>
    </div>
  );
};
