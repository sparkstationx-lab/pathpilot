import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Filter, 
  UserCheck, 
  ArrowRight,
  Briefcase,
  GraduationCap,
  Building2,
  Award,
  BookOpen
} from 'lucide-react';
import { Opportunity, OpportunityCategory, StudentProfile, AIMatchAnalysis } from '../types';
import { OpportunityCard } from './OpportunityCard';

interface OpportunitiesListProps {
  opportunities: Opportunity[];
  profile: StudentProfile | null;
  cachedAnalyses: Record<string, AIMatchAnalysis>;
  onSelectOpportunity: (opp: Opportunity) => void;
  onNavigateToProfile: () => void;
  onNavigateToDashboard?: () => void;
}

export const OpportunitiesList: React.FC<OpportunitiesListProps> = ({
  opportunities,
  profile,
  cachedAnalyses,
  onSelectOpportunity,
  onNavigateToProfile,
  onNavigateToDashboard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { label: string; value: string; icon: any }[] = [
    { label: 'All Opportunities', value: 'All', icon: Sparkles },
    { label: 'Internships', value: 'Internship', icon: Briefcase },
    { label: 'Jobs', value: 'Job', icon: Building2 },
    { label: 'Scholarships', value: 'Scholarship', icon: Award },
    { label: 'Certifications', value: 'Certification', icon: BookOpen },
  ];

  const filteredOpportunities = useMemo(() => {
    return opportunities.filter((opp) => {
      const matchesCategory = selectedCategory === 'All' || opp.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch =
        opp.title.toLowerCase().includes(query) ||
        opp.organization.toLowerCase().includes(query) ||
        opp.field.toLowerCase().includes(query) ||
        opp.summary.toLowerCase().includes(query) ||
        opp.requiredSkills.some((s) => s.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [opportunities, selectedCategory, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Active Status Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-5 sm:p-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                {profile?.fullName ? `Personalized Feed for ${profile.fullName}` : 'Personalized Opportunity Matcher'}
              </h2>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                AI Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Targeting: <strong className="text-slate-200">{profile?.careerGoal || 'Software Engineering'}</strong> | Level: <span className="text-slate-300">{profile?.currentYear || '3rd Year'} {profile?.educationDegree || 'B.Tech / BS'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {onNavigateToDashboard && (
            <button
              id="opportunities-to-dashboard-btn"
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 px-3 py-2 rounded-lg border border-emerald-800/50 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Dashboard</span>
            </button>
          )}

          <button
            id="update-profile-banner-btn"
            onClick={onNavigateToProfile}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-slate-100 bg-slate-800/80 hover:bg-slate-800 px-3.5 py-2 rounded-lg border border-slate-700/80 transition-all"
          >
            <span>Update Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Header, Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Curated Opportunities
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing {filteredOpportunities.length} opportunities ranked with AI match scores
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by role, company, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-thin">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-semibold border-emerald-400 shadow-sm shadow-emerald-950/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              profile={profile}
              cachedAnalysis={cachedAnalyses[opportunity.id] || null}
              onSelect={onSelectOpportunity}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-8">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Filter className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-slate-200 mb-1">
            No matching opportunities found
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search terms or clearing category filters to view all listings.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xs font-medium text-emerald-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
