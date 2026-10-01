import React from 'react';
import { FlaskConical, LineChart, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

export const Capabilities: React.FC = () => {
  return (
    <section id="capabilities" className="py-20 bg-slate-50/50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-2">
            <span className="text-blue-700 font-semibold uppercase">Platform Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Core Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 [text-wrap:balance]">
            What Labs Provides
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            A comprehensive, rigorous digital workbench engineered to replicate the precision,
            empirical challenges, and analytical depth of modern physical science laboratories.
          </p>
        </div>

        {/* The Three Polished Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1: Run Experiments */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-7 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-5">
                <FlaskConical className="w-5 h-5" />
              </div>

              <div className="text-xs font-mono text-slate-400 mb-1">CAPABILITY 01</div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Run Experiments
              </h3>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
                Interact with virtual laboratory equipment and scientific systems.
              </p>

              {/* Technical Specifications */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Calibrated volumetric glassware, digital burettes & sensors</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Real-time variable modulation: temperature, concentration & flux</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Realistic chemical and physical phenomena response modeling</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>SIMULATION ENGINE</span>
              <span className="text-slate-600 font-semibold">Continuous Dynamic Time</span>
            </div>
          </div>

          {/* Card 2: Collect & Analyze Data */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-7 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-5">
                <LineChart className="w-5 h-5" />
              </div>

              <div className="text-xs font-mono text-slate-400 mb-1">CAPABILITY 02</div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Collect & Analyze Data
              </h3>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
                Record measurements, generate graphs, and perform calculations.
              </p>

              {/* Technical Specifications */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Multi-channel synchronous data logging with timestamping</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Live regression fitting, derivative plots & residual error tracking</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Integrated mathematical computation & measurement uncertainty analysis</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>TELEMETRY MATRIX</span>
              <span className="text-slate-600 font-semibold">Tabular Precision (64-bit)</span>
            </div>
          </div>

          {/* Card 3: Understand the Science */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 lg:p-7 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-5">
                <BookOpen className="w-5 h-5" />
              </div>

              <div className="text-xs font-mono text-slate-400 mb-1">CAPABILITY 03</div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                Understand the Science
              </h3>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed font-normal">
                Connect observations with equations, models, and scientific principles.
              </p>

              {/* Technical Specifications */}
              <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Direct link between empirical readouts and governing equations</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Interactive parameter coupling with theoretical proofs</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>Rigorous exploration of chemical thermodynamics and kinetic theory</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>THEORETICAL RIGOR</span>
              <span className="text-slate-600 font-semibold">First-Principles Modeling</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
