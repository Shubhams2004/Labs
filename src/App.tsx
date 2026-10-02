/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Capabilities } from './components/Capabilities';
import { ChemistrySection } from './components/ChemistrySection';
import { HowItWorks } from './components/HowItWorks';
import { FutureExpansion } from './components/FutureExpansion';
import { Footer } from './components/Footer';
import { CatalogueView } from './components/catalogue/CatalogueView';
import { ExperimentWorkspace } from './components/workspace/ExperimentWorkspace';
import { Experiment } from './models/experiment';
import { ACID_BASE_TITRATION_EXPERIMENT } from './experiments/chemistry/titration';
import { CHEMISTRY_EXPERIMENTS_CATALOGUE } from './experiments/chemistry/catalogue';

type AppView = 'home' | 'catalogue' | 'workspace';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment>(
    ACID_BASE_TITRATION_EXPERIMENT
  );

  // Sync view with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#catalogue')) {
        setCurrentView('catalogue');
      } else if (hash.startsWith('#workspace')) {
        setCurrentView('workspace');
      } else if (hash === '' || hash === '#' || hash === '#overview' || hash === '#capabilities' || hash === '#chemistry' || hash === '#how-it-works' || hash === '#roadmap') {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToHome = () => {
    setCurrentView('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCatalogue = () => {
    setCurrentView('catalogue');
    window.location.hash = 'catalogue';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToWorkspace = (experiment: Experiment) => {
    setSelectedExperiment(experiment);
    setCurrentView('workspace');
    window.location.hash = `workspace-${experiment.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased">
      {currentView === 'home' && (
        <>
          <Navbar
            currentView="home"
            onNavigateHome={navigateToHome}
            onNavigateCatalogue={navigateToCatalogue}
          />
          <main className="flex-1">
            <Hero />
            <Capabilities />
            <ChemistrySection
              onNavigateCatalogue={navigateToCatalogue}
              onOpenWorkspace={(id) => {
                const found = CHEMISTRY_EXPERIMENTS_CATALOGUE.find((e) => e.id === id);
                if (found) navigateToWorkspace(found);
              }}
            />
            <HowItWorks />
            <FutureExpansion />
          </main>
          <Footer />
        </>
      )}

      {currentView === 'catalogue' && (
        <>
          <Navbar
            currentView="catalogue"
            onNavigateHome={navigateToHome}
            onNavigateCatalogue={navigateToCatalogue}
          />
          <main className="flex-1">
            <CatalogueView
              onBackToHome={navigateToHome}
              onOpenWorkspace={navigateToWorkspace}
            />
          </main>
          <Footer />
        </>
      )}

      {currentView === 'workspace' && (
        <>
          <Navbar
            currentView="workspace"
            onNavigateHome={navigateToHome}
            onNavigateCatalogue={navigateToCatalogue}
          />
          <main className="flex-1">
            <ExperimentWorkspace
              experiment={selectedExperiment}
              onBackToCatalogue={navigateToCatalogue}
            />
          </main>
          <Footer />
        </>
      )}
    </div>
  );
}
