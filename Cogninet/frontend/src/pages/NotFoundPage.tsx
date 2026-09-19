import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col gap-3.5 min-w-0">
      <Header
        breadcrumbCategory="System"
        breadcrumbSub="404"
        title="Page Not Found"
        subtitle="The requested telemetry route does not exist"
        icon="error"
      />

      <div className="flex flex-col items-center justify-center p-16 bg-surface-container-lowest rounded-2xl border border-surface-container-high/60 shadow-card text-center my-auto">
        <div className="w-16 h-16 rounded-2xl bg-surface-container flex items-center justify-center text-primary text-2xl font-bold mb-4 font-code-telemetry">
          404
        </div>
        <h2 className="font-headline-lg text-lg font-bold text-on-surface">Route Vector Unreachable</h2>
        <p className="font-body-sm text-xs text-secondary mt-1 max-w-md">
          The requested NOC console path is not mapped to any known telemetry module or active mesh router.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-5 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-headline-md text-xs font-bold shadow-primary-glow hover:opacity-90 transition-all flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">grid_view</span>
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
};
