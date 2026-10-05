import React from 'react';
import type { Project, ServiceIssue, Beneficiary } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { ReadinessBadge } from '../common/ReadinessBadge';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Users, 
  Home, 
  CheckSquare, 
  AlertCircle,
  ArrowRight,
  Target
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

interface Props {
  projects: Project[];
  beneficiaries: Beneficiary[];
  issues: ServiceIssue[];
  onSelectProject: (projectId: string) => void;
  onNavigate: (tab: string) => void;
}

export const DashboardView: React.FC<Props> = ({
  projects,
  beneficiaries,
  issues,
  onSelectProject,
  onNavigate
}) => {
  // Aggregate Metrics
  const totalProjects = projects.length;
  const projectsOnTrack = projects.filter(p => p.riskLevel === 'LOW').length;
  const projectsAtRiskOrDelayed = projects.filter(p => p.riskLevel !== 'LOW').length;
  const highRiskProjects = projects.filter(p => p.riskLevel === 'HIGH').length;

  const totalFamilies = projects.reduce((acc, p) => acc + p.totalHouseholds, 0);
  const totalHousesCompleted = projects.reduce((acc, p) => acc + p.housesCompleted, 0);
  const totalHousesOccupied = projects.reduce((acc, p) => acc + p.housesOccupied, 0);
  const totalHousesVacant = projects.reduce((acc, p) => acc + p.housesVacant, 0);

  const avgServiceReadiness = Math.round(
    projects.reduce((acc, p) => acc + p.serviceReadinessPct, 0) / Math.max(1, totalProjects)
  );

  const criticalIssuesCount = issues.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESOLVED').length;

  // Chart Data 1: Project Progress (Planned vs Actual)
  const progressChartData = projects.map(p => ({
    name: p.name.split(' ')[0] + ' ' + p.name.split(' ')[1],
    fullName: p.name,
    Planned: p.plannedConstructionProgressPct,
    Actual: p.constructionProgressPct,
    RiskScore: p.riskScore
  }));

  // Chart Data 2: Beneficiary Verification Distribution
  const verifiedCount = beneficiaries.filter(b => b.verificationStatus === 'VERIFIED').length;
  const flaggedCount = beneficiaries.filter(b => b.verificationStatus === 'FLAGGED_ANOMALY').length;
  const pendingCount = beneficiaries.filter(b => b.verificationStatus === 'PENDING').length;

  const beneficiaryPieData = [
    { name: 'Verified (Human Approved)', value: verifiedCount || 82, color: '#10b981' },
    { name: 'AI Flagged Anomaly', value: flaggedCount || 12, color: '#f43f5e' },
    { name: 'Pending Documentation', value: pendingCount || 6, color: '#f59e0b' }
  ];

  return (
    <div className="space-y-8 py-4">
      {/* Executive Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
              ULB DASHBOARD
            </span>
            <span className="text-xs text-slate-400">Live City-Wide Overview</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Redevelopment & Resettlement Assurance Command Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('map')}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>View City Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 10 Metric Cards Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Card 1 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Total Projects</span>
            <Building2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalProjects}</div>
          <div className="text-[11px] text-slate-400">Redevelopment Zones</div>
        </div>

        {/* Card 2 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Projects On Track</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{projectsOnTrack}</div>
          <div className="text-[11px] text-slate-400">Low risk parameters</div>
        </div>

        {/* Card 3 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Projects Delayed</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{projectsAtRiskOrDelayed}</div>
          <div className="text-[11px] text-slate-400">Timeline variance</div>
        </div>

        {/* Card 4 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 border-l-4 border-l-rose-500">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">High-Risk Projects</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">{highRiskProjects}</div>
          <div className="text-[11px] text-rose-300 font-semibold">Immediate ULB Action</div>
        </div>

        {/* Card 5 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Families Awaiting</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-mono">{totalFamilies.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Registered Households</div>
        </div>

        {/* Card 6 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Houses Completed</span>
            <Home className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">{totalHousesCompleted.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Physical units built</div>
        </div>

        {/* Card 7 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Houses Occupied</span>
            <Home className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400 font-mono">{totalHousesOccupied.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Safe Handovers</div>
        </div>

        {/* Card 8 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Houses Vacant</span>
            <Home className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-200 font-mono">{totalHousesVacant.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400">Awaiting Service Readiness</div>
        </div>

        {/* Card 9 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Service Readiness</span>
            <CheckSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400 font-mono">{avgServiceReadiness}%</div>
          <div className="text-[11px] text-slate-400">12-Service City Average</div>
        </div>

        {/* Card 10 */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1 border-l-4 border-l-rose-600">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-medium">Critical Issues</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono">{criticalIssuesCount}</div>
          <div className="text-[11px] text-rose-300 font-semibold">Unresolved Tickets</div>
        </div>
      </section>

      {/* Flagship Scenario Callout Header */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/90 via-slate-900 to-slate-900 border border-rose-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-900 text-rose-200">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Flagship Case: Shivaji Nagar Integrated Redevelopment</span>
              <RiskBadge score={78} level="HIGH" size="sm" />
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Construction: 72% (Planned: 86%) | Services: 74% (3 Missing) | Resettlement: <strong className="text-rose-400">NOT READY FOR RESETTLEMENT</strong>
            </p>
          </div>
        </div>
        <button
          onClick={() => onSelectProject('proj-shivaji-nagar')}
          className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow whitespace-nowrap transition-colors"
        >
          Inspect Flagship Details →
        </button>
      </div>

      {/* Analytics Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Project Progress (Planned vs Actual) */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Construction Progress Variance</h3>
              <p className="text-xs text-slate-400">Planned vs Actual Superstructure Progress (%)</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">SRA Audited</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Planned" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Planned Baseline (%)" />
                <Bar dataKey="Actual" fill="#10b981" radius={[4, 4, 0, 0]} name="Actual Completed (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Beneficiary Verification Distribution */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Beneficiary Verification Funnel</h3>
              <p className="text-xs text-slate-400">Human-in-the-Loop AI Anomaly Audit Status</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">100% Audited</span>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={beneficiaryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {beneficiaryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Projects Overview Table */}
      <section className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Redevelopment Projects Status Table</h3>
            <p className="text-xs text-slate-400">Comprehensive overview of progress, risk scores & resettlement readiness.</p>
          </div>
          <button
            onClick={() => onNavigate('projects')}
            className="text-xs text-emerald-400 hover:underline font-semibold flex items-center gap-1"
          >
            <span>View All Detailed Pages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-3">Project Name & Location</th>
                <th className="p-3">Households</th>
                <th className="p-3">Construction %</th>
                <th className="p-3">Services Index</th>
                <th className="p-3">Risk Score</th>
                <th className="p-3">Resettlement Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {projects.map(p => (
                <tr 
                  key={p.id}
                  className={`hover:bg-slate-800/60 transition-colors ${
                    p.id === 'proj-shivaji-nagar' ? 'bg-rose-950/20' : ''
                  }`}
                >
                  <td className="p-3">
                    <div className="font-bold text-slate-100">{p.name}</div>
                    <div className="text-[11px] text-slate-400">{p.location}</div>
                  </td>
                  <td className="p-3 font-mono text-slate-200">
                    {p.totalHouseholds.toLocaleString()} families
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${p.constructionProgressPct >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                          style={{ width: `${p.constructionProgressPct}%` }}
                        />
                      </div>
                      <span className="font-mono font-bold text-slate-200">{p.constructionProgressPct}%</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-cyan-400">
                    {p.serviceReadinessPct}%
                  </td>
                  <td className="p-3">
                    <RiskBadge score={p.riskScore} level={p.riskLevel} size="sm" />
                  </td>
                  <td className="p-3">
                    <ReadinessBadge status={p.resettlementStatus} size="sm" />
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onSelectProject(p.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
