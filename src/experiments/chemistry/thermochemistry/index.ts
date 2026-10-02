/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Experiment } from '../../../models/experiment';

export const THERMOCHEMISTRY_EXPERIMENT: Experiment = {
  id: 'thermochemistry',
  title: 'Thermochemistry',
  subject: 'Chemistry',
  category: 'Thermodynamics & Physical Chemistry',
  difficulty: 'Intermediate',
  status: 'coming-soon',
  estimatedDurationMinutes: 45,
  description:
    'Perform virtual solution calorimetry in an insulated dewar, measure thermal trajectories under constant pressure, and compute molar enthalpies of neutralization and reaction.',
  learningObjectives: [
    'Calibrate calorimeter heat capacity (C_cal) through standard water-mixing trials.',
    'Measure exothermic temperature rise during neutralization (HCl + NaOH).',
    'Apply Hess’s law of heat summation to verify state function enthalpy additivity.',
    'Quantify experimental heat loss corrections via thermal curve extrapolation.',
  ],
  requiredEquipment: [
    'Dual-walled vacuum insulated calorimeter with sealed silicone septum',
    'Precision thermistor temperature probe (0.01°C sensitivity, 10 Hz sampling)',
    'Submersible magnetic paddle stirrer',
    'Analytical balance (0.001 g resolution)',
    'Reagents: 1.00 M HCl, 1.00 M NaOH, 1.00 M NH₄Cl, 1.00 M NH₃',
  ],
  instructions: [
    {
      step: 1,
      title: 'Calorimeter Constant Calibration',
      content:
        'Mix 50.0 mL of cold water (293 K) with 50.0 mL of warm water (323 K). Calculate calorimeter heat capacity C_cal from temperature equilibration.',
    },
    {
      step: 2,
      title: 'Neutralization Reaction Execution',
      content:
        'Charge 50.0 mL of 1.00 M HCl into the vessel. Equilibrate. Rapidly inject 50.0 mL of 1.00 M NaOH. Log temperature every 5 seconds for 300 seconds.',
    },
    {
      step: 3,
      title: 'Extrapolation & Enthalpy Calculation',
      content:
        'Fit the cooling slope and extrapolate back to mixing time t = 0 to obtain corrected ΔT. Compute molar ΔH_neutralization.',
    },
  ],
  variables: [
    {
      id: 'acidVolume',
      name: 'Acid Volume (1.0 M HCl)',
      symbol: 'V_acid',
      unit: 'mL',
      min: 25.0,
      max: 100.0,
      step: 5.0,
      defaultValue: 50.0,
      description: 'Volume of hydrochloric acid reagent solution.',
    },
    {
      id: 'baseVolume',
      name: 'Base Volume (1.0 M NaOH)',
      symbol: 'V_base',
      unit: 'mL',
      min: 25.0,
      max: 100.0,
      step: 5.0,
      defaultValue: 50.0,
      description: 'Volume of sodium hydroxide neutralizing solution.',
    },
    {
      id: 'initialTemp',
      name: 'Initial Temperature',
      symbol: 'T_initial',
      unit: 'K',
      min: 288.0,
      max: 308.0,
      step: 0.5,
      defaultValue: 298.15,
      description: 'Equilibrated starting temperature of reagent solutions.',
    },
  ],
  units: {
    temperature: 'K',
    heat: 'J',
    enthalpy: 'kJ/mol',
    volume: 'mL',
  },
  observations: [
    { id: 'time', header: 'Time', symbol: 't', unit: 's', precision: 0, isIndependent: true },
    { id: 'temperature', header: 'Vessel Temp', symbol: 'T', unit: 'K', precision: 2 },
    { id: 'deltaT', header: 'Temperature Change', symbol: 'ΔT', unit: 'K', precision: 2 },
  ],
  calculations: [
    {
      id: 'molarEnthalpy',
      name: 'Molar Enthalpy of Neutralization',
      symbol: 'ΔH_neut',
      unit: 'kJ/mol',
      formulaDisplay: 'ΔH = -(m_soln × c_soln + C_cal) × ΔT / n_limiting',
      description: 'Molar reaction enthalpy normalized by moles of water formed.',
      precision: 2,
    },
  ],
  theory: {
    summary:
      'Under constant atmospheric pressure, reaction heat is identical to enthalpy change (qp = ΔH). Energy conservation dictates that heat released by the reaction is absorbed by the surrounding solution and container.',
    governingLaws: [
      {
        name: 'First Law Calorimetric Balance',
        formula: 'q_rxn = -(q_solution + q_calorimeter)',
        description: 'Conservation of thermal energy in an isolated system.',
      },
    ],
  },
};
