import pipeline from 'pipeline-operator';

import {
	changeAmountOf,
	get,
	set,
} from 'game/data';
import { IGameState } from 'game/store';

// === RESOURCES_AMOUNT

export const getResourcesAmount = get<number>('resources', 'amount');
export const setResourcesAmount = set<number>('resources', 'amount');
export const changeAmountOfResourcesAmount = changeAmountOf('resources', 'amount');

// === RESOURCES_RESERVED

export const getResourcesReserved = get<number>('resources', 'reserved');
export const setResourcesReserved = set<number>('resources', 'reserved');
export const changeAmountOfResourcesReserved = changeAmountOf('resources', 'reserved');

// === RESOURCES_USED

export const getResourcesUsed = get<number>('resources', 'used');
export const setResourcesUsed = set<number>('resources', 'used');
export const changeAmountOfResourcesUsed = changeAmountOf('resources', 'used');

export const reserveResources = (amount: number) => (state: IGameState) => {
	return changeAmountOfResourcesReserved(amount)(state);
};

export const payResources = (amount: number) => (state: IGameState) => {
	return pipeline(
		state,
		changeAmountOfResourcesAmount(-amount),
		changeAmountOfResourcesUsed(amount),
		changeAmountOfResourcesReserved(-amount),
	);
};
