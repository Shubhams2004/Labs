/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ObservationColumn, ObservationRecord } from '../models/experiment';

/**
 * Formats a numeric value with specific decimal precision.
 */
export function formatNumber(value: number, precision: number = 2): string {
  if (value === undefined || value === null || isNaN(value)) {
    return '—';
  }
  if (Math.abs(value) > 0 && (Math.abs(value) < 0.001 || Math.abs(value) >= 100000)) {
    return value.toExponential(precision);
  }
  return value.toFixed(precision);
}

/**
 * Formats a measurement with its unit, e.g. "25.00 mL".
 */
export function formatMeasurement(value: number, unit: string, precision: number = 2): string {
  const formatted = formatNumber(value, precision);
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Generates CSV string from observation records.
 */
export function exportObservationsToCSV(
  columns: ObservationColumn[],
  records: ObservationRecord[],
  experimentTitle: string
): string {
  const headerRow = ['Trial', ...columns.map((c) => `${c.header} (${c.unit})`)].join(',');
  const rows = records.map((record) => {
    const values = columns.map((col) => {
      const val = record.values[col.id];
      return val !== undefined ? val.toFixed(col.precision) : '';
    });
    return [record.trialNumber, ...values].join(',');
  });

  return [
    `# Labs - Virtual Science Laboratory`,
    `# Experiment: ${experimentTitle}`,
    `# Export Date: ${new Date().toISOString()}`,
    headerRow,
    ...rows,
  ].join('\n');
}
