import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Compass, HelpCircle, CheckCircle2 } from 'lucide-react';
import { PageView } from '../types';

interface HeroProps {
  onNavigate: (view: PageView) => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigate, onScrollToSection }) => {
  return (
    <section className="relative pt-12 pb-8 sm:pt-20 sm:pb-12 overflow-hidden">
      {/* Background subtle radial gradient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Small badge: "AI-Powered Career Assistant" */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs sm:text-sm font-medium mb-6 shadow-sm shadow-emerald-950"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>Gemini AI Opportunity Matching</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-100 leading-[1.15] mb-6"
        >
          Discover & Match Career Opportunities{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200">
            Tailored to Your Profile
          </span>
        </motion.h1>

        {/* Short description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8"
        >
          Discover internships, jobs, scholarships, and certifications matched to your skills, with instant eligibility and gap analysis powered by Gemini AI.
        </motion.p>

        {/* Primary & Secondary CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8"
        >
          <button
            id="hero-dashboard-cta"
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-98 text-sm sm:text-base cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-slate-950" />
            <span>Open AI Career Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="hero-profile-cta"
            onClick={() => onNavigate('profile')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-medium text-slate-200 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/70 hover:border-slate-600 transition-all duration-200 text-sm sm:text-base cursor-pointer"
          >
            <span>Career Profile</span>
          </button>

          <button
            id="hero-explore-cta"
            onClick={() => onNavigate('opportunities')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-medium text-slate-300 hover:text-white bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800 transition-all duration-200 text-sm sm:text-base cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Opportunities</span>
          </button>
        </motion.div>

        {/* Value pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400"
        >
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Internships, Jobs, Scholarships & Certifications</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gemini AI Match Score (0–100)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Targeted Skill Gaps & Strengths</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
};
