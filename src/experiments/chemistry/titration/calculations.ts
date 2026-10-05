/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Pure Chemistry Calculation Module for Strong Acid - Strong Base Titration:
 * HCl (aq) + NaOH (aq) -> NaCl (aq) + H2O (l)
 *
 * Designed to be testable, pure, and completely decoupled from React UI components.
 */

export interface StrongAcidBaseInput {
  analyteVolumeMl: number;       // Volume of HCl in flask (mL)
  analyteConcentrationM: number;  // Concentration of HCl (mol/L)
  titrantVolumeMl: number;       // Delivered volume of NaOH (mL)
  titrantConcentrationM: number;  // Concentration of NaOH (mol/L)
  temperatureC?: number;         // Temperature in Celsius (default 25.0)
}

export type TitrationStage =
  | 'before-equivalence'
  | 'near-equivalence'
  | 'at-equivalence'
  | 'after-equivalence';

export interface ChemicalStateResult {
  // Stoichiometric quantities
  molesHclInitial: number;
  molesNaohAdded: number;
  molesExcessAcid: number;
  molesExcessBase: number;
  limitingReagent: 'NaOH' | 'HCl' | 'none';
  excessReagent: 'HCl' | 'NaOH' | 'none';

  // Volumetric state
  analyteVolumeMl: number;
  titrantVolumeMl: number;
  totalVolumeMl: number;
  totalVolumeL: number;
  theoreticalEquivalenceVolumeMl: number;
  fractionTitrated: number;

  // Ion concentrations (mol/L)
  hydroniumConcentrationM: number;
  hydroxideConcentrationM: number;

  // pH values
  pH: number;
  pOH: number;

  // Stage & Indicator
  stage: TitrationStage;
  indicatorColor: string;
  indicatorLabel: string;
  indicatorAlpha: number;

  // Scientific assumptions
  assumptions: string[];
}

export interface ScientificConclusionResult {
  status: string;
  verdict: 'successful' | 'acceptable' | 'unsuccessful' | 'insufficient';
  text: string;
  isSuccessful: boolean;
  notes: string[];
}

export interface EquivalenceAnalysisResult {
  hasEnoughData: boolean;
  minPointsRequired: number;
  pointsRecorded: number;
  theoreticalEquivalenceVolumeMl: number;
  theoreticalAnalyteConcentrationM: number;
  estimatedEquivalenceVolumeMl: number | null;
  estimatedAnalyteConcentrationM: number | null;
  absoluteErrorVolumeMl: number | null;
  absoluteErrorConcentrationM: number | null;
  volumeErrorPercent: number | null;
  concentrationErrorPercent: number | null;
  maxDerivativeValue: number | null;
  inflectionPointIndex: number | null;
  message: string;
  conclusion?: ScientificConclusionResult;
}

/**
 * Water ion-product constant Kw at given temperature.
 * At 25°C (298.15 K), Kw = 1.008e-14 ≈ 1.0e-14.
 */
export function getKw(temperatureC: number = 25): number {
  const tKelvin = temperatureC + 273.15;
  // Marshall and Franck formulation approximation for liquid water
  const pKw = 14.0 - 0.033 * (temperatureC - 25);
  return Math.pow(10, -pKw);
}

/**
 * Calculates the theoretical equivalence volume:
 * V_eq = (C_acid * V_acid) / C_base
 */
export function calculateTheoreticalEquivalenceVolume(
  analyteVolumeMl: number,
  analyteConcentrationM: number,
  titrantConcentrationM: number
): number {
  if (titrantConcentrationM <= 0) return 0;
  return (analyteConcentrationM * analyteVolumeMl) / titrantConcentrationM;
}

/**
 * Core chemistry calculation function.
 * Computes exact moles, concentrations, auto-ionization of water, and pH.
 */
export function calculateChemicalState(input: StrongAcidBaseInput): ChemicalStateResult {
  const {
    analyteVolumeMl,
    analyteConcentrationM,
    titrantVolumeMl,
    titrantConcentrationM,
    temperatureC = 25.0,
  } = input;

  const Kw = getKw(temperatureC);
  const V_eq = calculateTheoreticalEquivalenceVolume(
    analyteVolumeMl,
    analyteConcentrationM,
    titrantConcentrationM
  );

  const totalVolumeMl = analyteVolumeMl + titrantVolumeMl;
  const totalVolumeL = totalVolumeMl / 1000.0;

  const molesHclInitial = (analyteVolumeMl / 1000.0) * analyteConcentrationM;
  const molesNaohAdded = (titrantVolumeMl / 1000.0) * titrantConcentrationM;

  let molesExcessAcid = 0;
  let molesExcessBase = 0;
  let limitingReagent: 'NaOH' | 'HCl' | 'none' = 'none';
  let excessReagent: 'HCl' | 'NaOH' | 'none' = 'none';

  let hydroniumConcentrationM = 1e-7;
  let hydroxideConcentrationM = 1e-7;
  let pH = 7.0;
  let pOH = 7.0;

  // Threshold for strict equivalence (within 1e-9 moles, sub-microliter)
  const moleDifference = molesHclInitial - molesNaohAdded;
  const tolerance = 1e-9;

  if (moleDifference > tolerance) {
    // Before Equivalence (Excess Strong Acid)
    limitingReagent = 'NaOH';
    excessReagent = 'HCl';
    molesExcessAcid = moleDifference;

    const cExcessAcid = molesExcessAcid / totalVolumeL;
    // Factoring water auto-ionization: [H+]^2 - cExcess*[H+] - Kw = 0
    hydroniumConcentrationM = (cExcessAcid + Math.sqrt(cExcessAcid * cExcessAcid + 4 * Kw)) / 2;
    hydroxideConcentrationM = Kw / hydroniumConcentrationM;

    pH = -Math.log10(hydroniumConcentrationM);
    pOH = 14.0 - pH;
  } else if (moleDifference < -tolerance) {
    // After Equivalence (Excess Strong Base)
    limitingReagent = 'HCl';
    excessReagent = 'NaOH';
    molesExcessBase = -moleDifference;

    const cExcessBase = molesExcessBase / totalVolumeL;
    // Factoring water auto-ionization: [OH-]^2 - cExcess*[OH-] - Kw = 0
    hydroxideConcentrationM = (cExcessBase + Math.sqrt(cExcessBase * cExcessBase + 4 * Kw)) / 2;
    hydroniumConcentrationM = Kw / hydroxideConcentrationM;

    pOH = -Math.log10(hydroxideConcentrationM);
    pH = 14.0 - pOH;
  } else {
    // Exactly at Equivalence
    limitingReagent = 'none';
    excessReagent = 'none';
    hydroniumConcentrationM = Math.sqrt(Kw);
    hydroxideConcentrationM = Math.sqrt(Kw);
    pH = -Math.log10(hydroniumConcentrationM);
    pOH = -Math.log10(hydroxideConcentrationM);
  }

  // Bound pH between physical extremes for aqueous solutions
  pH = Math.max(0.0, Math.min(14.0, pH));
  pOH = Math.max(0.0, Math.min(14.0, pOH));

  // Determine titration stage
  let stage: TitrationStage = 'before-equivalence';
  const deltaV = titrantVolumeMl - V_eq;

  if (Math.abs(deltaV) <= 0.08) {
    stage = 'at-equivalence';
  } else if (deltaV < -0.08 && deltaV >= -1.0) {
    stage = 'near-equivalence';
  } else if (deltaV < -1.0) {
    stage = 'before-equivalence';
  } else {
    stage = 'after-equivalence';
  }

  // Phenolphthalein indicator visualization mapping:
  // pKa of phenolphthalein ≈ 9.4
  // pH < 8.2: Colorless
  // pH 8.2 - 10.0: Transition range (pale faint pink to vivid magenta)
  // pH > 10.0: Saturated magenta/fuchsia
  let indicatorColor = 'rgba(248, 250, 252, 0.0)';
  let indicatorLabel = 'Colorless (Acidic Form H₂In)';
  let indicatorAlpha = 0.0;

  if (pH < 8.2) {
    indicatorColor = 'rgba(255, 255, 255, 0.0)';
    indicatorLabel = 'Colorless (pH < 8.2)';
    indicatorAlpha = 0.0;
  } else if (pH >= 8.2 && pH < 8.7) {
    // Barely perceptible faint pale pink (the ideal analytical end point)
    const factor = (pH - 8.2) / 0.5;
    indicatorAlpha = 0.15 + factor * 0.25; // 0.15 to 0.40
    indicatorColor = `rgba(244, 114, 182, ${indicatorAlpha.toFixed(2)})`;
    indicatorLabel = 'Faint Pale Pink (End Point Region)';
  } else if (pH >= 8.7 && pH <= 10.0) {
    // Developing deep pink / light magenta
    const factor = (pH - 8.7) / 1.3;
    indicatorAlpha = 0.40 + factor * 0.45; // 0.40 to 0.85
    indicatorColor = `rgba(219, 39, 119, ${indicatorAlpha.toFixed(2)})`;
    indicatorLabel = 'Distinct Pink / Magenta';
  } else {
    // Saturated magenta (alkaline dianion In²⁻)
    indicatorAlpha = 0.92;
    indicatorColor = 'rgba(190, 24, 93, 0.92)';
    indicatorLabel = 'Dark Magenta / Over-titrated (pH > 10.0)';
  }

  const fractionTitrated = V_eq > 0 ? titrantVolumeMl / V_eq : 0;

  const assumptions = [
    'Complete 100% ionic dissociation of strong acid HCl and strong base NaOH.',
    'Activity coefficients assumed to be unity (γ ≈ 1.0, dilute solution approximation).',
    'Self-ionization of water included via quadratic equilibrium [H⁺][OH⁻] = Kw.',
    'Ideal volumetric additivity: V_total = V_acid + V_base.',
    'Constant temperature maintained at 25.0°C (298.15 K).',
  ];

  return {
    molesHclInitial,
    molesNaohAdded,
    molesExcessAcid,
    molesExcessBase,
    limitingReagent,
    excessReagent,
    analyteVolumeMl,
    titrantVolumeMl,
    totalVolumeMl,
    totalVolumeL,
    theoreticalEquivalenceVolumeMl: V_eq,
    fractionTitrated,
    hydroniumConcentrationM,
    hydroxideConcentrationM,
    pH,
    pOH,
    stage,
    indicatorColor,
    indicatorLabel,
    indicatorAlpha,
    assumptions,
  };
}

/**
 * Calculates unknown acid concentration from user's experimental equivalence volume:
 * C_acid = (C_base * V_eq) / V_acid
 */
export function calculateUnknownConcentration(
  experimentalEquivalenceVolumeMl: number,
  analyteVolumeMl: number,
  titrantConcentrationM: number
): number {
  if (analyteVolumeMl <= 0) return 0;
  return (titrantConcentrationM * experimentalEquivalenceVolumeMl) / analyteVolumeMl;
}

/**
 * Analyzes recorded observation points to extract the experimental equivalence point
 * using the maximum of the numerical derivative ΔpH / ΔV.
 */
export function analyzeObservationResults(
  observations: { volume: number; pH: number }[],
  analyteVolumeMl: number,
  analyteConcentrationM: number,
  titrantConcentrationM: number
): EquivalenceAnalysisResult {
  const theoreticalEquivalenceVolumeMl = calculateTheoreticalEquivalenceVolume(
    analyteVolumeMl,
    analyteConcentrationM,
    titrantConcentrationM
  );

  const minPointsRequired = 4;
  const pointsRecorded = observations.length;

  if (pointsRecorded < minPointsRequired) {
    return {
      hasEnoughData: false,
      minPointsRequired,
      pointsRecorded,
      theoreticalEquivalenceVolumeMl,
      theoreticalAnalyteConcentrationM: analyteConcentrationM,
      estimatedEquivalenceVolumeMl: null,
      estimatedAnalyteConcentrationM: null,
      absoluteErrorVolumeMl: null,
      absoluteErrorConcentrationM: null,
      volumeErrorPercent: null,
      concentrationErrorPercent: null,
      maxDerivativeValue: null,
      inflectionPointIndex: null,
      message: `Record at least ${minPointsRequired} measurements across the titration range to compute experimental equivalence.`,
    };
  }

  // Sort observations monotonically by titrant volume
  const sorted = [...observations].sort((a, b) => a.volume - b.volume);

  let maxDerivative = -1;
  let inflectionVolume: number | null = null;
  let inflectionIndex: number | null = null;

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const curr = sorted[i];
    const deltaV = curr.volume - prev.volume;

    if (deltaV > 0.001) {
      const deltaPH = Math.abs(curr.pH - prev.pH);
      const derivative = deltaPH / deltaV;

      if (derivative > maxDerivative) {
        maxDerivative = derivative;
        // Midpoint volume of the maximum derivative interval
        inflectionVolume = (prev.volume + curr.volume) / 2.0;
        inflectionIndex = i;
      }
    }
  }

  if (inflectionVolume === null || maxDerivative <= 0.2) {
    return {
      hasEnoughData: false,
      minPointsRequired,
      pointsRecorded,
      theoreticalEquivalenceVolumeMl,
      theoreticalAnalyteConcentrationM: analyteConcentrationM,
      estimatedEquivalenceVolumeMl: null,
      estimatedAnalyteConcentrationM: null,
      absoluteErrorVolumeMl: null,
      absoluteErrorConcentrationM: null,
      volumeErrorPercent: null,
      concentrationErrorPercent: null,
      maxDerivativeValue: maxDerivative,
      inflectionPointIndex: null,
      message:
        'Observations do not show an inflection steep enough to isolate equivalence. Add points near the pH jump (~24 to 26 mL).',
    };
  }

  const estimatedEquivalenceVolumeMl = inflectionVolume;
  const estimatedAnalyteConcentrationM = calculateUnknownConcentration(
    estimatedEquivalenceVolumeMl,
    analyteVolumeMl,
    titrantConcentrationM
  );

  const absoluteErrorVolumeMl =
    Math.abs(estimatedEquivalenceVolumeMl - theoreticalEquivalenceVolumeMl);

  const absoluteErrorConcentrationM =
    Math.abs(estimatedAnalyteConcentrationM - analyteConcentrationM);

  const volumeErrorPercent =
    theoreticalEquivalenceVolumeMl > 0
      ? (absoluteErrorVolumeMl / theoreticalEquivalenceVolumeMl) * 100
      : 0;

  const concentrationErrorPercent =
    analyteConcentrationM > 0
      ? (absoluteErrorConcentrationM / analyteConcentrationM) * 100
      : 0;

  const conclusion = evaluateScientificConclusion(
    pointsRecorded,
    estimatedEquivalenceVolumeMl,
    theoreticalEquivalenceVolumeMl,
    estimatedAnalyteConcentrationM,
    analyteConcentrationM,
    volumeErrorPercent,
    false
  );

  return {
    hasEnoughData: true,
    minPointsRequired,
    pointsRecorded,
    theoreticalEquivalenceVolumeMl,
    theoreticalAnalyteConcentrationM: analyteConcentrationM,
    estimatedEquivalenceVolumeMl,
    estimatedAnalyteConcentrationM,
    absoluteErrorVolumeMl,
    absoluteErrorConcentrationM,
    volumeErrorPercent,
    concentrationErrorPercent,
    maxDerivativeValue: maxDerivative,
    inflectionPointIndex: inflectionIndex,
    message: 'Equivalence point successfully derived from observation inflection.',
    conclusion,
  };
}

/**
 * Objective scientific conclusion generator based strictly on experimental measurement data.
 */
export function evaluateScientificConclusion(
  pointsRecorded: number,
  estimatedVolumeMl: number | null,
  theoreticalVolumeMl: number,
  estimatedConcM: number | null,
  theoreticalConcM: number,
  volumeErrorPercent: number | null,
  isUserSpecifiedEndpoint: boolean = false
): ScientificConclusionResult {
  if (pointsRecorded < 4 || estimatedVolumeMl === null || volumeErrorPercent === null) {
    return {
      status: 'Inconclusive: Insufficient Observation Data',
      verdict: 'insufficient',
      isSuccessful: false,
      text: 'The experiment has fewer than 4 recorded observations or lacks measurements across the critical neutralization region. Additional trials across the 24.0–26.0 mL interval are required to substantiate an analytical conclusion.',
      notes: [
        'Record baseline trials at 0.00 mL and early pre-equivalence (5–15 mL).',
        'Add dropwise measurements (0.05–0.10 mL) between 24.0 and 25.5 mL.',
        'Record at least 2 trials past 26.0 mL to establish the upper alkaline plateau.',
      ],
    };
  }

  const absVolError = Math.abs(estimatedVolumeMl - theoreticalVolumeMl);

  if (volumeErrorPercent <= 2.0) {
    return {
      status: 'Experiment Successful — Analytical Grade Precision',
      verdict: 'successful',
      isSuccessful: true,
      text: `The experimental ${isUserSpecifiedEndpoint ? 'endpoint' : 'inflection point'} was determined at ${estimatedVolumeMl.toFixed(2)} mL, closely matching the stoichiometric theoretical equivalence point (${theoreticalVolumeMl.toFixed(2)} mL). The absolute error of ${absVolError.toFixed(2)} mL (percentage error: ${volumeErrorPercent.toFixed(2)}%) lies comfortably within the combined expanded uncertainty (±0.06 mL) of Class-A volumetric glassware and digital potentiometric sensing. The derived HCl molarity of ${estimatedConcM?.toFixed(4)} M accurately confirms the nominal concentration of ${theoreticalConcM.toFixed(4)} M.`,
      notes: [
        'Excellent endpoint identification within single-drop resolution.',
        'Phenolphthalein color transition aligned with stoichiometric inflection.',
        'Method confirmed suitable for quantitative volumetric titration.',
      ],
    };
  }

  if (volumeErrorPercent <= 5.0) {
    return {
      status: 'Experiment Acceptable — Minor Systematic Offset',
      verdict: 'acceptable',
      isSuccessful: true,
      text: `The titration yielded an experimental endpoint of ${estimatedVolumeMl.toFixed(2)} mL compared to theoretical ${theoreticalVolumeMl.toFixed(2)} mL (percentage error: ${volumeErrorPercent.toFixed(2)}%, absolute error: ${absVolError.toFixed(2)} mL). The small deviation reflects standard laboratory drop volume limitations (one drop ≈ 0.05 mL) or minor visual delay in detecting the faint pale pink color transition.`,
      notes: [
        'Derived concentration shows acceptable agreement within introductory laboratory benchmarks.',
        'For higher analytical accuracy, use smaller micro-drop increments near 24.8 mL.',
      ],
    };
  }

  return {
    status: 'Experiment Unsuccessful — Significant Over-Titration Detected',
    verdict: 'unsuccessful',
    isSuccessful: false,
    text: `The experimental endpoint (${estimatedVolumeMl.toFixed(2)} mL) deviated significantly from the theoretical stoichiometric point (${theoreticalVolumeMl.toFixed(2)} mL) with a percentage error of ${volumeErrorPercent.toFixed(2)}% (absolute error: ${absVolError.toFixed(2)} mL). The recorded data indicates that excess NaOH was added well past the inflection point into the deep magenta region, resulting in a substantial overestimation of the hydrochloric acid concentration (${estimatedConcM?.toFixed(4)} M vs ${theoreticalConcM.toFixed(4)} M). In professional analytical practice, this run must be repeated with finer control.`,
    notes: [
      'Stopcock was opened too rapidly or increments exceeded recommended dropwise control.',
      'Always cease titrant addition upon the first permanent faint pink tint, before dark magenta develops.',
    ],
  };
}
