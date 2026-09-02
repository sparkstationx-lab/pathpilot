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

  // Helper to compute local quick score if API hasn't loaded yet
  const computeQuickScore = (opp: Opportunity): { score: number; skillMatch: string[]; skillGaps: string[]; eligibility: string; relevance: string } => {
    const studentSkills = (profile.skills || []).map((s) => s.toLowerCase());
    const requiredSkills = (opp.requiredSkills || []).map((s) => s.toLowerCase());
    const preferredSkills = (opp.preferredSkills || []).map((s) => s.toLowerCase());

    const matchedReq = (opp.requiredSkills || []).filter((s) =>
      studentSkills.some((st) => st.includes(s.toLowerCase()) || s.toLowerCase().includes(st))
    );
    const matchedPref = (opp.preferredSkills || []).filter((s) =>
      studentSkills.some((st) => st.includes(s.toLowerCase()) || s.toLowerCase().includes(st))
    );
    const missing = (opp.requiredSkills || []).filter((s) => !matchedReq.includes(s));

    const totalReq = Math.max(requiredSkills.length, 1);
    const reqRatio = matchedReq.length / totalReq;
    const prefRatio = matchedPref.length / Math.max(preferredSkills.length, 1);

    let score = Math.round(reqRatio * 65 + prefRatio * 20 + 10);
    if (profile.careerGoal && opp.title.toLowerCase().includes(profile.careerGoal.toLowerCase().slice(0, 4))) {
      score = Math.min(score + 10, 96);
    }
    score = Math.max(Math.min(score, 98), 45);

    let eligibility = 'Eligible for Application';
    if (missing.length === 0) {
      eligibility = 'Highly Eligible — Meets Core Prerequisites';
    } else if (missing.length <= 1) {
      eligibility = 'Eligible — Minor Skill Gap Identified';
    } else {
      eligibility = 'Review Needed — Prerequisites Recommended';
    }

    const allMatched = [...matchedReq, ...matchedPref];
    const skillMatch = allMatched.length > 0 ? allMatched : ['STEM Coursework', 'Academic Training'];
    const skillGaps = missing.length > 0 ? missing : ['Advanced Frameworks'];
    const relevance = `Directly aligns with your goal of ${profile.careerGoal || opp.field} by offering industry-grade exposure.`;

    return { score, skillMatch, skillGaps, eligibility, relevance };
  };

  // Rank top opportunities by match score (cached or computed)
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
      const quick = computeQuickScore(opp);
      const fallbackAnalysis: AIMatchAnalysis = {
        opportunityId: opp.id,
        matchScore: quick.score,
        eligibility: quick.eligibility,
        skillMatch: quick.skillMatch,
        careerRelevance: quick.relevance,
        reasons: [
          `Strong alignment with your background in ${profile.branchField || 'Computer Science'}.`,
          `Supports your stated aspiration in ${profile.careerGoal || opp.field}.`,
        ],
        skillGaps: quick.skillGaps,
        analyzedAt: new Date().toISOString(),
        isAiGenerated: false,
      };
      return {
        opportunity: opp,
        score: quick.score,
        analysis: fallbackAnalysis,
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
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-12 space-y-12">
      {/* Navigation Breadcrumb Flow */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-slate-400 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={() => onNavigate('landing')}
            className="hover:text-emerald-400 transition-colors"
          >
            Overview
          </button>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <button 
            onClick={onNavigateToProfile}
            className="hover:text-emerald-400 transition-colors"
          >
            Career Profile
          </button>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <span className="font-semibold text-emerald-400 bg-emerald-950/70 px-3 py-1 rounded-lg border border-emerald-800/60 shadow-sm">
            AI Career Dashboard
          </span>
          <ChevronRight className="w-4 h-4 text-slate-600" />
          <button 
            onClick={onNavigateToOpportunities}
            className="hover:text-emerald-400 transition-colors"
          >
            All Opportunities
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToOpportunities}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
          >
            <Compass className="w-4 h-4" />
            <span>Explore All ({opportunities.length})</span>
          </button>
        </div>
      </div>

      {/* Dashboard Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-800/50 text-emerald-400 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Gemini AI Career Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
            AI Career Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Personalized match scores, eligibility status, and recommendations evaluated against your profile.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
          <button
            onClick={onNavigateToProfile}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-200 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/70 transition-all shadow-sm cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-emerald-400" />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* 1. STUDENT PROFILE SUMMARY CARD */}
      <section className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-8 sm:p-9 backdrop-blur-sm shadow-xl shadow-black/20">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-7 border-b border-slate-800/80">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5 shadow-sm">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-2xl font-bold text-slate-100">
                  {profile.fullName || 'Student Applicant'}
                </h2>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  Active Profile
                </span>
              </div>
              <p className="text-sm text-slate-300 mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>{profile.educationDegree}</span>
                <span className="text-slate-600">•</span>
                <span>{profile.branchField || 'Computer Science'}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">{profile.currentYear}</span>
              </p>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 sm:min-w-[260px] shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
              Target Career Goal
            </span>
            <p className="text-base font-bold text-emerald-300">
              {profile.careerGoal || 'Software Engineer'}
            </p>
          </div>
        </div>

        {/* Profile Attributes Grid: Skills, Interests, Projects */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-7">
          {/* Skills */}
          <div className="rounded-xl bg-slate-950/50 border border-slate-800/70 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Skills ({profile.skills.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
                {profile.skills.length > 0 ? (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700/60 font-mono"
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
          <div className="rounded-xl bg-slate-950/50 border border-slate-800/70 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2">
                  <Target className="w-4 h-4 text-teal-400" />
                  Interests ({profile.interests.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-2 max-h-28 overflow-y-auto pr-1">
                {profile.interests.length > 0 ? (
                  profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="text-xs px-2.5 py-1 rounded-lg bg-teal-950/40 text-teal-200 border border-teal-800/40"
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
          <div className="rounded-xl bg-slate-950/50 border border-slate-800/70 p-5 flex flex-col justify-between">
            <div>
              <span className="text-xs sm:text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
                <FolderGit2 className="w-4 h-4 text-slate-400" />
                Portfolio & Credentials
              </span>
              <div className="space-y-2 text-xs sm:text-sm text-slate-300">
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
              className="mt-4 text-xs font-semibold text-emerald-400 hover:text-emerald-300 text-left transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Update skills & credentials</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. TOP 3 RECOMMENDED OPPORTUNITIES */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
                Top 3 Recommended Opportunities
              </h2>
              {isLoadingAnalyses && (
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-800/40 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Gemini syncing
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Ranked by skill overlap and career goal trajectory
            </p>
          </div>

          <button
            id="dashboard-browse-all-btn"
            onClick={onNavigateToOpportunities}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-400 hover:text-emerald-300 self-start sm:self-auto cursor-pointer"
          >
            <span>View All Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Opportunity Cards */}
        <div className="space-y-6">
          {topThree.map((item, index) => {
            const { opportunity: opp, score, analysis } = item;
            return (
              <div
                key={opp.id}
                id={`top-opp-${opp.id}`}
                className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-7 sm:p-8 backdrop-blur-md hover:border-emerald-500/40 transition-all duration-200 shadow-xl shadow-black/20 space-y-7"
              >
                {/* Header Row: Rank Badge, Title, Company, Category, Match Score */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-mono">
                        TOP #{index + 1} MATCH
                      </span>
                      <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {getCategoryIcon(opp.category)}
                        <span>{opp.category}</span>
                      </span>
                      <span className="text-xs text-slate-400 px-2.5 py-1 rounded-full bg-slate-950/60 border border-slate-800">
                        {opp.type}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
                      {opp.title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-400 pt-1">
                      <span className="flex items-center gap-1.5 text-slate-200 font-medium">
                        <Building2 className="w-4 h-4 text-slate-400" />
                        {opp.organization}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        {opp.location}
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-300">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        Deadline: <strong className="text-slate-200">{opp.deadline}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Match Score & Eligibility Badge */}
                  <div className="flex items-center sm:items-end flex-row sm:flex-col justify-between sm:justify-center gap-3 shrink-0">
                    <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl border font-bold ${getScoreColor(score)}`}>
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <span className="text-xl leading-none">{score}%</span>
                      <span className="text-xs font-medium uppercase tracking-wider">Match</span>
                    </div>

                    <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/40 px-3 py-1.5 rounded-lg text-right">
                      {analysis.eligibility}
                    </span>
                  </div>
                </div>

                {/* Body Details: Career Relevance, Key Skill Matches, Skill Gaps */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Career Goal Relevance */}
                  <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5 flex items-center gap-2">
                        <Target className="w-4 h-4 text-teal-400" />
                        Career Goal Relevance
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {analysis.careerRelevance || opp.summary}
                      </p>
                    </div>
                  </div>

                  {/* Key Skill Matches */}
                  <div className="rounded-xl bg-emerald-950/20 border border-emerald-900/40 p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider block mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Key Skill Matches ({analysis.skillMatch.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {analysis.skillMatch.length > 0 ? (
                          analysis.skillMatch.map((skill, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-1 rounded-lg bg-emerald-900/50 text-emerald-200 border border-emerald-700/50 font-medium"
                            >
                              ✓ {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">Coursework alignment</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Skill Gaps */}
                  <div className="rounded-xl bg-amber-950/20 border border-amber-900/40 p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider block mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        Recommended Skill Focus ({analysis.skillGaps.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {analysis.skillGaps.length > 0 ? (
                          analysis.skillGaps.map((gap, i) => (
                            <span
                              key={i}
                              className="text-xs px-2.5 py-1 rounded-lg bg-amber-900/40 text-amber-200 border border-amber-700/50 font-medium"
                            >
                              + {gap}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-emerald-400 font-medium">✓ Prerequisites satisfied!</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer with Action Button */}
                <div className="pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-400">
                  <span className="text-slate-400">
                    Compensation: <strong className="text-emerald-300">{opp.benefitsOrAward}</strong>
                  </span>

                  <button
                    id={`view-top-opp-${opp.id}-btn`}
                    onClick={() => onSelectOpportunity(opp)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-98 cursor-pointer"
                  >
                    <span>View Opportunity Details & AI Analysis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. RECOMMENDED NEXT ACTIONS */}
      <section className="rounded-2xl border border-slate-800/90 bg-slate-900/70 p-8 sm:p-9 backdrop-blur-sm shadow-xl shadow-black/20">
        <div className="flex items-center gap-3 mb-8 pb-5 border-b border-slate-800/80">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100">
              Recommended Next Actions
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">Targeted steps to strengthen your applications</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1: Bridge Key Skill Gaps */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 flex items-center justify-center text-xs font-bold font-mono">
                1
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wide">
                Targeted Skill Preparation
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Strengthen identified gaps{' '}
              {topGaps.length > 0 ? (
                <strong className="text-emerald-300">({topGaps.join(', ')})</strong>
              ) : (
                'in advanced frameworks'
              )}{' '}
              through hands-on projects or coursework.
            </p>
          </div>

          {/* Action 2: Tailor Portfolio / Resume */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-teal-950 text-teal-300 border border-teal-800/60 flex items-center justify-center text-xs font-bold font-mono">
                2
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wide">
                Align Project Highlights
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Highlight projects and problem-solving skills relevant to <strong className="text-slate-200">{profile.careerGoal || 'software engineering'}</strong>.
            </p>
          </div>

          {/* Action 3: Review Deadlines */}
          <div className="rounded-xl bg-slate-950/60 border border-slate-800/80 p-6 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 flex items-center justify-center text-xs font-bold font-mono">
                3
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-slate-200 uppercase tracking-wide">
                Track Application Deadlines
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              <strong className="text-slate-200">{topThree[0]?.opportunity.title.slice(0, 30)}...</strong> deadline: <strong className="text-emerald-300">{topThree[0]?.opportunity.deadline}</strong>.
            </p>
          </div>
        </div>

        {/* Action Footnotes / Exploration Button */}
        <div className="mt-8 pt-7 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-slate-400">
            Browse all available opportunities, scholarships, and certifications.
          </p>
          <button
            onClick={onNavigateToOpportunities}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all text-xs sm:text-sm cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-98"
          >
            <Compass className="w-4 h-4" />
            <span>Explore All {opportunities.length} Matched Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
