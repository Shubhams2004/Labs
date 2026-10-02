/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Experiment } from '../../../models/experiment';

export const REACTION_KINETICS_EXPERIMENT: Experiment = {
  id: 'reaction-kinetics',
  title: 'Reaction Kinetics',
  subject: 'Chemistry',
  category: 'Physical Chemistry',
  difficulty: 'Intermediate',
  status: 'coming-soon',
  estimatedDurationMinutes: 50,
  description:
    'Investigate the rates of chemical transformation, determine reaction orders through systematic concentration variation, and extract empirical activation energy via temperature-dependent Arrhenius plotting.',
  learningObjectives: [
    'Measure reaction rates as a function of changing reactant concentrations.',
    'Deduce reaction orders (m, n) using the method of initial rates.',
    'Calculate the specific rate constant (k) across multiple temperature regimes.',
    'Construct an Arrhenius plot (ln k vs 1/T) to determine the activation energy (Ea).',
  ],
  requiredEquipment: [
    'Split-beam visible spectrophotometer (585 nm absorption channel)',
    'Sub-second precision digital optical stopwatch & trigger sensor',
    'Constant-temperature circulating water bath (285 K – 335 K, ±0.1 K)',
    'Automated micro-dispensers for persulfate, iodide, and thiosulfate reagents',
    '100 mL jacketed optical reaction cuvette with internal thermocouple',
  ],
  instructions: [
    {
      step: 1,
      title: 'Calibration and Thermal Equilibration',
      content:
        'Zero the spectrophotometer with distilled water blank. Set the water bath to 298.15 K and allow reactant stock vessels to thermally equilibrate.',
    },
    {
      step: 2,
      title: 'Initial Rates Matrix Preparation',
      content:
        'Prepare four trials systematically doubling [I⁻] while holding [S₂O₈²⁻] constant, then holding [I⁻] constant and varying [S₂O₈²⁻].',
    },
    {
      step: 3,
      title: 'Photometric Time Recording',
      content:
        'Rapidly mix reactants, start the digital timer, and record elapsed time until absorbance at 585 nm reaches the optical threshold.',
    },
    {
      step: 4,
      title: 'Temperature Series & Arrhenius Construction',
      content:
        'Repeat standard concentration trials at 288 K, 298 K, 308 K, and 318 K. Construct the linear ln(k) vs. 1/T curve to extract activation energy.',
    },
  ],
  variables: [
    {
      id: 'concIodide',
      name: 'Iodide Concentration',
      symbol: '[I⁻]',
      unit: 'M',
      min: 0.01,
      max: 0.2,
      step: 0.01,
      defaultValue: 0.04,
      description: 'Initial molar concentration of potassium iodide in the reaction mixture.',
    },
    {
      id: 'concPersulfate',
      name: 'Persulfate Concentration',
      symbol: '[S₂O₈²⁻]',
      unit: 'M',
      min: 0.01,
      max: 0.1,
      step: 0.01,
      defaultValue: 0.02,
      description: 'Initial concentration of ammonium persulfate oxidizing agent.',
    },
    {
      id: 'temperature',
      name: 'Bath Temperature',
      symbol: 'T',
      unit: 'K',
      min: 280,
      max: 335,
      step: 1,
      defaultValue: 298,
      description: 'Temperature of the circulating thermostatic jacket.',
    },
  ],
  units: {
    concentration: 'M',
    time: 's',
    rate: 'mol·L⁻¹·s⁻¹',
    temperature: 'K',
  },
  observations: [
    { id: 'trial', header: 'Trial', unit: '', precision: 0 },
    { id: 'concI', header: '[I⁻] Initial', symbol: '[I⁻]', unit: 'M', precision: 3 },
    { id: 'concS2O8', header: '[S₂O₈²⁻] Initial', symbol: '[S₂O₈²⁻]', unit: 'M', precision: 3 },
    { id: 'time', header: 'Reaction Time', symbol: 'Δt', unit: 's', precision: 1 },
    { id: 'rate', header: 'Initial Rate', symbol: 'r₀', unit: 'μmol·L⁻¹·s⁻¹', precision: 2 },
  ],
  calculations: [
    {
      id: 'orderM',
      name: 'Reaction Order with Respect to Iodide',
      symbol: 'm',
      unit: '',
      formulaDisplay: 'm = log(r₂ / r₁) / log([I⁻]₂ / [I⁻]₁)',
      description: 'Partial order of reaction with respect to iodide ions.',
      precision: 2,
    },
    {
      id: 'activationEnergy',
      name: 'Empirical Activation Energy',
      symbol: 'E_a',
      unit: 'kJ/mol',
      formulaDisplay: 'E_a = -R × (slope of ln k vs 1/T)',
      description: 'Minimum kinetic energy threshold required for productive molecular collisions.',
      precision: 2,
    },
  ],
  theory: {
    summary:
      'Chemical reaction rates depend on molecular collision frequency, effective spatial orientation, and kinetic thermal energy exceeding the activation energy Ea.',
    governingLaws: [
      {
        name: 'Differential Rate Law',
        formula: 'r = k × [A]^m × [B]^n',
        description: 'Expresses reaction velocity in terms of reactant concentrations and orders.',
      },
      {
        name: 'Arrhenius Temperature Relationship',
        formula: 'k = A × exp(-E_a / RT)',
        description: 'Quantifies exponential rate acceleration with increasing temperature.',
      },
    ],
  },
  graphConfig: {
    xAxis: {
      columnId: 'time',
      label: 'Elapsed Time',
      unit: 's',
      min: 0,
      max: 120,
    },
    yAxis: {
      columnId: 'concI',
      label: 'Reactant Concentration',
      unit: 'M',
      min: 0,
      max: 0.1,
    },
  },
};
