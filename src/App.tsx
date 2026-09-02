/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PageView, Opportunity, StudentProfile, AIMatchAnalysis } from './types';
import { OPPORTUNITIES } from './data/opportunities';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VisualFlow } from './components/VisualFlow';
import { Capabilities } from './components/Capabilities';
import { HowItWorks } from './components/HowItWorks';
import { CareerProfile } from './components/CareerProfile';
import { AICareerDashboard } from './components/AICareerDashboard';
import { OpportunitiesList } from './components/OpportunitiesList';
import { OpportunityDetail } from './components/OpportunityDetail';
import { Footer } from './components/Footer';

const STORAGE_KEY = 'autonomous_career_agent_profile';
const MATCH_CACHE_KEY = 'autonomous_career_agent_matches';

const DEFAULT_PROFILE: StudentProfile = {
  fullName: 'Alex Rivera',
  educationDegree: 'Bachelor of Technology (B.Tech)',
  branchField: 'Computer Science & Engineering',
  currentYear: '3rd Year',
  skills: ['Python', 'Data Structures', 'REST APIs', 'Git', 'JavaScript', 'SQL'],
  interests: ['Software Development', 'Artificial Intelligence', 'Cloud Architecture'],
  careerGoal: 'Software Engineer / Full Stack Developer',
  projects: ['Real-Time Web Application (React, Node.js)', 'Algorithms Visualizer (Python)'],
  certifications: ['AWS Cloud Foundations Certified'],
};

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('landing');
  const [previousView, setPreviousView] = useState<PageView>('landing');
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [cachedAnalyses, setCachedAnalyses] = useState<Record<string, AIMatchAnalysis>>({});

  // Load profile from localStorage on mount & view transitions
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setProfile(JSON.parse(saved));
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROFILE));
      }

      const rawMatches = sessionStorage.getItem(MATCH_CACHE_KEY);
      if (rawMatches) {
        setCachedAnalyses(JSON.parse(rawMatches));
      }
    } catch (e) {
      console.error('Failed to read profile or cache:', e);
    }
  }, [currentView]);

  const handleNavigate = (view: PageView) => {
    if (view === 'profile') {
      setPreviousView(currentView !== 'profile' ? currentView : 'landing');
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectOpportunity = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setPreviousView(currentView);
    setCurrentView('opportunity-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Determine which background page to render if modal popup is active
  const effectiveBackgroundView = currentView === 'profile' ? previousView : currentView;

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {effectiveBackgroundView === 'landing' && (
          <div>
            {/* Hero Section */}
            <Hero
              onNavigate={handleNavigate}
              onScrollToSection={scrollToSection}
            />

            {/* Visual Workflow: Student Profile → AI Analysis → Matched Opportunities */}
            <VisualFlow />

            {/* Core Capabilities: Discover Opportunities, AI Match & Eligibility, Application Assistance */}
            <Capabilities />

            {/* How It Works Section */}
            <HowItWorks
              onNavigate={handleNavigate}
            />
          </div>
        )}

        {effectiveBackgroundView === 'dashboard' && (
          <AICareerDashboard
            profile={profile}
            opportunities={OPPORTUNITIES}
            cachedAnalyses={cachedAnalyses}
            onSelectOpportunity={handleSelectOpportunity}
            onNavigateToProfile={() => handleNavigate('profile')}
            onNavigateToOpportunities={() => handleNavigate('opportunities')}
            onNavigate={handleNavigate}
          />
        )}

        {effectiveBackgroundView === 'opportunities' && (
          <OpportunitiesList
            opportunities={OPPORTUNITIES}
            profile={profile}
            cachedAnalyses={cachedAnalyses}
            onSelectOpportunity={handleSelectOpportunity}
            onNavigateToProfile={() => handleNavigate('profile')}
            onNavigateToDashboard={() => handleNavigate('dashboard')}
          />
        )}

        {effectiveBackgroundView === 'opportunity-detail' && selectedOpportunity && (
          <OpportunityDetail
            opportunity={selectedOpportunity}
            profile={profile}
            onBack={() => handleNavigate('opportunities')}
            onEditProfile={() => handleNavigate('profile')}
          />
        )}

        {/* Multi-Step Career Profile Popup / Wizard Modal */}
        {currentView === 'profile' && (
          <CareerProfile
            onBack={() => {
              setCurrentView(previousView);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreOpportunities={() => {
              setCurrentView('opportunities');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onScrollToSection={scrollToSection}
      />
    </div>
  );
}
