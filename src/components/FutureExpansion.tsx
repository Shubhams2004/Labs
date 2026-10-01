import React from 'react';
import { PHYSICS_ROADMAP } from '../data/experiments';
import { Compass, Sparkles, Check, ArrowRight } from 'lucide-react';

export const FutureExpansion: React.FC = () => {
  return (
    <section id="roadmap" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
            <span className="text-blue-700 font-semibold uppercase">Platform Trajectory</span>
            <span aria-hidden="true">·</span>
            <span>Disciplines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 [text-wrap:balance]">
            Future Expansion: Physics
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Following the initial deployment of our Chemistry laboratory suite, Labs will systematically
            expand into Physics, offering high-fidelity virtual simulations of classical mechanics,
            wave optics, electromagnetism, and thermodynamics.
          </p>
        </div>

        {/* Physics Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PHYSICS_ROADMAP.map((domain) => (
            <div
              key={domain.name}
              className="p-6 bg-slate-50/70 border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                  {domain.name}
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Planned Expansion
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {domain.focus}
              </p>

              <div className="space-y-2 pt-3 border-t border-slate-200/80">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold block">
                  Planned Experiments
                </span>
                <ul className="space-y-1.5">
                  {domain.experiments.map((expName, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>{expName}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Development Phases Ribbon */}
        <div className="mt-10 p-6 bg-white border border-slate-200 rounded-xl">
          <div className="text-xs font-mono uppercase text-slate-500 font-semibold mb-4">
            Curriculum Release Sequence
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between text-blue-900 font-semibold mb-1">
                <span>Phase 01: Core Chemistry</span>
                <span className="text-[11px] font-mono text-blue-700">Active</span>
              </div>
              <p className="text-slate-600">
                Acid–Base Titration, Reaction Kinetics, and Chemical Equilibrium virtual environments.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between text-slate-900 font-semibold mb-1">
                <span>Phase 02: Physical Chemistry</span>
                <span className="text-[11px] font-mono text-slate-500">Upcoming</span>
              </div>
              <p className="text-slate-600">
                Electrochemistry cell assemblies and Thermochemistry solution calorimetry.
              </p>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between text-slate-900 font-semibold mb-1">
                <span>Phase 03: Physics Suite</span>
                <span className="text-[11px] font-mono text-slate-500">Roadmap</span>
              </div>
              <p className="text-slate-600">
                Classical mechanics, wave optics, electromagnetism, and thermodynamics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
