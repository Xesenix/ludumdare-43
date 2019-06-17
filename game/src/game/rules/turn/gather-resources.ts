import { IGameState } from 'game';
import { changeAmountOfResources } from 'game/models/resources/resources';
import { getCurrentWorkers } from 'game/models/units/workers';

export const gatherResourcesRule = (state: IGameState): IGameState => {
	const workers = getCurrentWorkers(state);
	const resourceGathered = workers;

	changeAmountOfResources(resourceGathered)(state);

	return state;
};
