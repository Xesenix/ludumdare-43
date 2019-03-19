import { cloneDeep } from 'lodash';
import pipeline from 'pipeline-operator';

import {
	// prettier-ignore
	changeAmountOfResources,
	changeAmountOfResourcesStolenInLastTurn,
	changeAmountOfResourcesStolenInTotal,
} from 'game/features/resources/resources';
import { IGameState } from 'game/store';

const tap = (cb: (st: IGameState) => void) => (state: IGameState) => {
	cb(state);
	return state;
};

export const stealResources = (amount: number) => (state: IGameState) => pipeline(
	cloneDeep(state),
	changeAmountOfResources(-amount),
	changeAmountOfResourcesStolenInLastTurn(amount),
	changeAmountOfResourcesStolenInTotal(amount),
	tap((newState: IGameState) => console.log(`stealResources: ${amount}`, state.resources, newState.resources)),
);
