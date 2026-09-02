import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  GraduationCap,
  Sparkles,
  Target,
  FolderGit2,
  Award,
  Plus,
  X,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { StudentProfile } from '../types';
import { AILoadingOverlay } from './AILoadingOverlay';

interface CareerProfileProps {
  onBack: () => void;
  onExploreOpportunities?: () => void;
  onViewDashboard?: () => void;
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
  projects: ['Real-Time Web Application (React, Node.js)', 'Algorithms Visualizer (Python)'],
  certifications: ['AWS Cloud Foundations Certified', 'Meta Front-End Specialization'],
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
  'Web Development',
  'Open Source',
  'Product Engineering',
];

const SUGGESTED_CAREER_GOALS = [
  'Software Engineer / Full Stack Developer',
  'AI / Machine Learning Engineer',
  'Frontend Developer',
  'Backend Engineer',
  'Data Analyst / Scientist',
  'Cloud & DevOps Engineer',
  'Cybersecurity Analyst',
];

const TOTAL_STEPS = 5;

export const CareerProfile: React.FC<CareerProfileProps> = ({
  onBack,
  onExploreOpportunities,
  onViewDashboard,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_PROFILE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Input states for chips / lists
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newProject, setNewProject] = useState('');
  const [newCertification, setNewCertification] = useState('');

  // Load existing profile if available on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setProfile(parsed);
      }
    } catch (e) {
      console.error('Error reading profile from localStorage:', e);
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
      setErrorMsg(null);
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
      setErrorMsg(null);
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
      setErrorMsg(null);
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
      setErrorMsg(null);
    }
  };

  const removeCertification = (certToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((c) => c !== certToRemove),
    }));
  };

  // Validate step before advancing
  const validateCurrentStep = (step: number): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!profile.fullName.trim()) {
        setErrorMsg('Please enter your full name to proceed.');
        return false;
      }
    } else if (step === 2) {
      if (!profile.branchField.trim()) {
        setErrorMsg('Please specify your branch or field of study.');
        return false;
      }
    } else if (step === 4) {
      if (!profile.careerGoal.trim()) {
        setErrorMsg('Please enter your primary career goal or target role.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep(currentStep)) return;

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleFinalSave();
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const handleFinalSave = () => {
    if (isSaving) return;
    setIsSaving(true);

    setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
        if (onViewDashboard) {
          onViewDashboard();
        } else if (onExploreOpportunities) {
          onExploreOpportunities();
        } else {
          onBack();
        }
      } catch (e) {
        console.error('Error saving profile to localStorage:', e);
      } finally {
        setIsSaving(false);
      }
    }, 2400);
  };

  const handleLoadSample = () => {
    setProfile(SAMPLE_PROFILE);
    setErrorMsg(null);
  };

  const handleReset = () => {
    setProfile(INITIAL_PROFILE);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      {/* Modal Container */}
      <div className="relative w-full max-w-xl my-auto bg-slate-900 border border-slate-800/90 rounded-2xl shadow-2xl shadow-black/80 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Subtle Top Accent Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400" />

        {/* Modal Top Header with Step Counter & Close */}
        <div className="px-6 pt-5 pb-4 border-b border-slate-800/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 border border-emerald-800/50 text-emerald-400">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Career Profile Setup
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLoadSample}
              className="text-[11px] font-medium text-slate-400 hover:text-emerald-300 bg-slate-950 border border-slate-800 hover:border-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              Fill Sample
            </button>
            <button
              type="button"
              onClick={onBack}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Subtle Progress Bar */}
        <div className="w-full bg-slate-950 h-1">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>

        {/* Step Body Content */}
        <div className="p-6 sm:p-7 flex-1 min-h-[340px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* STEP 1: Basic Information */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">
                      Basic Information
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Enter your name to personalize opportunity matching.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <label htmlFor="fullName" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Full Name <span className="text-emerald-400">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    autoFocus
                    required
                    value={profile.fullName}
                    onChange={(e) => {
                      setProfile({ ...profile, fullName: e.target.value });
                      if (errorMsg) setErrorMsg(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleNext();
                      }
                    }}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/30 transition-all"
                  />
                </div>
              </motion.div>
            )}

            {/* STEP 2: Education */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">
                      Education
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Select your degree, field of study, and current year.
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 pt-1">
                  <div>
                    <label htmlFor="educationDegree" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Degree / Education <span className="text-emerald-400">*</span>
                    </label>
                    <select
                      id="educationDegree"
                      value={profile.educationDegree}
                      onChange={(e) => setProfile({ ...profile, educationDegree: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
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
                      onChange={(e) => {
                        setProfile({ ...profile, branchField: e.target.value });
                        if (errorMsg) setErrorMsg(null);
                      }}
                      placeholder="e.g. Computer Science & Engineering, Information Technology"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
                    >
                      <option value="1st Year">1st Year (Freshman)</option>
                      <option value="2nd Year">2nd Year (Sophomore)</option>
                      <option value="3rd Year">3rd Year (Junior)</option>
                      <option value="4th Year / Final Year">4th Year (Senior / Final Year)</option>
                      <option value="Recent Graduate">Recent Graduate</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Skills & Interests */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">
                      Skills & Interests
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Add your technical skills and domain interests.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Skills input */}
                  <div>
                    <label htmlFor="skillInput" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Skills
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
                        placeholder="Type skill & press Enter (e.g. Python, React)"
                        className="flex-1 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                      />
                      <button
                        type="button"
                        id="add-skill-btn"
                        onClick={() => addSkill()}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Skill chips */}
                    <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-lg bg-slate-950/70 border border-slate-800/80 mb-2">
                      {profile.skills.length === 0 ? (
                        <span className="text-xs text-slate-600 italic">No skills added yet.</span>
                      ) : (
                        profile.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-200 border border-slate-700/70"
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

                    {/* Suggested skills */}
                    <div className="flex flex-wrap items-center gap-1">
                      <span className="text-[10px] text-slate-500 mr-1">Suggestions:</span>
                      {SUGGESTED_SKILLS.filter((s) => !profile.skills.includes(s)).slice(0, 5).map((suggested) => (
                        <button
                          key={suggested}
                          type="button"
                          onClick={() => addSkill(suggested)}
                          className="text-[10px] px-2 py-0.5 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-emerald-300 border border-slate-700/40 transition-colors cursor-pointer"
                        >
                          + {suggested}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interests input */}
                  <div>
                    <label htmlFor="interestInput" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Interests
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
                        placeholder="Type interest & press Enter (e.g. AI, Cloud)"
                        className="flex-1 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                      />
                      <button
                        type="button"
                        id="add-interest-btn"
                        onClick={() => addInterest()}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    {/* Interest chips */}
                    <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 rounded-lg bg-slate-950/70 border border-slate-800/80">
                      {profile.interests.length === 0 ? (
                        <span className="text-xs text-slate-600 italic">No interests added yet.</span>
                      ) : (
                        profile.interests.map((interest) => (
                          <span
                            key={interest}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-teal-950/50 text-teal-200 border border-teal-800/50"
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
              </motion.div>
            )}

            {/* STEP 4: Career Goals */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">
                      Career Goals
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Define your target role or career trajectory.
                    </p>
                  </div>
                </div>

                <div className="pt-1 space-y-3">
                  <div>
                    <label htmlFor="careerGoal" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Primary Career Goal <span className="text-emerald-400">*</span>
                    </label>
                    <input
                      id="careerGoal"
                      type="text"
                      autoFocus
                      required
                      value={profile.careerGoal}
                      onChange={(e) => {
                        setProfile({ ...profile, careerGoal: e.target.value });
                        if (errorMsg) setErrorMsg(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleNext();
                        }
                      }}
                      placeholder="e.g. Software Engineer / Full Stack Developer"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block mb-2">Quick role presets:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_CAREER_GOALS.map((goal) => (
                        <button
                          key={goal}
                          type="button"
                          onClick={() => {
                            setProfile({ ...profile, careerGoal: goal });
                            if (errorMsg) setErrorMsg(null);
                          }}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            profile.careerGoal === goal
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-medium'
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                          }`}
                        >
                          {goal}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 5: Projects & Certifications */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0 mt-0.5">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-100">
                      Projects & Certifications
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Add relevant projects and earned credentials.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  {/* Projects */}
                  <div>
                    <label htmlFor="projectInput" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Projects
                    </label>
                    <div className="flex gap-2 mb-2">
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
                        placeholder="e.g. Web Application (React, Node.js)"
                        className="flex-1 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                      />
                      <button
                        type="button"
                        id="add-project-btn"
                        onClick={addProject}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-[85px] overflow-y-auto pr-1">
                      {profile.projects.length === 0 ? (
                        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-600 italic">
                          No projects added yet.
                        </div>
                      ) : (
                        profile.projects.map((proj, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-slate-950 border border-slate-800/90 flex items-center justify-between gap-2 text-xs text-slate-200"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                              <span className="truncate">{proj}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeProject(proj)}
                              className="text-slate-400 hover:text-rose-400 transition-colors shrink-0 p-0.5"
                              aria-label="Remove project"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <label htmlFor="certInput" className="block text-xs font-medium text-slate-300 mb-1.5">
                      Certifications
                    </label>
                    <div className="flex gap-2 mb-2">
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
                        placeholder="e.g. AWS Cloud Certified"
                        className="flex-1 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                      />
                      <button
                        type="button"
                        id="add-cert-btn"
                        onClick={addCertification}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>

                    <div className="space-y-1.5 max-h-[85px] overflow-y-auto pr-1">
                      {profile.certifications.length === 0 ? (
                        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-600 italic">
                          No certifications added yet.
                        </div>
                      ) : (
                        profile.certifications.map((cert, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded-lg bg-slate-950 border border-slate-800/90 flex items-center justify-between gap-2 text-xs text-slate-200"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <Award className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                              <span className="truncate">{cert}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeCertification(cert)}
                              className="text-slate-400 hover:text-rose-400 transition-colors shrink-0 p-0.5"
                              aria-label="Remove certification"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Validation Error Message */}
          {errorMsg && (
            <div className="mt-3 p-2.5 rounded-lg bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Controls */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between gap-3">
          {/* Back Button */}
          <button
            type="button"
            id="wizard-back-btn"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          {/* Subtle Step Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  // Only allow jumping back to previously completed steps or next step if valid
                  if (i + 1 < currentStep) {
                    setErrorMsg(null);
                    setCurrentStep(i + 1);
                  } else if (i + 1 === currentStep + 1 && validateCurrentStep(currentStep)) {
                    setCurrentStep(i + 1);
                  }
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i + 1 === currentStep
                    ? 'w-6 bg-emerald-400'
                    : i + 1 < currentStep
                    ? 'w-2 bg-emerald-500/50 hover:bg-emerald-400'
                    : 'w-2 bg-slate-800'
                }`}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          {/* Next / Submit Button */}
          {currentStep < TOTAL_STEPS ? (
            <button
              type="button"
              id="wizard-next-btn"
              onClick={handleNext}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-semibold text-xs sm:text-sm transition-all shadow-md shadow-emerald-500/20 active:scale-98 cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              id="create-profile-btn"
              onClick={handleNext}
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-500/25 active:scale-98 cursor-pointer disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSaving ? 'Analyzing Profile...' : 'Create My Career Profile'}</span>
            </button>
          )}
        </div>
      </div>

      {/* AI Loading State Animation */}
      <AILoadingOverlay
        isOpen={isSaving}
        title="PathPilot AI Career Matcher"
        messages={[
          'Analyzing your profile...',
          'Matching your skills...',
          'Checking eligibility...',
          'Preparing your recommendations...',
        ]}
        subtext="Configuring your personalized opportunity recommendations."
        minDurationMs={2400}
      />
    </div>
  );
};
