/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PageView } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VisualFlow } from './components/VisualFlow';
import { Capabilities } from './components/Capabilities';
import { HowItWorks } from './components/HowItWorks';
import { CareerProfileFoundation } from './components/CareerProfileFoundation';
import { Footer } from './components/Footer';

export default function App() {
  const [currentView, setCurrentView] = useState<PageView>('landing');

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

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content View */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <div>
            {/* Hero Section */}
            <Hero
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onScrollToSection={scrollToSection}
            />

            {/* Visual Workflow: Student Profile → AI Analysis → Matched Opportunities */}
            <VisualFlow />

            {/* Core Capabilities: Discover Opportunities, AI Match & Eligibility, Application Assistance */}
            <Capabilities />

            {/* How It Works Section */}
            <HowItWorks
              onNavigate={(view) => {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        ) : (
          /* Career Profile Creation Foundation (Phase 2 Ready) */
          <CareerProfileFoundation onBack={() => setCurrentView('landing')} />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onScrollToSection={scrollToSection}
      />
    </div>
  );
}
