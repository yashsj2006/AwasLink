import React from 'react';
import { 
  Building2, 
  Users, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileCheck, 
  Construction, 
  Droplets, 
  Search, 
  Home,
  ChevronRight,
  TrendingUp,
  Sliders,
  Target
} from 'lucide-react';

interface Props {
  onNavigate: (tab: string) => void;
  onLoadFlagship: () => void;
}

export const LandingPage: React.FC<Props> = ({ onNavigate, onLoadFlagship }) => {
  const journeySteps = [
    { num: '01', title: 'Beneficiary', desc: 'Household registration & baseline survey', icon: Users },
    { num: '02', title: 'Verification', desc: 'AI anomaly check & human officer audit', icon: FileCheck },
    { num: '03', title: 'Redevelopment', desc: 'SRA approval & developer timeline setup', icon: Sliders },
    { num: '04', title: 'Construction', desc: 'Superstructure milestone auditing', icon: Construction },
    { num: '05', title: 'Basic Services', desc: '12 essential utilities & infrastructure check', icon: Droplets },
    { num: '06', title: 'Inspection', desc: 'Multi-agency safety & quality verification', icon: Search },
    { num: '07', title: 'Resettlement', desc: 'Assurance certificate & safe family handover', icon: Home }
  ];

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="relative rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Housing Project Check</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            AwasTrack
            <span className="block text-xl sm:text-3xl font-semibold text-emerald-400 mt-2">
              From housing work to safe homes
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            This platform helps city teams track whether homes, roads, water, and essential services are ready before families move in.
          </p>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 space-y-2">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">What this platform checks</span>
            <blockquote className="text-base font-medium italic text-white">
              “Is this housing project ready for families to live safely and comfortably?”
            </blockquote>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition-all transform hover:-translate-y-0.5"
            >
              <span>View Urban Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLoadFlagship}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-900/40 transition-all"
            >
              <Target className="w-4 h-4" />
              <span>Inspect Flagship Demo: Shivaji Nagar</span>
            </button>

            <button
              onClick={() => onNavigate('map')}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <span>Explore City Map</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </section>

      {/* Three Key Metrics Bar */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-5 shadow-lg">
          <div className="p-4 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">5</div>
            <div className="text-sm font-semibold text-slate-300">Projects Monitored</div>
            <div className="text-xs text-slate-400 mt-0.5">Active SRA & MHADA redevelopment zones</div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-5 shadow-lg">
          <div className="p-4 rounded-xl bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">15,350+</div>
            <div className="text-sm font-semibold text-slate-300">Families Protected</div>
            <div className="text-xs text-slate-400 mt-0.5">Verified slum beneficiary households</div>
          </div>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-5 shadow-lg">
          <div className="p-4 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-800/60">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <div className="text-3xl font-extrabold text-white font-mono">42</div>
            <div className="text-sm font-semibold text-slate-300">Service Gaps Identified</div>
            <div className="text-xs text-slate-400 mt-0.5">Infrastructure deficiencies flagged pre-occupancy</div>
          </div>
        </div>
      </section>

      {/* Simple project journey */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">The housing project journey</h2>
            <p className="text-sm text-slate-400">From family registration to final safe move-in, step by step.</p>
          </div>
          <span className="text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800/60">
            Clear progress check
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-slate-800 px-2 py-0.5 rounded">
                      {step.num}
                    </span>
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="font-bold text-slate-100 text-sm">{step.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-snug">{step.desc}</p>
                </div>
                {idx < 6 && (
                  <div className="hidden lg:block text-slate-600 text-center mt-3">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Simple feature summary */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center border border-emerald-800">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base">Services check</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            This shows whether everyday needs like water, power, roads, toilets, and waste management are ready before people move in.
          </p>
          <button 
            onClick={() => onNavigate('services')}
            className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>See service status</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-rose-950 text-rose-400 flex items-center justify-center border border-rose-800">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base">Project risk check</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            This gives a simple warning score to show whether a project may face delays, problems, or safety concerns.
          </p>
          <button 
            onClick={() => onNavigate('projects')}
            className="text-xs font-semibold text-rose-400 hover:underline flex items-center gap-1"
          >
            <span>Check project details</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center border border-cyan-800">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-100 text-base">Family review</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            The system checks family records and asks officers to confirm the right people are eligible before final approval.
          </p>
          <button 
            onClick={() => onNavigate('beneficiaries')}
            className="text-xs font-semibold text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>Review family checks</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* Example housing project alert */}
      <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border border-rose-800/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700 text-xs font-bold">
            <span>Example project check</span>
          </div>
          <h3 className="text-xl font-extrabold text-white">Shivaji Nagar housing project</h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Building work is behind the plan, water and power are available, but roads and waste systems are still incomplete. This shows a <strong className="text-rose-400">high risk</strong> and means families are <strong className="text-rose-400">not ready to move in yet</strong>.
          </p>
        </div>

        <button
          onClick={onLoadFlagship}
          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg whitespace-nowrap flex items-center gap-2"
        >
          <Target className="w-4 h-4" />
          <span>Open example project</span>
        </button>
      </section>
    </div>
  );
};
