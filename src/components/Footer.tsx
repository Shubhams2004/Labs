import React, { useState } from 'react';
import { ArrowRight, Check, Compass } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Pre-footer Notification & Inquiries Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-slate-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold">
              Curriculum & Release Notifications
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Stay informed on experimental releases
            </h3>
            <p className="mt-2 text-sm text-slate-400 max-w-xl leading-relaxed">
              Get notified when initial Chemistry laboratory modules, interactive protocols, and data
              analysis engines go live for empirical simulation.
            </p>
          </div>

          <div className="lg:col-span-5">
            {subscribed ? (
              <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg flex items-center gap-3 text-xs text-slate-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Thank you. Your address <strong>{email}</strong> has been registered for curriculum releases.
                </span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your academic or personal email"
                  required
                  className="px-4 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 flex-1"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                >
                  <span>Notify Me</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <p className="text-[11px] text-slate-500 mt-2 font-mono">
              Strictly non-commercial notifications. Zero tracking or telemetry.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <span className="text-xl font-bold tracking-tight text-white">
              Labs
            </span>
            <p className="mt-3 text-xs text-slate-400 max-w-sm leading-relaxed">
              A modern, interactive scientific research platform designed for empirical
              experimentation, quantitative data collection, and physical theory connection.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-slate-500">
              <span>Client-Side Architecture</span>
              <span aria-hidden="true">·</span>
              <span>Open Science Standards</span>
            </div>
          </div>

          {/* Laboratory Disciplines */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Laboratories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => scrollTo('chemistry')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Acid–Base Titration
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('chemistry')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Reaction Kinetics
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('chemistry')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Chemical Equilibrium
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('chemistry')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Electrochemistry
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('chemistry')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Thermochemistry
                </button>
              </li>
            </ul>
          </div>

          {/* Navigation & Documentation */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => scrollTo('overview')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('capabilities')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Platform Capabilities
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollTo('roadmap')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Physics Roadmap
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtle Professional Creator Attribution */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Labs. All rights reserved.
          </div>

          {/* Subtle creator attribution as specifically requested */}
          <div className="text-slate-400 font-normal">
            <span>Labs · Created by Shubham Sonale</span>
          </div>

          <div className="font-mono text-[11px] text-slate-500">
            Version 1.0.0-rc
          </div>
        </div>
      </div>
    </footer>
  );
};
