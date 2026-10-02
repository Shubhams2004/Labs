/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ObservationColumn, ObservationRecord, ExperimentGraphConfig } from '../../models/experiment';
import { calculateLinearRegression } from '../../utils/calculations';
import { formatNumber } from '../../utils/formatters';
import { LineChart, TrendingUp, SlidersHorizontal, Activity } from 'lucide-react';
import { calculateChemicalState } from '../../experiments/chemistry/titration/calculations';

interface DataAnalysisGraphProps {
  columns: ObservationColumn[];
  records: ObservationRecord[];
  graphConfig?: ExperimentGraphConfig;
  experimentId?: string;
}

export const DataAnalysisGraph: React.FC<DataAnalysisGraphProps> = ({
  columns,
  records,
  graphConfig,
  experimentId,
}) => {
  // Default to graphConfig or first two numeric columns
  const defaultX = graphConfig?.xAxis.columnId || (columns[0] ? columns[0].id : '');
  const defaultY =
    graphConfig?.yAxis.columnId || (columns[1] ? columns[1].id : columns[0] ? columns[0].id : '');

  const [xColId, setXColId] = useState<string>(defaultX);
  const [yColId, setYColId] = useState<string>(defaultY);
  const [showConnectLine, setShowConnectLine] = useState<boolean>(true);
  const [showTheoretical, setShowTheoretical] = useState<boolean>(true);
  const [showRegression, setShowRegression] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; trial: number } | null>(
    null
  );

  const xCol = columns.find((c) => c.id === xColId);
  const yCol = columns.find((c) => c.id === yColId);

  // Extract valid (x, y) data points from observation records, sorted by x
  const dataPoints = useMemo(() => {
    return records
      .map((r) => {
        const x = r.values[xColId];
        const y = r.values[yColId];
        return {
          x,
          y,
          trial: r.trialNumber,
        };
      })
      .filter((p) => p.x !== undefined && p.y !== undefined && !isNaN(p.x) && !isNaN(p.y))
      .sort((a, b) => a.x - b.x);
  }, [records, xColId, yColId]);

  // Compute linear regression on observed points
  const regression = useMemo(() => {
    return calculateLinearRegression(dataPoints);
  }, [dataPoints]);

  // Determine coordinate axis scales
  const bounds = useMemo(() => {
    // For Titration (volume vs pH), standard domain is 0 to 50 mL and 0 to 14 pH
    if (xColId === 'volume' && yColId === 'pH') {
      return { minX: 0, maxX: 50, minY: 0, maxY: 14 };
    }

    if (dataPoints.length === 0) {
      return {
        minX: graphConfig?.xAxis.min ?? 0,
        maxX: graphConfig?.xAxis.max ?? 10,
        minY: graphConfig?.yAxis.min ?? 0,
        maxY: graphConfig?.yAxis.max ?? 10,
      };
    }
    const xVals = dataPoints.map((p) => p.x);
    const yVals = dataPoints.map((p) => p.y);

    const minX = Math.min(...xVals);
    const maxX = Math.max(...xVals);
    const minY = Math.min(...yVals);
    const maxY = Math.max(...yVals);

    const padX = (maxX - minX) * 0.1 || 1;
    const padY = (maxY - minY) * 0.1 || 1;

    return {
      minX: Math.max(0, minX - padX),
      maxX: maxX + padX,
      minY: Math.max(0, minY - padY),
      maxY: maxY + padY,
    };
  }, [dataPoints, xColId, yColId, graphConfig]);

  const mapToSvg = (x: number, y: number) => {
    const svgWidth = 600;
    const svgHeight = 260;
    const margin = { top: 25, right: 30, bottom: 45, left: 60 };

    const plotWidth = svgWidth - margin.left - margin.right;
    const plotHeight = svgHeight - margin.top - margin.bottom;

    const spanX = bounds.maxX - bounds.minX || 1;
    const spanY = bounds.maxY - bounds.minY || 1;

    const svgX = margin.left + ((x - bounds.minX) / spanX) * plotWidth;
    const svgY = margin.top + plotHeight - ((y - bounds.minY) / spanY) * plotHeight;

    return { svgX, svgY };
  };

  // Pre-generate smooth theoretical curve points for titration
  const theoreticalPoints = useMemo(() => {
    if (xColId !== 'volume' || yColId !== 'pH') return [];
    const pts: { x: number; y: number }[] = [];
    for (let v = 0; v <= 50; v += 0.25) {
      const state = calculateChemicalState({
        analyteVolumeMl: 25.0,
        analyteConcentrationM: 0.1,
        titrantVolumeMl: v,
        titrantConcentrationM: 0.1,
      });
      pts.push({ x: v, y: state.pH });
    }
    return pts;
  }, [xColId, yColId]);

  // Generate SVG polyline path strings
  const observationPolylinePoints = useMemo(() => {
    return dataPoints.map((p) => {
      const { svgX, svgY } = mapToSvg(p.x, p.y);
      return `${svgX},${svgY}`;
    }).join(' ');
  }, [dataPoints, bounds]);

  const theoreticalPolylinePoints = useMemo(() => {
    return theoreticalPoints.map((p) => {
      const { svgX, svgY } = mapToSvg(p.x, p.y);
      return `${svgX},${svgY}`;
    }).join(' ');
  }, [theoreticalPoints, bounds]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Top Header & Axis Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <LineChart className="w-4 h-4 text-blue-700" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Graphs & Data Analysis
          </h3>
          <span className="text-xs font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
            {dataPoints.length} Data Points Plotted
          </span>
        </div>

        {/* Axis Column Selectors & Toggles */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span>X-Axis:</span>
            <select
              value={xColId}
              onChange={(e) => setXColId(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.header} {col.unit ? `(${col.unit})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-slate-600">
            <span>Y-Axis:</span>
            <select
              value={yColId}
              onChange={(e) => setYColId(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {columns.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.header} {col.unit ? `(${col.unit})` : ''}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-1 text-slate-600 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={showConnectLine}
              onChange={(e) => setShowConnectLine(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
            />
            <span>Connect Observations</span>
          </label>

          {theoreticalPoints.length > 0 && (
            <label className="flex items-center gap-1 text-slate-600 font-medium cursor-pointer">
              <input
                type="checkbox"
                checked={showTheoretical}
                onChange={(e) => setShowTheoretical(e.target.checked)}
                className="rounded text-slate-600 focus:ring-slate-500 h-3.5 w-3.5"
              />
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-slate-400 inline-block border-t border-dashed border-slate-400" />
                <span>Theoretical Curve</span>
              </span>
            </label>
          )}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="p-6">
        <div className="relative w-full h-80 bg-slate-950 rounded-xl p-2 overflow-hidden border border-slate-800 select-none">
          <svg
            className="w-full h-full"
            viewBox="0 0 600 260"
            preserveAspectRatio="none"
          >
            {/* Coordinate Grid */}
            <defs>
              <pattern id="chart-grid" width="30" height="25" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 25" fill="none" stroke="#1E293B" strokeWidth="1" />
              </pattern>
            </defs>
            <rect x="60" y="25" width="510" height="190" fill="url(#chart-grid)" />

            {/* Equivalence Marker at V = 25 mL */}
            {xColId === 'volume' && (
              <g>
                {(() => {
                  const { svgX } = mapToSvg(25.0, 7.0);
                  return (
                    <line
                      x1={svgX}
                      y1="25"
                      x2={svgX}
                      y2="215"
                      stroke="#475569"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  );
                })()}
              </g>
            )}

            {/* Axes Lines */}
            <line x1="60" y1="215" x2="570" y2="215" stroke="#64748B" strokeWidth="1.5" />
            <line x1="60" y1="25" x2="60" y2="215" stroke="#64748B" strokeWidth="1.5" />

            {/* Axis Tick Labels */}
            <text x="60" y="232" fill="#94A3B8" fontSize="10" fontFamily="monospace">
              {formatNumber(bounds.minX, 0)}
            </text>
            <text x="315" y="232" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="middle">
              {formatNumber((bounds.minX + bounds.maxX) / 2, 0)}
            </text>
            <text x="570" y="232" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">
              {formatNumber(bounds.maxX, 0)}
            </text>

            <text x="52" y="218" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">
              {formatNumber(bounds.minY, 0)}
            </text>
            <text x="52" y="123" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">
              {formatNumber((bounds.minY + bounds.maxY) / 2, 0)}
            </text>
            <text x="52" y="32" fill="#94A3B8" fontSize="10" fontFamily="monospace" textAnchor="end">
              {formatNumber(bounds.maxY, 0)}
            </text>

            {/* Prominent Clear Axis Titles */}
            <text
              x="315"
              y="252"
              fill="#E2E8F0"
              fontSize="11"
              fontFamily="sans-serif"
              fontWeight="bold"
              textAnchor="middle"
            >
              Volume of NaOH added (mL)
            </text>

            <text
              x="-120"
              y="22"
              fill="#E2E8F0"
              fontSize="11"
              fontFamily="sans-serif"
              fontWeight="bold"
              textAnchor="middle"
              transform="rotate(-90)"
            >
              pH
            </text>

            {/* Theoretical Reference Sigmoid Curve */}
            {showTheoretical && theoreticalPoints.length > 0 && (
              <polyline
                points={theoreticalPolylinePoints}
                fill="none"
                stroke="#64748B"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.85"
              />
            )}

            {/* Connected Experimental Observation Line */}
            {showConnectLine && dataPoints.length >= 2 && (
              <polyline
                points={observationPolylinePoints}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Plotted Data Points */}
            {dataPoints.map((pt, i) => {
              const { svgX, svgY } = mapToSvg(pt.x, pt.y);
              return (
                <g key={i}>
                  <circle
                    cx={svgX}
                    cy={svgY}
                    r="5.5"
                    fill="#0284C7"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-8 transition-all"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Hover Coordinate HUD Tooltip */}
          {hoveredPoint && (
            <div className="absolute top-4 right-4 bg-slate-900/95 border border-slate-700 px-3 py-1.5 rounded-lg text-xs font-mono text-white shadow-xl pointer-events-none">
              <span className="text-blue-400 font-bold">Trial #{hoveredPoint.trial}</span>: (V ={' '}
              {formatNumber(hoveredPoint.x, 2)} mL, pH = {formatNumber(hoveredPoint.y, 2)})
            </div>
          )}

          {dataPoints.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 font-mono text-xs p-4 text-center">
              <Activity className="w-6 h-6 mb-2 text-slate-600" />
              <span>No measurements recorded yet.</span>
              <span className="text-[11px] text-slate-600 mt-1">
                Dispense NaOH using the burette controls and click "Record Measurement" to generate the curve.
              </span>
            </div>
          )}
        </div>

        {/* Legend Ribbon beneath graph */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-600 px-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-sky-500 border border-white" />
              <span>Recorded Observations</span>
            </div>
            {theoreticalPoints.length > 0 && (
              <div className="flex items-center gap-1.5 text-slate-500">
                <span className="w-4 h-0.5 bg-slate-400 border-t border-dashed border-slate-400" />
                <span>Theoretical Neutralization Model</span>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500">
            Domain: 0.00 – 50.00 mL · Scale: pH 0.00 – 14.00
          </div>
        </div>
      </div>
    </div>
  );
};
