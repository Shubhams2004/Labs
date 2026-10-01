import React from 'react';
import { ArrowRight, ChevronDown, Compass } from 'lucide-react';
import { InteractiveWorkbenchPreview } from './InteractiveWorkbenchPreview';

export const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="overview" className="relative pt-12 pb-20 md:pt-18 md:pb-28 overflow-hidden">
      {/* Subtle scientific grid & coordinate background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(226, 232, 240, 0.6) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(226, 232, 240, 0.6) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Eyebrow Metadata (Zero-pill discipline) */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-4">
          <span className="flex items-center gap-1.5 text-blue-700 font-medium">
            <Compass className="w-3.5 h-3.5" />
            Interactive Empirical Platform
          </span>
          <span aria-hidden="true">·</span>
          <span>Physical Sciences</span>
          <span aria-hidden="true">·</span>
          <span>Simulation Engine</span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] [text-wrap:balance]">
            Virtual Science Laboratory
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-medium text-slate-700 [text-wrap:balance]">
            Explore science through interactive experiments.
          </p>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
            Users will be able to perform virtual experiments, manipulate variables, collect
            measurements, analyze data, and connect experimental results with scientific theory.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => scrollTo('chemistry')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>Explore Experiments</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollTo('how-it-works')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <span>How It Works</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Single Dominant Focal Anchor: Precision Interactive Workbench Preview */}
        <div className="mt-12 lg:mt-16">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2 px-1">
            <div className="flex items-center gap-2 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
              <span>FIGURE 1.0</span>
              <span aria-hidden="true">·</span>
              <span>CALIBRATED EXPERIMENTAL CONSOLE ARCHITECTURE</span>
            </div>
            <span className="font-mono hidden sm:inline-block">INDEPENDENT VARIABLE SCRUBBING ENABLED</span>
          </div>

          <InteractiveWorkbenchPreview />
        </div>
      </div>
    </section>
  );
};
