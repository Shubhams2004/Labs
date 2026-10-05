/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  FlaskConical,
  Droplet,
  Eye,
  FileSpreadsheet,
  LineChart,
  Award,
  CheckCircle2,
} from 'lucide-react';

interface TitrationWorkflowStepperProps {
  currentStep: number;
  totalRecords: number;
  hasEndpoint: boolean;
  onStepClick?: (step: number) => void;
}

export const TitrationWorkflowStepper: React.FC<TitrationWorkflowStepperProps> = ({
  currentStep,
  totalRecords,
  hasEndpoint,
  onStepClick,
}) => {
  const steps = [
    {
      num: 1,
      title: 'Prepare',
      desc: '25.00 mL HCl + Phenolphthalein',
      icon: FlaskConical,
      done: true,
    },
    {
      num: 2,
      title: 'Add Titrant',
      desc: '0.1000 M NaOH via burette',
      icon: Droplet,
      done: currentStep >= 2,
    },
    {
      num: 3,
      title: 'Observe',
      desc: 'Read meniscus & indicator',
      icon: Eye,
      done: currentStep >= 3,
    },
    {
      num: 4,
      title: 'Record',
      desc: `${totalRecords} trial(s) logged`,
      icon: FileSpreadsheet,
      done: totalRecords >= 1,
    },
    {
      num: 5,
      title: 'Analyze',
      desc: 'Sigmoid curve inflection',
      icon: LineChart,
      done: totalRecords >= 4,
    },
    {
      num: 6,
      title: 'Conclude',
      desc: hasEndpoint ? 'Endpoint derived' : 'Generate lab report',
      icon: Award,
      done: hasEndpoint,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[620px] gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isActive = currentStep === step.num;
          const isDone = step.done;

          return (
            <React.Fragment key={step.num}>
              <div
                onClick={() => onStepClick && onStepClick(step.num)}
                className={`flex items-center gap-2 py-1 px-2.5 rounded-lg text-xs transition-all ${
                  onStepClick ? 'cursor-pointer' : ''
                } ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 border border-blue-200 font-semibold'
                    : isDone
                    ? 'text-slate-800'
                    : 'text-slate-400 opacity-70'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[11px] font-mono font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isDone && !isActive ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    step.num
                  )}
                </div>

                <div className="leading-tight">
                  <div className="font-bold text-[11px]">{step.title}</div>
                  <div className="text-[10px] text-slate-500 font-sans hidden md:block">
                    {step.desc}
                  </div>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div className="w-6 h-px bg-slate-200 shrink-0 mx-1" aria-hidden="true" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
