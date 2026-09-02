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
import { calculateOpportunityMatch } from '../services/matchingService';

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

  // Calculated weighted score from profile and opportunity data
  const calculateQuickScore = (): number => {
    if (cachedAnalysis) return cachedAnalysis.matchScore;
    if (!profile) return 72;
    return calculateOpportunityMatch(profile, opportunity).matchScore;
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
      className="group relative flex flex-col justify-between rounded-2xl border border-slate-800/90 bg-slate-900/75 p-5 backdrop-blur-sm transition-all duration-200 hover:border-emerald-500/50 hover:bg-slate-900/90 hover:shadow-xl hover:shadow-emerald-950/20 cursor-pointer space-y-3.5"
    >
      {/* Card Header & Badges */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getCategoryStyle()}`}>
              {getCategoryIcon()}
              {opportunity.category}
            </span>
            <span className="inline-flex items-center text-xs text-slate-400 px-2 py-0.5 rounded-full bg-slate-800/70 border border-slate-700/60">
              {opportunity.type}
            </span>
          </div>

          {/* Match Score Badge */}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreBadgeColor(matchScore)} shadow-sm shrink-0`}>
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>{matchScore}% Match</span>
          </div>
        </div>

        {/* Title & Organization */}
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
            {opportunity.title}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-slate-300 flex items-center gap-1.5 mt-0.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            {opportunity.organization}
          </p>
        </div>

        {/* Short Summary */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
          {opportunity.summary}
        </p>

        {/* Required Skills Chips */}
        <div className="flex flex-wrap gap-1.5 pt-0.5">
          {opportunity.requiredSkills.slice(0, 3).map((skill, idx) => {
            const isStudentSkill = profile?.skills?.some(
              (s) => s.toLowerCase() === skill.toLowerCase() || skill.toLowerCase().includes(s.toLowerCase())
            );
            return (
              <span
                key={idx}
                className={`text-[11px] px-2 py-0.5 rounded-md border font-mono font-medium ${
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
            <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-800/60 text-slate-400 border border-slate-700/50">
              +{opportunity.requiredSkills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Metadata & Action CTA */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {opportunity.deadline}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {opportunity.location.split('/')[0].trim()}
          </span>
        </div>

        <button
          id={`view-detail-btn-${opportunity.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(opportunity);
          }}
          className="inline-flex items-center gap-1 text-emerald-400 font-semibold group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all text-xs cursor-pointer"
        >
          <span>AI Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
