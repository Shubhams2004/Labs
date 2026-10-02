/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Subject = 'Chemistry' | 'Physics';

export type Difficulty = 'Introductory' | 'Intermediate' | 'Advanced';

export type ExperimentStatus = 'available' | 'coming-soon';

export interface ParameterDefinition {
  id: string;
  name: string;
  symbol?: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  description: string;
  category?: 'reagent' | 'environment' | 'apparatus' | 'general';
}

export interface ObservationColumn {
  id: string;
  header: string;
  symbol?: string;
  unit: string;
  precision: number;
  isIndependent?: boolean;
}

export interface ObservationRecord {
  id: string;
  timestamp: number;
  trialNumber: number;
  values: Record<string, number>;
  notes?: string;
}

export interface CalculationMetricDefinition {
  id: string;
  name: string;
  symbol?: string;
  unit: string;
  formulaTex?: string;
  formulaDisplay: string;
  description: string;
  precision: number;
}

export interface InstructionStep {
  step: number;
  title: string;
  content: string;
  caution?: string;
}

export interface TheoryReference {
  summary: string;
  governingLaws: {
    name: string;
    formula: string;
    description: string;
  }[];
  references?: string[];
}

export interface ExperimentGraphConfig {
  xAxis: {
    columnId: string;
    label: string;
    unit: string;
    min?: number;
    max?: number;
  };
  yAxis: {
    columnId: string;
    label: string;
    unit: string;
    min?: number;
    max?: number;
  };
  theoreticalCurveLabel?: string;
}

export interface Experiment {
  id: string;
  title: string;
  subject: Subject;
  category: string;
  description: string;
  difficulty: Difficulty;
  learningObjectives: string[];
  requiredEquipment: string[];
  instructions: InstructionStep[];
  variables: ParameterDefinition[];
  units: Record<string, string>;
  observations: ObservationColumn[];
  calculations: CalculationMetricDefinition[];
  theory: TheoryReference;
  status: ExperimentStatus;
  graphConfig?: ExperimentGraphConfig;
  estimatedDurationMinutes?: number;
}
