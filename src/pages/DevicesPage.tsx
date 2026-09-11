import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { getDevices } from '../services/api';
import { Device } from '../types';

export const DevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const searchParam = searchParams.get('q') || '';

  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const navigate = useNavigate();

  const fetchDeviceList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDevices(searchTerm, roleFilter);
      setDevices(data);
    } catch (err) {
      setError('Could not retrieve device fleet telemetry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceList();
  }, [roleFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDeviceList();
  };

  const filteredDevices = devices.filter((dev) => {
    if (statusFilter !== 'all' && dev.status !== statusFilter) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        dev.name.toLowerCase().includes(q) ||
        dev.id.toLowerCase().includes(q) ||
        dev.ipAddress.toLowerCase().includes(q) ||
        dev.role.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCount = devices.length;
  const healthyCount = devices.filter(d => d.status === 'healthy').length;
  const warningCount = devices.filter(d => d.status === 'warning').length;
  const criticalCount = devices.filter(d => d.status === 'critical').length;

  return (
    <div className="flex-1 flex flex-col gap-3.5 min-w-0">
      {/* Header */}
      <Header
        breadcrumbCategory="Devices"
        breadcrumbSub="Fleet Telemetry"
        title="Managed Devices"
        subtitle="Autonomous multi-region fabric & telemetry diagnostics panel"
        icon="router"
        onSearch={(q) => {
          setSearchTerm(q);
        }}
      />

      {/* Top Title Row + Export Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h2 className="font-headline-xl text-xl font-bold text-on-surface tracking-tight">Devices Fleet</h2>
          <span className="px-2 py-0.5 rounded-md bg-surface-container-high text-on-surface font-code-telemetry text-xs font-semibold">
            {totalCount} Nodes Configured
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => alert('Exporting Fleet CSV...')}
            className="px-3 py-1.5 rounded-xl bg-surface-container-lowest border border-surface-container hover:bg-surface-container text-on-surface font-headline-md text-xs flex items-center gap-1.5 shadow-sm transition-all" 
            type="button"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">file_download</span>
            <span>Export Fleet CSV</span>
          </button>
          <button 
            onClick={() => alert('Add node workflow: Telemetry agent auto-discovery listening on 10.240.0.0/16 subnet.')}
            className="px-3 py-1.5 rounded-xl bg-primary text-on-primary font-headline-md text-xs shadow-primary-glow hover:opacity-95 flex items-center gap-1.5 transition-all font-semibold" 
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>Register Node</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        {/* Total */}
        <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-high/60 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[11px] uppercase tracking-wider font-semibold text-secondary">Total Fleet</span>
            <div className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[18px]">hub</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-title-kpi text-2xl font-bold text-on-surface leading-none">{totalCount}</span>
            <span className="font-code-telemetry text-[11px] text-secondary">All managed nodes</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-secondary h-full rounded-full w-full"></div>
          </div>
        </div>

        {/* Online */}
        <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-high/60 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[11px] uppercase tracking-wider font-semibold text-secondary">Online / Healthy</span>
            <span className="flex items-center gap-1 font-label-caps text-[10px] px-2 py-0.5 rounded-full bg-tertiary-container/15 text-tertiary font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              {totalCount > 0 ? ((healthyCount / totalCount) * 100).toFixed(1) : 0}%
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-title-kpi text-2xl font-bold text-tertiary leading-none">{healthyCount}</span>
            <span className="font-code-telemetry text-[11px] text-tertiary font-medium">Healthy State</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-tertiary h-full rounded-full" style={{ width: `${(healthyCount / (totalCount || 1)) * 100}%` }}></div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-high/60 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[11px] uppercase tracking-wider font-semibold text-secondary">Warning</span>
            <span className="flex items-center gap-1 font-label-caps text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
              Sub-optimal
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-title-kpi text-2xl font-bold text-amber-700 leading-none">{warningCount}</span>
            <span className="font-code-telemetry text-[11px] text-secondary">Congestion Alert</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(warningCount / (totalCount || 1)) * 100}%` }}></div>
          </div>
        </div>

        {/* Critical */}
        <div className="bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-high/60 shadow-card flex flex-col justify-between border-l-4 border-l-error">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-[11px] uppercase tracking-wider font-semibold text-secondary">Critical</span>
            <span className="flex items-center gap-1 font-label-caps text-[10px] px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping"></span>
              P0 Action Required
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <span className="font-title-kpi text-2xl font-bold text-error leading-none">{criticalCount}</span>
            <span className="font-code-telemetry text-[11px] text-error font-semibold">Node R3 Degraded</span>
          </div>
          <div className="w-full bg-surface-container-high h-1 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-error h-full rounded-full" style={{ width: `${(criticalCount / (totalCount || 1)) * 100}%` }}></div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-surface-container-lowest p-3 rounded-2xl border border-surface-container-high/60 shadow-card flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl flex-1 max-w-md border border-surface-container-high/40">
          <span className="material-symbols-outlined text-secondary text-[18px]">search</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search devices by hostname, IP, role..."
            className="bg-transparent border-none outline-none font-body-sm text-xs text-on-surface w-full placeholder:text-secondary focus:ring-0 p-0"
          />
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} className="text-secondary hover:text-on-surface text-xs">
              ✕
            </button>
          )}
        </form>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-xl border border-surface-container-high/40 text-xs">
            <span className="text-secondary font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-on-surface border-none p-0 focus:ring-0 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="healthy">Healthy ({healthyCount})</option>
              <option value="warning">Warning ({warningCount})</option>
              <option value="critical">Critical ({criticalCount})</option>
            </select>
          </div>

          {/* Role Filter */}
          <div className="flex items-center gap-1.5 bg-surface-container-low px-2.5 py-1.5 rounded-xl border border-surface-container-high/40 text-xs">
            <span className="text-secondary font-medium">Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent text-xs font-semibold text-on-surface border-none p-0 focus:ring-0 cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="Core Router">Core Routers</option>
              <option value="Edge Router">Edge Routers</option>
              <option value="Distribution Switch">Distribution</option>
              <option value="DC Server Cluster">DC Servers</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Devices Table */}
      {loading ? (
        <LoadingState message="Querying Device Telemetry..." subMessage="Reading interface counters and latency statistics" />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchDeviceList} />
      ) : filteredDevices.length === 0 ? (
        <EmptyState
          title="No matching devices found"
          description="Try adjusting your search query or status filter to locate managed nodes."
          icon="router"
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchTerm('');
            setStatusFilter('all');
            setRoleFilter('all');
          }}
        />
      ) : (
        <div className="bg-surface-container-lowest rounded-2xl border border-surface-container-high/60 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body-sm text-xs">
              <thead>
                <tr className="bg-surface-container-low/50 text-secondary font-label-caps text-[10px] uppercase border-b border-surface-container-high/60">
                  <th className="py-3 px-4">Node / Hostname</th>
                  <th className="py-3 px-3">Role &amp; OS</th>
                  <th className="py-3 px-3">IP Address</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">CPU</th>
                  <th className="py-3 px-3">Memory</th>
                  <th className="py-3 px-3">Latency</th>
                  <th className="py-3 px-3">Loss</th>
                  <th className="py-3 px-3">Interfaces</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-high/40">
                {filteredDevices.map((dev) => (
                  <tr
                    key={dev.id}
                    onClick={() => navigate(`/devices/${dev.id}`)}
                    className={`hover:bg-surface-container-low/80 transition-colors cursor-pointer ${
                      dev.status === 'critical' ? 'bg-error-container/15' : ''
                    }`}
                  >
                    {/* Hostname */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                            dev.status === 'critical'
                              ? 'bg-error text-on-error shadow-sm animate-pulse'
                              : dev.status === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-surface-container text-secondary'
                          }`}
                        >
                          {dev.id}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-headline-md text-xs font-bold text-on-surface truncate">
                            {dev.name}
                          </span>
                          <span className="font-code-telemetry text-[10px] text-secondary truncate">
                            {dev.location}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role & OS */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-on-surface">{dev.role}</span>
                        <span className="font-code-telemetry text-[10px] text-secondary truncate max-w-[140px]">
                          {dev.osVersion}
                        </span>
                      </div>
                    </td>

                    {/* IP */}
                    <td className="py-3 px-3 font-code-telemetry text-xs font-semibold text-on-surface">
                      {dev.ipAddress}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-caps text-[9px] uppercase font-bold ${
                          dev.status === 'critical'
                            ? 'bg-error-container text-on-error-container'
                            : dev.status === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-tertiary-container/20 text-tertiary'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            dev.status === 'critical'
                              ? 'bg-error animate-ping'
                              : dev.status === 'warning'
                              ? 'bg-amber-500'
                              : 'bg-tertiary'
                          }`}
                        ></span>
                        {dev.status}
                      </span>
                    </td>

                    {/* CPU */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              dev.cpu > 80 ? 'bg-error' : dev.cpu > 60 ? 'bg-amber-500' : 'bg-tertiary'
                            }`}
                            style={{ width: `${dev.cpu}%` }}
                          ></div>
                        </div>
                        <span
                          className={`font-code-telemetry text-xs font-bold ${
                            dev.cpu > 80 ? 'text-error' : 'text-on-surface'
                          }`}
                        >
                          {dev.cpu}%
                        </span>
                      </div>
                    </td>

                    {/* Memory */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="font-code-telemetry text-xs font-semibold text-on-surface">
                          {dev.memory}%
                        </span>
                        {dev.memoryUsedGb && dev.memoryTotalGb && (
                          <span className="font-code-telemetry text-[9px] text-secondary">
                            {dev.memoryUsedGb}/{dev.memoryTotalGb} GB
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Latency */}
                    <td className="py-3 px-3">
                      <span
                        className={`font-code-telemetry text-xs font-bold ${
                          dev.latency > 100 ? 'text-error' : dev.latency > 30 ? 'text-amber-700' : 'text-on-surface'
                        }`}
                      >
                        {dev.latency} ms
                      </span>
                    </td>

                    {/* Loss */}
                    <td className="py-3 px-3">
                      <span
                        className={`font-code-telemetry text-xs font-bold ${
                          dev.packetLoss > 5 ? 'text-error' : dev.packetLoss > 1 ? 'text-amber-700' : 'text-tertiary'
                        }`}
                      >
                        {dev.packetLoss}%
                      </span>
                    </td>

                    {/* Interfaces */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 font-code-telemetry text-[10px]">
                        <span className="text-secondary font-semibold">{dev.interfaces.length} Ports</span>
                        {dev.interfaces.some(i => i.status === 'down') && (
                          <span className="px-1 py-0.2 rounded bg-error text-on-error font-bold text-[9px]">
                            1 Down
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => navigate(`/devices/${dev.id}`)}
                          className="p-1 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface transition-colors"
                          title="Inspect Telemetry"
                        >
                          <span className="material-symbols-outlined text-[17px]">query_stats</span>
                        </button>
                        {dev.status === 'critical' && (
                          <button
                            onClick={() => navigate('/ai-rca')}
                            className="px-2 py-0.5 rounded-lg bg-primary text-on-primary font-headline-md text-[10px] font-bold shadow-sm hover:opacity-90"
                            title="Open RCA"
                          >
                            AI RCA
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
