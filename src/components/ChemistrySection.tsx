import React, { useState } from 'react';
import { CHEMISTRY_EXPERIMENTS, Experiment } from '../data/experiments';
import { ExperimentModal } from './ExperimentModal';
import { ArrowUpRight, Clock, Beaker, FileText } from 'lucide-react';

export const ChemistrySection: React.FC = () => {
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);

  return (
    <section id="chemistry" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
              <span className="text-blue-700 font-semibold uppercase">Initial Discipline</span>
              <span aria-hidden="true">·</span>
              <span>Foundational Suite</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-700 font-medium">Coming Soon</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 [text-wrap:balance]">
              Coming First: Chemistry Laboratory
            </h2>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              We are introducing Chemistry as our inaugural discipline, featuring five fundamental
              experimental environments built on rigorous analytical formulas and real physical constants.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200 shrink-0 self-start md:self-auto">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>5 Core Experiments in Active Protocol Design</span>
          </div>
        </div>

        {/* Experiment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHEMISTRY_EXPERIMENTS.map((exp, index) => (
            <div
              key={exp.id}
              className={`bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-sm transition-all group ${
                index === 0 ? 'lg:col-span-2 bg-gradient-to-br from-white to-slate-50/50' : ''
              }`}
            >
              <div>
                {/* Card Top Unboxed Metadata */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-slate-400">EXP-0{index + 1}</span>
                    <span aria-hidden="true">·</span>
                    <span>{exp.category}</span>
                  </div>

                  {/* Clearly marked as Coming Soon */}
                  <span className="text-[11px] font-mono font-medium text-amber-700 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/80">
                    Coming Soon
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors">
                  {exp.title}
                </h3>

                <p className="mt-2 text-xs font-medium text-slate-700">
                  {exp.tagline}
                </p>

                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  {exp.summary}
                </p>

                {/* Mathematical Formulation Preview */}
                <div className="mt-5 p-3 bg-slate-50 rounded-lg border border-slate-100 font-mono text-xs text-slate-800 text-center overflow-x-auto">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                    {exp.equationLabel}
                  </div>
                  <code>{exp.equation}</code>
                </div>

                {/* Apparatus Summary */}
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Beaker className="w-3.5 h-3.5 text-slate-400" />
                    {exp.apparatus.length} Calibrated Apparatus
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{exp.protocolSteps.length} Protocol Steps</span>
                </div>
              </div>

              {/* Action Button: Opens Modal Protocol Brief */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedExperiment(exp)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-900 hover:text-blue-700 transition-colors cursor-pointer group-hover:translate-x-0.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>View Protocol & Objectives</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700" />
                </button>

                <span className="text-[11px] font-mono text-slate-400">Phase 1</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Brief Modal */}
      {selectedExperiment && (
        <ExperimentModal
          experiment={selectedExperiment}
          onClose={() => setSelectedExperiment(null)}
        />
      )}
    </section>
  );
};
