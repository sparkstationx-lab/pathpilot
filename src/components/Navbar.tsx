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
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90 focus:outline-none cursor-pointer"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
            <Sparkles className="w-4 h-4 text-emerald-400 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <span className="font-bold text-sm sm:text-base text-slate-100 tracking-tight block leading-none">
              PathPilot
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold tracking-wider uppercase block mt-0.5">
              AI Career Agent
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            id="nav-overview-btn"
            onClick={() => onNavigate('landing')}
            className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'landing'
                ? 'text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          <button
            id="nav-profile-btn"
            onClick={() => onNavigate('profile')}
            className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'profile'
                ? 'text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>

          <button
            id="nav-dashboard-btn"
            onClick={() => onNavigate('dashboard')}
            className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'dashboard'
                ? 'text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Dashboard</span>
          </button>

          <button
            id="nav-opportunities-btn"
            onClick={() => onNavigate('opportunities')}
            className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              currentView === 'opportunities' || currentView === 'opportunity-detail'
                ? 'text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Opportunities</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
