/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  EquivalenceAnalysisResult,
  ChemicalStateResult,
  evaluateScientificConclusion,
  calculateUnknownConcentration,
} from './calculations';
import { formatNumber } from '../../../utils/formatters';
import {
  Award,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Layers,
  FileText,
  Calculator,
  Compass,
  Printer,
  BookmarkCheck,
} from 'lucide-react';
import { ObservationRecord } from '../../../models/experiment';

interface TitrationAnalysisSectionProps {
  analysis: EquivalenceAnalysisResult;
  chemicalState: ChemicalStateResult;
  records: ObservationRecord[];
  analyteVolumeMl: number;
  analyteConcentrationM: number;
  titrantConcentrationM: number;
  userSelectedEndpointTrialId: string | null;
  onSelectEndpointTrial: (trialId: string) => void;
}

export const TitrationAnalysisSection: React.FC<TitrationAnalysisSectionProps> = ({
  analysis,
  chemicalState,
  records,
  analyteVolumeMl,
  analyteConcentrationM,
  titrantConcentrationM,
  userSelectedEndpointTrialId,
  onSelectEndpointTrial,
}) => {
  const [showFormulaExplanation, setShowFormulaExplanation] = useState(false);
  const [endpointMode, setEndpointMode] = useState<'inflection' | 'user'>(
    userSelectedEndpointTrialId ? 'user' : 'inflection'
  );

  // If user selected an endpoint trial directly from their observations
  const selectedRecord = records.find((r) => r.id === userSelectedEndpointTrialId);

  // Determine effective experimental endpoint volume
  let effectiveEndpointVolumeMl: number | null = null;
  let isUserMode = false;

  if (endpointMode === 'user' && selectedRecord) {
    effectiveEndpointVolumeMl = selectedRecord.values['volume'] ?? null;
    isUserMode = true;
  } else {
    effectiveEndpointVolumeMl = analysis.estimatedEquivalenceVolumeMl;
  }

  // Calculate derived values based on effective endpoint
  const theoreticalVolumeMl = analysis.theoreticalEquivalenceVolumeMl;
  const theoreticalConcM = analysis.theoreticalAnalyteConcentrationM;

  const derivedConcM =
    effectiveEndpointVolumeMl !== null
      ? calculateUnknownConcentration(
          effectiveEndpointVolumeMl,
          analyteVolumeMl,
          titrantConcentrationM
        )
      : null;

  const absoluteVolErrorMl =
    effectiveEndpointVolumeMl !== null
      ? Math.abs(effectiveEndpointVolumeMl - theoreticalVolumeMl)
      : null;

  const percentageVolError =
    effectiveEndpointVolumeMl !== null && theoreticalVolumeMl > 0
      ? (Math.abs(effectiveEndpointVolumeMl - theoreticalVolumeMl) / theoreticalVolumeMl) * 100
      : null;

  const absoluteConcErrorM =
    derivedConcM !== null ? Math.abs(derivedConcM - theoreticalConcM) : null;

  const percentageConcError =
    derivedConcM !== null && theoreticalConcM > 0
      ? (Math.abs(derivedConcM - theoreticalConcM) / theoreticalConcM) * 100
      : null;

  // Scientific conclusion evaluation based strictly on current data
  const conclusion = evaluateScientificConclusion(
    records.length,
    effectiveEndpointVolumeMl,
    theoreticalVolumeMl,
    derivedConcM,
    theoreticalConcM,
    percentageVolError,
    isUserMode
  );

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden space-y-0">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-700" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Experimental Results, Endpoint & Error Analysis
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-mono px-2.5 py-0.5 rounded-full border ${
              conclusion.verdict === 'successful'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                : conclusion.verdict === 'acceptable'
                ? 'bg-blue-50 text-blue-800 border-blue-200 font-semibold'
                : conclusion.verdict === 'unsuccessful'
                ? 'bg-rose-50 text-rose-800 border-rose-200 font-semibold'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}
          >
            {conclusion.status}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Endpoint Determination Selector Mode */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
              Endpoint Determination Method
            </span>
            <div className="text-xs text-slate-700">
              Select whether to use the mathematical inflection derivative (max ΔpH / ΔV)
              or designate a specific recorded trial as the permanent pale pink endpoint.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setEndpointMode('inflection')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                endpointMode === 'inflection'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              Numerical Inflection Point
            </button>

            <button
              onClick={() => setEndpointMode('user')}
              disabled={records.length === 0}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                endpointMode === 'user'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              Select Endpoint Trial ({records.length})
            </button>
          </div>
        </div>

        {/* User Trial Selector Dropdown if in User Mode */}
        {endpointMode === 'user' && records.length > 0 && (
          <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <span className="font-semibold text-slate-800">
                Designate Observed Visual End-Point Trial:
              </span>
            </div>

            <select
              value={userSelectedEndpointTrialId || ''}
              onChange={(e) => onSelectEndpointTrial(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="">-- Choose Trial from Observations --</option>
              {records.map((r) => (
                <option key={r.id} value={r.id}>
                  Trial #{r.trialNumber}: {formatNumber(r.values['volume'] ?? 0, 2)} mL | pH{' '}
                  {formatNumber(r.values['pH'] ?? 0, 2)}{' '}
                  {r.indicatorLabel ? `(${r.indicatorLabel})` : ''} {r.notes ? `[${r.notes}]` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Data Requirement Alert if insufficient */}
        {records.length < 4 && (
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <div className="font-bold mb-0.5">Additional Experimental Trials Needed</div>
              <p className="leading-relaxed">
                You have recorded {records.length} trial(s). At least 4 observations across the pre-equivalence,
                inflection jump (24–26 mL), and post-equivalence regions are required to accurately substantiate
                the experimental endpoint.
              </p>
            </div>
          </div>
        )}

        {/* 4 Core Quantitative Comparison Metric Cards (Distinctly separating Experimental vs Theoretical) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Experimental Endpoint */}
          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/30 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-blue-700 font-semibold mb-1">
                EXPERIMENTAL MEASUREMENT
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Experimental Endpoint (V_endpoint)
              </h4>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-mono text-blue-900">
                {effectiveEndpointVolumeMl !== null
                  ? `${formatNumber(effectiveEndpointVolumeMl, 2)} mL`
                  : '—'}
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                {isUserMode ? 'User-selected observation trial' : 'Maximum derivative inflection midpoint'}
              </div>
            </div>
            <div className="pt-2 border-t border-blue-100 text-[11px] text-slate-600">
              Derived from recorded measurements
            </div>
          </div>

          {/* Card 2: Theoretical Equivalence Point */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold mb-1">
                THEORETICAL BENCHMARK
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Theoretical Equivalence (V_equiv)
              </h4>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-mono text-slate-800">
                {formatNumber(theoreticalVolumeMl, 2)} mL
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                Stoichiometric exact (100% ionization)
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
              V_eq = (C_HCl × V_HCl) / C_NaOH
            </div>
          </div>

          {/* Card 3: Absolute Error & Difference */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold mb-1">
                EXPERIMENTAL DIFFERENCE
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Absolute Error (ΔV)
              </h4>
            </div>
            <div className="my-3">
              <div className="text-2xl font-bold font-mono text-slate-900">
                {absoluteVolErrorMl !== null
                  ? `${formatNumber(absoluteVolErrorMl, 2)} mL`
                  : '—'}
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                |V_endpoint - V_equiv|
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              Class-A glassware tolerance: ±0.05 mL
            </div>
          </div>

          {/* Card 4: Percentage Error & Concentration */}
          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold mb-1">
                ACCURACY EVALUATION
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Percentage Error (%)
              </h4>
            </div>
            <div className="my-3">
              <div
                className={`text-2xl font-bold font-mono ${
                  percentageVolError !== null && percentageVolError <= 2.0
                    ? 'text-emerald-700'
                    : percentageVolError !== null && percentageVolError <= 5.0
                    ? 'text-blue-700'
                    : 'text-rose-700'
                }`}
              >
                {percentageVolError !== null ? `${formatNumber(percentageVolError, 2)}%` : '—'}
              </div>
              <div className="text-[11px] font-mono text-slate-500 mt-1">
                Derived [HCl]: {derivedConcM !== null ? `${formatNumber(derivedConcM, 4)} M` : '—'}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              True [HCl] = {formatNumber(theoreticalConcM, 4)} M
            </div>
          </div>
        </div>

        {/* Expandable Mathematical Formulas & Error Calculation Explanation */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
          <button
            onClick={() => setShowFormulaExplanation(!showFormulaExplanation)}
            className="w-full text-left flex items-center justify-between text-xs font-bold text-slate-900 uppercase font-mono cursor-pointer"
          >
            <div className="flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-blue-700" />
              <span>Formulas Used for Endpoint & Error Analysis</span>
            </div>
            {showFormulaExplanation ? (
              <ChevronUp className="w-4 h-4 text-slate-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {showFormulaExplanation && (
            <div className="pt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-slate-700 animate-fadeIn">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                  1. Absolute Volumetric Error
                </div>
                <code className="text-slate-900 text-[11px] block font-semibold mb-1">
                  Absolute Error = |V_endpoint,exp - V_equiv,theo|
                </code>
                <p className="text-[11px] font-sans text-slate-500">
                  Measures the absolute volumetric discrepancy between the experimentally observed
                  endpoint and the theoretical stoichiometric point in milliliters.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                  2. Percentage Error
                </div>
                <code className="text-slate-900 text-[11px] block font-semibold mb-1">
                  % Error = (|V_exp - V_theo| / V_theo) × 100%
                </code>
                <p className="text-[11px] font-sans text-slate-500">
                  Normalized relative error reflecting volumetric experimental accuracy.
                  Values under 2.0% indicate analytical grade laboratory precision.
                </p>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">
                  3. Unknown Acid Concentration
                </div>
                <code className="text-slate-900 text-[11px] block font-semibold mb-1">
                  C_HCl = (C_NaOH × V_endpoint) / V_HCl
                </code>
                <p className="text-[11px] font-sans text-slate-500">
                  Calculated from 1:1 neutralization stoichiometry: moles of NaOH delivered equals
                  initial moles of HCl in the 25.00 mL conical flask.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 7: Comprehensive Lab Report Summary & Scientific Conclusion */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-700" />
              <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                Laboratory Report Summary & Scientific Conclusion
              </h4>
            </div>

            <div className="text-xs font-mono text-slate-500">
              Report Generated: {new Date().toLocaleDateString()}
            </div>
          </div>

          {/* Experiment Conditions Grid */}
          <div>
            <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold mb-2">
              Experiment Conditions & Instrument Specifications
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">Analyte Solution</span>
                <strong className="text-slate-800">25.00 ± 0.03 mL HCl</strong>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">Standardized Titrant</span>
                <strong className="text-slate-800">0.1000 M NaOH</strong>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">Thermal Ambient</span>
                <strong className="text-slate-800">25.0°C (298.15 K)</strong>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 block">Visual Indicator</span>
                <strong className="text-slate-800">Phenolphthalein</strong>
              </div>
            </div>
          </div>

          {/* Scientific Conclusion Callout */}
          <div
            className={`p-4 rounded-xl border text-xs space-y-2 ${
              conclusion.verdict === 'successful'
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                : conclusion.verdict === 'acceptable'
                ? 'bg-blue-50/80 border-blue-200 text-blue-950'
                : conclusion.verdict === 'unsuccessful'
                ? 'bg-rose-50/80 border-rose-200 text-rose-950'
                : 'bg-amber-50/80 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {conclusion.isSuccessful ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{conclusion.status}</span>
            </div>

            <p className="leading-relaxed">{conclusion.text}</p>

            {conclusion.notes.length > 0 && (
              <ul className="list-disc pl-4 space-y-1 text-[11px] pt-1 opacity-90">
                {conclusion.notes.map((note, idx) => (
                  <li key={idx}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
