import React from 'react';
import { motion } from 'motion/react';
import { Search, Sparkles, FileText, Check } from 'lucide-react';

export const Capabilities: React.FC = () => {
  const capabilities = [
    {
      id: 'cap-discover',
      title: 'Discover Opportunities',
      tagline: 'Multi-category career discovery',
      icon: Search,
      accent: 'emerald',
      description:
        'Find relevant internships, entry-level jobs, scholarships, and professional certifications tailored to your field of study and interests from a single hub.',
      bullets: [
        'Internships & early career jobs',
        'Academic & merit scholarships',
        'Industry-recognized certifications',
      ],
    },
    {
      id: 'cap-match',
      title: 'AI Match & Eligibility',
      tagline: 'Transparent relevance & gap analysis',
      icon: Sparkles,
      accent: 'teal',
      description:
        'Understand how well your current qualifications align with role requirements, discover your skill gaps, and see clear match breakdowns.',
      bullets: [
        'Skill & coursework requirement mapping',
        'Actionable skill gap identification',
        'Relevance scoring based on your profile',
      ],
    },
    {
      id: 'cap-apply',
      title: 'Application Assistance',
      tagline: 'Tailored application material generation',
      icon: FileText,
      accent: 'cyan',
      description:
        'Generate personalized resume summaries, tailored cover letters, and targeted outreach emails specific to the opportunity you are applying for.',
      bullets: [
        'Role-specific resume summary points',
        'Customized student cover letters',
        'Professional application email drafts',
      ],
    },
  ];

  return (
    <section id="capabilities" className="py-16 sm:py-20 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 bg-teal-950/60 border border-teal-800/40 px-3 py-1 rounded-full">
            Core Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 mt-3 tracking-tight">
            Designed for the Student Career Journey
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-2">
            Everything you need to find, evaluate, and prepare applications for relevant opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                className="rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 p-6 flex flex-col justify-between transition-colors duration-200"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-800/90 border border-slate-700/70 flex items-center justify-center text-emerald-400 mb-5 shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>

                  <span className="text-xs font-medium text-emerald-400/90 block mb-1">
                    {cap.tagline}
                  </span>

                  <h3 className="text-lg font-bold text-slate-100 mb-3 tracking-tight">
                    {cap.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed mb-6">
                    {cap.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 space-y-2">
                  {cap.bullets.map((bullet, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-400" />
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
