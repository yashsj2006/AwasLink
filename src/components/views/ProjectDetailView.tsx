import React from 'react';
import type { Project, UserRole } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { ReadinessBadge } from '../common/ReadinessBadge';
import { AIService } from '../../services/aiService';
import { 
  Building2, 
  MapPin, 
  Users, 
  Calendar, 
  HardHat, 
  Clock, 
  FileText, 
  TrendingUp, 
  BrainCircuit, 
  Edit3, 
  ShieldCheck
} from 'lucide-react';

interface Props {
  project: Project;
  currentRole: UserRole;
  allProjects: Project[];
  onSelectProject: (id: string) => void;
  onOpenMilestoneModal: (project: Project) => void;
}

export const ProjectDetailView: React.FC<Props> = ({
  project,
  currentRole,
  allProjects,
  onSelectProject,
  onOpenMilestoneModal
}) => {
  // AI Delay Prediction for this project
  const delayPrediction = AIService.predictProjectDelay(project);

  return (
    <div className="space-y-8 py-4">
      {/* Top Project Navigation Selector */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Selected Redevelopment Project:</span>
          <select
            value={project.id}
            onChange={(e) => onSelectProject(e.target.value)}
            className="bg-slate-950 text-white font-bold text-sm px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-emerald-500"
          >
            {allProjects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.riskLevel} Risk)
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <RiskBadge score={project.riskScore} level={project.riskLevel} size="md" />
          <ReadinessBadge status={project.resettlementStatus} size="md" />
        </div>
      </div>

      {/* Main Project Header Card */}
      <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
                {project.code}
              </span>
              <span className="text-xs text-slate-400">Current Phase: <strong className="text-white">{project.currentPhase}</strong></span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {project.name}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{project.location}</span>
            </div>
          </div>

          {(currentRole === 'officer' || currentRole === 'developer') && (
            <button
              onClick={() => onOpenMilestoneModal(project)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all"
            >
              <Edit3 className="w-4 h-4" />
              <span>Update Milestones & Progress</span>
            </button>
          )}
        </div>

        {/* Project Meta Information Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Total Households</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">{project.totalHouseholds.toLocaleString()}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Beneficiaries</span>
            </div>
            <div className="text-lg font-bold text-emerald-400 font-mono">
              {project.verifiedBeneficiaries.toLocaleString()} ({Math.round(project.verifiedBeneficiaries / project.eligibleBeneficiaries * 100)}%)
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <HardHat className="w-3.5 h-3.5 text-amber-400" />
              <span>Developer Partner</span>
            </div>
            <div className="text-xs font-bold text-slate-200 truncate">{project.developerName}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Start Date</span>
            </div>
            <div className="text-xs font-bold text-slate-200 font-mono">{project.startDate}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Expected Completion</span>
            </div>
            <div className="text-xs font-bold text-rose-300 font-mono">{project.revisedCompletionDate}</div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="text-slate-400 flex items-center gap-1 mb-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Construction Completed</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">{project.constructionProgressPct}%</div>
          </div>
        </div>
      </div>

      {/* Explainable Risk Score Card (Section 5 Requirement) */}
      <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-950 text-rose-400 border border-rose-800">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Explainable Risk Analysis & Governance Score</h2>
              <p className="text-xs text-slate-400">Algorithmic risk evaluation (0-100 scale, higher = riskier)</p>
            </div>
          </div>

          <RiskBadge score={project.riskScore} level={project.riskLevel} size="lg" />
        </div>

        {/* Explainable Quote Text Box */}
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-slate-200 space-y-1">
          <span className="text-[10px] uppercase font-mono font-bold text-rose-400 tracking-wider">
            Explainable Risk Summary
          </span>
          <p className="text-sm font-semibold italic text-rose-200 leading-relaxed">
            «“{project.riskExplanation}”»
          </p>
        </div>

        {/* Risk Factor Contributions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400">Construction Variance</div>
            <div className="text-sm font-bold text-amber-400 font-mono">
              -{project.plannedConstructionProgressPct - project.constructionProgressPct}% Behind
            </div>
            <div className="text-[11px] text-slate-400">Planned: {project.plannedConstructionProgressPct}% | Actual: {project.constructionProgressPct}%</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400">Beneficiary Verification</div>
            <div className="text-sm font-bold text-emerald-400 font-mono">
              {Math.round(project.verifiedBeneficiaries / project.eligibleBeneficiaries * 100)}% Complete
            </div>
            <div className="text-[11px] text-slate-400">{project.eligibleBeneficiaries - project.verifiedBeneficiaries} households pending</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400">Critical Issues Unresolved</div>
            <div className="text-sm font-bold text-rose-400 font-mono">
              {project.riskFactors.unresolvedCriticalIssuesCount} Pending
            </div>
            <div className="text-[11px] text-slate-400">High severity tickets</div>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <div className="text-slate-400">Infrastructure Readiness</div>
            <div className="text-sm font-bold text-cyan-400 font-mono">
              {project.riskFactors.infrastructureCompletionPct}% Ready
            </div>
            <div className="text-[11px] text-slate-400">Roads & utilities integration</div>
          </div>
        </div>
      </section>

      {/* AI Delay Prediction Card */}
      <section className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm">AI Delay Prediction Engine</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                Confidence: {delayPrediction.confidencePct}%
              </span>
            </div>
            <p className="text-xs text-slate-400">Predictive timeline modeling based on milestone execution speed</p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
          <p className="text-slate-200 font-medium leading-relaxed">
            «“{delayPrediction.explanation}”»
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {delayPrediction.keyDrivers.map((driver, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[11px]">
                • {driver}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Stage Milestone Timeline (Section 4 Requirement) */}
      <section className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-white">7-Stage Project Milestone Pipeline</h2>
            <p className="text-xs text-slate-400">
              Pipeline: Planning → Approval → Beneficiary Verification → Construction → Infrastructure → Inspection → Resettlement
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {project.milestones.filter(m => m.status === 'COMPLETED').length} of {project.milestones.length} Completed
          </span>
        </div>

        <div className="space-y-4">
          {project.milestones.map((ms, idx) => {
            let statusBadge = (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                PENDING
              </span>
            );

            if (ms.status === 'COMPLETED') {
              statusBadge = (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700">
                  🟢 COMPLETED
                </span>
              );
            } else if (ms.status === 'IN_PROGRESS') {
              statusBadge = (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-950 text-amber-300 border border-amber-700">
                  🟡 IN PROGRESS
                </span>
              );
            } else if (ms.status === 'DELAYED') {
              statusBadge = (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-700">
                  🔴 DELAYED ({ms.delayDays} days)
                </span>
              );
            }

            return (
              <div 
                key={ms.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-slate-300">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-100 text-sm">{ms.name}</span>
                      {statusBadge}
                    </div>
                    <div className="text-slate-400 flex flex-wrap items-center gap-3">
                      <span>Stage: <strong className="text-slate-300">{ms.stage}</strong></span>
                      <span>• Responsible: <strong className="text-slate-300">{ms.responsibleAuthority}</strong></span>
                    </div>
                    {ms.notes && (
                      <p className="text-amber-300/90 text-[11px] font-mono">{ms.notes}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-right">
                  <div>
                    <div className="text-[11px] text-slate-400">Planned Date</div>
                    <div className="font-mono font-semibold text-slate-300">{ms.plannedDate}</div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Actual / Revised</div>
                    <div className="font-mono font-semibold text-white">{ms.actualDate || 'Pending'}</div>
                  </div>
                  {ms.evidenceName && (
                    <a
                      href="#"
                      onClick={(e) => { e.preventDefault(); alert(`Viewing evidence document: ${ms.evidenceName}`); }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 font-medium flex items-center gap-1"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{ms.evidenceName}</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
