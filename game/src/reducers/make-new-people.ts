import pipeline from 'pipeline-operator';

import { getCurrentChildren, setCurrentChildren } from 'game/features/units/children';
import { changeAmountOfCurrentIdles, getCurrentIdles } from 'game/features/units/idles';
import { IGameState } from 'game/store';

export const reduceMakeNewPeople = (state: IGameState) => {
	const idles = getCurrentIdles(state);
	const newChildren = Math.floor(idles / 2);
	const children = getCurrentChildren(state);
	const newAdults = children;

	return pipeline(
		state,
		changeAmountOfCurrentIdles(newAdults),
		setCurrentChildren(newChildren),
	);
};
