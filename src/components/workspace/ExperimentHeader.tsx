/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Experiment } from '../../models/experiment';
import { ArrowLeft, RotateCcw, BookOpen, Info, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

interface ExperimentHeaderProps {
  experiment: Experiment;
  onReset: () => void;
  onBackToCatalogue: () => void;
  onToggleInstructions: () => void;
  onToggleTheory: () => void;
  isInstructionsOpen: boolean;
  isTheoryOpen: boolean;
}

export const ExperimentHeader: React.FC<ExperimentHeaderProps> = ({
  experiment,
  onReset,
  onBackToCatalogue,
  onToggleInstructions,
  onToggleTheory,
  isInstructionsOpen,
  isTheoryOpen,
}) => {
  const [showObjectives, setShowObjectives] = useState(false);

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-5">
      {/* Navigation Breadcrumb: Labs -> Chemistry -> Experiments -> Title */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono text-slate-500 mb-3">
        <button
          onClick={onBackToCatalogue}
          className="hover:text-slate-900 transition-colors cursor-pointer"
        >
          Labs
        </button>
        <span aria-hidden="true">/</span>
        <button
          onClick={onBackToCatalogue}
          className="hover:text-slate-900 transition-colors cursor-pointer"
        >
          {experiment.subject}
        </button>
        <span aria-hidden="true">/</span>
        <button
          onClick={onBackToCatalogue}
          className="hover:text-slate-900 transition-colors cursor-pointer"
        >
          Experiments
        </button>
        <span aria-hidden="true">/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{experiment.title}</span>
      </div>

      {/* Title & Top Action Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-mono">
            <span className="font-semibold text-blue-700">{experiment.category}</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-500">{experiment.difficulty} Level</span>
            {experiment.estimatedDurationMinutes && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">~{experiment.estimatedDurationMinutes} min</span>
              </>
            )}
            <span aria-hidden="true">·</span>
            <span className="text-amber-700 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
              {experiment.status === 'coming-soon' ? 'Coming Soon · Framework Preview' : 'Active'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {experiment.title}
          </h1>

          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-3xl">
            {experiment.description}
          </p>

          {/* Collapsible Learning Objectives */}
          <div className="mt-3">
            <button
              onClick={() => setShowObjectives(!showObjectives)}
              className="inline-flex items-center gap-1.5 text-xs text-blue-700 hover:text-blue-800 font-medium cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{showObjectives ? 'Hide' : 'View'} Learning Objectives ({experiment.learningObjectives.length})</span>
              {showObjectives ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showObjectives && (
              <ul className="mt-2 pl-4 space-y-1 text-xs text-slate-600 list-disc bg-slate-50 p-3 rounded-lg border border-slate-200 max-w-2xl">
                {experiment.learningObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Global Experiment Workspace Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0">
          <button
            onClick={onToggleInstructions}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              isInstructionsOpen
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Instructions</span>
          </button>

          <button
            onClick={onToggleTheory}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              isTheoryOpen
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Theory & Laws</span>
          </button>

          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
            title="Reset parameters and observation records"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Experiment</span>
          </button>

          <button
            onClick={onBackToCatalogue}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Catalogue</span>
          </button>
        </div>
      </div>
    </div>
  );
};
