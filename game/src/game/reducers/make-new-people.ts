import {
	// prettier-ignore
	getCurrentChildren,
	setCurrentChildren,
} from 'game/features/units/children';
import {
	// prettier-ignore
	changeAmountOfCurrentIdles,
	getCurrentIdles,
} from 'game/features/units/idles';
import { IGameState } from 'game/store';

export const reduceMakeNewPeople = (state: IGameState): IGameState => {
	const idles = getCurrentIdles(state);
	const newChildren = Math.floor(idles / 2);
	const children = getCurrentChildren(state);
	const newAdults = children;

	changeAmountOfCurrentIdles(newAdults)(state);
	setCurrentChildren(newChildren)(state);

	return state;
};
