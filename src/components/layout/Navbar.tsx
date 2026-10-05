import React, { useState } from 'react';
import type { UserRole, NotificationItem } from '../../types';
import { 
  Building2, 
  Home, 
  Map as MapIcon, 
  Users, 
  CheckSquare, 
  ShieldCheck, 
  Calculator, 
  AlertCircle, 
  Bell, 
  Target, 
  UserCheck, 
  ChevronDown,
  LayoutDashboard,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onLoadFlagshipScenario: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  notifications,
  onMarkNotificationRead,
  onLoadFlagshipScenario
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; icon: string; color: string }> = {
    officer: { label: 'Government Officer', icon: '🏢', color: 'bg-emerald-950 text-emerald-300 border-emerald-700' },
    developer: { label: 'Building Developer', icon: '🏗️', color: 'bg-amber-950 text-amber-300 border-amber-700' },
    resident: { label: 'Resident / Family', icon: '🏠', color: 'bg-indigo-950 text-indigo-300 border-indigo-700' }
  };

  const navTabs = [
    { id: 'landing', label: 'Overview', icon: Home },
    { id: 'dashboard', label: 'City Overview', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: Building2 },
    { id: 'map', label: 'Map', icon: MapIcon },
    { id: 'beneficiaries', label: 'Family Check', icon: Users },
    { id: 'services', label: 'Daily Services', icon: CheckSquare },
    { id: 'resettlement', label: 'Move-In Safety', icon: ShieldCheck },
    { id: 'suitability', label: 'Family Budget', icon: Calculator },
    { id: 'issues', label: 'Report Issue', icon: AlertCircle }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100 shadow-xl">
      {/* Top Banner Bar */}
      <div className="bg-slate-950 border-b border-slate-800/80 px-4 py-1.5 text-xs flex justify-between items-center text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-semibold text-slate-300">Government Slum Redevelopment & Safe Move-In Assurance Platform</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-slate-400">Seva First Civic-Tech Platform</span>
          <button
            onClick={onLoadFlagshipScenario}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow transition-all"
            title="Click to view the flagship test case for Shivaji Nagar"
          >
            <Target className="w-3.5 h-3.5" />
            <span>🎯 Flagship Demo Case: Shivaji Nagar</span>
          </button>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Brand Logo */}
        <div 
          onClick={() => onTabChange('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform border border-emerald-400/40">
            A
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                AwasTrack
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-700/60">
                Civic Tech
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-tight">
              Redevelopment-to-Resettlement Assurance
            </p>
          </div>
        </div>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Actions: Role Selector & Notifications */}
        <div className="flex items-center gap-3">
          {/* Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all ${roleLabels[currentRole].color}`}
            >
              <span>{roleLabels[currentRole].icon}</span>
              <span className="hidden sm:inline">{roleLabels[currentRole].label}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 py-1.5 text-xs">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
                  Switch User View
                </div>
                {(['officer', 'developer', 'resident'] as UserRole[]).map(role => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setShowRoleDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-800 transition-colors ${
                      currentRole === role ? 'bg-slate-800/80 font-bold text-emerald-400' : 'text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{roleLabels[role].icon}</span>
                      <span>{roleLabels[role].label}</span>
                    </div>
                    {currentRole === role && <UserCheck className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 relative transition-colors border border-slate-700"
              title="Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white font-mono text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 py-2 max-h-[26rem] overflow-y-auto">
                <div className="px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                  <span className="font-semibold text-xs text-slate-200">Alerts & Notifications</span>
                  <span className="text-[10px] text-slate-400 font-mono">{unreadCount} unread</span>
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs">No active notifications</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-3 border-b border-slate-800/60 hover:bg-slate-800/70 transition-colors cursor-pointer text-xs ${
                        !n.read ? 'bg-slate-800/40 border-l-2 border-l-rose-500' : 'opacity-70'
                      }`}
                    >
                      <div className="flex justify-between items-start font-semibold text-slate-200 mb-1">
                        <span>{n.title}</span>
                        <span className="text-[10px] font-normal text-slate-400 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 space-y-1">
          {navTabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold ${
                  active ? 'bg-slate-800 text-emerald-400' : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
