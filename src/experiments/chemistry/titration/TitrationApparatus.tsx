/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ChemicalStateResult } from './calculations';
import {
  Droplet,
  RotateCcw,
  PlusCircle,
  HelpCircle,
  Info,
  CheckCircle2,
  Gauge,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { formatNumber } from '../../../utils/formatters';

interface TitrationApparatusProps {
  chemicalState: ChemicalStateResult;
  analyteVolumeMl: number;
  titrantVolumeMl: number;
  titrantConcentrationM: number;
  analyteConcentrationM: number;
  onAddTitrant: (deltaMl: number) => void;
  onSetTitrantVolume: (volumeMl: number) => void;
  onResetTitration: () => void;
  onRecordObservation: () => void;
}

export const TitrationApparatus: React.FC<TitrationApparatusProps> = ({
  chemicalState,
  analyteVolumeMl,
  titrantVolumeMl,
  titrantConcentrationM,
  analyteConcentrationM,
  onAddTitrant,
  onSetTitrantVolume,
  onResetTitration,
  onRecordObservation,
}) => {
  const [isDripping, setIsDripping] = useState(false);
  const [recentDelta, setRecentDelta] = useState<number | null>(null);

  const handleAdd = (amount: number) => {
    setRecentDelta(amount);
    setIsDripping(true);
    onAddTitrant(amount);
    setTimeout(() => {
      setIsDripping(false);
    }, 600);
  };

  // Burette volume calculations: 50 mL total capacity
  const buretteCapacity = 50.0;
  const buretteReading = Math.min(50.0, Math.max(0.0, titrantVolumeMl));
  const remainingInBurette = Math.max(0.0, buretteCapacity - buretteReading);
  const buretteLiquidHeightPercent = (remainingInBurette / buretteCapacity) * 100;

  // Flask volume calculation: base 25 mL up to 75 mL max
  const flaskVolume = analyteVolumeMl + titrantVolumeMl;
  // Scaled height inside flask SVG: 25 mL => 35px height, 75 mL => 75px height
  const flaskLiquidHeight = Math.min(85, 30 + ((flaskVolume - 25) / 50) * 50);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              chemicalState.stage === 'at-equivalence'
                ? 'bg-amber-500 animate-ping'
                : chemicalState.stage === 'after-equivalence'
                ? 'bg-pink-600'
                : 'bg-blue-600'
            }`}
          />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-800">
            Interactive Titration Bench
          </span>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            · HCl (aq) + NaOH (aq)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetTitration}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
            title="Refill burette to 0.00 mL and reset flask"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Refill Burette</span>
          </button>
        </div>
      </div>

      {/* Main Split: Left = Visual Graphic Apparatus | Right = Telemetry & Addition Controls */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch flex-1 bg-gradient-to-b from-slate-50/50 via-white to-slate-50/30">
        {/* Visual Laboratory Glassware Column */}
        <div className="md:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-950 rounded-xl border border-slate-800 shadow-inner relative overflow-hidden min-h-[380px]">
          {/* Scientific Lab Grid Lines */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, #38BDF8 1px, transparent 1px), linear-gradient(to bottom, #38BDF8 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* SVG Apparatus Representation */}
          <svg
            className="w-full max-w-[280px] h-[340px] relative z-10"
            viewBox="0 0 280 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stand Base and Vertical Rod */}
            <rect x="20" y="325" width="240" height="10" rx="3" fill="#334155" stroke="#475569" strokeWidth="1" />
            <rect x="55" y="15" width="10" height="310" rx="2" fill="#475569" stroke="#64748B" strokeWidth="1" />

            {/* Upper and Lower Burette Metal Clamps */}
            <rect x="55" y="55" width="60" height="7" fill="#64748B" rx="1.5" />
            <rect x="110" y="52" width="12" height="13" fill="#94A3B8" rx="2" />
            <rect x="55" y="165" width="60" height="7" fill="#64748B" rx="1.5" />
            <rect x="110" y="162" width="12" height="13" fill="#94A3B8" rx="2" />

            {/* GLASS BURETTE TUBE (50 mL capacity) */}
            <g id="burette">
              {/* Outer glass cylinder */}
              <rect
                x="112"
                y="20"
                width="18"
                height="165"
                rx="2"
                fill="rgba(255, 255, 255, 0.08)"
                stroke="#94A3B8"
                strokeWidth="1.5"
              />

              {/* Titrant Liquid Column (NaOH solution) */}
              <rect
                x="114"
                y={22 + (160 * (1 - buretteLiquidHeightPercent / 100))}
                width="14"
                height={(160 * buretteLiquidHeightPercent) / 100}
                fill="rgba(186, 230, 253, 0.45)"
              />

              {/* Meniscus Line */}
              {remainingInBurette > 0 && (
                <ellipse
                  cx="121"
                  cy={22 + (160 * (1 - buretteLiquidHeightPercent / 100))}
                  rx="7"
                  ry="2"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="1.5"
                />
              )}

              {/* Burette Graduations and Labels */}
              {[0, 10, 20, 30, 40, 50].map((mark, i) => {
                const yPos = 25 + i * 29;
                return (
                  <g key={mark}>
                    <line x1="126" y1={yPos} x2="130" y2={yPos} stroke="#E2E8F0" strokeWidth="1" />
                    <text
                      x="134"
                      y={yPos + 3}
                      fill="#94A3B8"
                      fontSize="7"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {mark}
                    </text>
                  </g>
                );
              })}

              {/* Stopcock valve assembly */}
              <rect x="117" y="185" width="8" height="14" fill="#64748B" stroke="#94A3B8" strokeWidth="1" />
              {/* Stopcock handle (turns when adding titrant) */}
              <rect
                x="112"
                y="190"
                width="18"
                height="4"
                rx="1"
                fill={isDripping ? '#38BDF8' : '#CBD5E1'}
                transform={isDripping ? 'rotate(45 121 192)' : 'rotate(0 121 192)'}
                className="transition-transform duration-200"
              />

              {/* Burette Tip nozzle */}
              <polygon points="118,199 124,199 122,212 120,212" fill="#94A3B8" />
            </g>

            {/* ANIMATED LIQUID DROPLET (when adding titrant) */}
            {isDripping && (
              <g className="animate-bounce">
                <circle cx="121" cy="222" r="3" fill="#38BDF8" />
                <path d="M121 217 L123 222 L119 222 Z" fill="#38BDF8" />
              </g>
            )}

            {/* CONICAL ERLENMEYER FLASK (250 mL Pyrex) */}
            <g id="flask">
              {/* Flask Neck */}
              <path
                d="M 106 230 L 106 245 L 75 315 A 8 8 0 0 0 82 325 L 160 325 A 8 8 0 0 0 167 315 L 136 245 L 136 230 Z"
                fill="rgba(255, 255, 255, 0.05)"
                stroke="#E2E8F0"
                strokeWidth="1.5"
              />

              {/* Flask Lip Rim */}
              <ellipse cx="121" cy="230" rx="15" ry="3" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />

              {/* Flask Solution Liquid Level & Dynamic Color */}
              <clipPath id="flask-clip">
                <path d="M 106 245 L 75 315 A 8 8 0 0 0 82 325 L 160 325 A 8 8 0 0 0 167 315 L 136 245 Z" />
              </clipPath>

              {/* Base background water volume */}
              <rect
                x="70"
                y={325 - flaskLiquidHeight}
                width="105"
                height={flaskLiquidHeight}
                fill="rgba(224, 242, 254, 0.3)"
                clipPath="url(#flask-clip)"
              />

              {/* Phenolphthalein Color Tint - Dynamically driven strictly by chemicalState.indicatorColor */}
              <rect
                x="70"
                y={325 - flaskLiquidHeight}
                width="105"
                height={flaskLiquidHeight}
                fill={chemicalState.indicatorColor}
                clipPath="url(#flask-clip)"
                className="transition-colors duration-300"
              />

              {/* Liquid surface wave / meniscus */}
              <ellipse
                cx="121"
                cy={325 - flaskLiquidHeight}
                rx={15 + flaskLiquidHeight * 0.45}
                ry="3"
                fill={
                  chemicalState.pH >= 8.2
                    ? 'rgba(244, 114, 182, 0.7)'
                    : 'rgba(186, 230, 253, 0.6)'
                }
                clipPath="url(#flask-clip)"
              />

              {/* Magnetic stir bar in flask bottom */}
              <rect x="113" y="318" width="16" height="4" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
            </g>

            {/* COMBINATION pH SENSOR ELECTRODE */}
            <g id="ph-electrode">
              {/* Cable from meter */}
              <path d="M 215 155 Q 165 170 148 230" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="3 2" />
              {/* Glass electrode body dipping into flask */}
              <rect x="145" y="232" width="6" height="75" rx="2" fill="#E2E8F0" stroke="#334155" strokeWidth="1" />
              {/* Glass sensing bulb */}
              <circle cx="148" cy="308" r="4.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
            </g>

            {/* DIGITAL pH METER CONSOLE (Upper Right) */}
            <g id="ph-meter">
              <rect x="180" y="45" width="85" height="52" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
              <rect x="186" y="52" width="73" height="26" rx="2" fill="#020617" />
              <text x="189" y="62" fill="#38BDF8" fontSize="7" fontFamily="monospace">
                pH METER 25°C
              </text>
              <text x="254" y="75" fill="#38BDF8" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="end">
                {formatNumber(chemicalState.pH, 2)}
              </text>
              <circle cx="190" cy="88" r="3" fill="#10B981" />
              <text x="198" y="90" fill="#94A3B8" fontSize="6" fontFamily="monospace">
                CALIBRATED
              </text>
            </g>
          </svg>

          {/* Current Reading HUD Pill beneath apparatus */}
          <div className="mt-3 flex items-center justify-between w-full px-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
            <div>
              Burette: <strong className="text-white">{formatNumber(buretteReading, 2)} mL</strong>
            </div>
            <div>
              Flask: <strong className="text-white">{formatNumber(flaskVolume, 2)} mL</strong>
            </div>
            <div>
              pH: <strong className="text-blue-400">{formatNumber(chemicalState.pH, 2)}</strong>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry Readouts, Incremental Addition Controls & Observation Trigger */}
        <div className="md:col-span-6 flex flex-col justify-between space-y-4">
          {/* Key Instrument Telemetry Matrix */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                Current Burette Reading
              </span>
              <div className="text-xl font-bold font-mono text-slate-900">
                {formatNumber(buretteReading, 2)}{' '}
                <span className="text-xs font-normal text-slate-500 font-sans">mL</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                Remaining: {formatNumber(remainingInBurette, 2)} mL
              </span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase block mb-0.5">
                Digital pH Readout
              </span>
              <div className="text-xl font-bold font-mono text-blue-700">
                {formatNumber(chemicalState.pH, 2)}{' '}
                <span className="text-xs font-normal text-slate-500 font-sans">pH</span>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                pOH: {formatNumber(chemicalState.pOH, 2)}
              </span>
            </div>
          </div>

          {/* Indicator Visual Status Display */}
          <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span>Phenolphthalein Indicator State</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">Range: pH 8.2–10.0</span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className="w-7 h-7 rounded-full border border-slate-300 shadow-xs shrink-0 transition-colors"
                style={{
                  backgroundColor:
                    chemicalState.pH >= 8.2 ? chemicalState.indicatorColor : '#FFFFFF',
                }}
              />
              <div className="text-xs">
                <div className="font-bold text-slate-900">{chemicalState.indicatorLabel}</div>
                <div className="text-[11px] text-slate-500">
                  {chemicalState.pH < 8.2
                    ? 'Colorless acidic form (H₂In). Solution has not reached basic transition.'
                    : chemicalState.pH <= 9.0
                    ? 'Faint pale pink observed. Stoichiometric end-point achieved!'
                    : 'Intense magenta dianion (In²⁻). Alkaline excess beyond equivalence.'}
                </div>
              </div>
            </div>
          </div>

          {/* Incremental Titrant Addition Buttons */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wide text-slate-800 flex items-center gap-1.5">
                <Droplet className="w-3.5 h-3.5 text-blue-600" />
                <span>Dispense Titrant (0.1000 M NaOH)</span>
              </span>
              <span className="font-mono text-slate-400 text-[11px]">Stopcock Control</span>
            </div>

            {/* Fine Additions */}
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                Fine & Dropwise Additions (Near Equivalence)
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => handleAdd(0.05)}
                  disabled={remainingInBurette < 0.05}
                  className="py-2 px-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 disabled:opacity-40 text-blue-800 border border-blue-200 rounded-lg transition-colors cursor-pointer text-center"
                >
                  +0.05 mL
                  <span className="block text-[9px] font-normal text-blue-600">1 Drop</span>
                </button>
                <button
                  onClick={() => handleAdd(0.1)}
                  disabled={remainingInBurette < 0.1}
                  className="py-2 px-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 disabled:opacity-40 text-blue-800 border border-blue-200 rounded-lg transition-colors cursor-pointer text-center"
                >
                  +0.10 mL
                </button>
                <button
                  onClick={() => handleAdd(0.2)}
                  disabled={remainingInBurette < 0.2}
                  className="py-2 px-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 disabled:opacity-40 text-blue-800 border border-blue-200 rounded-lg transition-colors cursor-pointer text-center"
                >
                  +0.20 mL
                </button>
                <button
                  onClick={() => handleAdd(0.5)}
                  disabled={remainingInBurette < 0.5}
                  className="py-2 px-1 text-xs font-semibold bg-blue-50 hover:bg-blue-100 disabled:opacity-40 text-blue-800 border border-blue-200 rounded-lg transition-colors cursor-pointer text-center"
                >
                  +0.50 mL
                </button>
              </div>
            </div>

            {/* Rapid Additions */}
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400 mb-1.5 font-semibold">
                Larger Volumetric Increments (Fast Titration)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleAdd(1.0)}
                  disabled={remainingInBurette < 1.0}
                  className="py-2 px-3 text-xs font-semibold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 border border-slate-300 rounded-lg transition-colors cursor-pointer text-center"
                >
                  +1.00 mL
                </button>
                <button
                  onClick={() => handleAdd(5.0)}
                  disabled={remainingInBurette < 5.0}
                  className="py-2 px-3 text-xs font-semibold bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-800 border border-slate-300 rounded-lg transition-colors cursor-pointer text-center"
                >
                  +5.00 mL
                </button>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Record Observation to Table */}
          <button
            onClick={onRecordObservation}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-blue-400" />
            <span>Record Measurement to Observation Table</span>
          </button>
        </div>
      </div>

      {/* Educational Layer: "What's happening?" Panel */}
      <div className="px-4 py-3 bg-slate-100/80 border-t border-slate-200">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700">
            <span className="font-bold text-slate-900 uppercase font-mono mr-1.5">
              What's happening? ({chemicalState.stage.replace('-', ' ')})
            </span>
            {chemicalState.stage === 'before-equivalence' && (
              <span>
                Excess hydronium ions (H₃O⁺) dominate the conical flask. The added NaOH reacts
                completely with HCl to form neutral NaCl and water. Because pH is a logarithmic
                scale, the pH rises slowly initially. Phenolphthalein remains colorless.
              </span>
            )}
            {chemicalState.stage === 'near-equivalence' && (
              <span>
                Almost all hydrochloric acid has been neutralized. The remaining unreacted H⁺ is at
                micromolar levels. Each tiny addition of NaOH now triggers a steep exponential surge
                in pH. Watch for momentary flashes of pale pink where the droplets impact.
              </span>
            )}
            {chemicalState.stage === 'at-equivalence' && (
              <span>
                Stoichiometric equivalence reached! Moles of NaOH added exactly equal initial moles
                of HCl (n_base = n_acid). The solution contains only neutral Na⁺ and Cl⁻ spectator
                ions and pure water with a theoretical neutral pH of 7.00. The very next fraction of
                a drop turns the solution permanently pale pink!
              </span>
            )}
            {chemicalState.stage === 'after-equivalence' && (
              <span>
                All hydrochloric acid has been exhausted; excess strong base (OH⁻) is accumulating in
                the flask. The solution is strongly alkaline (pH &gt; 10). Phenolphthalein is
                completely deprotonated into its dianion form (In²⁻), producing persistent vivid
                magenta coloration.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
