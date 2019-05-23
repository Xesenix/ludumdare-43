import { IGameState } from 'game/store';

// === RESOURCES_AMOUNT

export const getResourcesAmount = (state: IGameState) => state.resources.amount;
export const setResourcesAmount = (value: number) => (state: IGameState) => { state.resources.amount = value; return state; };
export const changeAmountOfResources = (amount: number) => (state: IGameState) => { state.resources.amount += amount; return state; };

// === RESOURCES_RESERVED

export const getReservedResources = (state: IGameState) => state.resources.reserved;
export const setResourcesReserved = (value: number) => (state: IGameState) => { state.resources.reserved = value; return state; };
export const changeAmountOfReservedResources = (amount: number) => (state: IGameState) => { state.resources.reserved += amount; return state; };

// === RESOURCES_USED_IN_LAST_TURN

export const getResourcesUsedInLastTurn = (state: IGameState) => state.resources.used.current;
export const setResourcesUsedInLastTurn = (value: number) => (state: IGameState) => { state.resources.used.current = value; return state; };
export const changeAmountOfResourcesUsedInLastTurn = (amount: number) => (state: IGameState) => { state.resources.used.current += amount; return state; };

// === RESOURCES_USED_IN_TOTAL

export const getResourcesUsedInTotal = (state: IGameState) => state.resources.used.total;
export const setResourcesUsedInTotal = (value: number) => (state: IGameState) => { state.resources.used.total = value; return state; };
export const changeAmountOfResourcesUsedInTotal = (amount: number) => (state: IGameState) => { state.resources.used.total += amount; return state; };

// === RESOURCES_STOLEN_IN_LAST_TURN

export const getResourcesStolenInLastTurn = (state: IGameState) => state.resources.stolen.current;
export const setResourcesStolenInLastTurn = (value: number) => (state: IGameState) => { state.resources.stolen.current = value; return state; };
export const changeAmountOfResourcesStolenInLastTurn = (amount: number) => (state: IGameState) => { state.resources.stolen.current += amount; return state; };

// === RESOURCES_STOLEN_IN_TOTAL

export const getResourcesStolenInTotal = (state: IGameState) => state.resources.stolen.total;
export const setResourcesStolenInTotal = (value: number) => (state: IGameState) => { state.resources.stolen.total = value; return state; };
export const changeAmountOfResourcesStolenInTotal = (amount: number) => (state: IGameState) => { state.resources.stolen.total += amount; return state; };

// === Combined

export const getFreeResourcesAmount = (state: IGameState) => {
	const amount = getResourcesAmount(state);
	const reserved = getReservedResources(state);

	return amount - reserved;
};

export const payReservedResources = (amount: number) => (state: IGameState) => {
	useResources(amount)(state);
	changeAmountOfReservedResources(-amount)(state);
};

export const useResources = (amount: number) => (state: IGameState) => {
	changeAmountOfResources(-amount)(state);
	changeAmountOfResourcesUsedInLastTurn(amount)(state);
	changeAmountOfResourcesUsedInTotal(amount)(state);
};
