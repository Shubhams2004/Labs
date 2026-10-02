/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface KineticsCalculationInput {
  initialConcA: number; // M
  initialConcB: number; // M
  temperatureK: number; // K
  elapsedTimeSec: number; // s
  orderM?: number;
  orderN?: number;
  activationEnergyJ?: number;
}

export function calculateRateConstant(temperatureK: number, activationEnergyJ: number = 48000): number {
  const R = 8.314; // J/(mol*K)
  const A = 2.4e6; // Frequency factor
  return A * Math.exp(-activationEnergyJ / (R * temperatureK));
}

export function calculateInstantaneousConcentration(
  initialConc: number,
  k: number,
  elapsedTimeSec: number
): number {
  // First-order decay: [A] = [A]0 * e^(-k*t)
  return initialConc * Math.exp(-k * elapsedTimeSec);
}
