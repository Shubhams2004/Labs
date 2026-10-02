/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Experiment } from '../../models/experiment';
import { X, BookOpen, AlertTriangle, Layers, Award } from 'lucide-react';

interface InstructionsDrawerProps {
  experiment: Experiment;
  mode: 'instructions' | 'theory';
  onClose: () => void;
}

export const InstructionsDrawer: React.FC<InstructionsDrawerProps> = ({
  experiment,
  mode,
  onClose,
}) => {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-700" />
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {mode === 'instructions'
                ? `Standard Operating Instructions: ${experiment.title}`
                : `Scientific Theory & Reference: ${experiment.title}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {mode === 'instructions' ? (
            <>
              {/* Learning Objectives */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-500 font-semibold mb-2 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-blue-700" />
                  <span>Learning Objectives</span>
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-xs text-slate-600">
                  {experiment.learningObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ul>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-500 font-semibold mb-3">
                  Step-by-Step Protocol
                </h4>
                <ol className="space-y-4">
                  {experiment.instructions.map((step) => (
                    <li key={step.step} className="p-3.5 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-xs mb-1">
                        <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[11px] flex items-center justify-center font-mono shrink-0">
                          {step.step}
                        </span>
                        <span>{step.title}</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-7 leading-relaxed">{step.content}</p>
                      {step.caution && (
                        <div className="mt-2.5 ml-7 p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-600" />
                          <span>{step.caution}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Required Equipment */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-500 font-semibold mb-2 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-700" />
                  <span>Required Laboratory Equipment</span>
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {experiment.requiredEquipment.map((eq, i) => (
                    <li key={i} className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-700">
                      • {eq}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <>
              {/* Theory Summary */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-500 font-semibold mb-2">
                  Theoretical Background
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
                  {experiment.theory.summary}
                </p>
              </div>

              {/* Governing Laws */}
              <div>
                <h4 className="text-xs font-mono uppercase text-slate-500 font-semibold mb-3">
                  Governing Physical & Chemical Laws
                </h4>
                <div className="space-y-3">
                  {experiment.theory.governingLaws.map((law, i) => (
                    <div key={i} className="p-3.5 bg-white border border-slate-200 rounded-lg">
                      <div className="text-xs font-bold text-slate-900 mb-1">{law.name}</div>
                      <div className="p-2 bg-slate-950 text-white rounded font-mono text-center text-xs my-2 overflow-x-auto">
                        <code>{law.formula}</code>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{law.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic References */}
              {experiment.theory.references && experiment.theory.references.length > 0 && (
                <div>
                  <h4 className="text-xs font-mono uppercase text-slate-500 font-semibold mb-2">
                    Academic Citations & Literature
                  </h4>
                  <ul className="space-y-1 list-disc pl-4 text-xs text-slate-500 font-mono">
                    {experiment.theory.references.map((ref, i) => (
                      <li key={i}>{ref}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
