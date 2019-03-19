import pipeline from 'pipeline-operator';

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

export const reducePayGuards = (state: IGameState) => {
	const guards = getCurrentGuards(state);
	const resourcesAmount = getResourcesAmount(state);
	const guardsPaid = Math.min(guards, resourcesAmount);

	return pipeline(
		state,
		setCurrentGuards(guardsPaid),
		changeAmountOfCurrentIdles(guards - guardsPaid),
		useResources(guardsPaid),
	);
};
