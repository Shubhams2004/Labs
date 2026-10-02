/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ParameterDefinition } from '../../models/experiment';
import { Sliders, PlusCircle, RotateCcw, HelpCircle } from 'lucide-react';

interface ParameterControlPanelProps {
  variables: ParameterDefinition[];
  values: Record<string, number>;
  onChange: (paramId: string, value: number) => void;
  onResetDefaults: () => void;
  onRecordMeasurement: () => void;
}

export const ParameterControlPanel: React.FC<ParameterControlPanelProps> = ({
  variables,
  values,
  onChange,
  onResetDefaults,
  onRecordMeasurement,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-700" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Controls & Parameters
          </span>
        </div>
        <button
          onClick={onResetDefaults}
          className="text-xs text-slate-500 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          title="Reset all parameters to default"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Defaults</span>
        </button>
      </div>

      {/* Variables List */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5">
        {variables.map((variable) => {
          const currentValue =
            values[variable.id] !== undefined ? values[variable.id] : variable.defaultValue;

          return (
            <div key={variable.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label
                  htmlFor={`param-${variable.id}`}
                  className="font-semibold text-slate-800 flex items-center gap-1.5"
                >
                  <span>{variable.name}</span>
                  {variable.symbol && (
                    <span className="font-mono text-slate-400 font-normal">
                      ({variable.symbol})
                    </span>
                  )}
                </label>

                {/* Numeric readout and quick input */}
                <div className="flex items-center gap-1 font-mono">
                  <input
                    id={`param-${variable.id}`}
                    type="number"
                    min={variable.min}
                    max={variable.max}
                    step={variable.step}
                    value={currentValue}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val)) onChange(variable.id, val);
                    }}
                    className="w-20 px-2 py-0.5 text-right text-xs bg-slate-50 border border-slate-300 rounded font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                  <span className="text-xs text-slate-500 min-w-8 text-left">{variable.unit}</span>
                </div>
              </div>

              {/* Slider Control */}
              <input
                type="range"
                min={variable.min}
                max={variable.max}
                step={variable.step}
                value={currentValue}
                onChange={(e) => onChange(variable.id, parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />

              {/* Min - Max Bounds & Description */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>
                  Min: {variable.min} {variable.unit}
                </span>
                <span className="truncate max-w-[180px] text-right text-slate-500" title={variable.description}>
                  {variable.description}
                </span>
                <span>
                  Max: {variable.max} {variable.unit}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action: Record Measurement to Observation Table */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <button
          onClick={onRecordMeasurement}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Record Measurement to Observation Table</span>
        </button>
        <p className="text-[11px] text-slate-500 text-center mt-1.5 font-mono">
          Captures current laboratory variables and sensor outputs as a new trial
        </p>
      </div>
    </div>
  );
};
