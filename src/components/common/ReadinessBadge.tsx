import React from 'react';
import type { ResettlementStatus } from '../../types';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface Props {
  status: ResettlementStatus;
  percentage?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const ReadinessBadge: React.FC<Props> = ({ status, percentage, size = 'md' }) => {
  let style = 'bg-rose-950/90 text-rose-300 border-rose-700/80';
  let icon = <XCircle className="w-4 h-4 text-rose-400" />;
  let label = 'NOT READY FOR MOVE-IN';

  if (status === 'FULLY_READY') {
    style = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
    icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    label = 'READY FOR SAFE MOVE-IN';
  } else if (status === 'CONDITIONALLY_READY') {
    style = 'bg-amber-950/80 text-amber-300 border-amber-700/60';
    icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
    label = 'CONDITIONALLY READY FOR MOVE-IN';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs sm:text-sm gap-1.5 font-medium',
    lg: 'px-4 py-2 text-sm sm:text-base gap-2 font-bold tracking-wide'
  }[size];

  return (
    <div className={`inline-flex items-center rounded-lg border shadow-md ${style} ${sizeClasses}`}>
      {icon}
      <span>{label}</span>
      {percentage !== undefined && (
        <span className="ml-1.5 px-1.5 py-0.5 bg-black/40 rounded text-xs font-mono font-bold">
          {percentage}%
        </span>
      )}
    </div>
  );
};
