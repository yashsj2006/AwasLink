import React, { useState } from 'react';
import type { Project, Milestone, MilestoneStatus } from '../../types';
import { X, CheckCircle2, HardHat } from 'lucide-react';

interface Props {
  project: Project;
  onClose: () => void;
  onSaveProgress: (updatedProject: Project) => void;
}

export const MilestoneModal: React.FC<Props> = ({ project, onClose, onSaveProgress }) => {
  const [constructionPct, setConstructionPct] = useState<number>(project.constructionProgressPct);
  const [revisedCompletion, setRevisedCompletion] = useState<string>(project.revisedCompletionDate);
  const [milestones, setMilestones] = useState<Milestone[]>(project.milestones);

  const handleMilestoneStatusChange = (id: string, newStatus: MilestoneStatus) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: newStatus,
          actualDate: newStatus === 'COMPLETED' ? new Date().toISOString().split('T')[0] : m.actualDate
        };
      }
      return m;
    }));
  };

  const handleSave = () => {
    const updated: Project = {
      ...project,
      constructionProgressPct: constructionPct,
      revisedCompletionDate: revisedCompletion,
      milestones,
      housesCompleted: Math.round((constructionPct / 100) * project.totalHouseholds),
      riskFactors: {
        ...project.riskFactors,
        constructionDelayVariancePct: Math.max(0, project.plannedConstructionProgressPct - constructionPct)
      }
    };

    onSaveProgress(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-start border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <HardHat className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono font-bold text-amber-400">DEVELOPER & OFFICER CONTROL PANEL</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Update Progress & Milestones</h2>
            <p className="text-xs text-slate-400">{project.name}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Construction Progress Slider */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold text-slate-200">Superstructure Construction Completed (%)</span>
            <span className="font-mono font-bold text-emerald-400 text-base">{constructionPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={constructionPct}
            onChange={(e) => setConstructionPct(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[11px] text-slate-400 font-mono">
            <span>Planned Baseline: {project.plannedConstructionProgressPct}%</span>
            <span>Variance: {project.plannedConstructionProgressPct - constructionPct}%</span>
          </div>
        </div>

        {/* Revision Date Input */}
        <div className="space-y-1 text-xs">
          <label className="text-slate-300 font-semibold block">Target Completion Date</label>
          <input
            type="date"
            value={revisedCompletion}
            onChange={(e) => setRevisedCompletion(e.target.value)}
            className="bg-slate-950 text-white p-2.5 rounded-lg border border-slate-700 font-mono text-xs w-full max-w-xs"
          />
        </div>

        {/* Milestones List Editor */}
        <div className="space-y-3 text-xs">
          <h4 className="font-bold text-slate-200">Milestone Pipeline Statuses:</h4>
          <div className="space-y-2">
            {milestones.map(m => (
              <div key={m.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="font-semibold text-slate-100">{m.name}</div>
                  <div className="text-[11px] text-slate-400">Stage: {m.stage} | Planned: {m.plannedDate}</div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={m.status}
                    onChange={(e) => handleMilestoneStatusChange(m.id, e.target.value as MilestoneStatus)}
                    className="bg-slate-900 text-white p-1.5 rounded border border-slate-700 text-xs font-semibold"
                  >
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DELAYED">DELAYED</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs">
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save & Recalculate Risk Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
