/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Experiment, ObservationRecord } from '../../models/experiment';
import { ExperimentHeader } from './ExperimentHeader';
import { LabApparatusArea } from './LabApparatusArea';
import { ParameterControlPanel } from './ParameterControlPanel';
import { ObservationTable } from './ObservationTable';
import { DataAnalysisGraph } from './DataAnalysisGraph';
import { CalculationResults } from './CalculationResults';
import { InstructionsDrawer } from './InstructionsDrawer';
import { TitrationApparatus } from '../../experiments/chemistry/titration/TitrationApparatus';
import { TitrationAnalysisSection } from '../../experiments/chemistry/titration/TitrationAnalysisSection';
import {
  calculateChemicalState,
  analyzeObservationResults,
  ChemicalStateResult,
  EquivalenceAnalysisResult,
} from '../../experiments/chemistry/titration/calculations';

interface ExperimentWorkspaceProps {
  experiment: Experiment;
  onBackToCatalogue: () => void;
}

export const ExperimentWorkspace: React.FC<ExperimentWorkspaceProps> = ({
  experiment,
  onBackToCatalogue,
}) => {
  // Initialize parameters from experiment definition
  const initialParams = useMemo(() => {
    const map: Record<string, number> = {};
    for (const v of experiment.variables) {
      map[v.id] = v.defaultValue;
    }
    return map;
  }, [experiment]);

  const [parameters, setParameters] = useState<Record<string, number>>(initialParams);
  const [records, setRecords] = useState<ObservationRecord[]>([]);
  const [activeModal, setActiveModal] = useState<'instructions' | 'theory' | null>(null);

  // Titrant volume specifically tracked for interactive additions
  const currentTitrantVolume = parameters['titrantVolume'] ?? 0.0;
  const currentAnalyteVolume = parameters['analyteVolume'] ?? 25.0;
  const currentTitrantConc = parameters['titrantConcentration'] ?? 0.1;
  const currentAnalyteConc = parameters['analyteConcentration'] ?? 0.1;

  // Compute calculated chemical state via the pure chemistry engine
  const chemicalState: ChemicalStateResult = useMemo(() => {
    if (experiment.id === 'acid-base-titration') {
      return calculateChemicalState({
        analyteVolumeMl: currentAnalyteVolume,
        analyteConcentrationM: currentAnalyteConc,
        titrantVolumeMl: currentTitrantVolume,
        titrantConcentrationM: currentTitrantConc,
        temperatureC: 25.0,
      });
    }

    // Default neutral fallback for non-titration experiments
    return calculateChemicalState({
      analyteVolumeMl: 25.0,
      analyteConcentrationM: 0.1,
      titrantVolumeMl: 0.0,
      titrantConcentrationM: 0.1,
    });
  }, [
    experiment.id,
    currentAnalyteVolume,
    currentAnalyteConc,
    currentTitrantVolume,
    currentTitrantConc,
  ]);

  // Derived observation points for equivalence analysis
  const simplifiedObservations = useMemo(() => {
    return records
      .map((r) => ({
        volume: r.values['volume'],
        pH: r.values['pH'],
      }))
      .filter((p) => p.volume !== undefined && p.pH !== undefined);
  }, [records]);

  // Equivalence Analysis result
  const analysisResult: EquivalenceAnalysisResult = useMemo(() => {
    return analyzeObservationResults(
      simplifiedObservations,
      currentAnalyteVolume,
      currentAnalyteConc,
      currentTitrantConc
    );
  }, [simplifiedObservations, currentAnalyteVolume, currentAnalyteConc, currentTitrantConc]);

  // Derived calculation metrics
  const calculatedMetrics = useMemo(() => {
    const results: Record<string, number> = {};

    results['molesHcl'] = chemicalState.molesHclInitial;
    results['molesNaoh'] = chemicalState.molesNaohAdded;
    results['theoreticalVeq'] = chemicalState.theoreticalEquivalenceVolumeMl;
    results['derivedConcentration'] =
      analysisResult.estimatedAnalyteConcentrationM ?? currentAnalyteConc;

    return results;
  }, [chemicalState, analysisResult, currentAnalyteConc]);

  // Parameter updates
  const handleParameterChange = (paramId: string, value: number) => {
    setParameters((prev) => ({
      ...prev,
      [paramId]: value,
    }));
  };

  // Add incremental titrant (fine or rapid)
  const handleAddTitrant = (deltaMl: number) => {
    setParameters((prev) => {
      const current = prev['titrantVolume'] ?? 0;
      const nextVal = Math.min(50.0, Math.max(0, current + deltaMl));
      return {
        ...prev,
        titrantVolume: parseFloat(nextVal.toFixed(2)),
      };
    });
  };

  const handleSetTitrantVolume = (volumeMl: number) => {
    setParameters((prev) => ({
      ...prev,
      titrantVolume: Math.min(50.0, Math.max(0, parseFloat(volumeMl.toFixed(2)))),
    }));
  };

  // Reset to default parameter values
  const handleResetDefaults = () => {
    setParameters(initialParams);
  };

  // Reset entire experiment
  const handleResetExperiment = () => {
    setParameters(initialParams);
    setRecords([]);
  };

  // Record an observation to the table
  const handleRecordMeasurement = () => {
    const newRecordId = `rec-${Date.now()}`;
    const trialNumber = records.length + 1;
    const values: Record<string, number> = {};

    values['volume'] = currentTitrantVolume;
    values['pH'] = parseFloat(chemicalState.pH.toFixed(2));
    values['buretteReading'] = currentTitrantVolume;
    values['flaskVolume'] = currentAnalyteVolume + currentTitrantVolume;
    values['appearance'] =
      chemicalState.pH >= 10.0 ? 3 : chemicalState.pH >= 8.7 ? 2 : chemicalState.pH >= 8.2 ? 1 : 0;

    setRecords((prev) => [
      ...prev,
      {
        id: newRecordId,
        timestamp: Date.now(),
        trialNumber,
        values,
      },
    ]);
  };

  const handleDeleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClearRecords = () => {
    setRecords([]);
  };

  return (
    <div className="min-h-screen bg-slate-100/60 pb-20 flex flex-col">
      {/* Workspace Header: Title, Description, Objectives, Global Actions */}
      <ExperimentHeader
        experiment={experiment}
        onReset={handleResetExperiment}
        onBackToCatalogue={onBackToCatalogue}
        onToggleInstructions={() => setActiveModal('instructions')}
        onToggleTheory={() => setActiveModal('theory')}
        isInstructionsOpen={activeModal === 'instructions'}
        isTheoryOpen={activeModal === 'theory'}
      />

      {/* Main Experiment Layout Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6 flex-1 w-full">
        {/* Upper Split Stage: Laboratory Workspace (Left) | Controls & Parameters (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7">
            {experiment.id === 'acid-base-titration' ? (
              <TitrationApparatus
                chemicalState={chemicalState}
                analyteVolumeMl={currentAnalyteVolume}
                titrantVolumeMl={currentTitrantVolume}
                titrantConcentrationM={currentTitrantConc}
                analyteConcentrationM={currentAnalyteConc}
                onAddTitrant={handleAddTitrant}
                onSetTitrantVolume={handleSetTitrantVolume}
                onResetTitration={() => handleSetTitrantVolume(0.0)}
                onRecordObservation={handleRecordMeasurement}
              />
            ) : (
              <LabApparatusArea
                experiment={experiment}
                parameterValues={parameters}
              />
            )}
          </div>

          <div className="lg:col-span-5">
            <ParameterControlPanel
              variables={experiment.variables}
              values={parameters}
              onChange={handleParameterChange}
              onResetDefaults={handleResetDefaults}
              onRecordMeasurement={handleRecordMeasurement}
            />
          </div>
        </div>

        {/* Lower Stack: Observations Table */}
        <div>
          <ObservationTable
            columns={experiment.observations}
            records={records}
            experimentTitle={experiment.title}
            onClearRecords={handleClearRecords}
            onDeleteRecord={handleDeleteRecord}
          />
        </div>

        {/* Lower Stack: Graphs & Data Analysis */}
        <div>
          <DataAnalysisGraph
            columns={experiment.observations}
            records={records}
            graphConfig={experiment.graphConfig}
            experimentId={experiment.id}
          />
        </div>

        {/* Result Analysis Section (Active for Acid-Base Titration) */}
        {experiment.id === 'acid-base-titration' && (
          <div>
            <TitrationAnalysisSection
              analysis={analysisResult}
              chemicalState={chemicalState}
            />
          </div>
        )}

        {/* Lower Stack: Calculations & Results */}
        <div>
          <CalculationResults
            calculations={experiment.calculations}
            results={calculatedMetrics}
          />
        </div>
      </div>

      {/* Auxiliary Instructions / Theory Modal Drawer */}
      {activeModal && (
        <InstructionsDrawer
          experiment={experiment}
          mode={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};
