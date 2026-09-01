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
      title: 'Create Your Career Profile',
      icon: UserCheck,
      description:
        'Share your education details, technical and soft skills, coursework, and the types of roles or scholarships you are targeting.',
    },
    {
      step: '02',
      title: 'AI Matches & Highlights Gaps',
      icon: Sparkles,
      description:
        'The career agent processes your profile against opportunity requirements to rank relevance and pinpoint specific skills to strengthen.',
    },
    {
      step: '03',
      title: 'Generate Custom Materials',
      icon: Send,
      description:
        'Produce tailored resume summaries, custom cover letters, and email outreach drafts tailored specifically to your chosen opportunities.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 sm:py-20 border-t border-slate-800/80 bg-slate-950/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
            Simple Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-3 tracking-tight">
            How Career Agent Works
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            A structured workflow built specifically to help students navigate career discovery with clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative rounded-2xl bg-slate-900/60 border border-slate-800 p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold font-mono text-emerald-400/60">
                      {item.step}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-slate-100 mb-2">
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
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-teal-950/40 border border-emerald-500/20 p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-slate-100 mb-2">
            Ready to find your matched opportunities?
          </h3>
          <p className="text-sm text-slate-300 mb-6 max-w-lg mx-auto">
            Build your student profile to begin discovering internships, jobs, scholarships, and certifications suited for you.
          </p>
          <button
            id="how-it-works-cta"
            onClick={() => onNavigate('profile')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all duration-200 shadow-md shadow-emerald-500/20 active:scale-95 text-sm cursor-pointer"
          >
            <span>Build My Career Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
