import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  GraduationCap,
  Sparkles,
  Target,
  FolderGit2,
  Award,
  Plus,
  X,
  CheckCircle2,
  Save,
  Clock,
  RotateCcw,
  Compass,
  ArrowRight
} from 'lucide-react';
import { StudentProfile } from '../types';

interface CareerProfileProps {
  onBack: () => void;
  onExploreOpportunities?: () => void;
}

const STORAGE_KEY = 'autonomous_career_agent_profile';

const INITIAL_PROFILE: StudentProfile = {
  fullName: '',
  educationDegree: 'Bachelor of Technology (B.Tech)',
  branchField: '',
  currentYear: '3rd Year',
  skills: [],
  interests: [],
  careerGoal: '',
  projects: [],
  certifications: [],
};

const SAMPLE_PROFILE: StudentProfile = {
  fullName: 'Alex Rivera',
  educationDegree: 'Bachelor of Technology (B.Tech)',
  branchField: 'Computer Science & Engineering',
  currentYear: '3rd Year',
  skills: ['Python', 'Data Structures', 'REST APIs', 'Git', 'JavaScript', 'SQL'],
  interests: ['Software Development', 'Artificial Intelligence', 'Cloud Architecture'],
  careerGoal: 'Software Engineer / Full Stack Developer',
  projects: ['Real-Time Chat & Collab App (React, Node.js)', 'Algorithms Visualizer (Python)'],
  certifications: ['AWS Cloud Foundations Certified', 'Meta Front-End Developer Specialization'],
};

const SUGGESTED_SKILLS = [
  'Python',
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'SQL',
  'Data Structures',
  'Git',
  'Machine Learning',
  'REST APIs',
  'Java',
  'Docker',
];

const SUGGESTED_INTERESTS = [
  'Software Development',
  'Artificial Intelligence',
  'Data Science',
  'Cloud Architecture',
  'Cybersecurity',
  'Open Source',
  'Web Development',
  'Product Design',
];

export const CareerProfile: React.FC<CareerProfileProps> = ({ onBack, onExploreOpportunities }) => {
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_PROFILE);
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // Load profile from localStorage on component mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setProfile(parsed);
        setHasExistingProfile(true);
      } else {
        // Pre-fill sample profile for immediate testing if completely blank
        setProfile(SAMPLE_PROFILE);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROFILE));
        setHasExistingProfile(true);
      }
    } catch (e) {
      console.error('Error loading profile from localStorage:', e);
    }
  }, []);

  // Handlers for Skills
  const addSkill = (skillToAdd?: string) => {
    const val = (skillToAdd || newSkill).trim();
    if (val && !profile.skills.includes(val)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, val],
      }));
      if (!skillToAdd) setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Handlers for Interests
  const addInterest = (interestToAdd?: string) => {
    const val = (interestToAdd || newInterest).trim();
    if (val && !profile.interests.includes(val)) {
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, val],
      }));
      if (!interestToAdd) setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interestToRemove),
    }));
  };

  // Handlers for Projects
  const addProject = () => {
    const val = newProject.trim();
    if (val && !profile.projects.includes(val)) {
      setProfile((prev) => ({
        ...prev,
        projects: [...prev.projects, val],
      }));
      setNewProject('');
    }
  };

  const removeProject = (projToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p !== projToRemove),
    }));
  };

  // Handlers for Certifications
  const addCertification = () => {
    const val = newCertification.trim();
    if (val && !profile.certifications.includes(val)) {
      setProfile((prev) => ({
        ...prev,
        certifications: [...prev.certifications, val],
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (certToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== certToRemove),
    }));
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setIsSaved(true);
      setHasExistingProfile(true);
      setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error('Error saving profile to localStorage:', e);
    }
  };

  // Load Sample Profile
  const handleLoadSample = () => {
    setProfile(SAMPLE_PROFILE);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_PROFILE));
    setIsSaved(true);
    setHasExistingProfile(true);
  };

  // Reset / Clear
  const handleReset = () => {
    if (window.confirm('Reset all fields to blank?')) {
      setProfile(INITIAL_PROFILE);
      localStorage.removeItem(STORAGE_KEY);
      setHasExistingProfile(false);
      setIsSaved(false);
      setSavedAt(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Top Bar with Navigation & Status */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          id="profile-back-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Overview</span>
        </button>

        <div className="flex items-center gap-2">
          {onExploreOpportunities && (
            <button
              onClick={onExploreOpportunities}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 transition-all"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Explore Opportunities</span>
            </button>
          )}

          {hasExistingProfile && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-400/90 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved locally</span>
              {savedAt && <span className="text-slate-400">• {savedAt}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Career Profile</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
            Create Your Career Profile
          </h1>
          <p className="text-sm sm:text-base text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Provide your academic background, skills, interests, and career goals so Gemini AI can accurately discover, analyze, and rank matching opportunities for you.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="text-xs text-slate-400 hover:text-emerald-400 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition-colors self-start shrink-0"
        >
          Load Student Sample
        </button>
      </div>

      {/* Success Banner */}
      {isSaved && (
        <div className="mb-6 p-5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-emerald-200 text-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-semibold text-emerald-300">Career Profile Successfully Saved!</p>
              <p className="text-xs text-emerald-400/80">Your profile is safely stored locally and ready for Gemini AI opportunity matching.</p>
            </div>
          </div>
          {onExploreOpportunities && (
            <button
              onClick={onExploreOpportunities}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors shrink-0 shadow-sm"
            >
              <span>View Matched Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: Basic Information */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                1. Basic Information
              </h2>
              <p className="text-xs text-slate-400">Your name and primary identity</p>
            </div>
          </div>

          <div>
            <label htmlFor="fullName" className="block text-xs font-medium text-slate-300 mb-1.5">
              Full Name <span className="text-emerald-400">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
              placeholder="e.g. Alex Rivera"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>
        </div>

        {/* SECTION 2: Education */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                2. Education
              </h2>
              <p className="text-xs text-slate-400">Your current academic status and major</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="educationDegree" className="block text-xs font-medium text-slate-300 mb-1.5">
                Education / Degree <span className="text-emerald-400">*</span>
              </label>
              <select
                id="educationDegree"
                value={profile.educationDegree}
                onChange={(e) => setProfile({ ...profile, educationDegree: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
              >
                <option value="Bachelor of Technology (B.Tech)">Bachelor of Technology (B.Tech)</option>
                <option value="Bachelor of Science (B.S. / B.Sc)">Bachelor of Science (B.S. / B.Sc)</option>
                <option value="Bachelor of Engineering (B.E.)">Bachelor of Engineering (B.E.)</option>
                <option value="Bachelor of Computer Applications (BCA)">Bachelor of Computer Applications (BCA)</option>
                <option value="Master of Science (M.S. / M.Sc)">Master of Science (M.S. / M.Sc)</option>
                <option value="Master of Technology (M.Tech)">Master of Technology (M.Tech)</option>
                <option value="Master of Computer Applications (MCA)">Master of Computer Applications (MCA)</option>
                <option value="Diploma / Associate Degree">Diploma / Associate Degree</option>
                <option value="Other Degree / Self-Taught">Other Degree / Self-Taught</option>
              </select>
            </div>

            <div>
              <label htmlFor="branchField" className="block text-xs font-medium text-slate-300 mb-1.5">
                Branch / Field <span className="text-emerald-400">*</span>
              </label>
              <input
                id="branchField"
                type="text"
                required
                value={profile.branchField}
                onChange={(e) => setProfile({ ...profile, branchField: e.target.value })}
                placeholder="e.g. Computer Science, Electrical Engineering"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="currentYear" className="block text-xs font-medium text-slate-300 mb-1.5">
                Current Year <span className="text-emerald-400">*</span>
              </label>
              <select
                id="currentYear"
                value={profile.currentYear}
                onChange={(e) => setProfile({ ...profile, currentYear: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year / Final Year">4th Year (Senior / Final Year)</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 3: Skills & Interests */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                3. Skills & Interests
              </h2>
              <p className="text-xs text-slate-400">Your capabilities and career passions</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Skills */}
            <div>
              <label htmlFor="skillInput" className="block text-xs font-medium text-slate-300 mb-1.5">
                Skills (Languages, Frameworks, Tools)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  id="skillInput"
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Type a skill and press Enter (e.g. Python, React, SQL)"
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
                <button
                  type="button"
                  id="add-skill-btn"
                  onClick={() => addSkill()}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 mr-1">Suggestions:</span>
                {SUGGESTED_SKILLS.filter((s) => !profile.skills.includes(s)).slice(0, 6).map((suggested) => (
                  <button
                    key={suggested}
                    type="button"
                    onClick={() => addSkill(suggested)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-700/50 transition-colors cursor-pointer"
                  >
                    + {suggested}
                  </button>
                ))}
              </div>

              {/* Selected Skills Chips */}
              <div className="flex flex-wrap gap-2 min-h-[32px] p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                {profile.skills.length === 0 ? (
                  <span className="text-xs text-slate-600 italic">No skills added yet. Type above or click suggestions.</span>
                ) : (
                  profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700/80"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-slate-400 hover:text-rose-400 transition-colors"
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Interests */}
            <div>
              <label htmlFor="interestInput" className="block text-xs font-medium text-slate-300 mb-1.5">
                Interests (Domains & Focus Areas)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  id="interestInput"
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addInterest();
                    }
                  }}
                  placeholder="Type an interest and press Enter (e.g. Artificial Intelligence, Cloud)"
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
                <button
                  type="button"
                  id="add-interest-btn"
                  onClick={() => addInterest()}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Quick suggestions */}
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] text-slate-500 mr-1">Suggestions:</span>
                {SUGGESTED_INTERESTS.filter((i) => !profile.interests.includes(i)).slice(0, 5).map((suggested) => (
                  <button
                    key={suggested}
                    type="button"
                    onClick={() => addInterest(suggested)}
                    className="text-[11px] px-2 py-0.5 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-teal-300 border border-slate-700/50 transition-colors cursor-pointer"
                  >
                    + {suggested}
                  </button>
                ))}
              </div>

              {/* Selected Interests Chips */}
              <div className="flex flex-wrap gap-2 min-h-[32px] p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                {profile.interests.length === 0 ? (
                  <span className="text-xs text-slate-600 italic">No interests added yet. Type above or click suggestions.</span>
                ) : (
                  profile.interests.map((interest) => (
                    <span
                      key={interest}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-teal-950/50 text-teal-200 border border-teal-800/50"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="text-teal-400/70 hover:text-rose-400 transition-colors"
                        aria-label={`Remove ${interest}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 4: Career Goals */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                4. Career Goals
              </h2>
              <p className="text-xs text-slate-400">Target roles and aspirations</p>
            </div>
          </div>

          <div>
            <label htmlFor="careerGoal" className="block text-xs font-medium text-slate-300 mb-1.5">
              Primary Career Goal / Target Role <span className="text-emerald-400">*</span>
            </label>
            <input
              id="careerGoal"
              type="text"
              required
              value={profile.careerGoal}
              onChange={(e) => setProfile({ ...profile, careerGoal: e.target.value })}
              placeholder="e.g. Software Engineering Intern, Machine Learning Researcher, Junior Data Analyst"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
            />
          </div>
        </div>

        {/* SECTION 5: Projects & Certifications */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
            <div className="w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
              <FolderGit2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                5. Projects & Certifications
              </h2>
              <p className="text-xs text-slate-400">Practical experience and completed credentials</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Projects */}
            <div>
              <label htmlFor="projectInput" className="block text-xs font-medium text-slate-300 mb-1.5">
                Key Projects (Title & Short Description)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  id="projectInput"
                  type="text"
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addProject();
                    }
                  }}
                  placeholder="e.g. E-Commerce Platform built with React & Node.js"
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
                <button
                  type="button"
                  id="add-project-btn"
                  onClick={addProject}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-2">
                {profile.projects.length === 0 ? (
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-600 italic">
                    No projects added yet. Add relevant class projects, hackathon projects, or personal builds.
                  </div>
                ) : (
                  profile.projects.map((proj, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800/90 flex items-center justify-between gap-3 text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                        <span className="truncate">{proj}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProject(proj)}
                        className="text-slate-400 hover:text-rose-400 p-1 transition-colors flex-shrink-0"
                        aria-label="Remove project"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Certifications */}
            <div className="pt-4 border-t border-slate-800/80">
              <label htmlFor="certInput" className="block text-xs font-medium text-slate-300 mb-1.5">
                Certifications & Courses
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  id="certInput"
                  type="text"
                  value={newCertification}
                  onChange={(e) => setNewCertification(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCertification();
                    }
                  }}
                  placeholder="e.g. AWS Certified Cloud Practitioner, Meta Front-End Certificate"
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
                <button
                  type="button"
                  id="add-cert-btn"
                  onClick={addCertification}
                  className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* Certifications List */}
              <div className="space-y-2">
                {profile.certifications.length === 0 ? (
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-600 italic">
                    No certifications added yet. Add relevant online certificates or credentials.
                  </div>
                ) : (
                  profile.certifications.map((cert, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800/90 flex items-center justify-between gap-3 text-xs text-slate-200"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Award className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                        <span className="truncate">{cert}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCertification(cert)}
                        className="text-slate-400 hover:text-rose-400 p-1 transition-colors flex-shrink-0"
                        aria-label="Remove certification"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Form</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="create-profile-btn"
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all duration-200 shadow-lg shadow-emerald-500/20 active:scale-98 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Career Profile</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
