/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Experiment } from '../../models/experiment';

export const PHYSICS_EXPERIMENTS_CATALOGUE: Experiment[] = [
  {
    id: 'harmonic-oscillator',
    title: 'Coupled Harmonic Oscillator',
    subject: 'Physics',
    category: 'Mechanics & Dynamics',
    difficulty: 'Intermediate',
    status: 'coming-soon',
    estimatedDurationMinutes: 45,
    description:
      'Investigate normal modes, energy exchange, and beats in coupled mechanical pendulum systems with variable coupling spring constants.',
    learningObjectives: [
      'Measure in-phase and out-of-phase oscillation frequencies.',
      'Quantify normal mode splitting as a function of spring stiffness k.',
    ],
    requiredEquipment: [
      'Dual precision physical pendulums with optical rotary encoders',
      'Coupling spring set with calibrated spring constants',
      'Electromagnetic damper with variable current control',
    ],
    instructions: [
      {
        step: 1,
        title: 'Decoupled Baseline Calibration',
        content: 'Measure the independent natural frequency omega_0 of each uncoupled pendulum.',
      },
    ],
    variables: [
      {
        id: 'couplingK',
        name: 'Spring Constant (k)',
        symbol: 'k',
        unit: 'N/m',
        min: 0.1,
        max: 5.0,
        step: 0.1,
        defaultValue: 1.0,
        description: 'Stiffness of the coupling helical spring.',
      },
    ],
    units: { frequency: 'Hz', time: 's', angle: 'rad' },
    observations: [
      { id: 'time', header: 'Time', symbol: 't', unit: 's', precision: 2 },
      { id: 'theta1', header: 'Angle 1', symbol: 'θ₁', unit: 'rad', precision: 3 },
      { id: 'theta2', header: 'Angle 2', symbol: 'θ₂', unit: 'rad', precision: 3 },
    ],
    calculations: [
      {
        id: 'beatFrequency',
        name: 'Beat Frequency',
        symbol: 'f_beat',
        unit: 'Hz',
        formulaDisplay: 'f_beat = |f_anti - f_sym|',
        description: 'Frequency of energy transfer envelope.',
        precision: 3,
      },
    ],
    theory: {
      summary: 'Coupled linear systems demonstrate normal mode decomposition and periodic energy transfer.',
      governingLaws: [
        {
          name: 'Coupled Equations of Motion',
          formula: 'm d²x₁/dt² = -k_o x₁ - k_c(x₁ - x₂)',
          description: 'Newtonian dynamical formulation for dual coupled point masses.',
        },
      ],
    },
  },
];
