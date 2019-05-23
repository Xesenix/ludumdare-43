import { IGameState } from 'game/store';

import { trainGuardsRule, trainWorkersRule } from 'game/actions/training';

export const reduceTrainUnits = (state: IGameState): IGameState => {
	trainGuardsRule(state);
	trainWorkersRule(state);

	return state;
};
