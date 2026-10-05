import React, { useState } from 'react';
import type { Project } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import { ReadinessBadge } from '../common/ReadinessBadge';
import { MapPin, ArrowRight, Layers } from 'lucide-react';

interface Props {
  projects: Project[];
  onSelectProject: (id: string) => void;
}

export const MapView: React.FC<Props> = ({ projects, onSelectProject }) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || '');
  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
              SPATIAL GIS CONTROL
            </span>
            <span className="text-xs text-slate-400">Mumbai Urban Redevelopment Map</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            City Redevelopment & Risk Distribution Map
          </h1>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low Risk (On Track)
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Medium Risk
          </span>
          <span className="flex items-center gap-1 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" /> High Risk (Delayed)
          </span>
        </div>
      </div>

      {/* Main Map Container & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Custom Map Box */}
        <div className="lg:col-span-8 p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl relative min-h-[440px] flex flex-col justify-between overflow-hidden">
          {/* Simulated Dark Mode Urban Map Backdrop */}
          <div className="absolute inset-0 bg-slate-950 opacity-90 pointer-events-none" />
          
          {/* Gridlines styling to evoke GIS interface */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          <div className="relative z-10 flex justify-between items-center text-xs text-slate-400 bg-slate-900/90 p-3 rounded-xl border border-slate-800">
            <span className="flex items-center gap-1.5 font-mono font-bold text-slate-200">
              <Layers className="w-4 h-4 text-emerald-400" /> MUMBAI METROPOLITAN REGION GIS
            </span>
            <span>Scale 1:50,000 | Datum WGS84</span>
          </div>

          {/* Interactive Project Pins Representation */}
          <div className="relative z-10 my-auto py-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {projects.map(p => {
              const isSelected = p.id === selectedProjectId;
              let pinBg = 'bg-emerald-600 border-emerald-400 text-white';
              if (p.riskLevel === 'HIGH') pinBg = 'bg-rose-600 border-rose-400 text-white animate-pulse';
              else if (p.riskLevel === 'MEDIUM') pinBg = 'bg-amber-600 border-amber-400 text-white';

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-slate-800 border-emerald-500 shadow-xl ring-2 ring-emerald-500/50 scale-[1.02]' 
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-mono font-bold ${pinBg}`}>
                        <MapPin className="w-4 h-4" />
                      </span>
                      <div>
                        <div className="font-bold text-white text-xs">{p.name}</div>
                        <div className="text-[10px] text-slate-400">{p.location}</div>
                      </div>
                    </div>
                    <RiskBadge score={p.riskScore} level={p.riskLevel} size="sm" showScore={false} />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-slate-300 border-t border-slate-800/80 pt-2 mt-2">
                    <div>
                      <span className="text-slate-500 block">Progress</span>
                      <strong className="text-white">{p.constructionProgressPct}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Services</span>
                      <strong className="text-cyan-400">{p.serviceReadinessPct}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Risk</span>
                      <strong className={p.riskLevel === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}>{p.riskScore}/100</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 text-[11px] text-slate-400 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 text-center">
            Click any redevelopment pin to inspect live spatial readiness card
          </div>
        </div>

        {/* Selected Project Drawer / Details Sidebar */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <span className="text-xs font-mono uppercase font-bold text-slate-400">Selected Project GIS Card</span>
              <RiskBadge score={selectedProject.riskScore} level={selectedProject.riskLevel} size="sm" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">{selectedProject.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{selectedProject.location}</p>
            </div>

            <div className="space-y-3 text-xs bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Affected Families:</span>
                <strong className="text-white">{selectedProject.totalHouseholds.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Construction Completed:</span>
                <strong className="text-emerald-400">{selectedProject.constructionProgressPct}%</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>12-Service Index:</span>
                <strong className="text-cyan-400">{selectedProject.serviceReadinessPct}%</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Risk Score:</span>
                <strong className={selectedProject.riskLevel === 'HIGH' ? 'text-rose-400' : 'text-emerald-400'}>
                  {selectedProject.riskScore}/100
                </strong>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-semibold block">Resettlement Status:</span>
              <ReadinessBadge status={selectedProject.resettlementStatus} size="md" />
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 leading-relaxed italic">
              «{selectedProject.riskExplanation}»
            </div>
          </div>

          <button
            onClick={() => onSelectProject(selectedProject.id)}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow flex items-center justify-center gap-2 transition-all mt-4"
          >
            <span>Inspect Full Project Page</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
