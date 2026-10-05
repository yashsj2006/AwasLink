import type { Project, BasicService, ProjectRiskFactors, RiskLevel, ResettlementStatus } from '../types';

/**
 * Calculates Project Risk Score (0-100)
 * 0-35: Low Delay Risk (🟢 On Track)
 * 36-65: Medium Delay Risk (🟡 Watch Needed)
 * 66-100: High Delay Risk (🔴 Needs Urgent Help)
 */
export function calculateProjectRisk(factors: ProjectRiskFactors): {
  score: number;
  level: RiskLevel;
  explanation: string;
  breakdown: { factor: string; contribution: number; description: string }[];
} {
  const breakdown: { factor: string; contribution: number; description: string }[] = [];

  // 1. Construction Delay
  const constDelay = Math.max(0, factors.constructionDelayVariancePct);
  const constPts = Math.min(35, Math.round(constDelay * 2.2));
  breakdown.push({
    factor: 'Building Delay',
    contribution: constPts,
    description: `Building work is ${constDelay}% behind schedule (+${constPts} risk points)`
  });

  // 2. Unresolved Critical Issues
  const issuePts = Math.min(25, factors.unresolvedCriticalIssuesCount * 5);
  breakdown.push({
    factor: 'Unfixed Complaints',
    contribution: issuePts,
    description: `${factors.unresolvedCriticalIssuesCount} serious problems reported by residents (+${issuePts} risk points)`
  });

  // 3. Basic Services Pending
  const infraIncomplete = Math.max(0, 100 - factors.infrastructureCompletionPct);
  const infraPts = Math.round((infraIncomplete / 100) * 20);
  breakdown.push({
    factor: 'Unfinished Basic Services',
    contribution: infraPts,
    description: `Basic services like roads and sewage are only ${factors.infrastructureCompletionPct}% complete (+${infraPts} risk points)`
  });

  // 4. Family Document Verification Gap
  const verifGap = Math.max(0, 100 - factors.beneficiaryVerificationPct);
  const verifPts = Math.round((verifGap / 100) * 10);
  breakdown.push({
    factor: 'Family Document Check Pending',
    contribution: verifPts,
    description: `${verifGap}% of families are still waiting for document checks (+${verifPts} risk points)`
  });

  // 5. Funding & Completion Variance
  let fundingPts = 0;
  if (factors.fundingDelayStatus === 'SEVERE_DELAY') fundingPts = 7;
  else if (factors.fundingDelayStatus === 'SLIGHT_DELAY') fundingPts = 3;

  const completionVarPts = Math.min(3, factors.expectedCompletionVarianceMonths);
  const totalFinancialPts = fundingPts + completionVarPts;

  breakdown.push({
    factor: 'Budget & Schedule Adjustments',
    contribution: totalFinancialPts,
    description: `Government funding status: ${factors.fundingDelayStatus}, delay: ${factors.expectedCompletionVarianceMonths} months (+${totalFinancialPts} risk points)`
  });

  const totalScore = Math.min(100, Math.max(0, constPts + issuePts + infraPts + verifPts + totalFinancialPts));

  let level: RiskLevel = 'LOW';
  if (totalScore >= 66) level = 'HIGH';
  else if (totalScore >= 36) level = 'MEDIUM';

  // Plain English explanation that any citizen or jury member understands!
  const mainDrivers: string[] = [];
  if (constDelay > 5) mainDrivers.push(`building work is ${constDelay}% behind schedule`);
  if (infraIncomplete > 20) mainDrivers.push(`basic utilities (like sewage and roads) are incomplete (${factors.infrastructureCompletionPct}% done)`);
  if (factors.unresolvedCriticalIssuesCount > 0) mainDrivers.push(`${factors.unresolvedCriticalIssuesCount} serious resident complaints remain unfixed`);

  let explanation = '';
  if (level === 'HIGH') {
    explanation = `High risk primarily because ${mainDrivers.join(' and ')}.`;
  } else if (level === 'MEDIUM') {
    explanation = `Moderate risk identified because ${mainDrivers.join(' and ') || 'minor schedule adjustments are needed'}.`;
  } else {
    explanation = `Project is running smoothly with building work on time and essential services ready.`;
  }

  return { score: totalScore, level, explanation, breakdown };
}

/**
 * Calculates Basic-Service Readiness Index (0-100%)
 */
export function calculateServiceReadiness(services: BasicService[]): {
  percentage: number;
  criticalMissingCount: number;
  readyCount: number;
  partialCount: number;
  notReadyCount: number;
} {
  if (services.length === 0) {
    return { percentage: 0, criticalMissingCount: 0, readyCount: 0, partialCount: 0, notReadyCount: 0 };
  }

  let totalWeight = 0;
  let achievedWeight = 0;
  let criticalMissingCount = 0;
  let readyCount = 0;
  let partialCount = 0;
  let notReadyCount = 0;

  services.forEach(svc => {
    const weight = svc.critical ? 2 : 1;
    totalWeight += weight;

    if (svc.status === 'READY') {
      achievedWeight += weight;
      readyCount++;
    } else if (svc.status === 'PARTIAL') {
      achievedWeight += weight * 0.5;
      partialCount++;
      if (svc.critical) criticalMissingCount++;
    } else {
      notReadyCount++;
      if (svc.critical) criticalMissingCount++;
    }
  });

  const percentage = Math.round((achievedWeight / totalWeight) * 100);
  return { percentage, criticalMissingCount, readyCount, partialCount, notReadyCount };
}

/**
 * Calculates Safe Move-In Readiness & Final Verdict
 */
export function calculateResettlementReadiness(project: Project): {
  overallPercentage: number;
  status: ResettlementStatus;
  explanation: string;
  pillarScores: {
    housing: number;
    basicServices: number;
    socialInfra: number;
    administrative: number;
  };
} {
  const serviceStats = calculateServiceReadiness(project.basicServices);

  // Pillar 1: Housing (35%)
  const housingScore = Math.round(project.constructionProgressPct);

  // Pillar 2: Basic Services (35%)
  const basicServicesScore = serviceStats.percentage;

  // Pillar 3: Nearby Facilities (15%)
  const socialSvcs = project.basicServices.filter(s => s.category === 'SOCIAL');
  const socialScore = socialSvcs.length > 0
    ? Math.round((socialSvcs.filter(s => s.status === 'READY').length + socialSvcs.filter(s => s.status === 'PARTIAL').length * 0.5) / socialSvcs.length * 100)
    : 70;

  // Pillar 4: Family Verification (15%)
  const adminScore = Math.round(
    (project.verifiedBeneficiaries / Math.max(1, project.eligibleBeneficiaries)) * 100
  );

  const overallPercentage = Math.round(
    housingScore * 0.35 +
    basicServicesScore * 0.35 +
    socialScore * 0.15 +
    adminScore * 0.15
  );

  const missingCriticalServices = project.basicServices.filter(s => s.critical && s.status === 'NOT_READY');
  const partialCriticalServices = project.basicServices.filter(s => s.critical && s.status === 'PARTIAL');

  let status: ResettlementStatus = 'NOT_READY';
  let explanation = '';

  if (missingCriticalServices.length > 0 || project.constructionProgressPct < 85) {
    status = 'NOT_READY';
    const missingNames = missingCriticalServices.map(s => s.name.toLowerCase()).join(', ');
    explanation = `The project should not proceed to full resettlement because critical road, sewerage and waste-management infrastructure remains incomplete. ${serviceStats.criticalMissingCount} essential service(s) must be completed before families can move in.`;
  } else if (partialCriticalServices.length > 0 || project.constructionProgressPct < 95) {
    status = 'CONDITIONALLY_READY';
    explanation = `Project is conditionally ready for phased move-in. Minor gaps remain in ${partialCriticalServices.map(s => s.name.toLowerCase()).join(', ') || 'ancillary facilities'}. Final safety certificates are pending.`;
  } else {
    status = 'FULLY_READY';
    explanation = `Project is 100% ready for families to move in safely. Building quality, water, electricity, sewage, roads, and family paperwork are all verified complete.`;
  }

  return {
    overallPercentage,
    status,
    explanation,
    pillarScores: {
      housing: housingScore,
      basicServices: basicServicesScore,
      socialInfra: socialScore,
      administrative: adminScore
    }
  };
}
