import pipeline from 'pipeline-operator';

import {
	// prettier-ignore
	changeAmountOf,
	get,
	set,
} from 'game/data';
import { IGameState } from 'game/store';

// === RESOURCES_AMOUNT

export const getResourcesAmount = get<number>('resources.amount', 0);
export const setResourcesAmount = set<number>('resources.amount');
export const changeAmountOfResources = changeAmountOf('resources.amount');

// === RESOURCES_RESERVED

export const getReservedResources = get<number>('resources.reserved', 0);
export const setResourcesReserved = set<number>('resources.reserved');
export const changeAmountOfReservedResources = changeAmountOf('resources.reserved');

// === RESOURCES_USED_IN_LAST_TURN

export const getResourcesUsedInLastTurn = get<number>('resources.used.current', 0);
export const setResourcesUsedInLastTurn = set<number>('resources.used.current');
export const changeAmountOfResourcesUsedInLastTurn = changeAmountOf('resources.used.current');

// === RESOURCES_USED_IN_TOTAL

export const getResourcesUsedInTotal = get<number>('resources.used.total', 0);
export const setResourcesUsedInTotal = set<number>('resources.used.total');
export const changeAmountOfResourcesUsedInTotal = changeAmountOf('resources.used.total');

// === RESOURCES_STOLEN_IN_LAST_TURN

export const getResourcesStolenInLastTurn = get<number>('resources.stolen.current', 0);
export const setResourcesStolenInLastTurn = set<number>('resources.stolen.current');
export const changeAmountOfResourcesStolenInLastTurn = changeAmountOf('resources.stolen.current');

// === RESOURCES_STOLEN_IN_TOTAL

export const getResourcesStolenInTotal = get<number>('resources.stolen.total', 0);
export const setResourcesStolenInTotal = set<number>('resources.stolen.total');
export const changeAmountOfResourcesStolenInTotal = changeAmountOf('resources.stolen.total');

// === Combined

export const getFreeResourcesAmount = (state: IGameState) => {
	const amount = getResourcesAmount(state);
	const reserved = getReservedResources(state);

	return amount - reserved;
};

export const payReservedResources = (amount: number) => (state: IGameState) => {
	return pipeline(
		state,
		useResources(amount),
		changeAmountOfReservedResources(-amount),
	);
};

export const useResources = (amount: number) => (state: IGameState) => {
	return pipeline(
		state,
		changeAmountOfResources(-amount),
		changeAmountOfResourcesUsedInLastTurn(amount),
		changeAmountOfResourcesUsedInTotal(amount),
	);
};
