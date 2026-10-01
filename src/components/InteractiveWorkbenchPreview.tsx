import React, { useState, useMemo } from 'react';
import { Sliders, RefreshCw, BarChart2, Activity, FlaskConical } from 'lucide-react';

type SimulationMode = 'titration' | 'kinetics' | 'equilibrium';

export const InteractiveWorkbenchPreview: React.FC = () => {
  const [mode, setMode] = useState<SimulationMode>('titration');
  const [titrantVol, setTitrantVol] = useState<number>(24.5);
  const [elapsedTime, setElapsedTime] = useState<number>(35);
  const [tempKelvin, setTempKelvin] = useState<number>(298);
  const [stressFactor, setStressFactor] = useState<number>(1.5);

  // Titration calculations (Acetic Acid titration with NaOH: Ka = 1.74e-5, pKa = 4.76, Veq = 25.0 mL)
  const titrationData = useMemo(() => {
    const V = titrantVol;
    let ph = 7.0;
    let state = 'Buffer Region';

    if (V <= 0.05) {
      ph = 2.88;
      state = 'Initial Weak Acid';
    } else if (V < 24.8) {
      const ratio = V / (25.0 - V);
      ph = 4.76 + Math.log10(ratio);
      state = V < 12.5 ? 'Weak Acid Buffering' : 'Half-Equivalence Zone';
    } else if (V >= 24.8 && V <= 25.2) {
      ph = 8.72 + (V - 25.0) * 4.5;
      state = 'Stoichiometric Equivalence Point';
    } else {
      const excessMoles = (V - 25.0) * 0.1;
      const totalVolume = 50.0 + V;
      const ohConc = excessMoles / totalVolume;
      const pOH = -Math.log10(Math.max(ohConc, 1e-12));
      ph = Math.min(14.0, 14.0 - pOH);
      state = 'Excess Strong Base Titrant';
    }

    // Phenolphthalein color response
    let indicatorRgba = 'rgba(238, 242, 255, 0.4)';
    let indicatorLabel = 'Colorless (Acidic)';
    if (ph >= 8.2 && ph < 9.6) {
      const opacity = ((ph - 8.2) / 1.4) * 0.7 + 0.15;
      indicatorRgba = `rgba(219, 39, 119, ${opacity.toFixed(2)})`;
      indicatorLabel = 'Pale Pink Transition';
    } else if (ph >= 9.6) {
      indicatorRgba = 'rgba(219, 39, 119, 0.85)';
      indicatorLabel = 'Vivid Fuchsia End Point';
    }

    return {
      pH: Math.max(1.0, Math.min(13.8, ph)),
      state,
      indicatorRgba,
      indicatorLabel,
    };
  }, [titrantVol]);

  // Kinetics calculations (First-order decay: [A] = [A]0 * e^(-k*t))
  const kineticsData = useMemo(() => {
    const Ea = 45000; // J/mol
    const R = 8.314;
    const A = 1.2e6;
    const k = A * Math.exp(-Ea / (R * tempKelvin));
    const conc0 = 0.50; // M
    const conc = conc0 * Math.exp(-k * elapsedTime);
    const rate = k * conc;
    const halfLife = Math.log(2) / k;

    return {
      k: k.toFixed(4),
      conc: Math.max(0.001, conc).toFixed(3),
      rate: (rate * 1000).toFixed(2), // in mmol/(L*s)
      halfLife: halfLife.toFixed(1),
    };
  }, [elapsedTime, tempKelvin]);

  // Equilibrium calculations (Le Chatelier shift)
  const equilibriumData = useMemo(() => {
    const standardKc = 138;
    const feInitial = 0.02 * stressFactor;
    const scnInitial = 0.02;
    // Approximating complex equilibrium
    const complexConc = (feInitial * scnInitial * standardKc) / (1 + standardKc * (feInitial + scnInitial));
    const freeFe = feInitial - complexConc;
    const freeScn = scnInitial - complexConc;
    const Q = complexConc / (freeFe * freeScn);

    return {
      complexConc: (complexConc * 1000).toFixed(2),
      freeFe: (freeFe * 1000).toFixed(2),
      freeScn: (freeScn * 1000).toFixed(2),
      Q: Math.round(Q),
      Kc: standardKc,
    };
  }, [stressFactor]);

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 bg-slate-50/80 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Interactive Instrument Console
          </span>
          <span className="hidden sm:inline-block text-slate-300">|</span>
          <span className="hidden sm:inline-block text-xs text-slate-500 font-mono">
            Calibrated Mathematical Engine
          </span>
        </div>

        {/* Experiment Mode Selector Tabs */}
        <div className="flex items-center p-0.5 bg-slate-200/70 rounded-lg text-xs font-medium">
          <button
            onClick={() => setMode('titration')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mode === 'titration'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Titration Curve
          </button>
          <button
            onClick={() => setMode('kinetics')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mode === 'kinetics'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reaction Kinetics
          </button>
          <button
            onClick={() => setMode('equilibrium')}
            className={`px-3 py-1.5 rounded-md transition-all ${
              mode === 'equilibrium'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Equilibrium Shift
          </button>
        </div>
      </div>

      {/* Main Workspace Stage */}
      <div className="p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Real-time Data Visualization Canvas */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-medium text-slate-500 uppercase tracking-wider">
                {mode === 'titration' && 'Potentiometric pH Response Curve (V vs pH)'}
                {mode === 'kinetics' && 'Instantaneous Concentration Decay Profile ([A] vs t)'}
                {mode === 'equilibrium' && 'Dynamic Iron(III)-Thiocyanate Equilibrium Speciation'}
              </span>
              <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                Live Data Probe
              </span>
            </div>

            {/* SVG Graph Viewport */}
            <div className="relative w-full h-56 sm:h-64 bg-slate-950 rounded-lg p-3 text-slate-300 font-mono text-xs select-none overflow-hidden border border-slate-800">
              {/* Background Coordinate Grid */}
              <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {mode === 'titration' && (
                  <>
                    {/* Sigmoid Titration Curve */}
                    <path
                      d="M 20 180 Q 80 178 120 170 T 180 145 T 195 125 L 200 45 T 220 28 T 380 20"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="2.5"
                    />
                    {/* Equivalence Point Line (V = 25 mL -> x = 200) */}
                    <line
                      x1="200"
                      y1="10"
                      x2="200"
                      y2="190"
                      stroke="#64748B"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                    <text x="206" y="24" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                      V_eq = 25.0 mL
                    </text>

                    {/* Current Probe Marker */}
                    {(() => {
                      // Map titrantVol (0 to 50) to X (20 to 380)
                      const probeX = 20 + (titrantVol / 50) * 360;
                      // Map pH (1 to 14) to Y (185 to 15)
                      const probeY = 185 - ((titrationData.pH - 1) / 13) * 170;
                      return (
                        <g>
                          <line
                            x1={probeX}
                            y1="10"
                            x2={probeX}
                            y2="190"
                            stroke="#38BDF8"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                            opacity="0.8"
                          />
                          <circle
                            cx={probeX}
                            cy={probeY}
                            r="5"
                            fill="#60A5FA"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                          />
                          <text
                            x={Math.min(320, Math.max(30, probeX - 35))}
                            y={Math.max(25, probeY - 10)}
                            fill="#F8FAFC"
                            fontSize="10"
                            fontWeight="bold"
                            className="bg-slate-900"
                          >
                            pH {titrationData.pH.toFixed(2)} @ {titrantVol.toFixed(1)} mL
                          </text>
                        </g>
                      );
                    })()}
                  </>
                )}

                {mode === 'kinetics' && (
                  <>
                    {/* First-Order Decay Curve */}
                    <path
                      d="M 20 20 Q 90 120 180 155 T 380 185"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2.5"
                    />
                    {(() => {
                      const probeX = 20 + (elapsedTime / 100) * 360;
                      const probeY = 185 - (parseFloat(kineticsData.conc) / 0.5) * 165;
                      return (
                        <g>
                          <line
                            x1={probeX}
                            y1="10"
                            x2={probeX}
                            y2="190"
                            stroke="#34D399"
                            strokeWidth="1"
                            strokeDasharray="2 2"
                          />
                          <circle
                            cx={probeX}
                            cy={probeY}
                            r="5"
                            fill="#34D399"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                          />
                          <text
                            x={Math.min(310, Math.max(30, probeX - 20))}
                            y={Math.max(25, probeY - 10)}
                            fill="#F8FAFC"
                            fontSize="10"
                            fontWeight="bold"
                          >
                            [A] = {kineticsData.conc} M @ {elapsedTime} s
                          </text>
                        </g>
                      );
                    })()}
                  </>
                )}

                {mode === 'equilibrium' && (
                  <>
                    {/* Equilibrium Bars representation */}
                    <g transform="translate(40, 20)">
                      <rect x="20" y={150 - (parseFloat(equilibriumData.freeFe) / 20) * 120} width="60" height={(parseFloat(equilibriumData.freeFe) / 20) * 120} fill="#F59E0B" rx="3" />
                      <text x="30" y="165" fill="#CBD5E1" fontSize="10">Fe³⁺ free</text>
                      <text x="32" y={140 - (parseFloat(equilibriumData.freeFe) / 20) * 120} fill="#FDE68A" fontSize="10" fontWeight="bold">
                        {equilibriumData.freeFe} mM
                      </text>

                      <rect x="120" y={150 - (parseFloat(equilibriumData.freeScn) / 20) * 120} width="60" height={(parseFloat(equilibriumData.freeScn) / 20) * 120} fill="#94A3B8" rx="3" />
                      <text x="130" y="165" fill="#CBD5E1" fontSize="10">SCN⁻ free</text>
                      <text x="132" y={140 - (parseFloat(equilibriumData.freeScn) / 20) * 120} fill="#F1F5F9" fontSize="10" fontWeight="bold">
                        {equilibriumData.freeScn} mM
                      </text>

                      <rect x="220" y={150 - (parseFloat(equilibriumData.complexConc) / 20) * 120} width="60" height={(parseFloat(equilibriumData.complexConc) / 20) * 120} fill="#EF4444" rx="3" />
                      <text x="215" y="165" fill="#CBD5E1" fontSize="10">[Fe(SCN)]²⁺</text>
                      <text x="228" y={140 - (parseFloat(equilibriumData.complexConc) / 20) * 120} fill="#FCA5A5" fontSize="10" fontWeight="bold">
                        {equilibriumData.complexConc} mM
                      </text>
                    </g>
                  </>
                )}
              </svg>

              {/* Axis Labels */}
              <div className="absolute bottom-1 right-3 text-[10px] text-slate-400 font-mono">
                {mode === 'titration' && 'Titrant Volume V (mL)'}
                {mode === 'kinetics' && 'Elapsed Time t (s)'}
                {mode === 'equilibrium' && 'Species Concentration Profile'}
              </div>
              <div className="absolute top-2 left-3 text-[10px] text-slate-400 font-mono">
                {mode === 'titration' && 'pH Units [0.0 - 14.0]'}
                {mode === 'kinetics' && 'Molar Concentration [A] (mol/L)'}
                {mode === 'equilibrium' && 'Millimolar (mM)'}
              </div>
            </div>
          </div>

          {/* Theoretical Law Display */}
          <div className="mt-3 py-2 px-3 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 flex items-center justify-between">
            <span className="font-mono text-[11px] text-slate-500">
              {mode === 'titration' && 'Governing Law: Henderson–Hasselbalch [pH = pKa + log([A⁻]/[HA])]'}
              {mode === 'kinetics' && 'Governing Law: Arrhenius Relation [k = A · exp(-Ea / RT)]'}
              {mode === 'equilibrium' && 'Governing Law: Law of Mass Action [Kc = [C]ᶜ[D]ᵈ / [A]ᵃ[B]ᵇ]'}
            </span>
            <span className="text-[11px] font-semibold text-slate-700">Analytical Model</span>
          </div>
        </div>

        {/* Right Side: Interactive Variable Controls & Digital Sensor Metrics */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Digital Telemetry Readout Cards */}
          <div className="grid grid-cols-2 gap-3">
            {mode === 'titration' && (
              <>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Digital Sensor pH
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {titrationData.pH.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">± 0.02 pH electrode</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col justify-between">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Titrant Delivered
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {titrantVol.toFixed(1)} <span className="text-xs font-normal text-slate-500">mL</span>
                  </div>
                  <div className="text-[10px] text-blue-600 font-mono">0.100 M NaOH</div>
                </div>
              </>
            )}

            {mode === 'kinetics' && (
              <>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Concentration [A]
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {kineticsData.conc} <span className="text-xs font-normal text-slate-500">M</span>
                  </div>
                  <div className="text-[10px] text-emerald-600 font-mono">
                    Rate: {kineticsData.rate} mM/s
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Rate Constant (k)
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {kineticsData.k} <span className="text-xs font-normal text-slate-500">s⁻¹</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    t½ = {kineticsData.halfLife} s
                  </div>
                </div>
              </>
            )}

            {mode === 'equilibrium' && (
              <>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Quotient (Q)
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {equilibriumData.Q}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">Kc Reference = 138</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                    Product Complex
                  </div>
                  <div className="text-2xl font-mono font-bold text-slate-900 mt-1 tabular-nums">
                    {equilibriumData.complexConc} <span className="text-xs font-normal text-slate-500">mM</span>
                  </div>
                  <div className="text-[10px] text-red-600 font-mono">Blood-red chromophore</div>
                </div>
              </>
            )}
          </div>

            {/* Visual State Demonstration Indicator */}
            {mode === 'titration' && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center shrink-0 transition-colors duration-200"
                  style={{ backgroundColor: titrationData.indicatorRgba }}
                >
                  <FlaskConical className="w-5 h-5 text-slate-700/80" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-900">{titrationData.state}</div>
                  <div className="text-slate-500 text-[11px]">
                    Indicator Status: {titrationData.indicatorLabel}
                  </div>
                </div>
              </div>
            )}

          {/* Interactive Sliders to Manipulate Variables */}
          <div className="space-y-4 pt-1">
            {mode === 'titration' && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label htmlFor="buret-slider" className="font-medium text-slate-700 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-600" />
                    Dispense Titrant Volume (Buret Stopcock)
                  </label>
                  <span className="font-mono text-blue-600 font-bold tabular-nums">
                    {titrantVol.toFixed(1)} / 50.0 mL
                  </span>
                </div>
                <input
                  id="buret-slider"
                  type="range"
                  min="0.0"
                  max="50.0"
                  step="0.2"
                  value={titrantVol}
                  onChange={(e) => setTitrantVol(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  aria-label="Titrant volume slider"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>0.0 mL (Acidic)</span>
                  <span className="text-blue-600 font-semibold">25.0 mL (Equivalence)</span>
                  <span>50.0 mL (Basic)</span>
                </div>
              </div>
            )}

            {mode === 'kinetics' && (
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label htmlFor="kinetics-time-slider" className="font-medium text-slate-700 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      Elapsed Reaction Time (t)
                    </label>
                    <span className="font-mono text-emerald-600 font-bold tabular-nums">
                      {elapsedTime} s
                    </span>
                  </div>
                  <input
                    id="kinetics-time-slider"
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={elapsedTime}
                    onChange={(e) => setElapsedTime(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                    aria-label="Elapsed reaction time slider"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <label htmlFor="temp-slider" className="font-medium text-slate-700">
                      Vessel Temperature (T)
                    </label>
                    <span className="font-mono text-slate-700 font-semibold tabular-nums">
                      {tempKelvin} K ({tempKelvin - 273}°C)
                    </span>
                  </div>
                  <input
                    id="temp-slider"
                    type="range"
                    min="278"
                    max="338"
                    step="2"
                    value={tempKelvin}
                    onChange={(e) => setTempKelvin(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-700"
                    aria-label="Vessel temperature slider"
                  />
                </div>
              </div>
            )}

            {mode === 'equilibrium' && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label htmlFor="stress-slider" className="font-medium text-slate-700 flex items-center gap-1.5">
                    <BarChart2 className="w-3.5 h-3.5 text-amber-600" />
                    Le Chatelier Stress Factor (Reactant Influx)
                  </label>
                  <span className="font-mono text-amber-600 font-bold tabular-nums">
                    {stressFactor.toFixed(1)}x
                  </span>
                </div>
                <input
                  id="stress-slider"
                  type="range"
                  min="0.4"
                  max="3.0"
                  step="0.1"
                  value={stressFactor}
                  onChange={(e) => setStressFactor(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  aria-label="Le Chatelier stress factor slider"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                  <span>0.4x (Depletion)</span>
                  <span>1.0x (Standard)</span>
                  <span>3.0x (Saturated)</span>
                </div>
              </div>
            )}

            {/* Quick Action Button */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  if (mode === 'titration') setTitrantVol(25.0);
                  if (mode === 'kinetics') {
                    setElapsedTime(0);
                    setTempKelvin(298);
                  }
                  if (mode === 'equilibrium') setStressFactor(1.0);
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 transition-colors font-medium cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Reset Parameters
              </button>
              <span className="text-[11px] text-slate-400 font-mono">
                Model: 64-bit Floating Precision
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
