import React from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Sparkles, 
  ArrowRight,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen
} from 'lucide-react';
import { Opportunity, AIMatchAnalysis, StudentProfile } from '../types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  profile: StudentProfile | null;
  cachedAnalysis?: AIMatchAnalysis | null;
  onSelect: (opportunity: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  profile,
  cachedAnalysis,
  onSelect,
}) => {
  // Category icon mapping
  const getCategoryIcon = () => {
    switch (opportunity.category) {
      case 'Internship':
        return <Briefcase className="w-3.5 h-3.5" />;
      case 'Job':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'Scholarship':
        return <Award className="w-3.5 h-3.5" />;
      case 'Certification':
        return <BookOpen className="w-3.5 h-3.5" />;
      default:
        return <GraduationCap className="w-3.5 h-3.5" />;
    }
  };

  // Category badge colors
  const getCategoryStyle = () => {
    switch (opportunity.category) {
      case 'Internship':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Job':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      case 'Scholarship':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Certification':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  // Quick skill matching calculation if no full AI analysis is cached yet
  const calculateQuickScore = (): number => {
    if (cachedAnalysis) return cachedAnalysis.matchScore;
    if (!profile || !profile.skills || profile.skills.length === 0) return 72;

    const studentSkills = profile.skills.map((s) => s.toLowerCase());
    const req = opportunity.requiredSkills.map((s) => s.toLowerCase());
    const matched = req.filter((r) => studentSkills.some((s) => s.includes(r) || r.includes(s)));
    const ratio = matched.length / Math.max(req.length, 1);
    
    let score = Math.round(50 + ratio * 42);
    if (profile.careerGoal && opportunity.title.toLowerCase().includes(profile.careerGoal.toLowerCase().slice(0, 4))) {
      score = Math.min(score + 6, 98);
    }
    return Math.min(Math.max(score, 55), 96);
  };

  const matchScore = calculateQuickScore();

  const getScoreBadgeColor = (score: number) => {
    if (score >= 85) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    if (score >= 70) return 'bg-teal-500/15 text-teal-300 border-teal-500/30';
    return 'bg-blue-500/15 text-blue-300 border-blue-500/30';
  };

  return (
    <div 
      id={`opp-card-${opportunity.id}`}
      onClick={() => onSelect(opportunity)}
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/70 p-7 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/50 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-emerald-950/20 cursor-pointer space-y-6"
    >
      {/* Card Header & Badges */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getCategoryStyle()}`}>
              {getCategoryIcon()}
              {opportunity.category}
            </span>
            <span className="inline-flex items-center text-xs text-slate-400 px-2.5 py-1 rounded-full bg-slate-800/70 border border-slate-700/60">
              {opportunity.type}
            </span>
          </div>

          {/* Match Score Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border ${getScoreBadgeColor(matchScore)} shadow-sm`}>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>{matchScore}% Match</span>
          </div>
        </div>

        {/* Title & Organization */}
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1 mb-2">
          {opportunity.title}
        </h3>
        <p className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          {opportunity.organization}
        </p>

        {/* Short Summary */}
        <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-5">
          {opportunity.summary}
        </p>

        {/* Required Skills Chips */}
        <div className="flex flex-wrap gap-2 mb-2">
          {opportunity.requiredSkills.slice(0, 3).map((skill, idx) => {
            const isStudentSkill = profile?.skills?.some(
              (s) => s.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(s.toLowerCase())
            );
            return (
              <span
                key={idx}
                className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-medium ${
                  isStudentSkill
                    ? 'bg-emerald-950/50 text-emerald-300 border-emerald-800/70'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700/60'
                }`}
              >
                {skill}
              </span>
            );
          })}
          {opportunity.requiredSkills.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-lg bg-slate-800/60 text-slate-400 border border-slate-700/50">
              +{opportunity.requiredSkills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Metadata & Action CTA */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs sm:text-sm text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            {opportunity.deadline}
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-4 h-4 text-slate-500" />
            {opportunity.location.split('/')[0].trim()}
          </span>
        </div>

        <button
          id={`view-detail-btn-${opportunity.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(opportunity);
          }}
          className="inline-flex items-center gap-1.5 text-emerald-400 font-semibold group-hover:text-emerald-300 group-hover:translate-x-1 transition-all"
        >
          <span>AI Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
