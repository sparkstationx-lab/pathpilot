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
    <div className="w-full max-w-5xl mx-auto my-12 px-4 sm:px-6">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400/90 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1 rounded-full">
          Autonomous Workflow
        </span>
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-100 mt-2">
          From Profile to Opportunities in Three Stages
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`relative rounded-2xl bg-slate-900/60 border ${step.borderColor} p-5 sm:p-6 backdrop-blur-sm flex flex-col justify-between group hover:bg-slate-900/90 transition-all duration-300 shadow-lg shadow-black/20`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-slate-200">
                    <Icon className={`w-5 h-5 ${step.accentColor}`} />
                  </div>
                  <span className="text-xs font-mono font-medium px-2.5 py-1 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700/50">
                    {step.badge}
                  </span>
                </div>

                <div className="mb-3">
                  <span className="text-xs font-mono text-slate-500 font-semibold tracking-wider block mb-1">
                    STAGE {step.number}
                  </span>
                  <h4 className="text-lg font-bold text-slate-100 tracking-tight">
                    {step.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    {step.subtitle}
                  </p>
                </div>

                {/* Micro bullets */}
                <div className="pt-3 border-t border-slate-800/80 space-y-1.5">
                  {step.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrow indicator between cards on desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-slate-950 border border-slate-700 items-center justify-center text-emerald-400 shadow-md">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
