import React from 'react';
import { Sparkles } from 'lucide-react';
import { PageView } from '../types';

interface FooterProps {
  onNavigate: (view: PageView) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onScrollToSection }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070a11] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Description */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-slate-200 text-sm block">
                Career Agent
              </span>
              <span className="text-xs text-slate-400">
                AI-Powered Career Assistant for Students
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex items-center gap-6 text-xs text-slate-400">
            <button
              onClick={() => onNavigate('landing')}
              className="hover:text-slate-200 transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => onScrollToSection('how-it-works')}
              className="hover:text-slate-200 transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => onScrollToSection('capabilities')}
              className="hover:text-slate-200 transition-colors"
            >
              Capabilities
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              Build Profile
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/60 text-center text-xs text-slate-400">
          <p>Autonomous AI Career Agent • Built for student opportunity discovery</p>
        </div>
      </div>
    </footer>
  );
};
