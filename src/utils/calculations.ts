/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Common statistical and mathematical functions for scientific data analysis.
 * Kept completely decoupled from UI components.
 */

export interface LinearRegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
}

/**
 * Calculates mean of an array of numbers.
 */
export function calculateMean(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

/**
 * Calculates sample standard deviation.
 */
export function calculateStandardDeviation(values: number[]): number {
  if (values.length <= 1) return 0;
  const mean = calculateMean(values);
  const variance =
    values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (values.length - 1);
  return Math.sqrt(variance);
}

/**
 * Fits a line y = mx + b using least-squares linear regression.
 */
export function calculateLinearRegression(
  points: { x: number; y: number }[]
): LinearRegressionResult {
  if (points.length < 2) {
    return { slope: 0, intercept: 0, rSquared: 0 };
  }

  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;
  let sumYY = 0;

  for (const pt of points) {
    sumX += pt.x;
    sumY += pt.y;
    sumXY += pt.x * pt.y;
    sumXX += pt.x * pt.x;
    sumYY += pt.y * pt.y;
  }

  const denominator = n * sumXX - sumX * sumX;
  if (Math.abs(denominator) < 1e-12) {
    return { slope: 0, intercept: sumY / n, rSquared: 0 };
  }

  const slope = (n * sumXY - sumX * sumY) / denominator;
  const intercept = (sumY - slope * sumX) / n;

  // Compute R^2
  const yMean = sumY / n;
  let ssTot = 0;
  let ssRes = 0;
  for (const pt of points) {
    const yPred = slope * pt.x + intercept;
    ssTot += Math.pow(pt.y - yMean, 2);
    ssRes += Math.pow(pt.y - yPred, 2);
  }

  const rSquared = ssTot > 0 ? Math.max(0, 1 - ssRes / ssTot) : 1;

  return { slope, intercept, rSquared };
}
