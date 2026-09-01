import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { PageView } from '../types';

interface NavbarProps {
  currentView: PageView;
  onNavigate: (view: PageView) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate, onScrollToSection }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090d16]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group transition-opacity hover:opacity-90 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-500/10">
            <Sparkles className="w-5 h-5 text-emerald-400 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <span className="font-semibold text-base sm:text-lg text-slate-100 tracking-tight block leading-tight">
              Career Agent
            </span>
            <span className="text-[10px] text-emerald-400/90 font-medium tracking-wide uppercase">
              Student Edition
            </span>
          </div>
        </button>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 sm:gap-6">
          {currentView === 'landing' ? (
            <>
              <button
                id="nav-how-it-works"
                onClick={() => onScrollToSection('how-it-works')}
                className="hidden md:inline-block text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium"
              >
                How It Works
              </button>
              <button
                id="nav-capabilities"
                onClick={() => onScrollToSection('capabilities')}
                className="hidden md:inline-block text-sm text-slate-400 hover:text-slate-200 transition-colors font-medium"
              >
                Capabilities
              </button>
              <button
                id="nav-cta-btn"
                onClick={() => onNavigate('profile')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all duration-200 shadow-sm shadow-emerald-500/20 active:scale-95"
              >
                <span>Build Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button
              id="nav-back-home"
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-colors"
            >
              ← Back to Overview
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};
