import React from 'react';
import { motion } from 'motion/react';
import { UserCheck, Cpu, Target, ArrowRight } from 'lucide-react';

export const VisualFlow: React.FC = () => {
  const steps = [
    {
      id: 'step-profile',
      number: '01',
      title: 'Student Profile',
      subtitle: 'Skills, interests & education',
      icon: UserCheck,
      badge: 'Input',
      accentColor: 'text-emerald-400',
      bgGlow: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      items: ['Academic background', 'Technical & soft skills', 'Target career track'],
    },
    {
      id: 'step-analysis',
      number: '02',
      title: 'AI Analysis',
      subtitle: 'Eligibility & skill matching',
      icon: Cpu,
      badge: 'Intelligence',
      accentColor: 'text-teal-400',
      bgGlow: 'from-teal-500/10 to-transparent',
      borderColor: 'border-teal-500/30',
      items: ['Requirement mapping', 'Skill gap identification', 'Relevance ranking'],
    },
    {
      id: 'step-opportunities',
      number: '03',
      title: 'Matched Opportunities',
      subtitle: 'Ranked & ready for action',
      icon: Target,
      badge: 'Outcome',
      accentColor: 'text-emerald-300',
      bgGlow: 'from-emerald-400/10 to-transparent',
      borderColor: 'border-emerald-400/30',
      items: ['Internships & jobs', 'Scholarships & certs', 'Tailored application drafts'],
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto py-16 sm:py-24 px-6 sm:px-8">
      <div className="text-center mb-12 sm:mb-16">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-3.5 py-1.5 rounded-full">
          Autonomous Workflow
        </span>
        <h3 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-4 tracking-tight">
          From Profile to Opportunities in Three Stages
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative rounded-2xl bg-slate-900/60 border ${step.borderColor} p-7 sm:p-8 backdrop-blur-sm flex flex-col justify-between group hover:bg-slate-900/90 transition-all duration-300 shadow-xl shadow-black/30`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-200 shadow-sm">
                    <Icon className={`w-6 h-6 ${step.accentColor}`} />
                  </div>
                  <span className="text-xs font-mono font-medium px-3 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/60">
                    {step.badge}
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-xs font-mono text-slate-500 font-semibold tracking-wider block mb-1.5">
                    STAGE {step.number}
                  </span>
                  <h4 className="text-xl font-bold text-slate-100 tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                    {step.subtitle}
                  </p>
                </div>

                {/* Micro bullets */}
                <div className="pt-5 border-t border-slate-800/80 space-y-2.5">
                  {step.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                      <span className="w-2 h-2 rounded-full bg-emerald-500/80 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow indicator between cards on desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-950 border border-slate-700 items-center justify-center text-emerald-400 shadow-lg">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
