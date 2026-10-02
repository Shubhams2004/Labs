/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CalculationMetricDefinition } from '../../models/experiment';
import { formatNumber } from '../../utils/formatters';
import { Calculator, CheckCircle2, HelpCircle } from 'lucide-react';

interface CalculationResultsProps {
  calculations: CalculationMetricDefinition[];
  results: Record<string, number>;
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({
  calculations,
  results,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-blue-700" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Calculations & Derived Results
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Decoupled Scientific Equation Engine
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {calculations.map((calc) => {
          const val = results[calc.id];
          const hasValue = val !== undefined && !isNaN(val);

          return (
            <div
              key={calc.id}
              className="p-4 bg-slate-50/70 rounded-xl border border-slate-200 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mb-1">
                  <span>{calc.symbol || calc.id}</span>
                  <span className="text-slate-400">DERIVED METRIC</span>
                </div>

                <h4 className="text-xs font-bold text-slate-800 leading-snug">
                  {calc.name}
                </h4>

                {/* Mathematical Formula Preview */}
                <div className="mt-2 p-2 bg-white rounded border border-slate-200 text-[11px] font-mono text-slate-700 text-center overflow-x-auto">
                  <code>{calc.formulaDisplay}</code>
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {hasValue ? formatNumber(val, calc.precision) : '—'}
                  {calc.unit && (
                    <span className="text-xs font-normal text-slate-500 ml-1.5 font-mono">
                      {calc.unit}
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                  {calc.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
