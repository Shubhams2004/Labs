/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ThermochemistryCalculationInput {
  massSolutionG: number;
  specificHeatJgK: number;
  calorimeterConstantJK: number;
  deltaTK: number;
  molesReacted: number;
}

export function calculateEnthalpyOfReaction(input: ThermochemistryCalculationInput): {
  heatJoules: number;
  deltaHKjMol: number;
} {
  const { massSolutionG, specificHeatJgK, calorimeterConstantJK, deltaTK, molesReacted } = input;
  // q_solution + q_calorimeter
  const qSoln = massSolutionG * specificHeatJgK * deltaTK;
  const qCal = calorimeterConstantJK * deltaTK;
  const heatJoules = -(qSoln + qCal);
  const deltaHKjMol = molesReacted > 0 ? (heatJoules / molesReacted) / 1000 : 0;

  return {
    heatJoules,
    deltaHKjMol,
  };
}
