import React, { useState } from 'react';
import type { AffordabilityInput, AffordabilityResult } from '../../types';
import { Sliders } from 'lucide-react';

export const HousingSuitabilityView: React.FC = () => {
  // Preset defaults matching the prompt example
  const [inputs, setInputs] = useState<AffordabilityInput>({
    householdMonthlyIncome: 18000,
    housingMonthlyCost: 7500,
    utilitiesMonthlyCost: 1500,
    transportMonthlyCost: 1200,
    distanceToWorkplaceKm: 4.5,
    distanceToSchoolKm: 1.2,
    distanceToHealthcareKm: 2.0
  });

  const calculateSuitability = (data: AffordabilityInput): AffordabilityResult => {
    const totalMonthlyCost = data.housingMonthlyCost + data.utilitiesMonthlyCost + data.transportMonthlyCost;
    const ratio = (totalMonthlyCost / Math.max(1, data.householdMonthlyIncome)) * 100;

    let score = 100;

    // Financial burden penalty
    if (ratio > 60) score -= 45;
    else if (ratio > 50) score -= 25;
    else if (ratio > 40) score -= 15;
    else if (ratio > 30) score -= 5;

    // Distance penalty
    if (data.distanceToWorkplaceKm > 10) score -= 15;
    else if (data.distanceToWorkplaceKm > 6) score -= 8;

    if (data.distanceToSchoolKm > 3) score -= 10;
    if (data.distanceToHealthcareKm > 4) score -= 10;

    score = Math.min(100, Math.max(10, score));

    let rating: 'HIGHLY SUITABLE' | 'MODERATELY SUITABLE' | 'HIGH DISPLACEMENT RISK' = 'HIGHLY SUITABLE';
    if (score < 50) rating = 'HIGH DISPLACEMENT RISK';
    else if (score < 75) rating = 'MODERATELY SUITABLE';

    const recs: string[] = [];
    if (ratio > 50) recs.push('High financial burden (>50% of income spent on shelter & commute). Recommend ULB maintenance subsidy.');
    if (data.distanceToWorkplaceKm > 6) recs.push('Long commute distance. Suggest assigning BEST bus monthly pass concession for working adults.');
    if (data.distanceToSchoolKm > 2.5) recs.push('School distance exceeds 2.5km. Suggest school van route integration.');

    const explanation = rating === 'HIGHLY SUITABLE'
      ? `The housing allotment is highly suitable with total shelter and commute expenditure (${ratio.toFixed(1)}% of income) remaining within viable livability parameters.`
      : rating === 'MODERATELY SUITABLE'
      ? `Housing is moderately viable (${ratio.toFixed(1)}% income committed). Additional commute support recommended to prevent displacement.`
      : `High displacement risk! Total shelter and commute costs consume ${ratio.toFixed(1)}% of household income, creating severe risk of default or return to informal slums.`;

    return {
      totalMonthlyCost,
      costToIncomeRatioPct: Math.round(ratio * 10) / 10,
      suitabilityScore: Math.round(score),
      suitabilityRating: rating,
      explanation,
      recommendations: recs
    };
  };

  const result = calculateSuitability(inputs);

  return (
    <div className="space-y-8 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono font-bold">
              LIVELIHOOD-AWARE CALCULATOR
            </span>
            <span className="text-xs text-slate-400">Genuine Affordability & Distance Audit</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Livelihood-Aware Housing Suitability Index
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Inputs Column */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-white text-base">Household Financial & Distance Parameters</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold flex justify-between mb-1">
                <span>Household Monthly Income (₹)</span>
                <span className="font-mono font-bold text-emerald-400">₹{inputs.householdMonthlyIncome.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="8000"
                max="60000"
                step="1000"
                value={inputs.householdMonthlyIncome}
                onChange={(e) => setInputs({ ...inputs, householdMonthlyIncome: Number(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold flex justify-between mb-1">
                <span>Housing Cost / Maintenance (₹/month)</span>
                <span className="font-mono font-bold text-amber-400">₹{inputs.housingMonthlyCost.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="2000"
                max="25000"
                step="500"
                value={inputs.housingMonthlyCost}
                onChange={(e) => setInputs({ ...inputs, housingMonthlyCost: Number(e.target.value) })}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold flex justify-between mb-1">
                <span>Utilities (Water, Power, Gas ₹/month)</span>
                <span className="font-mono font-bold text-cyan-400">₹{inputs.utilitiesMonthlyCost.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="500"
                max="8000"
                step="250"
                value={inputs.utilitiesMonthlyCost}
                onChange={(e) => setInputs({ ...inputs, utilitiesMonthlyCost: Number(e.target.value) })}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <label className="text-slate-300 font-semibold flex justify-between mb-1">
                <span>Monthly Transport & Commute Cost (₹)</span>
                <span className="font-mono font-bold text-indigo-400">₹{inputs.transportMonthlyCost.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min="300"
                max="8000"
                step="100"
                value={inputs.transportMonthlyCost}
                onChange={(e) => setInputs({ ...inputs, transportMonthlyCost: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Workplace (km)</label>
                <input
                  type="number"
                  step="0.5"
                  value={inputs.distanceToWorkplaceKm}
                  onChange={(e) => setInputs({ ...inputs, distanceToWorkplaceKm: Number(e.target.value) })}
                  className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700 font-mono text-center"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">School (km)</label>
                <input
                  type="number"
                  step="0.5"
                  value={inputs.distanceToSchoolKm}
                  onChange={(e) => setInputs({ ...inputs, distanceToSchoolKm: Number(e.target.value) })}
                  className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700 font-mono text-center"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 text-[11px]">Clinic (km)</label>
                <input
                  type="number"
                  step="0.5"
                  value={inputs.distanceToHealthcareKm}
                  onChange={(e) => setInputs({ ...inputs, distanceToHealthcareKm: Number(e.target.value) })}
                  className="w-full bg-slate-950 text-white p-2 rounded-lg border border-slate-700 font-mono text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results & Explainability Column */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="font-bold text-white text-base">Affordability & Livability Breakdown</h2>
            <span className="text-xs font-mono font-bold text-emerald-400">{result.suitabilityScore}/100</span>
          </div>

          {/* Big Score Callout */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>Estimated Total Housing Cost</span>
              <span className="font-mono text-slate-300">Income: ₹{inputs.householdMonthlyIncome.toLocaleString()}</span>
            </div>

            <div className="text-3xl font-extrabold text-white font-mono">
              ₹{result.totalMonthlyCost.toLocaleString()}
              <span className="text-sm font-normal text-slate-400 ml-2">/ month ({result.costToIncomeRatioPct}% of income)</span>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                result.suitabilityRating === 'HIGHLY SUITABLE' 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                  : result.suitabilityRating === 'MODERATELY SUITABLE'
                  ? 'bg-amber-950 text-amber-300 border border-amber-700'
                  : 'bg-rose-950 text-rose-300 border border-rose-700'
              }`}>
                SUITABILITY: {result.suitabilityScore}/100 — {result.suitabilityRating}
              </span>
            </div>
          </div>

          {/* Explainable Quote Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 space-y-1">
            <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono tracking-wider">
              Explainable Analysis
            </span>
            <p className="font-medium italic leading-relaxed text-slate-100">
              «“{result.explanation}”»
            </p>
          </div>

          {/* Policy Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-300">ULB Civic Recommendations:</h4>
              <ul className="space-y-1 text-xs text-slate-400">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="p-2 rounded bg-slate-950 border border-slate-800 text-slate-300">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
