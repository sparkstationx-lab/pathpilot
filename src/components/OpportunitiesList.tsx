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
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 space-y-10">
      {/* Profile Active Status Banner */}
      <div className="rounded-2xl border border-slate-800/90 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 p-7 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl shadow-black/20">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
            <UserCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                {profile?.fullName ? `${profile.fullName}'s Opportunity Feed` : 'Opportunity Feed'}
              </h2>
              <span className="text-xs font-semibold uppercase px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Active Profile
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Targeting: <strong className="text-slate-200">{profile?.careerGoal || 'Software Engineering'}</strong> | Level: <span className="text-slate-300">{profile?.currentYear || '3rd Year'} {profile?.educationDegree || 'B.Tech'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          {onNavigateToDashboard && (
            <button
              id="opportunities-to-dashboard-btn"
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/50 hover:bg-emerald-950/80 px-4 py-2.5 rounded-xl border border-emerald-800/60 transition-all shadow-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Dashboard</span>
            </button>
          )}

          <button
            id="update-profile-banner-btn"
            onClick={onNavigateToProfile}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-slate-100 bg-slate-800/90 hover:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700/80 transition-all shadow-sm cursor-pointer"
          >
            <span>Update Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header, Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
            Opportunities
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            {filteredOpportunities.length} opportunities available
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by role, company, or skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-12 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded bg-slate-800"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all border cursor-pointer ${
                isActive
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
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
        <div className="text-center py-20 rounded-2xl border border-slate-800/80 bg-slate-900/40 p-10 space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mx-auto shadow-inner">
            <Filter className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-200">
              No matching opportunities found
            </h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto">
              Try adjusting your search query or category filters.
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
