import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  Briefcase, 
  RefreshCw, 
  Target, 
  Layers, 
  FileText,
  Clock,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Opportunity, StudentProfile, AIMatchAnalysis } from '../types';
import { analyzeOpportunityFit } from '../services/geminiService';
import { AIApplicationGenerator } from './AIApplicationGenerator';

interface OpportunityDetailProps {
  opportunity: Opportunity;
  profile: StudentProfile | null;
  onBack: () => void;
  onEditProfile: () => void;
}

export const OpportunityDetail: React.FC<OpportunityDetailProps> = ({
  opportunity,
  profile,
  onBack,
  onEditProfile,
}) => {
  const [analysis, setAnalysis] = useState<AIMatchAnalysis | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [loadingStepIndex, setLoadingStepIndex] = useState<number>(0);
  const [loadingProgress, setLoadingProgress] = useState<number>(15);

  const loadingMessages = [
    'Analyzing your profile...',
    'Finding relevant opportunity requirements...',
    'Matching your skills...',
    'Checking eligibility...',
    'Preparing your recommendations...',
  ];

  useEffect(() => {
    if (!loading) {
      setLoadingStepIndex(0);
      setLoadingProgress(15);
      return;
    }

    const startTime = Date.now();
    const duration = 2200;

    const msgTimer = setInterval(() => {
      setLoadingStepIndex((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 450);

    const progressTimer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(Math.round((elapsed / duration) * 98), 98);
      setLoadingProgress((p) => Math.max(p, pct));
    }, 40);

    return () => {
      clearInterval(msgTimer);
      clearInterval(progressTimer);
    };
  }, [loading]);

  const fetchAnalysis = async (force = false) => {
    if (!profile) {
      setLoading(false);
      return;
    }

    if (force) {
      setIsRefreshing(true);
    }
    setLoading(true);
    setError(null);

    const minDelay = new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const [result] = await Promise.all([
        analyzeOpportunityFit(profile, opportunity, force),
        minDelay,
      ]);
      setAnalysis(result);
    } catch (err: any) {
      console.error('Failed to analyze fit:', err);
      setError(err.message || 'Unable to complete AI analysis right now. Please try again.');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalysis(false);
  }, [opportunity.id, profile]);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 70) return 'text-teal-400 border-teal-500/40 bg-teal-500/10';
    return 'text-blue-400 border-blue-500/40 bg-blue-500/10';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return 'Exceptional Match';
    if (score >= 80) return 'Strong Fit';
    if (score >= 65) return 'Moderate Fit';
    return 'Foundational Fit';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-7">
      {/* Top Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
        <button
          id="back-to-opportunities-btn"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-emerald-400 transition-colors py-1.5 px-3 rounded-lg hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Opportunities</span>
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <span>Targeting:</span>
          <span className="text-slate-200 font-semibold bg-slate-800/90 px-2.5 py-1 rounded-md border border-slate-700/70 text-xs">
            {profile?.fullName || 'Student'} ({profile?.careerGoal || 'Software Engineer'})
          </span>
          <button
            onClick={onEditProfile}
            className="text-emerald-400 hover:underline hover:text-emerald-300 ml-1 font-medium cursor-pointer text-xs"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Main Opportunity Header */}
      <div className="rounded-2xl border border-slate-800/90 bg-slate-900/80 p-5 sm:p-6 backdrop-blur-md shadow-xl shadow-black/20">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 sm:gap-6">
          <div className="space-y-2.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Briefcase className="w-3 h-3" />
                {opportunity.category}
              </span>
              <span className="inline-flex items-center text-xs text-slate-300 px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                {opportunity.type}
              </span>
              <span className="text-xs text-slate-400 font-mono px-2 py-0.5 rounded-md bg-slate-950/60 border border-slate-800">
                {opportunity.field}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
              {opportunity.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-5 text-xs sm:text-sm text-slate-300 pt-0.5">
              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                {opportunity.organization}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {opportunity.location}
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Deadline: <strong className="text-slate-200">{opportunity.deadline}</strong>
              </span>
            </div>
          </div>

          {/* Benefits / Stipend Card */}
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl px-4 py-3 sm:min-w-[240px] self-start shadow-sm space-y-0.5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Compensation / Award
            </p>
            <p className="text-sm sm:text-base font-bold text-emerald-300">
              {opportunity.benefitsOrAward}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AI ANALYSIS SECTION (Gemini-Powered Fit Assessment) */}
      {/* ========================================================================= */}
      <section 
        id="ai-opportunity-analysis-section" 
        className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/80 p-5 sm:p-6 shadow-2xl shadow-emerald-950/20 relative overflow-hidden space-y-5"
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* AI Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-100">
                  Fit & Compatibility Analysis
                </h2>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-800/50">
                  AI Match
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Evaluated against your profile
              </p>
            </div>
          </div>

          <button
            id="refresh-ai-analysis-btn"
            onClick={() => fetchAnalysis(true)}
            disabled={isRefreshing || loading}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700/70 hover:border-emerald-500/40 transition-all disabled:opacity-50 self-start sm:self-auto cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Re-analyzing...' : 'Refresh Analysis'}</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-8 px-4 flex flex-col items-center justify-center text-center space-y-4 max-w-lg mx-auto">
            {/* Animated AI Core Icon / Spinner */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-xl border-2 border-emerald-500/25 border-t-emerald-400 animate-spin" />
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
                <Sparkles className="w-4 h-4 animate-pulse text-emerald-300" />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-100 min-h-[24px] transition-all duration-300">
                {loadingMessages[loadingStepIndex] || 'Analyzing match compatibility...'}
              </h3>
              <p className="text-xs text-slate-400">
                Evaluating skills, coursework, and requirements for {opportunity.organization}.
              </p>
            </div>

            {/* Progress-style animation bar */}
            <div className="w-full max-w-xs space-y-1.5 pt-1">
              <div className="w-full bg-slate-950 border border-slate-800 h-2 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-150 ease-out"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono px-1">
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>AI Matching</span>
                </span>
                <span className="text-emerald-400 font-semibold">{loadingProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-slate-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-amber-200">
                  AI Analysis Service Notice
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {error}
                </p>
                <button
                  onClick={() => fetchAnalysis(true)}
                  className="text-xs font-semibold text-amber-300 underline hover:text-amber-200 cursor-pointer"
                >
                  Click to retry AI analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Render AI Match Analysis */}
        {!loading && analysis && (
          <div className="space-y-5 relative z-10">
            {/* Top Stat Row: Score & Eligibility Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 1. Match Score Card */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center border ${getScoreColor(analysis.matchScore)} font-bold shrink-0 p-2`}>
                  <span className="text-2xl leading-none">{analysis.matchScore}</span>
                  <span className="text-[10px] uppercase font-semibold mt-0.5">%</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Match Score
                  </span>
                  <p className="text-base font-bold text-slate-100 mt-0.5">
                    {getScoreDescription(analysis.matchScore)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Skills & goals compatibility
                  </p>
                </div>
              </div>

              {/* 2. Eligibility Status Card */}
              <div className="md:col-span-2 rounded-xl border border-slate-800 bg-slate-950/60 p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Eligibility Status
                  </span>
                  <p className="text-sm sm:text-base font-bold text-emerald-300">
                    {analysis.eligibility}
                  </p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Based on your academic year, major, and course prerequisites.
                  </p>
                </div>
              </div>
            </div>

            {/* Career Goal Alignment */}
            {analysis.careerRelevance && (
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Career Goal Relevance
                    </h3>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {analysis.careerRelevance}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Strengths & Missing Skills 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Skill Match / Strengths */}
              <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs sm:text-sm font-bold text-emerald-200 uppercase tracking-wide">
                      Matched Skills ({analysis.skillMatch.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.skillMatch.length > 0 ? (
                      analysis.skillMatch.map((skill, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-emerald-900/50 text-emerald-300 border border-emerald-700/60 font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        No direct skill overlap found.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Missing Skills / Skill Gaps */}
              <div className="rounded-xl border border-amber-900/40 bg-amber-950/20 p-4 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs sm:text-sm font-bold text-amber-200 uppercase tracking-wide">
                      Skill Gaps ({analysis.skillGaps.length})
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.skillGaps.length > 0 ? (
                      analysis.skillGaps.map((gap, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-amber-900/40 text-amber-300 border border-amber-700/50 font-medium"
                        >
                          <Zap className="w-3 h-3 text-amber-400" />
                          {gap}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-400 font-medium">
                        ✓ No major skill gaps identified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Why This Opportunity Is Recommended */}
            {analysis.reasons && analysis.reasons.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 sm:p-5">
                <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Why Recommended
                </h3>
                <ul className="space-y-2">
                  {analysis.reasons.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* AI APPLICATION GENERATOR SUITE */}
      {/* ========================================================================= */}
      <div>
        <AIApplicationGenerator 
          opportunity={opportunity} 
          profile={profile} 
          onEditProfile={onEditProfile} 
        />
      </div>

      {/* ========================================================================= */}
      {/* COMPLETE OPPORTUNITY DETAILS & REQUIREMENTS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left 2 Cols: Description, Responsibilities, Criteria */}
        <div className="md:col-span-2 space-y-5">
          {/* Overview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <h3 className="text-base font-bold text-slate-100 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-400" />
              Description
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {opportunity.description}
            </p>
          </div>

          {/* Key Responsibilities */}
          {opportunity.responsibilities && opportunity.responsibilities.length > 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
              <h3 className="text-base font-bold text-slate-100 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Key Responsibilities
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                {opportunity.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0">•</span>
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Eligibility Criteria */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
            <h3 className="text-base font-bold text-slate-100 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Eligibility Criteria
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {opportunity.eligibilityCriteria.map((crit, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span className="leading-relaxed">{crit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right 1 Col: Required Skills, Preferred Skills, Timeline */}
        <div className="space-y-5">
          {/* Required & Preferred Skills */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Required Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.requiredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 border border-slate-700/80 font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                Preferred Skills
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.preferredSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-md bg-slate-950/80 text-slate-300 border border-slate-800 font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Application Generator
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generate tailored resume summaries, cover letters, and outreach emails.
            </p>
            <button
              id="sidebar-generate-application-btn"
              onClick={() => {
                const el = document.getElementById('ai-application-generator-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full py-2.5 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-md shadow-emerald-950/40 cursor-pointer flex items-center justify-center gap-1.5 active:scale-98"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Generate Application Materials</span>
            </button>
            <button
              onClick={onBack}
              className="w-full py-2 px-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-700/70 transition-all cursor-pointer"
            >
              Back to Opportunities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
