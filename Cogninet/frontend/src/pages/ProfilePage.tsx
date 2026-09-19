import React from 'react';
import { Header } from '../components/layout/Header';
import { useTheme } from '../context/ThemeContext';

export const ProfilePage: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex-1 flex flex-col gap-3.5 min-w-0">
      <Header
        breadcrumbCategory="System"
        breadcrumbSub="Profile"
        title="Operator Profile"
        subtitle="NOC operator session & display mode"
        icon="person"
      />

      {/* 1. Theme Switcher Bar */}
      <div className="bg-surface-container-lowest px-4 py-2.5 rounded-2xl border border-surface-container-high/60 shadow-card flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">
              {theme === 'dark' ? 'dark_mode' : 'light_mode'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-md text-xs font-bold text-on-surface">Display Theme &amp; Contrast Mode</span>
            <span className="text-[11px] text-secondary">Toggle between daylight white and dark NOC command center</span>
          </div>
        </div>

        {/* Compact Toggle Switch */}
        <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-xl border border-surface-container-high/40">
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-code-telemetry text-xs font-bold transition-all ${
              theme === 'light'
                ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px] text-amber-500">light_mode</span>
            <span>White (Default)</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-code-telemetry text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'bg-primary text-on-primary shadow-primary-glow'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">dark_mode</span>
            <span>Dark NOC</span>
          </button>
        </div>
      </div>

      {/* 2. Profile Details & Recorded Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Left: Operator Card */}
        <div className="bg-surface-container-lowest p-4.5 rounded-2xl border border-surface-container-high/60 shadow-card flex flex-col items-center text-center justify-between">
          <div className="flex flex-col items-center w-full">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-primary-glow mb-2.5">
              KR
            </div>
            <h2 className="font-headline-md text-sm font-bold text-on-surface">Kumaran R</h2>
            <span className="font-code-telemetry text-xs text-secondary mt-0.5 font-semibold">DevOps Lead</span>
            <span className="px-2.5 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary font-code-telemetry text-[10px] font-bold mt-2">
              SecOps Sign-Off
            </span>

            <div className="w-full border-t border-surface-container-high/40 mt-3.5 pt-3 flex flex-col gap-2 text-left font-body-sm text-xs">
              <div className="flex justify-between text-secondary">
                <span>Email:</span>
                <span className="font-code-telemetry text-on-surface font-semibold text-[11px]">kumaran@cogninet.ai</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Role:</span>
                <span className="font-code-telemetry text-primary font-bold text-[11px]">DevOps Lead</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Station:</span>
                <span className="font-code-telemetry text-on-surface font-semibold text-[11px]">NOC-STATION-04</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>IP Origin:</span>
                <span className="font-code-telemetry text-on-surface font-semibold text-[11px]">10.100.4.12</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Fabric:</span>
                <span className="font-code-telemetry text-on-surface font-semibold text-[11px]">AS64512 Core</span>
              </div>
              <div className="flex justify-between text-secondary">
                <span>Session:</span>
                <span className="font-code-telemetry text-tertiary font-bold text-[11px]">Active (TLS 1.3)</span>
              </div>
            </div>
          </div>

          <div className="w-full pt-3 mt-3 border-t border-surface-container-high/40">
            <div className="flex items-center justify-center gap-1.5 font-code-telemetry text-[10px] text-tertiary font-bold bg-tertiary-container/10 py-1.5 px-2 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span>LIVE SESSION RECORDING</span>
            </div>
          </div>
        </div>

        {/* Right: Recorded Audit Log */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-4.5 rounded-2xl border border-surface-container-high/60 shadow-card flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2.5 border-b border-surface-container-high/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary">history</span>
                <h3 className="font-headline-md text-xs font-bold text-on-surface">
                  Recorded Operator Actions &amp; Audit Trail
                </h3>
              </div>
              <span className="font-code-telemetry text-[10px] font-bold text-secondary bg-surface-container px-2 py-0.5 rounded-md">
                Encrypted Log
              </span>
            </div>

            {/* Audit Log Timeline */}
            <div className="flex flex-col gap-2">
              <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary text-on-primary flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">bolt</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-on-surface">Auto-Mitigation Policy Executed</span>
                    <span className="text-[11px] text-secondary">
                      Traffic drained from <strong className="font-code-telemetry text-on-surface">Router-Core-R3</strong> to backup trunks R1/R2.
                    </span>
                  </div>
                </div>
                <span className="font-code-telemetry text-[10px] text-secondary shrink-0">Just now</span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-error-container text-error flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">search</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-on-surface">Alarm Inspected (ALM-1092)</span>
                    <span className="text-[11px] text-secondary">
                      Inspected optical power attenuation loss on port <span className="font-code-telemetry">eth0</span> (-21.4 dBm).
                    </span>
                  </div>
                </div>
                <span className="font-code-telemetry text-[10px] text-secondary shrink-0">18m ago</span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-tertiary-container/20 text-tertiary flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">psychology</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-on-surface">AI Root Cause Correlation Confirmed</span>
                    <span className="text-[11px] text-secondary">
                      Correlated 4 active alarms into Root Incident <strong className="font-code-telemetry text-primary">INC-001</strong> (91% confidence).
                    </span>
                  </div>
                </div>
                <span className="font-code-telemetry text-[10px] text-secondary shrink-0">24m ago</span>
              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-lg bg-surface-container text-secondary flex items-center justify-center text-xs shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[14px]">login</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-xs text-on-surface">SecOps Console Session Initialized</span>
                    <span className="text-[11px] text-secondary">
                      Authenticated from workstation IP 10.100.4.12 with SHA-256 session token.
                    </span>
                  </div>
                </div>
                <span className="font-code-telemetry text-[10px] text-secondary shrink-0">1h ago</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-surface-container-high/40 flex items-center justify-between mt-3">
            <span className="font-code-telemetry text-[10px] text-secondary">
              All operator actions recorded for autonomous compliance
            </span>
            <button
              onClick={() => alert('Audit log exported with SHA-256 signature.')}
              className="px-3 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-headline-md text-xs font-semibold border border-surface-container-high/60 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              <span>Export Audit Log</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
