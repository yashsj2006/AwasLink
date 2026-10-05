import React from 'react';
import type { Project } from '../../types';
import { calculateResettlementReadiness } from '../../services/riskEngine';
import { ReadinessBadge } from '../common/ReadinessBadge';
import { 
  Home, 
  CheckSquare, 
  Users, 
  HeartHandshake
} from 'lucide-react';

interface Props {
  project: Project;
  allProjects: Project[];
  onSelectProject: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const ResettlementReadinessView: React.FC<Props> = ({
  project,
  allProjects,
  onSelectProject
}) => {
  const readiness = calculateResettlementReadiness(project);

  return (
    <div className="space-y-8 py-4">
      {/* Header Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
              FINAL GOVERNANCE DECISION
            </span>
            <span className="text-xs text-slate-400">Resettlement Readiness Certificate Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Resettlement Assurance & Occupancy Authorization
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
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Resettlement Certificate Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              Overall Resettlement Readiness Score
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black text-white font-mono">
                RESETTLEMENT READINESS: {readiness.overallPercentage}%
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-300">
              Project: <strong className="text-white">{project.name}</strong> ({project.location})
            </p>
          </div>

          <div>
            <ReadinessBadge status={readiness.status} percentage={readiness.overallPercentage} size="lg" />
          </div>
        </div>

        {/* Explainable Decision Quote Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 space-y-2">
          <span className="text-[10px] uppercase font-bold text-emerald-400 font-mono tracking-wider">
            Official Municipal Decision Rationale
          </span>
          <p className="text-base font-semibold italic text-slate-100 leading-relaxed">
            «“{readiness.explanation}”»
          </p>
        </div>
      </div>

      {/* 4 Pillars Breakdown */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Pillar 1: Housing */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Home className="w-4 h-4 text-emerald-400" />
              1. Housing Unit Readiness
            </span>
            <span className="font-mono font-bold text-emerald-400">{readiness.pillarScores.housing}%</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Superstructure Construction</span>
              <span className="font-mono font-bold">{project.constructionProgressPct}%</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Structural Safety Audit</span>
              <span className="text-emerald-400 font-bold">🟢 Certified</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Occupancy NOC</span>
              <span className={project.constructionProgressPct >= 90 ? 'text-emerald-400' : 'text-amber-400'}>
                {project.constructionProgressPct >= 90 ? '🟢 Ready' : '🟡 Pending Inspection'}
              </span>
            </div>
          </div>
        </div>

        {/* Pillar 2: Basic Services */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-cyan-400" />
              2. Basic Services Readiness
            </span>
            <span className="font-mono font-bold text-cyan-400">{readiness.pillarScores.basicServices}%</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Water & Electricity</span>
              <span className="text-emerald-400 font-bold">🟢 Ready</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Sewerage & Roads</span>
              <span className="text-rose-400 font-bold">🔴 3 Gaps Pending</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Waste & Streetlights</span>
              <span className="text-amber-400 font-bold">🟡 Partial</span>
            </div>
          </div>
        </div>

        {/* Pillar 3: Social Infrastructure */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <HeartHandshake className="w-4 h-4 text-rose-400" />
              3. Social Infrastructure
            </span>
            <span className="font-mono font-bold text-rose-400">{readiness.pillarScores.socialInfra}%</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Healthcare (PHC Access)</span>
              <span className="text-amber-400 font-bold">🟡 2.2km away</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Primary School Access</span>
              <span className="text-emerald-400 font-bold">🟢 800m away</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Public Transit Access</span>
              <span className="text-emerald-400 font-bold">🟢 Rail / Bus</span>
            </div>
          </div>
        </div>

        {/* Pillar 4: Administrative */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-400" />
              4. Beneficiary Allocation
            </span>
            <span className="font-mono font-bold text-emerald-400">{readiness.pillarScores.administrative}%</span>
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Biometric Verification</span>
              <span className="text-emerald-400 font-bold">🟢 94% Verified</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Document Audit</span>
              <span className="text-emerald-400 font-bold">🟢 Annexure II Clear</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Flat Lottery Allotment</span>
              <span className="text-amber-400 font-bold">🟡 Phased Allotment</span>
            </div>
          </div>
        </div>
      </section>

      {/* Itemized Service Readiness Status List */}
      <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-base">Itemized Readiness Summary (12 Services & Housing)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {project.basicServices.map(svc => (
            <div key={svc.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
              <span className="text-slate-200 font-semibold">{svc.name}</span>
              {svc.status === 'READY' && <span className="text-emerald-400 font-bold">🟢 Ready</span>}
              {svc.status === 'PARTIAL' && <span className="text-amber-400 font-bold">🟡 Limited / Partial</span>}
              {svc.status === 'NOT_READY' && <span className="text-rose-400 font-bold">🔴 Not Ready</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
