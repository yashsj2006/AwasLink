import React from 'react';
import type { RiskLevel } from '../../types';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export const RiskBadge: React.FC<Props> = ({ score, level, size = 'md', showScore = true }) => {
  let bgColor = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
  let icon = <ShieldCheck className="w-4 h-4 text-emerald-400" />;
  let label = 'LOW DELAY RISK';

  if (level === 'HIGH' || score >= 66) {
    bgColor = 'bg-rose-950/90 text-rose-300 border-rose-700/70 animate-pulse';
    icon = <ShieldAlert className="w-4 h-4 text-rose-400" />;
    label = 'HIGH DELAY RISK';
  } else if (level === 'MEDIUM' || score >= 36) {
    bgColor = 'bg-amber-950/80 text-amber-300 border-amber-700/60';
    icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
    label = 'MEDIUM DELAY RISK';
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs sm:text-sm gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm sm:text-base gap-2 font-semibold'
  }[size];

  return (
    <div className={`inline-flex items-center rounded-full border shadow-sm ${bgColor} ${sizeClasses}`}>
      {icon}
      <span>{label}</span>
      {showScore && (
        <span className="ml-1 opacity-90 border-l border-current pl-1.5 font-mono font-bold">
          {score}/100
        </span>
      )}
    </div>
  );
};
