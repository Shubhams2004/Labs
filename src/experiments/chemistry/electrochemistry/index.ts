/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Experiment } from '../../../models/experiment';

export const ELECTROCHEMISTRY_EXPERIMENT: Experiment = {
  id: 'electrochemistry',
  title: 'Electrochemistry',
  subject: 'Chemistry',
  category: 'Physical Chemistry',
  difficulty: 'Advanced',
  status: 'coming-soon',
  estimatedDurationMinutes: 50,
  description:
    'Construct virtual galvanic cells, measure open-circuit cell potentials (E_cell) under standard and non-standard electrolyte concentrations, and verify the Nernst formulation.',
  learningObjectives: [
    'Assemble a galvanic cell with metal electrodes and salt bridge.',
    'Measure standard cell electromotive force (E°cell).',
    'Demonstrate the concentration dependence of cell potential according to the Nernst equation.',
    'Calculate Gibbs free energy change (ΔG) and the equilibrium constant (K) from electrochemical data.',
  ],
  requiredEquipment: [
    'Digital electrometer / high-impedance voltmeter (10 GΩ, 0.1 mV resolution)',
    'High-purity Zinc and Copper metal electrode strips',
    'Matched glass half-cell beakers with KNO₃ agar salt bridge',
    'Aqueous standard solutions of ZnSO₄ and CuSO₄ (0.001 M to 1.0 M)',
  ],
  instructions: [
    {
      step: 1,
      title: 'Electrode Preparation & Baseline Assembly',
      content:
        'Polish the Zn and Cu electrode surfaces. Fill half-cells with 1.00 M ZnSO₄ and 1.00 M CuSO₄. Insert the salt bridge.',
    },
    {
      step: 2,
      title: 'Standard Potential Measurement',
      content:
        'Connect the electrometer leads. Record the standard cell EMF (E°cell ≈ 1.10 V at 298.15 K).',
    },
    {
      step: 3,
      title: 'Concentration Gradient Series',
      content:
        'Dilute the anode or cathode compartment through 3 orders of magnitude. Measure the resulting E_cell and plot against ln(Q).',
    },
  ],
  variables: [
    {
      id: 'anodeConc',
      name: 'Anode Concentration [Zn²⁺]',
      symbol: '[Zn²⁺]',
      unit: 'M',
      min: 0.001,
      max: 1.0,
      step: 0.05,
      defaultValue: 1.0,
      description: 'Molarity of zinc sulfate in anode compartment.',
    },
    {
      id: 'cathodeConc',
      name: 'Cathode Concentration [Cu²⁺]',
      symbol: '[Cu²⁺]',
      unit: 'M',
      min: 0.001,
      max: 1.0,
      step: 0.05,
      defaultValue: 1.0,
      description: 'Molarity of copper sulfate in cathode compartment.',
    },
  ],
  units: {
    potential: 'V',
    concentration: 'M',
    energy: 'kJ/mol',
  },
  observations: [
    { id: 'trial', header: 'Trial', unit: '', precision: 0 },
    { id: 'anode', header: '[Zn²⁺]', symbol: '[Zn²⁺]', unit: 'M', precision: 3 },
    { id: 'cathode', header: '[Cu²⁺]', symbol: '[Cu²⁺]', unit: 'M', precision: 3 },
    { id: 'emf', header: 'Cell EMF', symbol: 'E_cell', unit: 'V', precision: 3 },
  ],
  calculations: [
    {
      id: 'nernstPotential',
      name: 'Theoretical Cell Potential',
      symbol: 'E_calc',
      unit: 'V',
      formulaDisplay: 'E = E° - (RT / nF) ln([Zn²⁺] / [Cu²⁺])',
      description: 'Calculated potential from Nernst equation.',
      precision: 3,
    },
  ],
  theory: {
    summary:
      'Spontaneous redox reactions generate electrical work. The Nernst equation accounts for non-standard concentration effects on the reversible electrochemical cell potential.',
    governingLaws: [
      {
        name: 'Nernst Formulation',
        formula: 'E_cell = E°_cell - (RT / nF) ln Q',
        description: 'Relates cell potential to reaction quotient Q and standard EMF.',
      },
    ],
  },
};
