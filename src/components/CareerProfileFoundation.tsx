import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Check, Plus, X, GraduationCap, Briefcase, Award } from 'lucide-react';
import { StudentProfile } from '../types';

interface CareerProfileFoundationProps {
  onBack: () => void;
}

export const CareerProfileFoundation: React.FC<CareerProfileFoundationProps> = ({ onBack }) => {
  const [profile, setProfile] = useState<StudentProfile>({
    fullName: '',
    email: '',
    educationLevel: 'Undergraduate (Bachelor)',
    fieldOfStudy: '',
    targetRole: '',
    skills: ['Python', 'Data Structures', 'React', 'Problem Solving'],
    interests: ['Software Engineering', 'AI & Machine Learning', 'Open Source'],
    opportunityTypes: ['Internship', 'Scholarship', 'Certification'],
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interestToRemove),
    }));
  };

  const toggleOpportunityType = (type: string) => {
    setProfile((prev) => {
      const exists = prev.opportunityTypes.includes(type);
      return {
        ...prev,
        opportunityTypes: exists
          ? prev.opportunityTypes.filter((t) => t !== type)
          : [...prev.opportunityTypes, type],
      };
    });
  };

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Back Button */}
      <button
        id="profile-back-btn"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-400 hover:text-slate-200 mb-6 transition-colors group cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Back to Home</span>
      </button>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Profile Setup Foundation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight">
          Build Your Career Profile
        </h1>
        <p className="text-sm sm:text-base text-slate-400 mt-1">
          Tell us about your education, target roles, and skills so the Career Agent can match and rank relevant opportunities for you.
        </p>
      </div>

      {/* Form Card */}
      <form onSubmit={handleSaveDraft} className="space-y-6">
        {/* Section 1: Basic & Academic Information */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Academic Background
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-300 mb-1.5">
                Student Email
              </label>
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="e.g. alex@university.edu"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="educationLevel" className="block text-xs font-medium text-slate-300 mb-1.5">
                Education Level
              </label>
              <select
                id="educationLevel"
                value={profile.educationLevel}
                onChange={(e) => setProfile({ ...profile, educationLevel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/60 transition-colors"
              >
                <option value="Undergraduate (Bachelor)">Undergraduate (Bachelor)</option>
                <option value="Graduate (Master / PhD)">Graduate (Master / PhD)</option>
                <option value="Associate Degree">Associate Degree</option>
                <option value="High School Senior">High School Senior</option>
                <option value="Bootcamp / Self-Taught">Bootcamp / Self-Taught</option>
              </select>
            </div>

            <div>
              <label htmlFor="fieldOfStudy" className="block text-xs font-medium text-slate-300 mb-1.5">
                Major / Field of Study
              </label>
              <input
                id="fieldOfStudy"
                type="text"
                value={profile.fieldOfStudy}
                onChange={(e) => setProfile({ ...profile, fieldOfStudy: e.target.value })}
                placeholder="e.g. Computer Science, Data Science"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Career Goals & Target Roles */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
            <Briefcase className="w-5 h-5 text-teal-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Target Career Goals
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="targetRole" className="block text-xs font-medium text-slate-300 mb-1.5">
                Target Role / Career Focus
              </label>
              <input
                id="targetRole"
                type="text"
                value={profile.targetRole}
                onChange={(e) => setProfile({ ...profile, targetRole: e.target.value })}
                placeholder="e.g. Software Engineer Intern, Data Analyst, Cloud Practitioner"
                className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                Opportunity Categories of Interest
              </label>
              <div className="flex flex-wrap gap-2">
                {['Internship', 'Entry-Level Job', 'Scholarship', 'Certification'].map((type) => {
                  const isSelected = profile.opportunityTypes.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleOpportunityType(type)}
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer border ${
                        isSelected
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{type}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Skills & Interests */}
        <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-slate-800">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Skills & Technical Knowledge
            </h2>
          </div>

          <div className="space-y-4">
            {/* Skills */}
            <div>
              <label htmlFor="skillInput" className="block text-xs font-medium text-slate-300 mb-1.5">
                Current Skills & Technologies
              </label>
              <div className="flex gap-2 mb-3">
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
                  placeholder="Add a skill (e.g. Python, SQL, Git)"
                  className="flex-1 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-slate-800/90 text-slate-200 border border-slate-700/60"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="pt-3 border-t border-slate-800/80">
              <label htmlFor="interestInput" className="block text-xs font-medium text-slate-300 mb-1.5">
                Career & Subject Interests
              </label>
              <div className="flex gap-2 mb-3">
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
                  placeholder="Add an interest (e.g. Machine Learning, Cloud Computing)"
                  className="flex-1 px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 transition-colors"
                />
                <button
                  type="button"
                  onClick={addInterest}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-teal-950/40 text-teal-300 border border-teal-800/40"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="text-teal-400/80 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-slate-400">
            Profile saved locally for hackathon demonstration.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              id="save-profile-btn"
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all duration-200 shadow-md shadow-emerald-500/20 active:scale-95 text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaved ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Profile & Ready for Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
