import { useState } from 'react';
import type { UserRole, Project, Beneficiary, ServiceIssue, NotificationItem } from './types';
import { mockProjects, mockBeneficiaries, mockServiceIssues, mockNotifications } from './data/mockData';
import { calculateProjectRisk, calculateResettlementReadiness, calculateServiceReadiness } from './services/riskEngine';
import { AIService } from './services/aiService';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Views
import { LandingPage } from './components/views/LandingPage';
import { DashboardView } from './components/views/DashboardView';
import { ProjectDetailView } from './components/views/ProjectDetailView';
import { ServiceReadinessView } from './components/views/ServiceReadinessView';
import { ResettlementReadinessView } from './components/views/ResettlementReadinessView';
import { BeneficiaryView } from './components/views/BeneficiaryView';
import { HousingSuitabilityView } from './components/views/HousingSuitabilityView';
import { IssueManagementView } from './components/views/IssueManagementView';
import { MapView } from './components/views/MapView';

// Modals
import { MilestoneModal } from './components/modals/MilestoneModal';

export function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('officer');
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('proj-shivaji-nagar');
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => 
    AIService.scanBeneficiaryAnomalies(mockBeneficiaries)
  );
  const [issues, setIssues] = useState<ServiceIssue[]>(mockServiceIssues);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  
  // Modal state
  const [milestoneModalProject, setMilestoneModalProject] = useState<Project | null>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Helper to recalculate a project's metrics whenever modified
  const refreshProjectData = (p: Project): Project => {
    const riskResult = calculateProjectRisk(p.riskFactors);
    const svcResult = calculateServiceReadiness(p.basicServices);
    const resettlResult = calculateResettlementReadiness(p);

    return {
      ...p,
      riskScore: riskResult.score,
      riskLevel: riskResult.level,
      riskExplanation: riskResult.explanation,
      serviceReadinessPct: svcResult.percentage,
      resettlementReadinessPct: resettlResult.overallPercentage,
      resettlementStatus: resettlResult.status,
      resettlementExplanation: resettlResult.explanation
    };
  };

  // Flagship Scenario Launcher
  const handleLoadFlagshipScenario = () => {
    setSelectedProjectId('proj-shivaji-nagar');
    setActiveTab('projects');

    // Add notification alert
    const flagshipNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: '🎯 Flagship Demo Loaded',
      message: 'Shivaji Nagar Integrated Redevelopment case study selected. Risk: 78/100 (HIGH). Resettlement: NOT READY.',
      timestamp: 'Just now',
      type: 'CRITICAL',
      read: false,
      roleTarget: 'ALL'
    };
    setNotifications(prev => [flagshipNotif, ...prev]);
  };

  // Beneficiary Officer Review Action
  const handleReviewBeneficiary = (id: string, action: 'APPROVE' | 'REJECT', notes: string) => {
    setBeneficiaries(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          verificationStatus: action === 'APPROVE' ? 'VERIFIED' : 'PENDING',
          aiFlagged: action === 'APPROVE' ? false : b.aiFlagged,
          officerReviewStatus: action === 'APPROVE' ? 'APPROVED_BY_OFFICER' : 'REJECTED_BY_OFFICER',
          officerNotes: notes
        };
      }
      return b;
    }));

    // Add Notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Beneficiary Audit Updated',
        message: `Beneficiary application ID #${id} was ${action === 'APPROVE' ? 'human verified & approved' : 'sent for re-audit'} by ULB Officer.`,
        timestamp: 'Just now',
        type: action === 'APPROVE' ? 'SUCCESS' : 'WARNING',
        read: false
      },
      ...prev
    ]);
  };

  // Issue Add Action
  const handleAddIssue = (newIssue: Partial<ServiceIssue>) => {
    const fullIssue: ServiceIssue = {
      id: `issue-${Date.now()}`,
      ticketId: `TCK-2026-${Math.floor(100 + Math.random() * 900)}`,
      projectId: newIssue.projectId || selectedProjectId,
      projectName: newIssue.projectName || selectedProject.name,
      blockLocation: newIssue.blockLocation || 'Transit Block 1',
      category: newIssue.category || 'Water',
      description: newIssue.description || 'Service disruption reported.',
      reportedBy: newIssue.reportedBy || 'Resident',
      reportedRole: newIssue.reportedRole || 'resident',
      reportedDate: new Date().toISOString().split('T')[0],
      priority: newIssue.priority || 'MEDIUM',
      affectedHouseholds: newIssue.affectedHouseholds || 50,
      status: 'REPORTED',
      photoUrl: newIssue.photoUrl
    };

    setIssues(prev => [fullIssue, ...prev]);

    // Recalculate project risk if critical issue added
    if (fullIssue.priority === 'CRITICAL') {
      setProjects(prev => prev.map(p => {
        if (p.id === fullIssue.projectId) {
          const updatedFactors = {
            ...p.riskFactors,
            unresolvedCriticalIssuesCount: p.riskFactors.unresolvedCriticalIssuesCount + 1
          };
          return refreshProjectData({ ...p, riskFactors: updatedFactors });
        }
        return p;
      }));
    }
  };

  // Issue Status Update Action
  const handleUpdateIssueStatus = (issueId: string, status: ServiceIssue['status'], notes?: string, assignedTo?: string) => {
    setIssues(prev => prev.map(i => {
      if (i.id === issueId) {
        return {
          ...i,
          status,
          resolutionNotes: notes || i.resolutionNotes,
          assignedTo: assignedTo || i.assignedTo
        };
      }
      return i;
    }));
  };

  // Save Progress Update from Developer/Officer Modal
  const handleSaveProgress = (updated: Project) => {
    const refreshed = refreshProjectData(updated);
    setProjects(prev => prev.map(p => p.id === refreshed.id ? refreshed : p));
  };

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Header Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onLoadFlagshipScenario={handleLoadFlagshipScenario}
      />

      {/* Main View Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {activeTab === 'landing' && (
          <LandingPage 
            onNavigate={setActiveTab} 
            onLoadFlagship={handleLoadFlagshipScenario} 
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            projects={projects}
            beneficiaries={beneficiaries}
            issues={issues}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setActiveTab('projects');
            }}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectDetailView
            project={selectedProject}
            currentRole={currentRole}
            allProjects={projects}
            onSelectProject={setSelectedProjectId}
            onOpenMilestoneModal={setMilestoneModalProject}
          />
        )}

        {activeTab === 'services' && (
          <ServiceReadinessView
            project={selectedProject}
            allProjects={projects}
            onSelectProject={setSelectedProjectId}
          />
        )}

        {activeTab === 'resettlement' && (
          <ResettlementReadinessView
            project={selectedProject}
            allProjects={projects}
            onSelectProject={setSelectedProjectId}
            onNavigate={setActiveTab}
          />
        )}

        {activeTab === 'beneficiaries' && (
          <BeneficiaryView
            beneficiaries={beneficiaries}
            currentRole={currentRole}
            onReviewBeneficiary={handleReviewBeneficiary}
          />
        )}

        {activeTab === 'suitability' && (
          <HousingSuitabilityView />
        )}

        {activeTab === 'issues' && (
          <IssueManagementView
            issues={issues}
            projects={projects}
            currentRole={currentRole}
            onAddIssue={handleAddIssue}
            onUpdateIssueStatus={handleUpdateIssueStatus}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            projects={projects}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setActiveTab('projects');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Developer/Officer Milestone Update Modal */}
      {milestoneModalProject && (
        <MilestoneModal
          project={milestoneModalProject}
          onClose={() => setMilestoneModalProject(null)}
          onSaveProgress={handleSaveProgress}
        />
      )}
    </div>
  );
}

export default App;
