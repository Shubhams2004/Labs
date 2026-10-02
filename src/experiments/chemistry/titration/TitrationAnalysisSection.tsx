/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EquivalenceAnalysisResult, ChemicalStateResult } from './calculations';
import { formatNumber } from '../../../utils/formatters';
import { CheckCircle2, AlertCircle, HelpCircle, Layers, TrendingUp, Award } from 'lucide-react';

interface TitrationAnalysisSectionProps {
  analysis: EquivalenceAnalysisResult;
  chemicalState: ChemicalStateResult;
}

export const TitrationAnalysisSection: React.FC<TitrationAnalysisSectionProps> = ({
  analysis,
  chemicalState,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-700" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Experimental Titration Results & Equivalence Analysis
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
              analysis.hasEnoughData
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {analysis.hasEnoughData
              ? 'Inflection Point Derived'
              : `${analysis.pointsRecorded} / ${analysis.minPointsRequired} Points Recorded`}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* If not enough data recorded yet */}
        {!analysis.hasEnoughData && (
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <div className="font-bold mb-0.5">Additional Experimental Trials Needed</div>
              <p className="leading-relaxed">{analysis.message}</p>
              <p className="mt-1 text-[11px] text-amber-700 font-mono">
                Tip: Record observations before 24 mL, near 24.5–25.5 mL with dropwise additions, and
                past 26 mL to observe the full sigmoid curve.
              </p>
            </div>
          </div>
        )}

        {/* Comparative Analysis Cards Grid: Experimental vs Theoretical */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Equivalence Volume Comparison */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-blue-700 font-semibold mb-1">
                EXPERIMENTAL DERIVATION
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Estimated Equivalence Volume
              </h4>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-mono text-blue-900">
                {analysis.estimatedEquivalenceVolumeMl !== null
                  ? `${formatNumber(analysis.estimatedEquivalenceVolumeMl, 2)} mL`
                  : '—'}
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                Inflection midpoint (max ΔpH/ΔV)
              </div>
            </div>
            <div className="pt-2 border-t border-blue-100 text-[11px] text-slate-600">
              From user-recorded observation trials
            </div>
          </div>

          {/* Card 2: Theoretical Equivalence Volume */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold mb-1">
                THEORETICAL BENCHMARK
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Theoretical Equivalence Point
              </h4>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-mono text-slate-800">
                {formatNumber(analysis.theoreticalEquivalenceVolumeMl, 2)} mL
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                Stoichiometric exact (1:1 molarity)
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
              V_eq = (C_HCl × V_HCl) / C_NaOH
            </div>
          </div>

          {/* Card 3: Derived Unknown HCl Concentration */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-blue-700 font-semibold mb-1">
                EXPERIMENTAL DERIVATION
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Derived [HCl] Concentration
              </h4>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-mono text-blue-900">
                {analysis.estimatedAnalyteConcentrationM !== null
                  ? `${formatNumber(analysis.estimatedAnalyteConcentrationM, 4)} M`
                  : '—'}
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                C_HCl = (C_NaOH × V_eq) / V_flask
              </div>
            </div>
            <div className="pt-2 border-t border-blue-100 text-[11px] text-slate-600">
              Calculated from experimental equivalence
            </div>
          </div>

          {/* Card 4: Percentage Error */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold mb-1">
                ACCURACY & UNCERTAINTY
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Experimental Percentage Error
              </h4>
            </div>
            <div className="my-3">
              <div
                className={`text-2xl font-bold font-mono ${
                  analysis.volumeErrorPercent !== null && analysis.volumeErrorPercent < 2.0
                    ? 'text-emerald-700'
                    : 'text-slate-900'
                }`}
              >
                {analysis.volumeErrorPercent !== null
                  ? `${formatNumber(analysis.volumeErrorPercent, 2)}%`
                  : '—'}
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                True [HCl] benchmark: {formatNumber(analysis.theoreticalAnalyteConcentrationM, 4)} M
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              |V_exp - V_theo| / V_theo × 100%
            </div>
          </div>
        </div>

        {/* Model Assumptions & Scientific Integrity Footer */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase font-mono">
            <Layers className="w-3.5 h-3.5 text-blue-700" />
            <span>Underlying Scientific Assumptions & Boundary Conditions</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-600 list-disc pl-4">
            {chemicalState.assumptions.map((asm, i) => (
              <li key={i}>{asm}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
