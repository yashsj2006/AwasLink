import React from 'react';
import type { Project } from '../../types';
import { calculateServiceReadiness } from '../../services/riskEngine';
import { ReadinessBadge } from '../common/ReadinessBadge';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ShieldAlert, 
  Droplets, 
  Zap, 
  Activity, 
  Truck, 
  Compass, 
  Sun, 
  Trash2, 
  Sparkles, 
  Hospital, 
  GraduationCap, 
  Bus,
  CheckSquare
} from 'lucide-react';

interface Props {
  project: Project;
  allProjects: Project[];
  onSelectProject: (id: string) => void;
  onUpdateServiceStatus?: (serviceId: string, status: 'READY' | 'PARTIAL' | 'NOT_READY') => void;
}

export const ServiceReadinessView: React.FC<Props> = ({
  project,
  allProjects,
  onSelectProject
}) => {
  const serviceStats = calculateServiceReadiness(project.basicServices);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case 'Drinking Water': return <Droplets className="w-5 h-5 text-cyan-400" />;
      case 'Electricity': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'Sewerage': return <Activity className="w-5 h-5 text-rose-400" />;
      case 'Drainage': return <Truck className="w-5 h-5 text-indigo-400" />;
      case 'Internal Roads': return <Compass className="w-5 h-5 text-amber-500" />;
      case 'Street Lighting': return <Sun className="w-5 h-5 text-yellow-400" />;
      case 'Solid Waste Collection': return <Trash2 className="w-5 h-5 text-emerald-400" />;
      case 'Sanitation': return <Sparkles className="w-5 h-5 text-teal-400" />;
      case 'Healthcare Accessibility': return <Hospital className="w-5 h-5 text-rose-400" />;
      case 'School Accessibility': return <GraduationCap className="w-5 h-5 text-blue-400" />;
      case 'Public Transport Accessibility': return <Bus className="w-5 h-5 text-emerald-400" />;
      default: return <CheckSquare className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold">
              12-SERVICE AUDIT MATRIX
            </span>
            <span className="text-xs text-slate-400">Settlement Infrastructure Verification</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Settlement Basic-Service Readiness Index
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Project:</span>
          <select
            value={project.id}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-slate-950 text-white font-bold text-sm px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
          >
            {allProjects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.serviceReadinessPct}% Ready)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Readiness Gauge Score Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              Overall Settlement Readiness Score
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black text-white font-mono">
                {serviceStats.percentage}%
              </span>
              <span className="text-slate-400 text-sm font-semibold">of 12 essential services verified</span>
            </div>
            <p className="text-xs text-slate-300">
              {serviceStats.readyCount} Ready | {serviceStats.partialCount} Partial | {serviceStats.notReadyCount} Not Ready
            </p>
          </div>

          <div className="space-y-2 text-right">
            <ReadinessBadge status={project.resettlementStatus} percentage={serviceStats.percentage} size="lg" />
          </div>
        </div>

        {/* Critical Service Safeguard Banner (Section 6 Requirement) */}
        {serviceStats.criticalMissingCount > 0 && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 flex items-start gap-3 shadow-lg">
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <span className="font-extrabold uppercase tracking-wider text-rose-300">
                🔴 NOT READY FOR RESETTLEMENT — CRITICAL SERVICE BLOCKER
              </span>
              <p className="font-medium leading-relaxed">
                «{serviceStats.criticalMissingCount} critical basic service(s) require intervention before full family resettlement can be authorized.»
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 12-Service Detailed Grid Matrix */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-white">12 Core Settlement Services Matrix</h2>
          <span className="text-xs text-slate-400">Inspected by Municipal Engineers & SRA</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.basicServices.map(svc => {
            let statusBadge = (
              <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-700 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Not Ready
              </span>
            );

            if (svc.status === 'READY') {
              statusBadge = (
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                </span>
              );
            } else if (svc.status === 'PARTIAL') {
              statusBadge = (
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-700 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Partial
                </span>
              );
            }

            return (
              <div 
                key={svc.id}
                className={`p-4 rounded-xl bg-slate-900 border space-y-3 transition-all ${
                  svc.critical && svc.status !== 'READY' ? 'border-rose-800/80 bg-rose-950/10' : 'border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                      {getServiceIcon(svc.name)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
                        <span>{svc.name}</span>
                        {svc.critical && (
                          <span className="px-1.5 py-0.2 rounded bg-rose-950 text-rose-400 text-[10px] font-mono border border-rose-800">
                            CRITICAL
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 uppercase font-mono">{svc.category}</div>
                    </div>
                  </div>
                  {statusBadge}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                    <span>Completion Progress</span>
                    <span>{svc.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full ${
                        svc.status === 'READY' ? 'bg-emerald-500' : svc.status === 'PARTIAL' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${svc.completionPercentage}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed">
                  <p>{svc.notes}</p>
                  <div className="mt-1.5 text-[10px] text-slate-400 font-mono flex justify-between border-t border-slate-800/60 pt-1">
                    <span>Inspector: {svc.inspectorName}</span>
                    <span>{svc.lastInspected}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
