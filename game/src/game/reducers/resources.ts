import { changeAmountOfResources } from 'game/features/resources/resources';
import { getCurrentWorkers } from 'game/features/units/workers';
import { IGameState } from 'game/store';

export const reduceGatherResources = (state: IGameState): IGameState => {
	const workers = getCurrentWorkers(state);
	const resourceGathered = workers;

	changeAmountOfResources(resourceGathered)(state);

	return state;
};
