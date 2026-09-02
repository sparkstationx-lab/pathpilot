import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  FileText, 
  Mail, 
  FileSignature, 
  Copy, 
  Check, 
  RotateCcw, 
  AlertCircle, 
  UserCheck, 
  Layers,
  ChevronRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Opportunity, StudentProfile, AIApplicationMaterials } from '../types';
import { generateApplicationMaterials, getCachedApplication } from '../services/geminiService';

interface AIApplicationGeneratorProps {
  opportunity: Opportunity;
  profile: StudentProfile | null;
  onEditProfile?: () => void;
}

export const AIApplicationGenerator: React.FC<AIApplicationGeneratorProps> = ({
  opportunity,
  profile,
  onEditProfile,
}) => {
  const [materials, setMaterials] = useState<AIApplicationMaterials | null>(() => 
    getCachedApplication(opportunity.id)
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'resume' | 'cover' | 'email'>('all');

  // If cached data exists for this opportunity, restore it on opportunity change
  useEffect(() => {
    const cached = getCachedApplication(opportunity.id);
    setMaterials(cached);
    setError(null);
  }, [opportunity.id]);

  const handleGenerate = async (force = false) => {
    if (!profile) return;
    setLoading(true);
    setError(null);

    try {
      const result = await generateApplicationMaterials(profile, opportunity, force);
      setMaterials(result);
    } catch (err: any) {
      console.error('Failed to generate application materials:', err);
      setError(err.message || 'Unable to generate application materials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2200);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleCopyAll = () => {
    if (!materials) return;
    const combined = `=====================================================
APPLICATION MATERIALS FOR: ${opportunity.title} at ${opportunity.organization}
STUDENT APPLICANT: ${profile?.fullName || 'Student Applicant'}
=====================================================

--- 1. TAILORED RESUME SUMMARY ---
${materials.resumeSummary}

--- 2. TARGETED COVER LETTER ---
${materials.coverLetter}

--- 3. APPLICATION EMAIL ---
SUBJECT: ${materials.applicationEmail.subject}

${materials.applicationEmail.body}
`;
    copyToClipboard(combined, 'all');
  };

  return (
    <section 
      id="ai-application-generator-section"
      className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-md shadow-xl space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-800/50 text-emerald-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Application Generator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
            Tailored Application Suite
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Generate a tailored resume summary, cover letter, and outreach email based on your profile.
          </p>
        </div>

        {materials && !loading && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="regenerate-application-btn"
              onClick={() => handleGenerate(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-950 border border-slate-800 hover:border-slate-700 hover:text-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
              <span>Regenerate</span>
            </button>

            <button
              id="copy-all-application-btn"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm cursor-pointer"
            >
              {copiedKey === 'all' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>All Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-red-950/30 border border-red-800/50 p-4 flex items-start gap-3 text-red-200 text-xs">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">{error}</p>
            <button
              onClick={() => handleGenerate(true)}
              className="text-red-300 underline hover:text-white font-medium"
            >
              Click here to retry generation
            </button>
          </div>
        </div>
      )}

      {/* Profile grounding disclaimer banner */}
      <div className="rounded-xl bg-slate-950/60 border border-slate-800/70 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Strictly grounded in your verified profile:{' '}
            <strong className="text-slate-200">{profile?.fullName || 'Student'}</strong> (
            {profile?.educationDegree}, {profile?.skills.length || 0} skills, {profile?.projects.length || 0} projects)
          </span>
        </div>
        {onEditProfile && (
          <button
            onClick={onEditProfile}
            className="text-emerald-400 hover:text-emerald-300 font-medium underline self-start sm:self-auto"
          >
            Update profile data
          </button>
        )}
      </div>

      {/* 1. INITIAL EMPTY / CALL-TO-ACTION STATE */}
      {!materials && !loading && (
        <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-8 sm:p-10 text-center space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-lg sm:text-xl font-bold text-slate-100">
              Ready to Apply for {opportunity.title}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Generate a customized application package tailored to {opportunity.organization}.
            </p>
          </div>

          {/* 3 Deliverables Preview Pills */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <FileText className="w-3.5 h-3.5" />
                <span>Resume Summary</span>
              </div>
              <p className="text-[11px] text-slate-400">2–3 sentence profile header for this role.</p>
            </div>

            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <FileSignature className="w-3.5 h-3.5" />
                <span>Cover Letter</span>
              </div>
              <p className="text-[11px] text-slate-400">Targeted letter highlighting your projects and skills.</p>
            </div>

            <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3.5 space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <Mail className="w-3.5 h-3.5" />
                <span>Application Email</span>
              </div>
              <p className="text-[11px] text-slate-400">Concise outreach note for hiring teams.</p>
            </div>
          </div>

          <div>
            <button
              id="generate-application-cta-btn"
              onClick={() => handleGenerate(false)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-98 text-sm cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Generate Application</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. LOADING STATE */}
      {loading && (
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-10 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 animate-spin mb-2">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-100">
              Drafting Application Materials with Gemini...
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Evaluating your academic background in {profile?.branchField || 'Computer Science'}, verified skills, and project accomplishments against {opportunity.organization}'s requirements.
            </p>
          </div>
          <div className="w-48 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div className="w-full h-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      )}

      {/* 3. GENERATED MATERIALS DISPLAY */}
      {materials && !loading && (
        <div className="space-y-6">
          {/* Navigation Tab Bar for Filter/Quick Jump */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1.5">
              <button
                id="tab-all-materials"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
                }`}
              >
                All Sections (3)
              </button>

              <button
                id="tab-resume-summary"
                onClick={() => setActiveTab('resume')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'resume'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume Summary</span>
              </button>

              <button
                id="tab-cover-letter"
                onClick={() => setActiveTab('cover')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'cover'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
                }`}
              >
                <FileSignature className="w-3.5 h-3.5" />
                <span>Cover Letter</span>
              </button>

              <button
                id="tab-application-email"
                onClick={() => setActiveTab('email')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'email'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Application Email</span>
              </button>
            </div>

            <span className="text-[11px] text-slate-500">
              Generated: {new Date(materials.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1: RESUME SUMMARY */}
          {/* ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'resume') && (
            <div 
              id="resume-summary-section"
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6 space-y-3.5 relative hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-100">
                      Tailored Resume Summary
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Add this statement to the top of your resume.
                    </p>
                  </div>
                </div>

                <button
                  id="copy-resume-summary-btn"
                  onClick={() => copyToClipboard(materials.resumeSummary, 'resume')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-slate-900 border border-slate-800 hover:border-emerald-700/60 transition-all self-start sm:self-auto cursor-pointer"
                >
                  {copiedKey === 'resume' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Summary</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-lg bg-slate-900/90 border border-slate-800/80 p-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans select-all">
                {materials.resumeSummary}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Tailored for: <strong className="text-slate-400">{opportunity.title}</strong></span>
                <span>{materials.resumeSummary.split(' ').length} words</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 2: COVER LETTER */}
          {/* ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'cover') && (
            <div 
              id="cover-letter-section"
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6 space-y-3.5 relative hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                    <FileSignature className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-100">
                      Targeted Cover Letter
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Connects your projects and skills to the role.
                    </p>
                  </div>
                </div>

                <button
                  id="copy-cover-letter-btn"
                  onClick={() => copyToClipboard(materials.coverLetter, 'cover')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-teal-400 hover:text-teal-300 bg-slate-900 border border-slate-800 hover:border-teal-700/60 transition-all self-start sm:self-auto cursor-pointer"
                >
                  {copiedKey === 'cover' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-teal-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Cover Letter</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-lg bg-slate-900/90 border border-slate-800/80 p-5 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line select-all space-y-3">
                {materials.coverLetter}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Addressed to: <strong className="text-slate-400">{opportunity.organization}</strong></span>
                <span>{materials.coverLetter.split(' ').length} words</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION 3: APPLICATION EMAIL */}
          {/* ========================================================================= */}
          {(activeTab === 'all' || activeTab === 'email') && (
            <div 
              id="application-email-section"
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 sm:p-6 space-y-4 relative hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-100">
                      Application Outreach Email
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Ready-to-send outreach message for hiring teams.
                    </p>
                  </div>
                </div>

                <button
                  id="copy-full-email-btn"
                  onClick={() => copyToClipboard(`Subject: ${materials.applicationEmail.subject}\n\n${materials.applicationEmail.body}`, 'email')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-slate-900 border border-slate-800 hover:border-cyan-700/60 transition-all self-start sm:self-auto cursor-pointer"
                >
                  {copiedKey === 'email' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Copied Full Email!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Email</span>
                    </>
                  )}
                </button>
              </div>

              {/* Subject Line */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400">
                    Email Subject Line
                  </span>
                  <button
                    onClick={() => copyToClipboard(materials.applicationEmail.subject, 'email-subject')}
                    className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    {copiedKey === 'email-subject' ? (
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Subject</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-lg bg-slate-900/90 border border-slate-800/80 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-200 select-all">
                  {materials.applicationEmail.subject}
                </div>
              </div>

              {/* Email Body */}
              <div className="space-y-1.5">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-slate-400 block">
                  Email Message Body
                </span>
                <div className="rounded-lg bg-slate-900/90 border border-slate-800/80 p-4 text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line select-all">
                  {materials.applicationEmail.body}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
