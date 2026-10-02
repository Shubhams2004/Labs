/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Experiment } from '../../models/experiment';
import { CHEMISTRY_EXPERIMENTS_CATALOGUE } from '../../experiments/chemistry/catalogue';
import { ExperimentCard } from './ExperimentCard';
import { ArrowLeft, Clock, Sparkles, Filter, LayoutTemplate } from 'lucide-react';
import { ExperimentModal } from '../ExperimentModal';
import { CHEMISTRY_EXPERIMENTS } from '../../data/experiments';

interface CatalogueViewProps {
  onBackToHome: () => void;
  onOpenWorkspace: (experiment: Experiment) => void;
}

export const CatalogueView: React.FC<CatalogueViewProps> = ({
  onBackToHome,
  onOpenWorkspace,
}) => {
  const [selectedProtocolExp, setSelectedProtocolExp] = useState<any | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredExperiments = CHEMISTRY_EXPERIMENTS_CATALOGUE.filter((exp) => {
    if (filterCategory === 'all') return true;
    return exp.category.toLowerCase().includes(filterCategory.toLowerCase());
  });

  const handleViewDetails = (exp: Experiment) => {
    // Map to legacy modal format or use directly
    const legacyExp = CHEMISTRY_EXPERIMENTS.find((e) => e.id === exp.id);
    if (legacyExp) {
      setSelectedProtocolExp(legacyExp);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Top Bar with Navigation Breadcrumbs: Labs -> Chemistry -> Experiments */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
              <button
                onClick={onBackToHome}
                className="hover:text-slate-900 transition-colors cursor-pointer"
              >
                Labs
              </button>
              <span aria-hidden="true">/</span>
              <span className="text-slate-900 font-semibold">Chemistry</span>
              <span aria-hidden="true">/</span>
              <span className="text-blue-700 font-semibold">Experiments</span>
            </div>

            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
          </div>

          <div className="mt-4 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Chemistry Laboratory Catalogue
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Explore foundational experimental environments in physical and analytical chemistry.
              All five initial experiments are structured around the unified Labs architecture and are
              currently in active curriculum development.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Architecture Framework Notice Ribbon */}
        <div className="p-4 bg-white border border-blue-200/80 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Foundational Reusable Workspace Architecture
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                The visual layout, measurement recording, parameter controls, graphing engine, and
                decoupled calculation modules are fully operational.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenWorkspace(CHEMISTRY_EXPERIMENTS_CATALOGUE[0])}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
          >
            <span>Preview Experiment Workspace</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
              Filter by Subdiscipline:
            </span>
            <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-lg text-xs font-medium">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterCategory === 'all'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Modules (5)
              </button>
              <button
                onClick={() => setFilterCategory('analytical')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterCategory === 'analytical'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Analytical
              </button>
              <button
                onClick={() => setFilterCategory('physical')}
                className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                  filterCategory === 'physical'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Physical Chemistry
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>1 Active Simulation · 4 Coming Soon</span>
          </div>
        </div>

        {/* Experiment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperiments.map((exp) => (
            <ExperimentCard
              key={exp.id}
              experiment={exp}
              onOpenWorkspace={onOpenWorkspace}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      {/* Protocol Details Modal */}
      {selectedProtocolExp && (
        <ExperimentModal
          experiment={selectedProtocolExp}
          onClose={() => setSelectedProtocolExp(null)}
        />
      )}
    </div>
  );
};
