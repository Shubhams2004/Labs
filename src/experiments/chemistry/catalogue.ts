/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Experiment } from '../../models/experiment';
import { ACID_BASE_TITRATION_EXPERIMENT } from './titration';
import { REACTION_KINETICS_EXPERIMENT } from './kinetics';
import { CHEMICAL_EQUILIBRIUM_EXPERIMENT } from './equilibrium';
import { ELECTROCHEMISTRY_EXPERIMENT } from './electrochemistry';
import { THERMOCHEMISTRY_EXPERIMENT } from './thermochemistry';

export const CHEMISTRY_EXPERIMENTS_CATALOGUE: Experiment[] = [
  ACID_BASE_TITRATION_EXPERIMENT,
  REACTION_KINETICS_EXPERIMENT,
  CHEMICAL_EQUILIBRIUM_EXPERIMENT,
  ELECTROCHEMISTRY_EXPERIMENT,
  THERMOCHEMISTRY_EXPERIMENT,
];

export function getChemistryExperimentById(id: string): Experiment | undefined {
  return CHEMISTRY_EXPERIMENTS_CATALOGUE.find((exp) => exp.id === id);
}
