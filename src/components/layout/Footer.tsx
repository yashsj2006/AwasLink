import React from 'react';
import { ShieldCheck, Info, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-8 px-4 sm:px-6 lg:px-8 mt-16 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-slate-200 font-bold text-base mb-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>AwasTrack</span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            A simple housing project tracker that helps citizens and officials see whether a project is safe, ready, and suitable for families.
          </p>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-2 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>How the system works</span>
          </h4>
          <p className="text-slate-400 leading-relaxed">
            The platform highlights risks and helps officers review them carefully. It supports decisions, but it does not make the final legal decision for families or housing approval.
          </p>
        </div>

        <div>
          <h4 className="text-slate-200 font-semibold mb-2 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>Main checks</span>
          </h4>
          <ul className="space-y-1 text-slate-400">
            <li>• Water, power, roads, and sanitation check</li>
            <li>• Safety and risk score</li>
            <li>• Family eligibility review</li>
            <li>• Budget and distance check</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500">
        <p>© 2026 AwasTrack — simple housing and city project tracking.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-300 cursor-pointer">Privacy</span>
          <span className="hover:text-slate-300 cursor-pointer">City rules</span>
          <span className="hover:text-slate-300 cursor-pointer">System status: working</span>
        </div>
      </div>
    </footer>
  );
};
