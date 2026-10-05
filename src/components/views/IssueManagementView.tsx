import React, { useState } from 'react';
import type { ServiceIssue, Project, UserRole, IssuePriority, IssueStatus } from '../../types';
import { AIService } from '../../services/aiService';
import { 
  Plus, 
  Filter, 
  Camera, 
  Building2,
  BrainCircuit
} from 'lucide-react';

interface Props {
  issues: ServiceIssue[];
  projects: Project[];
  currentRole: UserRole;
  onAddIssue: (issue: Partial<ServiceIssue>) => void;
  onUpdateIssueStatus: (issueId: string, status: IssueStatus, notes?: string, assignedTo?: string) => void;
}

export const IssueManagementView: React.FC<Props> = ({
  issues,
  projects,
  currentRole,
  onAddIssue,
  onUpdateIssueStatus
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Form State
  const [newCategory, setNewCategory] = useState<ServiceIssue['category']>('Water');
  const [newProjectId, setNewProjectId] = useState<string>(projects[0]?.id || '');
  const [newBlock, setNewBlock] = useState<string>('Block B Sector 3');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newHouseholds, setNewHouseholds] = useState<number>(120);

  const filtered = issues.filter(i => filterCategory === 'ALL' || i.category === filterCategory);

  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const proj = projects.find(p => p.id === newProjectId) || projects[0];
    
    // AI Auto-Prioritization
    const aiPrioritizer = AIService.prioritizeIssue({
      category: newCategory,
      affectedHouseholds: newHouseholds
    });

    onAddIssue({
      projectId: proj.id,
      projectName: proj.name,
      blockLocation: newBlock,
      category: newCategory,
      description: newDescription || `Issue reported regarding ${newCategory} service infrastructure.`,
      reportedBy: currentRole === 'resident' ? 'Resident Association' : 'ULB Field Inspector',
      reportedRole: currentRole === 'resident' ? 'resident' : 'officer',
      reportedDate: new Date().toISOString().split('T')[0],
      priority: aiPrioritizer.suggestedPriority,
      affectedHouseholds: newHouseholds,
      status: 'REPORTED',
      photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80'
    });

    setShowReportModal(false);
    setNewDescription('');
  };

  const priorityBadges: Record<IssuePriority, { color: string; label: string }> = {
    CRITICAL: { color: 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse', label: '🔴 CRITICAL' },
    HIGH: { color: 'bg-orange-950 text-orange-300 border-orange-700', label: '🟠 HIGH' },
    MEDIUM: { color: 'bg-amber-950 text-amber-300 border-amber-700', label: '🟡 MEDIUM' },
    LOW: { color: 'bg-emerald-950 text-emerald-300 border-emerald-700', label: '🟢 LOW' }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800 text-xs font-mono font-bold">
              CITIZEN & ULB TICKET DESK
            </span>
            <span className="text-xs text-slate-400">Issue Lifecycle Tracker</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Service Issue Management & AI Prioritization
          </h1>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Service Issue</span>
        </button>
      </div>

      {/* AI Prioritization Rationale Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3 shadow-md">
        <BrainCircuit className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            AI Feature — Population-Impact Prioritization Engine
          </span>
          <p className="text-slate-300 leading-relaxed">
            Reported complaints are automatically scored by potential health impact and number of households affected. Critical issues (e.g. sewerage backflow affecting 800+ families) automatically rank at the top of officer work orders.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-400 font-semibold mr-2 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Category Filter:
        </span>
        {['ALL', 'Water', 'Electricity', 'Sewerage', 'Road', 'Streetlight', 'Waste', 'Sanitation'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterCategory === cat 
                ? 'bg-slate-800 text-emerald-400 border border-slate-700' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {filtered.map(issue => (
          <div 
            key={issue.id}
            className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg hover:border-slate-700 transition-all"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${priorityBadges[issue.priority].color}`}>
                  {priorityBadges[issue.priority].label}
                </span>
                <span className="font-mono font-bold text-cyan-400 text-xs">{issue.ticketId}</span>
                <span className="text-xs text-slate-400">Category: <strong className="text-white">{issue.category}</strong></span>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Status:</span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-semibold">
                  {issue.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
              <div className="md:col-span-8 space-y-2">
                <div className="flex items-center gap-2 text-slate-300 font-semibold">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{issue.projectName} — {issue.blockLocation}</span>
                </div>
                <p className="text-slate-200 leading-relaxed font-normal bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {issue.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 font-mono pt-1">
                  <span>Reported by: <strong className="text-slate-300">{issue.reportedBy}</strong></span>
                  <span>• Affected Households: <strong className="text-rose-400 font-bold">{issue.affectedHouseholds} families</strong></span>
                  <span>• Date: {issue.reportedDate}</span>
                </div>
                {issue.assignedTo && (
                  <div className="text-[11px] text-emerald-400 font-mono">
                    Assigned Contractor: {issue.assignedTo}
                  </div>
                )}
              </div>

              {/* Photo Evidence Preview */}
              {issue.photoUrl && (
                <div className="md:col-span-4 flex flex-col justify-center">
                  <div className="relative rounded-lg overflow-hidden border border-slate-800 h-32 group">
                    <img 
                      src={issue.photoUrl} 
                      alt="Issue Evidence" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 px-2 py-0.5 rounded text-[10px] text-slate-300 flex items-center gap-1 font-mono">
                      <Camera className="w-3 h-3 text-cyan-400" /> Photo Evidence
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Officer & Developer Actions */}
            {(currentRole === 'officer' || currentRole === 'developer') && (
              <div className="flex items-center justify-end gap-3 border-t border-slate-800/80 pt-3 text-xs">
                {issue.status === 'REPORTED' && (
                  <button
                    onClick={() => onUpdateIssueStatus(issue.id, 'ASSIGNED', undefined, 'ULB Emergency Infra Cell')}
                    className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold"
                  >
                    Assign to Contractor
                  </button>
                )}

                {issue.status !== 'RESOLVED' && (
                  <button
                    onClick={() => onUpdateIssueStatus(issue.id, 'RESOLVED', 'Inspected on-site and verified complete by ULB Engineer.')}
                    className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow"
                  >
                    Mark Verified & Resolved ✓
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white">Report New Service Issue</h2>
            <form onSubmit={handleSubmitIssue} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Project</label>
                <select
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-slate-700"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-slate-700"
                >
                  {['Water', 'Electricity', 'Sewerage', 'Road', 'Streetlight', 'Waste', 'Sanitation', 'Construction'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Block / Location</label>
                <input
                  type="text"
                  value={newBlock}
                  onChange={(e) => setNewBlock(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue, defect, or service outage..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-slate-950 text-white p-2.5 rounded-lg border border-slate-700"
                  required
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Estimated Affected Households</label>
                <input
                  type="number"
                  value={newHouseholds}
                  onChange={(e) => setNewHouseholds(Number(e.target.value))}
                  className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700 font-mono"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow"
                >
                  Submit Issue Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
