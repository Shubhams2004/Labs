/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ObservationColumn, ObservationRecord } from '../../models/experiment';
import { formatNumber, exportObservationsToCSV } from '../../utils/formatters';
import { Table, Download, Trash2, Database, AlertCircle } from 'lucide-react';

interface ObservationTableProps {
  columns: ObservationColumn[];
  records: ObservationRecord[];
  experimentTitle: string;
  onClearRecords: () => void;
  onDeleteRecord: (id: string) => void;
}

export const ObservationTable: React.FC<ObservationTableProps> = ({
  columns,
  records,
  experimentTitle,
  onClearRecords,
  onDeleteRecord,
}) => {
  const handleDownloadCSV = () => {
    if (records.length === 0) return;
    const csvContent = exportObservationsToCSV(columns, records, experimentTitle);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `${experimentTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_observations.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-700" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Measurements & Observation Table
          </h3>
          <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            {records.length} {records.length === 1 ? 'Trial' : 'Trials'} Logged
          </span>
        </div>

        {/* Table Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadCSV}
            disabled={records.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-white text-slate-700 border border-slate-300 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onClearRecords}
            disabled={records.length === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white hover:bg-rose-50 disabled:opacity-40 disabled:hover:bg-white text-rose-700 border border-slate-300 hover:border-rose-200 rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Trials</span>
          </button>
        </div>
      </div>

      {/* Observation Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-mono">
              <th className="py-2.5 px-4 font-semibold w-16">#</th>
              {columns.map((col) => (
                <th key={col.id} className="py-2.5 px-4 font-semibold whitespace-nowrap">
                  <span>{col.header}</span>
                  {col.unit && <span className="text-slate-400 font-normal ml-1">({col.unit})</span>}
                </th>
              ))}
              <th className="py-2.5 px-4 font-semibold w-12 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-mono">
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 2}
                  className="py-10 px-4 text-center text-slate-400 text-xs font-sans"
                >
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  No observation data logged yet. Adjust variables in the controls panel and click{' '}
                  <strong className="text-slate-600">"Record Measurement"</strong> to record experimental trials.
                </td>
              </tr>
            ) : (
              records.map((rec, idx) => (
                <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 text-slate-500 font-semibold">{rec.trialNumber}</td>
                  {columns.map((col) => {
                    const val = rec.values[col.id];
                    return (
                      <td key={col.id} className="py-2.5 px-4 text-slate-800 tabular-nums">
                        {val !== undefined ? formatNumber(val, col.precision) : '—'}
                      </td>
                    );
                  })}
                  <td className="py-2.5 px-4 text-center">
                    <button
                      onClick={() => onDeleteRecord(rec.id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete trial record"
                    >
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
