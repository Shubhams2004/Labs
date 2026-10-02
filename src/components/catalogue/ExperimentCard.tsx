/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Experiment } from '../../models/experiment';
import { Beaker, Sliders, Clock, ArrowRight, Lock, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ExperimentCardProps {
  experiment: Experiment;
  onOpenWorkspace: (experiment: Experiment) => void;
  onViewDetails: (experiment: Experiment) => void;
}

export const ExperimentCard: React.FC<ExperimentCardProps> = ({
  experiment,
  onOpenWorkspace,
  onViewDetails,
}) => {
  const [showBlockedNotice, setShowBlockedNotice] = useState(false);

  const handleLaunchClick = () => {
    if (experiment.status === 'coming-soon') {
      // Prevent accidental launch of coming-soon experiments
      setShowBlockedNotice(true);
      setTimeout(() => setShowBlockedNotice(false), 4000);
      return;
    }
    onOpenWorkspace(experiment);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition-all relative">
      <div>
        {/* Top Metadata */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
          <div className="flex items-center gap-1.5 font-mono">
            <span className="font-semibold text-blue-700">{experiment.category}</span>
            <span aria-hidden="true">·</span>
            <span>{experiment.difficulty}</span>
          </div>

          {experiment.status === 'available' ? (
            <span className="text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Available</span>
            </span>
          ) : (
            <span className="text-[11px] font-mono font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Coming Soon
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 tracking-tight">
          {experiment.title}
        </h3>

        <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
          {experiment.description}
        </p>

        {/* Key Metrics / Variables Summary */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>{experiment.variables.length} Variables</span>
          </div>
          <span aria-hidden="true">·</span>
          <div className="flex items-center gap-1">
            <Beaker className="w-3.5 h-3.5 text-slate-400" />
            <span>{experiment.requiredEquipment.length} Equipment</span>
          </div>
          {experiment.estimatedDurationMinutes && (
            <>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>~{experiment.estimatedDurationMinutes} min</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Controls & Coming-Soon Guards */}
      <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
        {showBlockedNotice && (
          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-xs flex items-start gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <strong>Coming Soon:</strong> This simulation module is currently in curriculum
              development and cannot be launched yet. Use "View Protocol" to inspect its specifications
              or "Preview Workspace" for the architecture preview.
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* View Details/Protocol button */}
          <button
            onClick={() => onViewDetails(experiment)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 transition-colors cursor-pointer py-1.5 px-2.5 rounded hover:bg-slate-50"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Protocol</span>
          </button>

          <div className="flex items-center gap-2">
            {experiment.status === 'available' ? (
              <button
                onClick={() => onOpenWorkspace(experiment)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <span>Launch Experiment</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleLaunchClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed border border-slate-200"
                title="Coming Soon · Module cannot be launched yet"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Launch</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
