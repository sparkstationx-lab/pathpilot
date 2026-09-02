import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, Sparkles, Send, ArrowRight } from 'lucide-react';
import { PageView } from '../types';

interface HowItWorksProps {
  onNavigate: (view: PageView) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onNavigate }) => {
  const steps = [
    {
      step: '01',
      title: 'Set Up Your Profile',
      icon: UserCheck,
      description:
        'Add your degree, skills, projects, and target career goals.',
    },
    {
      step: '02',
      title: 'Match & Identify Gaps',
      icon: Sparkles,
      description:
        'Evaluate eligibility against requirements and identify skill gaps.',
    },
    {
      step: '03',
      title: 'Generate Application Materials',
      icon: Send,
      description:
        'Create tailored resume summaries, cover letters, and outreach emails.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-28 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-3.5 py-1.5 rounded-full">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mt-4 tracking-tight">
            How PathPilot Works
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mt-3 leading-relaxed">
            Three steps to match and apply for career opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative rounded-2xl bg-slate-900/70 border border-slate-800/90 p-8 flex flex-col justify-between shadow-xl shadow-black/20 hover:border-slate-700/80 hover:bg-slate-900/90 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-bold font-mono text-emerald-400/70">
                      {item.step}
                    </span>
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-sm">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Action Banner */}
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-teal-950/40 border border-emerald-500/20 p-10 sm:p-12 text-center max-w-4xl mx-auto shadow-2xl shadow-black/30">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 mb-3 tracking-tight">
            Ready to explore your matches?
          </h3>
          <p className="text-base text-slate-300/90 mb-8 max-w-xl mx-auto leading-relaxed">
            Set up your profile to discover matched opportunities.
          </p>
          <button
            id="how-it-works-cta"
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all duration-200 shadow-lg shadow-emerald-500/25 active:scale-98 text-sm sm:text-base cursor-pointer"
          >
            <span>Build My Career Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
