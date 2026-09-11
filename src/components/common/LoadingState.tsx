import React from 'react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading Telemetry Stream...', 
  subMessage = 'Synchronizing real-time telemetry from mesh nodes' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[320px] w-full bg-surface-container-lowest rounded-2xl border border-surface-container-high/60 shadow-card">
      <div className="relative flex items-center justify-center w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping"></div>
        <div className="w-12 h-12 rounded-full border-3 border-t-primary border-r-primary/40 border-b-primary/10 border-l-transparent animate-spin"></div>
        <span className="material-symbols-outlined text-primary text-[22px] absolute">psychology</span>
      </div>
      <h3 className="font-headline-md text-base font-bold text-on-surface">{message}</h3>
      <p className="font-body-sm text-xs text-secondary mt-1">{subMessage}</p>
    </div>
  );
};
