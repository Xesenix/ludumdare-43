import pipeline from 'pipeline-operator';

import { IGameState } from 'game/store';

import { trainGuardsRule, trainWorkersRule } from 'game/actions/training';

export const reduceTrainUnits = (state: IGameState) =>
	pipeline(
		// prettier-ignore
		state,
		trainGuardsRule,
		trainWorkersRule,
	);
