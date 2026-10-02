/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EquilibriumCalculationInput {
  initialFeConcM: number;
  initialScnConcM: number;
  temperatureK: number;
}

export function calculateEquilibriumConcentrations(input: EquilibriumCalculationInput): {
  eqFeConcM: number;
  eqScnConcM: number;
  eqComplexConcM: number;
  Kc: number;
} {
  const standardKc = 138.0; // Iron-thiocyanate formation constant at 298 K
  const { initialFeConcM, initialScnConcM } = input;
  // Solving Kc = x / ((Fe0 - x)(Scn0 - x)) => Kc*x^2 - (Kc*(Fe0+Scn0) + 1)*x + Kc*Fe0*Scn0 = 0
  const a = standardKc;
  const b = -(standardKc * (initialFeConcM + initialScnConcM) + 1);
  const c = standardKc * initialFeConcM * initialScnConcM;

  const discriminant = b * b - 4 * a * c;
  const x = (-b - Math.sqrt(Math.max(0, discriminant))) / (2 * a);

  return {
    eqFeConcM: Math.max(0, initialFeConcM - x),
    eqScnConcM: Math.max(0, initialScnConcM - x),
    eqComplexConcM: Math.max(0, x),
    Kc: standardKc,
  };
}
