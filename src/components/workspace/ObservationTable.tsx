/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ObservationColumn, ObservationRecord } from '../../models/experiment';
import { formatNumber, exportObservationsToCSV } from '../../utils/formatters';
import { Table, Download, Trash2, Database, AlertCircle, BookmarkCheck, Star } from 'lucide-react';

interface ObservationTableProps {
  columns: ObservationColumn[];
  records: ObservationRecord[];
  experimentTitle: string;
  onClearRecords: () => void;
  onDeleteRecord: (id: string) => void;
  selectedEndpointTrialId?: string | null;
  onSelectEndpointTrial?: (id: string) => void;
}

export const ObservationTable: React.FC<ObservationTableProps> = ({
  columns,
  records,
  experimentTitle,
  onClearRecords,
  onDeleteRecord,
  selectedEndpointTrialId,
  onSelectEndpointTrial,
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

  const getIndicatorAppearance = (val: number | undefined, record: ObservationRecord) => {
    if (record.indicatorLabel) return record.indicatorLabel;
    if (val === undefined || val === null) return '—';
    if (val === 0) return 'Colorless (Acidic)';
    if (val === 1) return 'Faint Pale Pink (Endpoint)';
    if (val === 2) return 'Distinct Pink';
    if (val === 3) return 'Dark Magenta (Alkaline)';
    return String(val);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Database className="w-4 h-4 text-blue-700" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Manual Measurements & Observation Table
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
              <th className="py-2.5 px-4 font-semibold">Observations & Notes</th>
              <th className="py-2.5 px-4 font-semibold text-center w-28">Endpoint</th>
              <th className="py-2.5 px-4 font-semibold w-12 text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-mono">
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 3}
                  className="py-10 px-4 text-center text-slate-400 text-xs font-sans"
                >
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                  No manual observation readings logged yet. Add titrant using the virtual burette and click{' '}
                  <strong className="text-slate-700">"Record Reading"</strong> to log each experimental measurement.
                </td>
              </tr>
            ) : (
              records.map((rec) => {
                const isCurrentEndpoint = selectedEndpointTrialId === rec.id || rec.isEndpointTrial;

                return (
                  <tr
                    key={rec.id}
                    className={`transition-colors ${
                      isCurrentEndpoint ? 'bg-amber-50/70 font-semibold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-2.5 px-4 text-slate-500 font-semibold flex items-center gap-1.5">
                      {isCurrentEndpoint && (
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
                      )}
                      <span>{rec.trialNumber}</span>
                    </td>

                    {columns.map((col) => {
                      const val = rec.values[col.id];

                      if (col.id === 'appearance') {
                        const appearanceText = getIndicatorAppearance(val, rec);
                        const isPink =
                          appearanceText.toLowerCase().includes('pink') ||
                          appearanceText.toLowerCase().includes('magenta') ||
                          val === 1 ||
                          val === 2 ||
                          val === 3;

                        return (
                          <td key={col.id} className="py-2.5 px-4 text-slate-800 whitespace-nowrap">
                            <span className="flex items-center gap-1.5 font-sans text-xs">
                              <span
                                className={`w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0 ${
                                  isPink ? 'bg-pink-400' : 'bg-white'
                                }`}
                              />
                              <span>{appearanceText}</span>
                            </span>
                          </td>
                        );
                      }

                      return (
                        <td key={col.id} className="py-2.5 px-4 text-slate-800 tabular-nums">
                          {val !== undefined ? formatNumber(val, col.precision) : '—'}
                        </td>
                      );
                    })}

                    {/* Notes & Tags Column */}
                    <td className="py-2.5 px-4 text-slate-600 font-sans text-xs">
                      {rec.notes ? (
                        <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
                          {rec.notes}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">—</span>
                      )}
                    </td>

                    {/* Endpoint Designation Action */}
                    <td className="py-2.5 px-4 text-center">
                      {onSelectEndpointTrial && (
                        <button
                          type="button"
                          onClick={() => onSelectEndpointTrial(rec.id)}
                          className={`text-[11px] px-2 py-1 rounded border font-sans transition-colors cursor-pointer ${
                            isCurrentEndpoint
                              ? 'bg-amber-100 border-amber-300 text-amber-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                          title="Designate this trial as the visual titration endpoint"
                        >
                          {isCurrentEndpoint ? 'Selected' : 'Set Endpoint'}
                        </button>
                      )}
                    </td>

                    {/* Delete row */}
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
