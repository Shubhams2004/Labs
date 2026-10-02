/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ElectrochemistryCalculationInput {
  standardEmfV: number;
  anodeConcM: number;
  cathodeConcM: number;
  electronsTransferred: number;
  temperatureK: number;
}

export function calculateCellPotential(input: ElectrochemistryCalculationInput): {
  cellPotentialV: number;
  reactionQuotientQ: number;
  deltaGJ: number;
} {
  const { standardEmfV, anodeConcM, cathodeConcM, electronsTransferred, temperatureK } = input;
  const R = 8.314; // J/(mol*K)
  const F = 96485; // C/mol

  const Q = anodeConcM / Math.max(cathodeConcM, 1e-12);
  const nernstOffset = ((R * temperatureK) / (electronsTransferred * F)) * Math.log(Q);
  const cellPotentialV = standardEmfV - nernstOffset;
  const deltaGJ = -electronsTransferred * F * cellPotentialV;

  return {
    cellPotentialV,
    reactionQuotientQ: Q,
    deltaGJ,
  };
}
