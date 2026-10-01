import React from 'react';
import { Search, Play, LineChart, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Choose an experiment',
      tag: 'Selection & Protocol',
      icon: Search,
      description:
        'Select from structured laboratory modules in Chemistry. Review pre-lab briefs, study theoretical models, and inspect apparatus specifications.',
      detail: 'Complete background equations and variable definitions provided upfront.',
    },
    {
      number: '02',
      title: 'Perform the experiment',
      tag: 'Empirical Execution',
      icon: Play,
      description:
        'Interact with virtual laboratory apparatus. Manipulate independent variables such as volumes, concentrations, and temperatures with continuous sensor feedback.',
      detail: 'Fine-grained parameter manipulation with realistic dynamic response times.',
    },
    {
      number: '03',
      title: 'Analyze the results',
      tag: 'Data & Mathematical Rigor',
      icon: LineChart,
      description:
        'Record experimental trials, generate automated response curves and derivative plots, derive physical constants, and evaluate experimental uncertainty.',
      detail: 'Direct verification of empirical observations against theoretical predictions.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-slate-50/50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
            <span className="text-blue-700 font-semibold uppercase">Scientific Workflow</span>
            <span aria-hidden="true">·</span>
            <span>Three-Stage Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 [text-wrap:balance]">
            How It Works
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            A continuous three-step empirical cycle that mirrors the workflow of professional academic
            research and laboratory investigations.
          </p>
        </div>

        {/* The Simple Three-Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-white rounded-xl border border-slate-200 p-6 lg:p-7 shadow-xs flex flex-col justify-between"
              >
                {/* Step Connector Indicator for Desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 items-center justify-center text-slate-500 shadow-xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-2xl font-mono font-bold text-slate-200">
                      {step.number}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-blue-700 mb-1 font-semibold uppercase">
                    {step.tag}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-mono">
                  {step.detail}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
