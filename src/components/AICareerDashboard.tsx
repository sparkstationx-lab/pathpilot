import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  UserCheck, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  Briefcase, 
  Building2, 
  Award, 
  BookOpen, 
  Calendar, 
  MapPin, 
  Clock, 
  Zap, 
  Compass, 
  Edit3, 
  Layers,
  ChevronRight,
  RefreshCw,
  FolderGit2,
  GraduationCap
} from 'lucide-react';
import { Opportunity, StudentProfile, AIMatchAnalysis, PageView } from '../types';
import { analyzeOpportunityFit, getCachedMatch } from '../services/geminiService';
import { calculateOpportunityMatch } from '../services/matchingService';

interface AICareerDashboardProps {
  profile: StudentProfile;
  opportunities: Opportunity[];
  cachedAnalyses: Record<string, AIMatchAnalysis>;
  onSelectOpportunity: (opp: Opportunity) => void;
  onNavigateToProfile: () => void;
  onNavigateToOpportunities: () => void;
  onNavigate: (view: PageView) => void;
}

export const AICareerDashboard: React.FC<AICareerDashboardProps> = ({
  profile,
  opportunities,
  cachedAnalyses,
  onSelectOpportunity,
  onNavigateToProfile,
  onNavigateToOpportunities,
  onNavigate,
}) => {
  const [matchData, setMatchData] = useState<Record<string, AIMatchAnalysis>>(cachedAnalyses);
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState<boolean>(false);

  // Rank top opportunities by match score (cached or computed via client-side weighted algorithm)
  const rankedOpportunities = useMemo(() => {
    const scoredList = opportunities.map((opp) => {
      const existing = matchData[opp.id] || getCachedMatch(opp.id);
      if (existing) {
        return {
          opportunity: opp,
          score: existing.matchScore,
          analysis: existing,
        };
      }
      const calculated = calculateOpportunityMatch(profile, opp);
      return {
        opportunity: opp,
        score: calculated.matchScore,
        analysis: calculated,
      };
    });

    // Sort descending by score
    return scoredList.sort((a, b) => b.score - a.score);
  }, [opportunities, matchData, profile]);

  const topThree = rankedOpportunities.slice(0, 3);

  // Fetch AI analysis in background for top 3 if not already generated
  useEffect(() => {
    let isMounted = true;
    const fetchTopThreeAI = async () => {
      const needed = topThree.filter((item) => !item.analysis.isAiGenerated && !matchData[item.opportunity.id]);
      if (needed.length === 0) return;

      setIsLoadingAnalyses(true);
      try {
        for (const item of needed) {
          if (!isMounted) break;
          try {
            const res = await analyzeOpportunityFit(profile, item.opportunity);
            if (isMounted && res) {
              setMatchData((prev) => ({
                ...prev,
                [res.opportunityId]: res,
              }));
            }
          } catch (e) {
            console.warn('Dashboard analysis fetch info:', e);
          }
          // Small pause between background requests
          await new Promise((resolve) => setTimeout(resolve, 350));
        }
      } catch (err) {
        console.warn('Error fetching top 3 analyses:', err);
      } finally {
        if (isMounted) {
          setIsLoadingAnalyses(false);
        }
      }
    };

    fetchTopThreeAI();

    return () => {
      isMounted = false;
    };
  }, [profile.fullName, profile.skills.length, profile.careerGoal]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (score >= 70) return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Internship':
        return <Briefcase className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Job':
        return <Building2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Scholarship':
        return <Award className="w-3.5 h-3.5 text-amber-400" />;
      case 'Certification':
        return <BookOpen className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <GraduationCap className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  // Compile recommended next actions from top matches
  const topGaps = useMemo(() => {
    const allGaps = new Set<string>();
    topThree.forEach((item) => {
      item.analysis.skillGaps.forEach((g) => allGaps.add(g));
    });
    return Array.from(allGaps).slice(0, 4);
  }, [topThree]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-7">
      {/* Navigation Breadcrumb Flow */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-slate-400 pb-3.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <button 
            onClick={() => onNavigate('landing')}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Overview
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <button 
            onClick={onNavigateToProfile}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            Career Profile
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span className="font-semibold text-emerald-400 bg-emerald-950/70 px-2.5 py-0.5 rounded-md border border-emerald-800/60 shadow-sm">
            AI Career Dashboard
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <button 
            onClick={onNavigateToOpportunities}
            className="hover:text-emerald-400 transition-colors cursor-pointer"
          >
            All Opportunities
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToOpportunities}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore All ({opportunities.length})</span>
          </button>
        </div>
      </div>

      {/* Dashboard Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/50 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Match Insights</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            AI Career Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Opportunities ranked by compatibility with your academic and skill profile.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={onNavigateToProfile}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/70 transition-all shadow-sm cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* 1. STUDENT PROFILE SUMMARY CARD */}
      <section className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-xl shadow-black/20 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                  {profile.fullName || 'Student Applicant'}
                </h2>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  Active Profile
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5">
                <span>{profile.educationDegree || 'Degree not specified'}</span>
                <span className="text-slate-600">•</span>
                <span>{profile.branchField || 'Field not specified'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">{profile.currentYear || 'Year not specified'}</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl px-4 py-2.5 sm:min-w-[240px] shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Target Career Goal
            </span>
            <p className="text-sm sm:text-base font-bold text-emerald-300 truncate mt-0.5">
              {profile.careerGoal || 'Software Engineer'}
            </p>
          </div>
        </div>

        {/* Profile Attributes Grid: Skills, Interests, Projects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Skills */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/70 p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Skills ({profile.skills.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-200 border border-slate-700/60 font-mono"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No skills listed</span>
                )}
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/70 p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-teal-400" />
                  Interests ({profile.interests.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {profile.interests.length > 0 ? (
                  profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-xs px-2 py-0.5 rounded-md bg-teal-950/50 text-teal-200 border border-teal-800/50"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500 italic">No interests listed</span>
                )}
              </div>
            </div>
          </div>

          {/* Experience / Projects & Certs count */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/70 p-4 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-2">
                <FolderGit2 className="w-3.5 h-3.5 text-slate-400" />
                Portfolio & Credentials
              </span>
              <div className="space-y-1.5 text-xs text-slate-300">
                <p className="flex items-center justify-between">
                  <span className="text-slate-400">Projects Added:</span>
                  <strong className="text-slate-200">{profile.projects.length}</strong>
                </p>
                <p className="flex items-center justify-between">
                  <span className="text-slate-400">Certifications:</span>
                  <strong className="text-slate-200">{profile.certifications.length}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={onNavigateToProfile}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 text-left transition-colors flex items-center gap-1 cursor-pointer pt-1"
            >
              <span>Update skills & credentials</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. TOP 3 RECOMMENDED OPPORTUNITIES */}
      <section className="space-y-4 sm:space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                Top 3 Recommended Opportunities
              </h2>
              {isLoadingAnalyses && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Syncing
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked by profile compatibility
            </p>
          </div>

          <button
            id="dashboard-browse-all-btn"
            onClick={onNavigateToOpportunities}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Opportunity Cards */}
        <div className="space-y-4 sm:space-y-5">
          {topThree.map((item, index) => {
            const { opportunity: opp, score, analysis } = item;
            return (
              <div
                key={opp.id}
                id={`top-opp-${opp.id}`}
                className="rounded-2xl border border-slate-800/90 bg-slate-900/85 p-5 sm:p-6 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-200 shadow-xl shadow-black/20 space-y-4"
              >
                {/* Header Row: Rank Badge, Title, Company, Category, Match Score */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
                        TOP #{index + 1} MATCH
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {getCategoryIcon(opp.category)}
                        <span>{opp.category}</span>
                      </span>
                      <span className="text-xs text-slate-400 px-2 py-0.5 rounded-full bg-slate-950/60 border border-slate-800">
                        {opp.type}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                      {opp.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1 text-slate-200 font-medium">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        {opp.organization}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {opp.location}
                      </span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        Deadline: <strong className="text-slate-200">{opp.deadline}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Match Score & Eligibility Badge */}
                  <div className="flex items-center sm:items-end flex-row sm:flex-col justify-between sm:justify-center gap-2.5 shrink-0">
                    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-bold ${getScoreColor(score)}`}>
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span className="text-lg leading-none">{score}%</span>
                      <span className="text-[11px] font-semibold uppercase tracking-wider">Match</span>
                    </div>

                    <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/70 border border-emerald-800/40 px-2.5 py-1 rounded-lg text-right">
                      {analysis.eligibility}
                    </span>
                  </div>
                </div>

                {/* Body Details: Career Relevance, Key Skill Matches, Skill Gaps */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
                  {/* Career Goal Relevance */}
                  <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-3.5 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-teal-400" />
                        Career Relevance
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {analysis.careerRelevance || opp.summary}
                      </p>
                    </div>
                  </div>

                  {/* Key Skill Matches */}
                  <div className="rounded-xl bg-emerald-950/20 border border-emerald-900/40 p-3.5 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Matched Skills ({analysis.skillMatch.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.skillMatch.length > 0 ? (
                          analysis.skillMatch.map((skill, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded-md bg-emerald-900/50 text-emerald-200 border border-emerald-700/50 font-medium"
                            >
                              ✓ {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">Prerequisites satisfied</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skill Gaps */}
                  <div className="rounded-xl bg-amber-950/20 border border-amber-900/40 p-3.5 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        Skill Gaps ({analysis.skillGaps.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {analysis.skillGaps.length > 0 ? (
                          analysis.skillGaps.map((gap, i) => (
                            <span
                              key={i}
                              className="text-xs px-2 py-0.5 rounded-md bg-amber-900/40 text-amber-200 border border-amber-700/50 font-medium"
                            >
                              + {gap}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-emerald-400 font-medium">✓ No skill gaps identified</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with Action Button */}
                <div className="pt-3.5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-400">
                  <span className="text-slate-400">
                    Compensation: <strong className="text-emerald-300">{opp.benefitsOrAward}</strong>
                  </span>

                  <button
                    id={`view-top-opp-${opp.id}-btn`}
                    onClick={() => onSelectOpportunity(opp)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-98 cursor-pointer"
                  >
                    <span>View Opportunity Details & AI Analysis</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. RECOMMENDED NEXT ACTIONS */}
      <section className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-sm shadow-xl shadow-black/20 space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              Recommended Next Actions
            </h2>
            <p className="text-xs text-slate-400">Steps to strengthen your applications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {/* Action 1: Bridge Key Skill Gaps */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center justify-center text-[10px] font-bold font-mono">
                1
              </span>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Targeted Skill Prep
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Strengthen identified gaps{' '}
              {topGaps.length > 0 ? (
                <strong className="text-emerald-300">({topGaps.join(', ')})</strong>
              ) : (
                'in relevant technical areas'
              )}{' '}
              through coursework or projects.
            </p>
          </div>

          {/* Action 2: Tailor Portfolio / Resume */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-950 text-teal-300 border border-teal-800/60 flex items-center justify-center text-[10px] font-bold font-mono">
                2
              </span>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Align Project Highlights
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Highlight projects relevant to <strong className="text-slate-200">{profile.careerGoal || 'target roles'}</strong>.
            </p>
          </div>

          {/* Action 3: Review Deadlines */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 flex items-center justify-center text-[10px] font-bold font-mono">
                3
              </span>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Track Deadlines
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200">{topThree[0]?.opportunity.title.slice(0, 26)}...</strong> deadline: <strong className="text-emerald-300">{topThree[0]?.opportunity.deadline}</strong>.
            </p>
          </div>
        </div>

        {/* Action Footnotes / Exploration Button */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            Browse all available opportunities, scholarships, and certifications.
          </p>
          <button
            onClick={onNavigateToOpportunities}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all text-xs sm:text-sm cursor-pointer shadow-md shadow-emerald-500/20 active:scale-98"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore All Opportunities ({opportunities.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};
