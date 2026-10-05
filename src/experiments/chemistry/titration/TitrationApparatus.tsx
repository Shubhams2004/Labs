/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChemicalStateResult } from './calculations';
import {
  Droplet,
  RotateCcw,
  PlusCircle,
  Info,
  ZoomIn,
  Sliders,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { formatNumber } from '../../../utils/formatters';

interface TitrationApparatusProps {
  chemicalState: ChemicalStateResult;
  analyteVolumeMl: number;
  titrantVolumeMl: number;
  titrantConcentrationM: number;
  analyteConcentrationM: number;
  initialBuretteReading?: number;
  finalBuretteReading?: number | null;
  onAddTitrant: (deltaMl: number) => void;
  onSetTitrantVolume: (volumeMl: number) => void;
  onResetTitration: () => void;
  onRecordObservation: (observationData: {
    buretteReading: number;
    volumeDelivered: number;
    pH: number;
    indicatorState: string;
    note?: string;
    isEndpoint?: boolean;
  }) => void;
  onMarkEndpoint?: (reading: number) => void;
  totalRecordsCount: number;
}

export const TitrationApparatus: React.FC<TitrationApparatusProps> = ({
  chemicalState,
  analyteVolumeMl,
  titrantVolumeMl,
  titrantConcentrationM,
  analyteConcentrationM,
  initialBuretteReading = 0.0,
  finalBuretteReading = null,
  onAddTitrant,
  onSetTitrantVolume,
  onResetTitration,
  onRecordObservation,
  onMarkEndpoint,
  totalRecordsCount,
}) => {
  const [isDripping, setIsDripping] = useState(false);
  const [showLoupe, setShowLoupe] = useState(true);
  const [showUncertaintyDetails, setShowUncertaintyDetails] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string>('');
  const [isMarkingEndpoint, setIsMarkingEndpoint] = useState(false);

  // Burette capacity: 50.00 mL
  const buretteCapacity = 50.0;
  // Volume delivered is cumulative NaOH added
  const volumeDelivered = Math.min(50.0, Math.max(0.0, titrantVolumeMl));
  // In a real burette, 0.00 mL is at the top. The reading increases as the liquid level drops.
  const currentBuretteReading = Math.min(
    buretteCapacity,
    initialBuretteReading + volumeDelivered
  );
  const remainingInBurette = Math.max(0.0, buretteCapacity - currentBuretteReading);

  // Meniscus position: 0 mL is at top (y=25), 50 mL is at bottom (y=180)
  // Distance span = 155px
  const meniscusSvgY = 25 + (currentBuretteReading / buretteCapacity) * 155;
  const liquidBottomY = 182;
  const liquidHeight = Math.max(0, liquidBottomY - meniscusSvgY);

  // Conical flask total volume (initial HCl + delivered NaOH)
  const flaskVolume = analyteVolumeMl + volumeDelivered;
  // Scaled liquid height inside flask SVG: 25 mL => 32px, 75 mL => 75px
  const flaskLiquidHeight = Math.min(82, 32 + ((flaskVolume - 25) / 50) * 48);

  // Realistic experimental measurements incorporating instrument resolution
  // Burette reading resolution: 0.01-0.02 mL (Class-A 0.1 mL graduations estimated)
  const experimentalBuretteReading = parseFloat(currentBuretteReading.toFixed(2));
  const experimentalDeliveredVolume = parseFloat(volumeDelivered.toFixed(2));
  // pH meter resolution: 0.01 pH unit
  const experimentalMeasuredPH = parseFloat(chemicalState.pH.toFixed(2));

  const handleAdd = (amount: number) => {
    setIsDripping(true);
    onAddTitrant(amount);
    setTimeout(() => {
      setIsDripping(false);
    }, 550);
  };

  const handleRecord = () => {
    const isEndpoint =
      isMarkingEndpoint ||
      selectedNote.toLowerCase().includes('end') ||
      (chemicalState.pH >= 8.2 && chemicalState.pH <= 9.2);

    onRecordObservation({
      buretteReading: experimentalBuretteReading,
      volumeDelivered: experimentalDeliveredVolume,
      pH: experimentalMeasuredPH,
      indicatorState: chemicalState.indicatorLabel,
      note: selectedNote || (isEndpoint ? 'Permanent pale pink endpoint' : undefined),
      isEndpoint,
    });

    if (isEndpoint && onMarkEndpoint) {
      onMarkEndpoint(experimentalBuretteReading);
    }

    setIsMarkingEndpoint(false);
    setSelectedNote('');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full">
      {/* Top Laboratory Bench Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200">
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
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Precision Analytical Titration Bench
          </span>
          <span className="text-xs font-mono text-slate-500 hidden sm:inline">
            · 50.00 mL Class-A Glass Burette
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLoupe(!showLoupe)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
              showLoupe
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-300'
            }`}
          >
            <ZoomIn className="w-3 h-3" />
            <span>{showLoupe ? 'Hide Loupe' : 'Meniscus Loupe'}</span>
          </button>

          <button
            onClick={onResetTitration}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-md transition-colors cursor-pointer"
            title="Refill burette to 0.00 mL"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Refill Burette</span>
          </button>
        </div>
      </div>

      {/* Main Laboratory Bench Stage */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1 bg-gradient-to-b from-slate-50/40 via-white to-slate-50/20">
        {/* Left Column: Glassware SVG Apparatus & Meniscus Loupe */}
        <div className="lg:col-span-6 flex flex-col items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800 shadow-inner relative overflow-hidden min-h-[420px]">
          {/* Subtle Precision Laboratory Grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'linear-gradient(to right, #38BDF8 1px, transparent 1px), linear-gradient(to bottom, #38BDF8 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />

          {/* SVG Laboratory Apparatus */}
          <svg
            className="w-full max-w-[280px] h-[330px] relative z-10"
            viewBox="0 0 280 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Stand Base and Vertical Steel Rod */}
            <rect x="20" y="325" width="240" height="10" rx="3" fill="#334155" stroke="#475569" strokeWidth="1" />
            <rect x="52" y="12" width="10" height="315" rx="2" fill="#475569" stroke="#64748B" strokeWidth="1" />

            {/* Burette Metal Clamps */}
            <rect x="52" y="45" width="60" height="7" fill="#64748B" rx="1.5" />
            <rect x="107" y="42" width="12" height="13" fill="#94A3B8" rx="2" />
            <rect x="52" y="145" width="60" height="7" fill="#64748B" rx="1.5" />
            <rect x="107" y="142" width="12" height="13" fill="#94A3B8" rx="2" />

            {/* CLASS-A GLASS BURETTE TUBE (50 mL capacity, graduated downwards) */}
            <g id="burette-assembly">
              {/* Outer glass cylinder */}
              <rect
                x="110"
                y="18"
                width="20"
                height="168"
                rx="2"
                fill="rgba(255, 255, 255, 0.08)"
                stroke="#94A3B8"
                strokeWidth="1.5"
              />

              {/* Titrant Liquid Column (NaOH solution in burette) */}
              {liquidHeight > 0 && (
                <rect
                  x="112"
                  y={meniscusSvgY}
                  width="16"
                  height={liquidHeight}
                  fill="rgba(186, 230, 253, 0.45)"
                />
              )}

              {/* Downward Concave Meniscus Curve */}
              {remainingInBurette > 0 && (
                <g>
                  {/* Meniscus bottom curve */}
                  <ellipse
                    cx="120"
                    cy={meniscusSvgY}
                    rx="8"
                    ry="2.5"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1.5"
                  />
                  {/* Optical pointer line to bottom of meniscus */}
                  <line
                    x1="94"
                    y1={meniscusSvgY}
                    x2="110"
                    y2={meniscusSvgY}
                    stroke="#F59E0B"
                    strokeWidth="1"
                    strokeDasharray="2 1"
                  />
                  <polygon
                    points={`108,${meniscusSvgY - 2.5} 112,${meniscusSvgY} 108,${meniscusSvgY + 2.5}`}
                    fill="#F59E0B"
                  />
                </g>
              )}

              {/* Graduated Scale Markings (0 mL at top, 50 mL at bottom) */}
              {[0, 10, 20, 30, 40, 50].map((mark, i) => {
                const yPos = 25 + i * 31;
                return (
                  <g key={mark}>
                    <line x1="124" y1={yPos} x2="129" y2={yPos} stroke="#E2E8F0" strokeWidth="1" />
                    <text
                      x="133"
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
              <rect x="116" y="186" width="8" height="14" fill="#64748B" stroke="#94A3B8" strokeWidth="1" />
              {/* Rotating stopcock handle */}
              <rect
                x="111"
                y="191"
                width="18"
                height="4"
                rx="1"
                fill={isDripping ? '#38BDF8' : '#CBD5E1'}
                transform={isDripping ? 'rotate(45 120 193)' : 'rotate(0 120 193)'}
                className="transition-transform duration-200"
              />

              {/* Burette Nozzle Tip */}
              <polygon points="117,200 123,200 121,213 119,213" fill="#94A3B8" />
            </g>

            {/* ANIMATED LIQUID DROPLET (when dispensing) */}
            {isDripping && (
              <g className="animate-bounce">
                <circle cx="120" cy="222" r="3" fill="#38BDF8" />
                <path d="M120 217 L122 222 L118 222 Z" fill="#38BDF8" />
              </g>
            )}

            {/* CONICAL ERLENMEYER FLASK (250 mL Pyrex) */}
            <g id="flask-assembly">
              {/* Flask Glass Outline */}
              <path
                d="M 105 230 L 105 245 L 75 315 A 8 8 0 0 0 82 325 L 158 325 A 8 8 0 0 0 165 315 L 135 245 L 135 230 Z"
                fill="rgba(255, 255, 255, 0.05)"
                stroke="#E2E8F0"
                strokeWidth="1.5"
              />
              <ellipse cx="120" cy="230" rx="15" ry="3" fill="none" stroke="#E2E8F0" strokeWidth="1.5" />

              {/* Solution Liquid Level & Color Clip */}
              <clipPath id="flask-solution-clip">
                <path d="M 105 245 L 75 315 A 8 8 0 0 0 82 325 L 158 325 A 8 8 0 0 0 165 315 L 135 245 Z" />
              </clipPath>

              {/* Water base solution */}
              <rect
                x="70"
                y={325 - flaskLiquidHeight}
                width="100"
                height={flaskLiquidHeight}
                fill="rgba(224, 242, 254, 0.3)"
                clipPath="url(#flask-solution-clip)"
              />

              {/* Phenolphthalein Color Tint (Driven strictly by chemicalState.indicatorColor) */}
              <rect
                x="70"
                y={325 - flaskLiquidHeight}
                width="100"
                height={flaskLiquidHeight}
                fill={chemicalState.indicatorColor}
                clipPath="url(#flask-solution-clip)"
                className="transition-colors duration-300"
              />

              {/* Liquid surface ellipse */}
              <ellipse
                cx="120"
                cy={325 - flaskLiquidHeight}
                rx={15 + flaskLiquidHeight * 0.42}
                ry="3"
                fill={
                  chemicalState.pH >= 8.2
                    ? 'rgba(244, 114, 182, 0.7)'
                    : 'rgba(186, 230, 253, 0.6)'
                }
                clipPath="url(#flask-solution-clip)"
              />

              {/* Magnetic stir bar */}
              <rect x="112" y="318" width="16" height="4" rx="2" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1" />
            </g>

            {/* COMBINATION pH ELECTRODE */}
            <g id="electrode">
              <path d="M 215 150 Q 165 170 148 230" fill="none" stroke="#475569" strokeWidth="2" strokeDasharray="3 2" />
              <rect x="145" y="232" width="6" height="75" rx="2" fill="#E2E8F0" stroke="#334155" strokeWidth="1" />
              <circle cx="148" cy="308" r="4.5" fill="#38BDF8" stroke="#0284C7" strokeWidth="1" />
            </g>

            {/* DIGITAL pH METER CONSOLE */}
            <g id="meter">
              <rect x="175" y="45" width="90" height="54" rx="4" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
              <rect x="181" y="52" width="78" height="28" rx="2" fill="#020617" />
              <text x="185" y="62" fill="#38BDF8" fontSize="7" fontFamily="monospace">
                pH METER 25.0°C
              </text>
              <text x="254" y="76" fill="#38BDF8" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="end">
                {formatNumber(experimentalMeasuredPH, 2)}
              </text>
              <circle cx="187" cy="91" r="3" fill="#10B981" />
              <text x="194" y="93" fill="#94A3B8" fontSize="6" fontFamily="monospace">
                ±0.01 pH RESOLUTION
              </text>
            </g>
          </svg>

          {/* MENISCUS MAGNIFIER / LOUPE CLOSE-UP VIEW */}
          {showLoupe && (
            <div className="w-full mt-2 p-2.5 bg-slate-900/90 border border-slate-700 rounded-lg flex items-center justify-between gap-3 text-white text-xs">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full border-2 border-amber-400 bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden shrink-0 shadow-inner">
                  {/* Magnified glass ticks */}
                  <div className="absolute inset-0 flex flex-col justify-around py-1 px-1">
                    <div className="w-full h-px bg-slate-600" />
                    <div className="w-3/4 h-px bg-slate-600" />
                    <div className="w-full h-px bg-slate-600" />
                    <div className="w-3/4 h-px bg-slate-600" />
                    <div className="w-full h-px bg-slate-600" />
                  </div>
                  {/* Magnified concave meniscus */}
                  <div className="w-8 h-2.5 border-b-2 border-cyan-400 rounded-b-full bg-cyan-900/40 relative z-10" />
                  <div className="absolute top-1/2 w-full h-px bg-amber-400/80 pointer-events-none" />
                </div>
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span>Meniscus Reading</span>
                    <span className="text-[10px] text-amber-400 font-mono">
                      (Read bottom of curve)
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Burette Scale: <strong>{formatNumber(experimentalBuretteReading, 2)} mL</strong> (±0.05 mL)
                  </div>
                </div>
              </div>

              <div className="text-right text-[11px] font-mono text-slate-400">
                Class-A ASTM E287
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Burette Measurement HUD, Addition Controls, and Record Reading */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          {/* Complete Burette Volumetric Reading Matrix */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
              <span className="font-bold uppercase tracking-wide text-slate-800 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-700" />
                <span>Virtual Burette Measurements</span>
              </span>
              <span className="font-mono text-slate-400 text-[11px]">
                Vol Delivered: ΔV = V_curr - V_init
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {/* Initial Reading */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">
                  Initial Reading (V_init)
                </span>
                <div className="text-sm font-bold font-mono text-slate-800">
                  {formatNumber(initialBuretteReading, 2)} mL
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Top fill mark</span>
              </div>

              {/* Current Reading */}
              <div className="p-2.5 bg-blue-50/60 rounded-lg border border-blue-200">
                <span className="text-[10px] font-mono text-blue-700 uppercase block mb-0.5 font-semibold">
                  Current Reading (V_curr)
                </span>
                <div className="text-base font-extrabold font-mono text-blue-900">
                  {formatNumber(experimentalBuretteReading, 2)} mL
                </div>
                <span className="text-[10px] text-blue-600 font-mono">Burette scale</span>
              </div>

              {/* Volume Delivered */}
              <div className="p-2.5 bg-emerald-50/60 rounded-lg border border-emerald-200">
                <span className="text-[10px] font-mono text-emerald-700 uppercase block mb-0.5 font-semibold">
                  Volume Delivered (ΔV)
                </span>
                <div className="text-base font-extrabold font-mono text-emerald-900">
                  {formatNumber(experimentalDeliveredVolume, 2)} mL
                </div>
                <span className="text-[10px] text-emerald-600 font-mono">Added to flask</span>
              </div>

              {/* Final Reading / Status */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-0.5">
                  Remaining in Tube
                </span>
                <div className="text-sm font-bold font-mono text-slate-800">
                  {formatNumber(remainingInBurette, 2)} mL
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Capacity 50 mL</span>
              </div>
            </div>

            {/* Experimental Uncertainty vs Theoretical Value Banner */}
            <div className="pt-1">
              <button
                onClick={() => setShowUncertaintyDetails(!showUncertaintyDetails)}
                className="w-full text-left flex items-center justify-between text-[11px] font-mono text-slate-600 hover:text-slate-900 py-1 cursor-pointer"
              >
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <Info className="w-3.5 h-3.5 text-blue-700" />
                  <span>Instrument Uncertainty & Theoretical Model Values</span>
                </span>
                {showUncertaintyDetails ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {showUncertaintyDetails && (
                <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-500">Burette Tolerance:</span>{' '}
                      <strong>±0.05 mL (Class-A)</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">pH Electrode Resolution:</span>{' '}
                      <strong>±0.01 pH unit</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Volumetric Pipette:</span>{' '}
                      <strong>25.00 ± 0.03 mL</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">Combined Exp. Uncertainty:</span>{' '}
                      <strong>±0.06 mL (k=2)</strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                    <span className="text-slate-600">
                      Theoretical Equivalence Point:
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {formatNumber(chemicalState.theoreticalEquivalenceVolumeMl, 2)} mL
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Indicator State Card */}
          <div className="p-3.5 bg-white rounded-lg border border-slate-200 shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <span>Phenolphthalein Indicator State</span>
              </span>
              <span className="font-mono text-[11px] text-slate-500">Transition: pH 8.2–10.0</span>
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
              <span className="font-mono text-slate-400 text-[11px]">PTFE Stopcock</span>
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

          {/* MANUAL OBSERVATION RECORDING CONTROL */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-wide text-slate-800 flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5 text-blue-700" />
                <span>Manual Observation Recording</span>
              </span>
              <span className="font-mono text-slate-500 text-[11px]">
                {totalRecordsCount} Trials Logged
              </span>
            </div>

            {/* Quick Note / Milestone Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                'Baseline 0.00 mL',
                'Pre-equivalence',
                'Dropwise addition',
                'Faint pale pink endpoint',
                'Post-equivalence plateau',
              ].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => {
                    setSelectedNote(preset);
                    if (preset.includes('endpoint')) {
                      setIsMarkingEndpoint(true);
                    }
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    selectedNote === preset
                      ? 'bg-blue-100 border-blue-300 text-blue-900 font-semibold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRecord}
                className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-blue-400" />
                <span>Record Reading to Observation Table</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 text-center font-mono">
              Saves: Burette {formatNumber(experimentalBuretteReading, 2)} mL · Delivered{' '}
              {formatNumber(experimentalDeliveredVolume, 2)} mL · pH {formatNumber(experimentalMeasuredPH, 2)} · {chemicalState.indicatorLabel}
            </p>
          </div>
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
