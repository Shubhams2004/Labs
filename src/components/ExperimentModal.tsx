import React, { useState } from 'react';
import { X, Check, Bell, ArrowRight, Beaker } from 'lucide-react';
import { Experiment } from '../data/experiments';

interface ExperimentModalProps {
  experiment: Experiment | null;
  onClose: () => void;
}

export const ExperimentModal: React.FC<ExperimentModalProps> = ({ experiment, onClose }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  if (!experiment) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid scientific or institutional email address.');
      return;
    }
    setError('');
    setIsSubscribed(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="experiment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-200 bg-slate-50/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-1">
              <span>{experiment.category}</span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-700 font-semibold uppercase">{experiment.status}</span>
            </div>
            <h2 id="experiment-modal-title" className="text-xl font-bold text-slate-900 tracking-tight">
              {experiment.title}
            </h2>
            <p className="text-xs text-slate-600 mt-1">{experiment.tagline}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer"
            aria-label="Close protocol dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700">
          {/* Objective */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-semibold">
              Research Objective
            </h3>
            <p className="text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
              {experiment.objective}
            </p>
          </div>

          {/* Governing Equation */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                Mathematical Model & Formulation
              </h3>
              <span className="text-xs font-mono text-slate-500">{experiment.equationLabel}</span>
            </div>
            <div className="p-4 bg-slate-950 text-white rounded-lg font-mono text-center overflow-x-auto text-sm border border-slate-800">
              <code>{experiment.equation}</code>
            </div>
          </div>

          {/* Scientific Principle */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1.5 font-semibold">
              Underlying Theory
            </h3>
            <p className="text-slate-700 leading-relaxed">{experiment.scientificPrinciple}</p>
          </div>

          {/* Variables Matrix */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 font-semibold">
              Experimental Variable Matrix
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] font-mono text-blue-700 block uppercase font-semibold">
                  Independent Variable
                </span>
                <span className="text-xs text-slate-800 mt-1 block">
                  {experiment.variables.independent}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] font-mono text-emerald-700 block uppercase font-semibold">
                  Dependent Variable
                </span>
                <span className="text-xs text-slate-800 mt-1 block">
                  {experiment.variables.dependent}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[11px] font-mono text-slate-600 block uppercase font-semibold">
                  Controlled Parameters
                </span>
                <span className="text-xs text-slate-800 mt-1 block">
                  {experiment.variables.controlled}
                </span>
              </div>
            </div>
          </div>

          {/* Simulated Apparatus */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 font-semibold">
              Virtual Apparatus & Reagents
            </h3>
            <ul className="space-y-1.5">
              {experiment.apparatus.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <Beaker className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Standard Operating Protocol */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 font-semibold">
              Standard Operating Protocol
            </h3>
            <ol className="space-y-2">
              {experiment.protocolSteps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <span className="font-mono text-slate-400 font-semibold shrink-0">
                    {String(idx + 1).padStart(2, '0')}.
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Modal Footer / Notification Signup */}
        <div className="p-5 border-t border-slate-200 bg-slate-50">
          {isSubscribed ? (
            <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>
                Notification registered for <strong>{email}</strong>. You will receive an alert as soon as the{' '}
                <strong>{experiment.title}</strong> module is released.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email to get notified when this experiment opens"
                    className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 placeholder:text-slate-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
                >
                  <span>Notify On Release</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {error && <p className="text-[11px] text-rose-600">{error}</p>}
              <p className="text-[11px] text-slate-500">
                Module scheduled for Initial Chemistry Launch Phase. No spam; only release and protocol notices.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
