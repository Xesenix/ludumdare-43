import { IGameState } from 'game';
import {
	// prettier-ignore
	getResourcesAmount,
	useResources,
} from 'game/models/resources/resources';
import {
	// prettier-ignore
	getCurrentGuards,
	setCurrentGuards,
} from 'game/models/units/guards';
import { changeAmountOfCurrentIdles } from 'game/models/units/idles';

export const guardsUpkeepRule = (state: IGameState): IGameState => {
	const guards = getCurrentGuards(state);
	const resourcesAmount = getResourcesAmount(state);
	const guardsPaid = Math.min(guards, resourcesAmount);

	setCurrentGuards(guardsPaid)(state);
	changeAmountOfCurrentIdles(guards - guardsPaid)(state);
	useResources(guardsPaid)(state);

	return state;
};
