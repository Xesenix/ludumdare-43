import { IGameState } from 'game';
import { getCurrentChildren, setCurrentChildren } from 'game/models/units/children';
import { getCurrentGuards } from 'game/models/units/guards';
import { getCurrentIdles, setCurrentIdles } from 'game/models/units/idles';
import { getMaxPopulation } from 'game/models/units/population';
import { getCurrentWorkers } from 'game/models/units/workers';

export const populationLimitRule = (state: IGameState): IGameState => {
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
