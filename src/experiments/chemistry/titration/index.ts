/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Experiment } from '../../../models/experiment';

export const ACID_BASE_TITRATION_EXPERIMENT: Experiment = {
  id: 'acid-base-titration',
  title: 'Acid–Base Titration',
  subject: 'Chemistry',
  category: 'Analytical Chemistry',
  difficulty: 'Introductory',
  status: 'available', // FIRST FUNCTIONAL EXPERIMENT!
  estimatedDurationMinutes: 30,
  description:
    'Perform a precision volumetric titration of hydrochloric acid (HCl) with sodium hydroxide (NaOH) using phenolphthalein indicator. Measure pH trajectories, determine the stoichiometric equivalence point, and calculate the concentration of the acid.',
  learningObjectives: [
    'Operate a virtual precision 50 mL burette to dispense standardized NaOH titrant.',
    'Observe the sharp potentiometric pH jump across the stoichiometric equivalence point.',
    'Correlate the visual phenolphthalein indicator transition (pH 8.2–10.0) with stoichiometric equivalence.',
    'Construct the experimental titration curve (pH vs. Volume of NaOH added).',
    'Calculate the unknown acid concentration from the experimental equivalence volume and determine percentage error.',
  ],
  requiredEquipment: [
    '50.00 mL Class-A precision glass burette with PTFE stopcock (±0.05 mL)',
    '250 mL Pyrex Erlenmeyer conical flask',
    'Combination glass-body pH electrode with digital meter',
    'Phenolphthalein indicator solution (0.1% in ethanol/water)',
    'Standardized 0.1000 M sodium hydroxide (NaOH) titrant solution',
    'Hydrochloric acid (HCl) analyte solution (nominal 0.1000 M, 25.00 mL)',
    'Magnetic stirrer with PTFE stir bar',
  ],
  instructions: [
    {
      step: 1,
      title: 'Apparatus Inspection & Initial Setup',
      content:
        'The 50.00 mL burette is pre-filled to the 0.00 mL mark with standardized 0.1000 M NaOH. The conical flask contains exactly 25.00 mL of HCl with 2 drops of phenolphthalein indicator. Record the initial baseline pH at 0.00 mL NaOH.',
    },
    {
      step: 2,
      title: 'Initial Titrant Addition (Pre-Equivalence)',
      content:
        'Deliver NaOH in 1.00 mL or 2.00 mL increments. Record the titrant volume and pH after each addition. Observe how slowly the pH rises in the acidic region (pH 1.0 to 3.0).',
    },
    {
      step: 3,
      title: 'Approaching Equivalence (Dropwise Fine Addition)',
      content:
        'As the volume approaches 24.00 mL, switch to fine increments (+0.10 mL, +0.20 mL, or dropwise +0.05 mL). Watch for momentary flashes of pale pink where the drops enter the flask before dispersing.',
      caution:
        'The pH rises extremely rapidly between 24.50 mL and 25.50 mL! Add titrant in small drops to capture the inflection point accurately.',
    },
    {
      step: 4,
      title: 'End Point Detection & Over-Titration',
      content:
        'Stop when the first permanent pale pink coloration persists throughout the solution (pH ~8.2–9.0). Add an additional 1.00–2.00 mL to capture the post-equivalence plateau.',
    },
    {
      step: 5,
      title: 'Data Analysis & Concentration Calculation',
      content:
        'Inspect the plotted pH vs. Volume curve. Locate the inflection point where ΔpH / ΔV reaches its peak to determine the experimental equivalence volume, and compare your calculated concentration against theory.',
    },
  ],
  variables: [
    {
      id: 'titrantVolume',
      name: 'NaOH Volume Added',
      symbol: 'V_NaOH',
      unit: 'mL',
      min: 0.0,
      max: 50.0,
      step: 0.05,
      defaultValue: 0.0,
      description: 'Cumulative volume of 0.1000 M NaOH dispensed from the burette.',
      category: 'reagent',
    },
    {
      id: 'analyteVolume',
      name: 'Initial HCl Flask Volume',
      symbol: 'V_HCl',
      unit: 'mL',
      min: 10.0,
      max: 50.0,
      step: 5.0,
      defaultValue: 25.0,
      description: 'Volume of hydrochloric acid solution in the conical flask.',
      category: 'reagent',
    },
    {
      id: 'titrantConcentration',
      name: 'NaOH Titrant Concentration',
      symbol: 'C_NaOH',
      unit: 'M',
      min: 0.05,
      max: 0.5,
      step: 0.01,
      defaultValue: 0.1,
      description: 'Standardized molarity of the sodium hydroxide solution.',
      category: 'reagent',
    },
    {
      id: 'analyteConcentration',
      name: 'HCl Analyte Concentration (Theoretical)',
      symbol: 'C_HCl',
      unit: 'M',
      min: 0.05,
      max: 0.5,
      step: 0.01,
      defaultValue: 0.1,
      description: 'True concentration of the hydrochloric acid solution to be determined experimentally.',
      category: 'reagent',
    },
  ],
  units: {
    volume: 'mL',
    concentration: 'M (mol/L)',
    pH: 'pH units',
    moles: 'mol',
  },
  observations: [
    {
      id: 'volume',
      header: 'NaOH Added',
      symbol: 'V_NaOH',
      unit: 'mL',
      precision: 2,
      isIndependent: true,
    },
    {
      id: 'pH',
      header: 'Solution pH',
      symbol: 'pH',
      unit: 'pH',
      precision: 2,
    },
    {
      id: 'buretteReading',
      header: 'Burette Reading',
      symbol: 'B_read',
      unit: 'mL',
      precision: 2,
    },
    {
      id: 'flaskVolume',
      header: 'Total Flask Vol',
      symbol: 'V_flask',
      unit: 'mL',
      precision: 2,
    },
    {
      id: 'appearance',
      header: 'Indicator Visual State',
      symbol: 'Color',
      unit: '',
      precision: 0,
    },
  ],
  calculations: [
    {
      id: 'molesHcl',
      name: 'Initial Moles of HCl',
      symbol: 'n_HCl',
      unit: 'mol',
      formulaDisplay: 'n_HCl = C_HCl × V_HCl',
      description: 'Total molar amount of hydrochloric acid in the flask.',
      precision: 5,
    },
    {
      id: 'molesNaoh',
      name: 'Moles of NaOH Added',
      symbol: 'n_NaOH',
      unit: 'mol',
      formulaDisplay: 'n_NaOH = C_NaOH × V_NaOH',
      description: 'Molar amount of sodium hydroxide dispensed so far.',
      precision: 5,
    },
    {
      id: 'theoreticalVeq',
      name: 'Theoretical Equivalence Volume',
      symbol: 'V_eq,theo',
      unit: 'mL',
      formulaDisplay: 'V_eq = (C_HCl × V_HCl) / C_NaOH',
      description: 'Theoretical volume of titrant required for exact stoichiometric neutralization.',
      precision: 2,
    },
    {
      id: 'derivedConcentration',
      name: 'Experimentally Derived [HCl]',
      symbol: 'C_HCl,exp',
      unit: 'M',
      formulaDisplay: 'C_HCl = (C_NaOH × V_eq,exp) / V_HCl',
      description: 'Calculated acid concentration derived from experimental observations.',
      precision: 4,
    },
  ],
  theory: {
    summary:
      'Neutralization between strong acid HCl and strong base NaOH is a 1:1 stoichiometric reaction: HCl (aq) + NaOH (aq) -> NaCl (aq) + H2O (l). Both species dissociate completely into ions. Because neither conjugate ion hydrolyzes, the theoretical pH at stoichiometric equivalence is exactly 7.00 at 25°C. Phenolphthalein changes from colorless to pale pink between pH 8.2 and 10.0, matching the vertical inflection region.',
    governingLaws: [
      {
        name: 'Neutralization Stoichiometry',
        formula: 'H⁺ (aq) + OH⁻ (aq) ⇌ H₂O (l)',
        description: 'Net ionic equation for strong acid-strong base neutralization with Kw = 1.0 × 10⁻¹⁴ at 25°C.',
      },
      {
        name: 'Equivalence Condition',
        formula: 'n_acid = n_base ⟹ C_HCl × V_HCl = C_NaOH × V_eq',
        description: 'Point where stoichiometric amounts of acid and base have reacted completely.',
      },
      {
        name: 'Auto-ionization of Water',
        formula: '[H⁺][OH⁻] = K_w = 1.0 × 10⁻¹⁴',
        description: 'Governs hydronium and hydroxide equilibrium in aqueous solution.',
      },
    ],
    references: [
      'Skoog, D. A., West, D. M., & Holler, F. J. Fundamentals of Analytical Chemistry (9th ed.).',
      'Christian, G. D., Dasgupta, P. K., & Schug, K. A. Analytical Chemistry (7th ed.).',
    ],
  },
  graphConfig: {
    xAxis: {
      columnId: 'volume',
      label: 'Volume of NaOH added',
      unit: 'mL',
      min: 0,
      max: 50,
    },
    yAxis: {
      columnId: 'pH',
      label: 'pH',
      unit: 'pH',
      min: 0,
      max: 14,
    },
    theoreticalCurveLabel: 'Theoretical Neutralization Curve',
  },
};
