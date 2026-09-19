import React from 'react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load telemetry data',
  message = 'An error occurred while communicating with the telemetry collector.',
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[320px] w-full bg-surface-container-lowest rounded-2xl border border-error/20 shadow-card text-center">
      <div className="w-14 h-14 rounded-2xl bg-error-container/40 flex items-center justify-center text-error mb-4">
        <span className="material-symbols-outlined text-[30px]">error</span>
      </div>
      <h3 className="font-headline-md text-base font-bold text-error">{title}</h3>
      <p className="font-body-sm text-xs text-secondary mt-1 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-2 rounded-xl bg-primary text-on-primary font-headline-md text-xs font-semibold shadow-primary-glow hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Retry Telemetry Query
        </button>
      )}
    </div>
  );
};
