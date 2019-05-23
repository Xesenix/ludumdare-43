import {
	// prettier-ignore
	getResourcesAmount,
	useResources,
} from 'game/features/resources/resources';
import {
	// prettier-ignore
	getCurrentGuards,
	setCurrentGuards,
} from 'game/features/units/guards';
import { changeAmountOfCurrentIdles } from 'game/features/units/idles';
import { IGameState } from 'game/store';

export const reducePayGuards = (state: IGameState): IGameState => {
	const guards = getCurrentGuards(state);
	const resourcesAmount = getResourcesAmount(state);
	const guardsPaid = Math.min(guards, resourcesAmount);

	setCurrentGuards(guardsPaid)(state);
	changeAmountOfCurrentIdles(guards - guardsPaid)(state);
	useResources(guardsPaid)(state);

	return state;
};
