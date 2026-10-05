export type UserRole = 'resident' | 'officer' | 'developer';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type ServiceStatus = 'READY' | 'PARTIAL' | 'NOT_READY';

export type MilestoneStatus = 'COMPLETED' | 'IN_PROGRESS' | 'DELAYED' | 'PENDING';

export type ResettlementStatus = 'FULLY_READY' | 'CONDITIONALLY_READY' | 'NOT_READY';

export type IssuePriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type IssueStatus = 'REPORTED' | 'VERIFIED' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED';

export interface Milestone {
  id: string;
  name: string;
  stage: 'Planning' | 'Approval' | 'Beneficiary Verification' | 'Construction' | 'Infrastructure' | 'Inspection' | 'Resettlement';
  status: MilestoneStatus;
  plannedDate: string;
  actualDate?: string;
  delayDays: number;
  responsibleAuthority: string;
  evidenceUrl?: string;
  evidenceName?: string;
  notes?: string;
}

export interface BasicService {
  id: string;
  name: string;
  category: 'UTILITY' | 'INFRASTRUCTURE' | 'SANITATION' | 'SOCIAL';
  status: ServiceStatus;
  critical: boolean;
  completionPercentage: number;
  lastInspected: string;
  inspectorName: string;
  notes: string;
}

export interface ProjectRiskFactors {
  approvalDelayDays: number;
  constructionDelayVariancePct: number;
  beneficiaryVerificationPct: number;
  fundingDelayStatus: 'ON_TIME' | 'SLIGHT_DELAY' | 'SEVERE_DELAY';
  infrastructureCompletionPct: number;
  unresolvedCriticalIssuesCount: number;
  developerPerformanceRating: number;
  expectedCompletionVarianceMonths: number;
}

export interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  city: string;
  coordinates: [number, number];
  totalHouseholds: number;
  eligibleBeneficiaries: number;
  verifiedBeneficiaries: number;
  developerName: string;
  startDate: string;
  plannedCompletionDate: string;
  revisedCompletionDate: string;
  currentPhase: 'Planning' | 'Approval' | 'Beneficiary Verification' | 'Construction' | 'Infrastructure' | 'Inspection' | 'Resettlement';
  
  // Progress values
  constructionProgressPct: number;
  plannedConstructionProgressPct: number;
  
  // Houses breakdown
  housesCompleted: number;
  housesOccupied: number;
  housesVacant: number;

  // Risk Score (0-100)
  riskScore: number;
  riskLevel: RiskLevel;
  riskExplanation: string;
  riskFactors: ProjectRiskFactors;

  // Basic Services & Resettlement
  basicServices: BasicService[];
  serviceReadinessPct: number;
  resettlementReadinessPct: number;
  resettlementStatus: ResettlementStatus;
  resettlementExplanation: string;

  // Milestones
  milestones: Milestone[];
}

export interface Beneficiary {
  id: string;
  applicantId: string;
  fullName: string;
  householdSize: number;
  incomeCategory: 'EWS' | 'LIG' | 'MIG';
  monthlyIncome: number;
  eligibilityStatus: 'ELIGIBLE' | 'UNDER_REVIEW' | 'INELIGIBLE';
  documentationStatus: 'VERIFIED' | 'PENDING_DOCS' | 'REJECTED';
  verificationStatus: 'VERIFIED' | 'PENDING' | 'FLAGGED_ANOMALY';
  allocationStatus: 'ALLOCATED' | 'WAITLISTED' | 'NOT_ALLOCATED';
  allocatedFlatNumber?: string;
  projectId: string;
  projectName: string;
  
  // AI Anomaly flags
  aiFlagged?: boolean;
  anomalyReason?: string;
  anomalySimilarityPct?: number;
  duplicateMatchedApplicantId?: string;
  officerReviewStatus?: 'PENDING_REVIEW' | 'APPROVED_BY_OFFICER' | 'REJECTED_BY_OFFICER';
  officerNotes?: string;
}

export interface ServiceIssue {
  id: string;
  ticketId: string;
  projectId: string;
  projectName: string;
  blockLocation: string;
  category: 'Water' | 'Electricity' | 'Sewerage' | 'Road' | 'Streetlight' | 'Waste' | 'Sanitation' | 'Construction';
  description: string;
  reportedBy: string;
  reportedRole: 'resident' | 'officer';
  reportedDate: string;
  priority: IssuePriority;
  affectedHouseholds: number;
  status: IssueStatus;
  assignedTo?: string;
  photoUrl?: string;
  resolutionNotes?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'WARNING' | 'CRITICAL' | 'SUCCESS' | 'INFO';
  read: boolean;
  projectId?: string;
  roleTarget?: UserRole | 'ALL';
}

export interface AffordabilityInput {
  householdMonthlyIncome: number;
  housingMonthlyCost: number;
  utilitiesMonthlyCost: number;
  transportMonthlyCost: number;
  distanceToWorkplaceKm: number;
  distanceToSchoolKm: number;
  distanceToHealthcareKm: number;
}

export interface AffordabilityResult {
  totalMonthlyCost: number;
  costToIncomeRatioPct: number;
  suitabilityScore: number;
  suitabilityRating: 'HIGHLY SUITABLE' | 'MODERATELY SUITABLE' | 'HIGH DISPLACEMENT RISK';
  explanation: string;
  recommendations: string[];
}
