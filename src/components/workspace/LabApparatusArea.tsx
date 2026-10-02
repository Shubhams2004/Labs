/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Experiment } from '../../models/experiment';
import { Beaker, Eye, Gauge, Compass, Layers } from 'lucide-react';

interface LabApparatusAreaProps {
  experiment: Experiment;
  parameterValues: Record<string, number>;
}

export const LabApparatusArea: React.FC<LabApparatusAreaProps> = ({
  experiment,
  parameterValues,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Top Bar: Laboratory Apparatus Status */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Interactive Laboratory Workspace
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-500">
          Calibration: 298.15 K · 1.00 bar
        </span>
      </div>

      {/* Main Interactive Stage */}
      <div className="p-6 flex-1 flex flex-col justify-between min-h-[340px] bg-gradient-to-b from-slate-50/40 to-white">
        {/* Visual Apparatus Canvas Container */}
        <div className="relative w-full flex-1 rounded-lg border border-dashed border-slate-300 bg-white p-6 flex flex-col items-center justify-center text-center overflow-hidden">
          {/* Subtle Grid Pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                'linear-gradient(to right, #cbd5e1 1px, transparent 1px), linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shadow-xs">
              <Beaker className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Virtual Laboratory Simulation Bench
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              Standardized laboratory apparatus container for{' '}
              <strong className="text-slate-800">{experiment.title}</strong>. Parameter adjustments
              in the adjacent controls panel dynamically stream inputs to the analytical calculation
              engine.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-1.5 text-[11px] font-mono text-slate-500">
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {experiment.requiredEquipment.length} Equipment Units Assigned
              </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {experiment.variables.length} Active Variables
              </span>
            </div>
          </div>
        </div>

        {/* Equipment Inventory Ribbon */}
        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="text-[11px] font-mono uppercase text-slate-500 font-semibold mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-700" />
            <span>Assigned Laboratory Equipment & Sensors</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            {experiment.requiredEquipment.slice(0, 4).map((equip, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200/80 truncate text-slate-700"
                title={equip}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                <span className="truncate">{equip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
