import { getCurrentChildren, setCurrentChildren } from 'game/features/units/children';
import { getCurrentGuards } from 'game/features/units/guards';
import { getCurrentIdles, setCurrentIdles } from 'game/features/units/idles';
import { getMaxPopulation } from 'game/features/units/population';
import { getCurrentWorkers } from 'game/features/units/workers';
import { IGameState } from 'game/store';

export const reducePopulationLimit = (state: IGameState): IGameState => {
	const max = getMaxPopulation(state);
	const guards = getCurrentGuards(state);
	const children = getCurrentChildren(state);
	const idles = getCurrentIdles(state);
	const workers = getCurrentWorkers(state);
	const maxChildren = Math.min(max - workers - guards - idles, children);
	const maxIdles = Math.min(max - workers - guards - maxChildren, idles);

	setCurrentIdles(maxIdles)(state);
	setCurrentChildren(maxChildren)(state);

	return state;
};
