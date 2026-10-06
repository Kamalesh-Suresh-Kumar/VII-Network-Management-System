import React, { useMemo } from 'react';
import { TelemetryRecord } from '../../services/api';

interface Props {
  telemetry: TelemetryRecord[];
  timeRange?: '1H' | '6H' | '24H' | '7D';
}

const RANGE_MS: Record<NonNullable<Props['timeRange']>, number> = {
  '1H': 60 * 60 * 1000,
  '6H': 6 * 60 * 60 * 1000,
  '24H': 24 * 60 * 60 * 1000,
  '7D': 7 * 24 * 60 * 60 * 1000,
};

export const RealTelemetryChart: React.FC<Props> = ({
  telemetry,
  timeRange = '24H',
}) => {
  const samples = useMemo(() => {
    const now = Date.now();
    const cutoff = now - RANGE_MS[timeRange];

    return telemetry
      .filter(t =>
        t.metricName === 'interface_oper_status' &&
        new Date(t.timestamp).getTime() >= cutoff
      )
      .sort(
        (a, b) =>
          new Date(a.timestamp).getTime() -
          new Date(b.timestamp).getTime()
      )
      .slice(-40);
  }, [telemetry, timeRange]);

  const chart = useMemo(() => {
    if (!samples.length) {
      return {
        points: '',
        area: '',
        latest: 0,
        up: 0,
        down: 0,
      };
    }

    const width = 800;
    const height = 190;

    const points = samples.map((sample, index) => {
      const x =
        samples.length === 1
          ? width / 2
          : (index / (samples.length - 1)) * width;

      // Real SNMP operational state:
      // 1 = UP
      // 0 = DOWN
      const y = sample.metricValue === 1 ? 55 : 150;

      return `${x},${y}`;
    });

    const latest = samples[samples.length - 1].metricValue;

    const up = samples.filter(
      s => s.metricValue === 1
    ).length;

    const down = samples.filter(
      s => s.metricValue === 0
    ).length;

    return {
      points: points.join(' '),
      area: `M ${points[0]} L ${points.join(' L ')} L ${width},180 L 0,180 Z`,
      latest,
      up,
      down,
    };
  }, [samples]);

  const latestStatus =
    chart.latest === 1 ? 'ALL UP' : 'INTERFACE DOWN';

  return (
    <div className="relative w-full">

      {/* Real telemetry counters */}
      <div className="grid grid-cols-3 gap-2.5 py-2.5">

        <div className="p-2 bg-surface-container-low rounded-xl border border-surface-container-high/30 flex items-center justify-between">
          <span className="font-label-caps text-[10px] text-secondary uppercase font-semibold">
            Samples
          </span>

          <span className="font-code-telemetry text-[12px] font-bold text-on-surface">
            {samples.length}
          </span>
        </div>

        <div className="p-2 bg-surface-container-low rounded-xl border border-surface-container-high/30 flex items-center justify-between">
          <span className="font-label-caps text-[10px] text-secondary uppercase font-semibold">
            UP Samples
          </span>

          <span className="font-code-telemetry text-[12px] font-bold text-tertiary">
            {chart.up}
          </span>
        </div>

        <div className="p-2 bg-surface-container-low rounded-xl border border-surface-container-high/30 flex items-center justify-between">
          <span className="font-label-caps text-[10px] text-secondary uppercase font-semibold">
            DOWN Samples
          </span>

          <span className="font-code-telemetry text-[12px] font-bold text-error">
            {chart.down}
          </span>
        </div>
      </div>

      {/* Graph */}
      <div className="relative w-full h-[200px]">

        {!samples.length ? (
          <div className="h-full flex items-center justify-center text-secondary text-sm">
            No SNMP telemetry available for this period
          </div>
        ) : (
          <>
            <svg
              className="w-full h-full overflow-visible"
              preserveAspectRatio="none"
              viewBox="0 0 800 200"
            >
              {/* UP reference line */}
              <line
                stroke="#eceef2"
                strokeDasharray="4 4"
                strokeWidth="1"
                x1="0"
                x2="800"
                y1="55"
                y2="55"
              />

              {/* DOWN reference line */}
              <line
                stroke="#eceef2"
                strokeDasharray="4 4"
                strokeWidth="1"
                x1="0"
                x2="800"
                y1="150"
                y2="150"
              />

              {/* Same visual filled waveform style */}
              <path
                d={chart.area}
                fill="rgba(0,105,71,0.08)"
              />

              {/* Real telemetry line */}
              <polyline
                points={chart.points}
                fill="none"
                stroke="#006947"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
              />

              {/* Real UP/DOWN points */}
              {samples.map((sample, index) => {
                const x =
                  samples.length === 1
                    ? 400
                    : (index / (samples.length - 1)) * 800;

                const y =
                  sample.metricValue === 1
                    ? 55
                    : 150;

                return (
                  <circle
                    key={`${sample.id}-${index}`}
                    cx={x}
                    cy={y}
                    r="4"
                    fill={
                      sample.metricValue === 1
                        ? '#006947'
                        : '#ba1a1a'
                    }
                  />
                );
              })}
            </svg>

            <div className="absolute left-2 top-1 font-code-telemetry text-[10px] text-tertiary font-bold">
              UP = 1
            </div>

            <div className="absolute left-2 bottom-3 font-code-telemetry text-[10px] text-error font-bold">
              DOWN = 0
            </div>

            <div className="absolute right-2 top-1 px-2 py-1 rounded-md bg-on-surface text-surface-bright font-code-telemetry text-[10px]">
              LIVE: {latestStatus}
            </div>
          </>
        )}
      </div>

      {/* Real timestamps */}
      <div className="flex justify-between items-center text-secondary font-code-telemetry text-[11px] pt-1.5">

        <span>
          {samples.length
            ? new Date(
                samples[0].timestamp
              ).toLocaleTimeString()
            : '--'}
        </span>

        <span className="text-tertiary font-bold">
          Real SNMP interface telemetry
        </span>

        <span>
          {samples.length
            ? new Date(
                samples[samples.length - 1].timestamp
              ).toLocaleTimeString()
            : '--'}
        </span>

      </div>
    </div>
  );
};
