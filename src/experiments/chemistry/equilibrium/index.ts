/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Experiment } from '../../../models/experiment';

export const CHEMICAL_EQUILIBRIUM_EXPERIMENT: Experiment = {
  id: 'chemical-equilibrium',
  title: 'Chemical Equilibrium',
  subject: 'Chemistry',
  category: 'General & Physical Chemistry',
  difficulty: 'Intermediate',
  status: 'coming-soon',
  estimatedDurationMinutes: 40,
  description:
    'Examine reversible chemical reactions at dynamic equilibrium, test Le Chatelier’s principle under thermal and concentration disturbances, and quantitatively evaluate the equilibrium constant Kc.',
  learningObjectives: [
    'Measure equilibrium concentrations using visible spectrophotometry.',
    'Test system response to stressors (reagent addition, precipitation, temperature).',
    'Demonstrate the constancy of Kc across diverse initial concentration conditions.',
    'Calculate the standard Gibbs free energy of reaction (ΔG°) from Kc.',
  ],
  requiredEquipment: [
    'Digital colorimeter with 447 nm bandpass filter',
    'Matched 1.00 cm quartz cuvettes',
    'Volumetric precision micro-pipets (100–1000 μL)',
    'Thermostatic cell holder (280 K – 340 K)',
    'Stock solutions of Fe(NO₃)₃, KSCN, and AgNO₃ precipitant',
  ],
  instructions: [
    {
      step: 1,
      title: 'Spectrophotometer Zeroing & Standard Curve',
      content:
        'Zero the instrument with 0.5 M HNO₃ solvent. Measure standard solutions of thiocyanatoiron(III) to establish the Beer–Lambert molar absorptivity.',
    },
    {
      step: 2,
      title: 'Equilibrium Mixture Preparation',
      content:
        'Prepare series of tubes with systematically varied Fe³⁺ to SCN⁻ ratios. Record absorbance at 447 nm after stabilization.',
    },
    {
      step: 3,
      title: 'Le Chatelier Disturbance Perturbation',
      content:
        'Introduce drops of Ag⁺ to precipitate SCN⁻ as AgSCN. Observe and record the optical absorbance shift as the equilibrium responds.',
    },
  ],
  variables: [
    {
      id: 'ironConc',
      name: 'Iron(III) Initial Concentration',
      symbol: '[Fe³⁺]₀',
      unit: 'mM',
      min: 0.5,
      max: 5.0,
      step: 0.1,
      defaultValue: 2.0,
      description: 'Starting concentration of ferric ion.',
    },
    {
      id: 'scnConc',
      name: 'Thiocyanate Initial Concentration',
      symbol: '[SCN⁻]₀',
      unit: 'mM',
      min: 0.5,
      max: 5.0,
      step: 0.1,
      defaultValue: 2.0,
      description: 'Starting concentration of thiocyanate ligand.',
    },
  ],
  units: {
    concentration: 'mM',
    absorbance: 'AU',
    Kc: 'M⁻¹',
  },
  observations: [
    { id: 'tube', header: 'Mixture', unit: '', precision: 0 },
    { id: 'absorbance', header: 'Absorbance (447 nm)', symbol: 'A', unit: 'AU', precision: 3 },
    { id: 'complex', header: '[Fe(SCN)²⁺] Eq', symbol: '[Complex]', unit: 'mM', precision: 3 },
    { id: 'Kc', header: 'Calculated Kc', symbol: 'K_c', unit: 'M⁻¹', precision: 1 },
  ],
  calculations: [
    {
      id: 'equilibriumKc',
      name: 'Equilibrium Constant',
      symbol: 'K_c',
      unit: 'M⁻¹',
      formulaDisplay: 'K_c = [[Fe(SCN)]²⁺] / ([Fe³⁺] × [SCN⁻])',
      description: 'Equilibrium ratio of product complex to unreacted aqueous reactants.',
      precision: 1,
    },
  ],
  theory: {
    summary:
      'Dynamic equilibrium represents a condition where opposing forward and reverse process rates are equal. Le Chatelier’s principle predicts that a system at equilibrium subjected to a disturbance will shift to counteract that change.',
    governingLaws: [
      {
        name: 'Law of Mass Action',
        formula: 'K_c = [Products]^p / [Reactants]^r',
        description: 'Quantifies equilibrium state at constant temperature.',
      },
    ],
  },
};
