import { IGameState } from 'game';
import {
	// prettier-ignore
	getCurrentChildren,
	setCurrentChildren,
} from 'game/models/units/children';
import {
	// prettier-ignore
	changeAmountOfCurrentIdles,
	getCurrentIdles,
} from 'game/models/units/idles';

export const populationIncreaseRule = (state: IGameState): IGameState => {
	const idles = getCurrentIdles(state);
	const newChildren = Math.floor(idles / 2);
	const children = getCurrentChildren(state);
	const newAdults = children;

	changeAmountOfCurrentIdles(newAdults)(state);
	setCurrentChildren(newChildren)(state);

	return state;
};
