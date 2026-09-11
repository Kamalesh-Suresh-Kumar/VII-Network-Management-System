import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = 'inbox',
  actionLabel,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 min-h-[280px] w-full bg-surface-container-lowest rounded-2xl border border-surface-container-high/60 shadow-card text-center">
      <div className="w-12 h-12 rounded-2xl bg-surface-container-low flex items-center justify-center text-secondary mb-3">
        <span className="material-symbols-outlined text-[26px]">{icon}</span>
      </div>
      <h3 className="font-headline-md text-sm font-bold text-on-surface">{title}</h3>
      <p className="font-body-sm text-xs text-secondary mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-3 px-3.5 py-1.5 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface font-headline-md text-xs font-semibold border border-surface-container-high transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
