import pipeline from 'pipeline-operator';

import { changeAmountOfResources } from 'game/features/resources/resources';
import { getCurrentWorkers } from 'game/features/units/workers';
import { IGameState } from 'game/store';

export const reduceGatherResources = (state: IGameState) => {
	const workers = getCurrentWorkers(state);
	const resourceGathered = workers;

	return pipeline(
		state,
		changeAmountOfResources(resourceGathered),
	);
};
