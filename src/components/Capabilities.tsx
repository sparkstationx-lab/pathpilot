import React from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, FileText, Check } from 'lucide-react';

export const Capabilities: React.FC = () => {
  const capabilities = [
    {
      id: 'cap-discover',
      title: 'Discover Opportunities',
      tagline: 'Multi-category discovery',
      icon: Search,
      accent: 'emerald',
      description:
        'Curated internships, jobs, scholarships, and certifications matched to your field of study.',
      bullets: [
        'Internships & early career jobs',
        'Academic & merit scholarships',
        'Industry-recognized certifications',
      ],
    },
    {
      id: 'cap-match',
      title: 'AI Match & Eligibility',
      tagline: 'Match & gap analysis',
      icon: Sparkles,
      accent: 'teal',
      description:
        'Transparent compatibility ratings, requirement alignment, and targeted skill gap identification.',
      bullets: [
        'Coursework & skill requirement mapping',
        'Targeted skill gap identification',
        'Relevance scoring based on your profile',
      ],
    },
    {
      id: 'cap-apply',
      title: 'Application Assistance',
      tagline: 'Tailored application suite',
      icon: FileText,
      accent: 'cyan',
      description:
        'Role-specific resume summaries, targeted cover letters, and outreach emails tailored to the opportunity.',
      bullets: [
        'Role-specific resume summary points',
        'Customized student cover letters',
        'Professional application email drafts',
      ],
    },
  ];

  return (
    <section id="capabilities" className="py-20 sm:py-28 border-t border-slate-800/80 bg-[#070a11]/60">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/70 border border-emerald-800/50 px-3.5 py-1.5 rounded-full">
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mt-4 tracking-tight">
            Designed for the Student Career Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-400 mt-3 leading-relaxed">
            Discover, evaluate, and apply for relevant opportunities with transparent AI intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.id}
                id={cap.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-emerald-500/40 p-8 flex flex-col justify-between transition-all duration-300 shadow-xl shadow-black/20 hover:bg-slate-900/90"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-slate-800/90 border border-slate-700/70 flex items-center justify-center text-emerald-400 mb-6 shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>

                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-2">
                    {cap.tagline}
                  </span>

                  <h3 className="text-xl font-bold text-slate-100 mb-3 tracking-tight">
                    {cap.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800/80 space-y-3">
                  {cap.bullets.map((bullet, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      </div>
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
