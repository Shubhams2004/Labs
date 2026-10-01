/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Capabilities } from './components/Capabilities';
import { ChemistrySection } from './components/ChemistrySection';
import { HowItWorks } from './components/HowItWorks';
import { FutureExpansion } from './components/FutureExpansion';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Capabilities />
        <ChemistrySection />
        <HowItWorks />
        <FutureExpansion />
      </main>
      <Footer />
    </div>
  );
}
