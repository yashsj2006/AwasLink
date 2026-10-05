import React, { useState } from 'react';
import type { Beneficiary, UserRole } from '../../types';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  BrainCircuit,
  Eye,
  X
} from 'lucide-react';

interface Props {
  beneficiaries: Beneficiary[];
  currentRole: UserRole;
  onReviewBeneficiary: (id: string, action: 'APPROVE' | 'REJECT', notes: string) => void;
}

export const BeneficiaryView: React.FC<Props> = ({
  beneficiaries,
  onReviewBeneficiary
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [officerNotesInput, setOfficerNotesInput] = useState<string>('');

  const filtered = beneficiaries.filter(b => {
    const matchesSearch = b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.applicantId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.projectName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === 'FLAGGED') return b.verificationStatus === 'FLAGGED_ANOMALY';
    if (filterStatus === 'VERIFIED') return b.verificationStatus === 'VERIFIED';
    if (filterStatus === 'PENDING') return b.verificationStatus === 'PENDING';
    return true;
  });

  const flaggedCount = beneficiaries.filter(b => b.verificationStatus === 'FLAGGED_ANOMALY').length;

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold">
              BENEFICIARY AUDIT MODULE
            </span>
            <span className="text-xs text-slate-400">Human-in-the-Loop Verification</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Slum Household Beneficiary Registry & Anomaly Detector
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-800 text-xs font-semibold flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>{flaggedCount} Anomaly Flags Pending Review</span>
          </span>
        </div>
      </div>

      {/* Ethical AI Protocol Banner */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3 shadow-md">
        <BrainCircuit className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-white uppercase tracking-wider text-[11px]">
            Ethical Governance Protocol (AI Decision-Support Only)
          </span>
          <p className="text-slate-300 leading-relaxed">
            AI algorithms scan synthetic biometric and ration card datasets solely to flag potential duplicates or income mismatches. <strong>The AI is strictly prohibited from auto-rejecting any citizen application.</strong> Final approval rests with designated ULB/SRA human officers.
          </p>
        </div>
      </div>

      {/* Controls & Filters Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by Applicant ID, Name, or Project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 pl-9 pr-4 py-2 rounded-lg text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['ALL', 'FLAGGED', 'VERIFIED', 'PENDING'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filterStatus === st 
                  ? 'bg-emerald-600 text-white shadow' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Beneficiaries Table */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
            <tr>
              <th className="p-3">Applicant Details</th>
              <th className="p-3">Redevelopment Project</th>
              <th className="p-3">Household & Income</th>
              <th className="p-3">Eligibility & Docs</th>
              <th className="p-3">AI Verification Status</th>
              <th className="p-3">Flat Allocation</th>
              <th className="p-3 text-right">Officer Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map(b => (
              <tr 
                key={b.id}
                className={`hover:bg-slate-800/60 transition-colors ${
                  b.verificationStatus === 'FLAGGED_ANOMALY' ? 'bg-rose-950/20' : ''
                }`}
              >
                <td className="p-3">
                  <div className="font-bold text-slate-100">{b.fullName}</div>
                  <div className="text-[11px] font-mono text-cyan-400">{b.applicantId}</div>
                </td>
                <td className="p-3 text-slate-300">
                  <div className="font-medium text-slate-200">{b.projectName}</div>
                </td>
                <td className="p-3 font-mono">
                  <div>{b.householdSize} members</div>
                  <div className="text-[11px] text-slate-400">{b.incomeCategory} (₹{b.monthlyIncome.toLocaleString()}/mo)</div>
                </td>
                <td className="p-3">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {b.eligibilityStatus}
                    </span>
                    <div className="text-[10px] text-slate-400">{b.documentationStatus}</div>
                  </div>
                </td>
                <td className="p-3">
                  {b.verificationStatus === 'FLAGGED_ANOMALY' ? (
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-950 text-rose-300 border border-rose-700 inline-flex items-center gap-1 animate-pulse">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                        <span>AI ANOMALY FLAG ({b.anomalySimilarityPct}%)</span>
                      </span>
                      <p className="text-[10px] text-rose-300 font-mono truncate max-w-xs">{b.anomalyReason}</p>
                    </div>
                  ) : b.verificationStatus === 'VERIFIED' ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Human Verified
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-950 text-amber-300 border border-amber-800">
                      Pending Audit
                    </span>
                  )}
                </td>
                <td className="p-3 font-mono">
                  {b.allocatedFlatNumber ? (
                    <span className="font-bold text-emerald-400">{b.allocatedFlatNumber}</span>
                  ) : (
                    <span className="text-slate-400">{b.allocationStatus}</span>
                  )}
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => {
                      setSelectedBeneficiary(b);
                      setOfficerNotesInput(b.officerNotes || '');
                    }}
                    className={`px-3 py-1.5 rounded text-xs font-semibold shadow transition-colors flex items-center gap-1.5 ml-auto ${
                      b.verificationStatus === 'FLAGGED_ANOMALY'
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Officer Review Modal */}
      {selectedBeneficiary && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">{selectedBeneficiary.applicantId}</span>
                  <span className="text-xs text-slate-400">Beneficiary Review File</span>
                </div>
                <h2 className="text-xl font-bold text-white">{selectedBeneficiary.fullName}</h2>
              </div>
              <button 
                onClick={() => setSelectedBeneficiary(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400">Project</span>
                <div className="font-bold text-white">{selectedBeneficiary.projectName}</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-400">Household Size & Income</span>
                <div className="font-bold text-white font-mono">
                  {selectedBeneficiary.householdSize} Persons | ₹{selectedBeneficiary.monthlyIncome.toLocaleString()}/mo ({selectedBeneficiary.incomeCategory})
                </div>
              </div>
            </div>

            {/* AI Flag Details Box */}
            {selectedBeneficiary.aiFlagged && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-700 text-rose-200 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-rose-300 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>AI Flagged Anomaly Explanation</span>
                </div>
                <p className="font-mono text-slate-200 leading-relaxed">
                  «“{selectedBeneficiary.anomalyReason}”»
                </p>
                <div className="text-[11px] text-rose-300 font-mono">
                  Biometric / Data Match Similarity Index: {selectedBeneficiary.anomalySimilarityPct}%
                </div>
              </div>
            )}

            {/* Officer Action Form */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Human Officer Verification Notes:
              </label>
              <textarea
                rows={3}
                placeholder="Enter officer audit notes, site verification findings, or justification..."
                value={officerNotesInput}
                onChange={(e) => setOfficerNotesInput(e.target.value)}
                className="w-full bg-slate-950 text-white placeholder-slate-500 p-3 rounded-lg text-xs border border-slate-700 focus:outline-none focus:border-emerald-500"
              />

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => {
                    onReviewBeneficiary(selectedBeneficiary.id, 'REJECT', officerNotesInput);
                    setSelectedBeneficiary(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span>Reject / Request Re-audit</span>
                </button>

                <button
                  onClick={() => {
                    onReviewBeneficiary(selectedBeneficiary.id, 'APPROVE', officerNotesInput);
                    setSelectedBeneficiary(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve Beneficiary (Human Verified)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
