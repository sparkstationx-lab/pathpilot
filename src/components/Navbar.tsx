import React from 'react';
import { Sparkles, ArrowRight, Compass, User, Home } from 'lucide-react';
import { PageView } from '../types';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  onScrollToSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onScrollToSection }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 text-left group transition-opacity hover:opacity-90 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
            <Sparkles className="w-5 h-5 text-emerald-400 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <span className="font-semibold text-base sm:text-lg text-slate-100 tracking-tight block leading-tight">
              PathPilot
            </span>
            <span className="text-[11px] text-emerald-400 font-medium tracking-wide uppercase">
              AI Career Agent
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <button
            id="nav-overview-btn"
            onClick={() => onNavigate('landing')}
            className={`text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              currentView === 'landing'
                ? 'text-emerald-400 bg-slate-800/90 border border-slate-700/70 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="hidden md:inline">Overview</span>
          </button>

          <button
            id="nav-profile-btn"
            onClick={() => onNavigate('profile')}
            className={`text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              currentView === 'profile'
                ? 'text-emerald-400 bg-slate-800/90 border border-slate-700/70 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            id="nav-dashboard-btn"
            onClick={() => onNavigate('dashboard')}
            className={`text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              currentView === 'dashboard'
                ? 'text-emerald-400 bg-slate-800/90 border border-slate-700/70 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI Dashboard</span>
          </button>

          <button
            id="nav-opportunities-btn"
            onClick={() => onNavigate('opportunities')}
            className={`text-xs sm:text-sm font-medium px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              currentView === 'opportunities' || currentView === 'opportunity-detail'
                ? 'text-emerald-400 bg-slate-800/90 border border-slate-700/70 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Opportunities</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
