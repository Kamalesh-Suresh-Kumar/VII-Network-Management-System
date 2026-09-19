import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  breadcrumbCategory?: string;
  breadcrumbSub?: string;
  title: string;
  subtitle?: string;
  icon?: string;
  onSearch?: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  breadcrumbCategory = 'COGNINET NOC',
  breadcrumbSub = 'CORE TELEMETRY',
  title,
  subtitle,
  icon,
  onSearch
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [secondsTick, setSecondsTick] = useState<number>(1.2);
  const navigate = useNavigate();

  // Subtle live telemetry heartbeat animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsTick((prev) => +(1.0 + Math.random() * 0.4).toFixed(1));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  return (
    <header className="w-full flex items-center justify-between border-b border-surface-container-high/50 pb-3 mb-3.5 bg-transparent z-40 shrink-0 select-none">
      {/* Breadcrumb & Title */}
      <div className="flex items-center gap-4 min-w-0 max-w-[55%]">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 font-label-caps text-[10px] text-secondary uppercase tracking-wider truncate pb-0.5">
            {icon && <span className="material-symbols-outlined text-[14px] text-primary">{icon}</span>}
            <span>{breadcrumbCategory}</span>
            <span className="text-outline-variant">/</span>
            <span className="text-primary font-bold">{breadcrumbSub}</span>
            <span className="h-3 w-px bg-surface-container-high mx-1 hidden sm:inline"></span>
            <div className="hidden sm:flex items-center gap-1 text-[9.5px] font-code-telemetry text-secondary lowercase">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              <span>sync: {secondsTick}s</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-0.5 min-w-0">
            <h1 className="font-headline-xl text-[19px] font-bold text-on-surface tracking-tight leading-snug py-0.5 truncate">
              {title}
            </h1>
            {subtitle && (
              <span className="text-secondary font-body-md text-[12px] leading-snug py-0.5 truncate hidden xl:inline">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Strip: Search, Health Badge, Notifications, Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-surface-container-lowest border border-surface-container-high px-3 py-1.5 rounded-full shadow-sm">
          <span className="material-symbols-outlined text-secondary text-[16px]">search</span>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (onSearch) onSearch(e.target.value);
            }}
            placeholder="Search telemetry, node..."
            className="bg-transparent border-none outline-none font-body-sm text-[12px] text-on-surface w-32 sm:w-44 placeholder:text-secondary focus:ring-0 p-0"
          />
          <kbd className="font-code-telemetry text-[9px] text-secondary bg-surface-container px-1.5 py-0.5 rounded">⌘K</kbd>
        </form>

        {/* Live Network Health Status */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container/10 border border-tertiary/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary"></span>
          </span>
          <span className="font-code-telemetry text-[11px] text-tertiary font-bold tracking-tight whitespace-nowrap">
            94% OPTIMAL
          </span>
        </div>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          onClick={() => navigate('/alarms')}
          className="relative p-1.5 rounded-full hover:bg-surface-container transition-colors text-secondary"
          type="button"
          title="Active network alarms (4)"
        >
          <span className="material-symbols-outlined text-[19px]">notifications</span>
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-surface"></span>
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => navigate('/profile')}
          className="w-7 h-7 rounded-full bg-primary flex items-center justify-center font-bold text-on-primary text-[11px] shadow-sm hover:opacity-90 transition-opacity"
          title="Kumaran R (AI & NOC Lead)"
        >
          KR
        </button>
      </div>
    </header>
  );
};
