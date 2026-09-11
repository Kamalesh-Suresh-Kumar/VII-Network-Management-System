import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarProps {
  activeAlarmsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeAlarmsCount = 4 }) => {
  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'grid_view',
    },
    {
      label: 'Devices',
      path: '/devices',
      icon: 'router',
      badge: '12',
      badgeType: 'neutral'
    },
    {
      label: 'Alarms',
      path: '/alarms',
      icon: 'notifications_active',
      badge: activeAlarmsCount.toString(),
      badgeType: 'error'
    },
    {
      label: 'AI / RCA',
      path: '/ai-rca',
      icon: 'psychology',
      badge: 'Live',
      badgeType: 'primary'
    },
    {
      label: 'Network Topology',
      path: '/topology',
      icon: 'hub',
    },
  ];

  return (
    <aside className="fixed top-3 bottom-3 left-3 w-[240px] z-50 flex flex-col justify-between bg-surface-container-lowest rounded-2xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.04),0_4px_12px_-2px_rgba(0,0,0,0.02)] p-3.5 border border-surface-container-high/50 select-none">
      {/* Top Brand and Nav Menu */}
      <div className="flex flex-col gap-3 min-h-0">
        {/* Brand / Logo Header */}
        <div className="flex items-center gap-2.5 px-1 pt-1">
          <img 
            src="/logo.png" 
            alt="COGNINET Logo" 
            className="h-8 w-8 object-contain rounded-lg shrink-0 shadow-xs"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-headline-md text-base font-bold tracking-tight text-on-surface">COGNINET</span>
            <span className="font-label-caps text-[9px] uppercase tracking-widest text-primary font-bold">Cognitive NetOps</span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="flex flex-col gap-1 mt-1 overflow-y-auto pr-0.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-xl transition-all font-body-md text-xs ${
                  isActive
                    ? 'bg-primary text-on-primary font-headline-md font-semibold shadow-[0_6px_18px_-3px_rgba(179,33,0,0.4)]'
                    : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[19px]">{item.icon}</span>
                    <span className={isActive ? 'font-semibold' : 'font-medium'}>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full font-code-telemetry text-[10px] font-bold ${
                        isActive
                          ? 'bg-white/20 text-on-primary'
                          : item.badgeType === 'error'
                          ? 'bg-error-container text-on-error-container'
                          : item.badgeType === 'primary'
                          ? 'bg-primary-fixed text-on-primary-fixed uppercase tracking-wider text-[9px]'
                          : 'bg-surface-container text-secondary'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Bottom Section - Permanently Fixed at Bottom of Sidebar */}
      <div className="flex flex-col gap-2 shrink-0 pt-2.5 border-t border-surface-container-high/50">
        {/* User Profile Badge */}
        <NavLink 
          to="/profile"
          className={({ isActive }) =>
            `flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
              isActive
                ? 'bg-primary/10 border-primary/40 text-primary shadow-xs'
                : 'bg-surface-container-low border-surface-container-high/40 hover:bg-surface-container text-on-surface'
            }`
          }
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 shadow-sm text-on-primary font-bold text-xs">
            KR
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-body-md text-[12px] font-bold text-on-surface truncate">Kumaran R</span>
            <span className="font-code-telemetry text-[10px] text-secondary truncate">DevOps Lead</span>
          </div>
          <span className="material-symbols-outlined text-secondary text-[16px]">chevron_right</span>
        </NavLink>
      </div>
    </aside>
  );
};
