import { IGameState } from 'game';

import { getResourcesAmount } from '../resources/resources';

// === SACRIFICE_COUNT

export const getSacrificeCount = (state: IGameState) => state.sacrifice.count;
export const setSacrificeCount = (value: number) => (state: IGameState) => { state.sacrifice.count = value; return state; };
export const changeAmountOfSacrificeCount = (amount: number) => (state: IGameState) => { state.sacrifice.count += amount; return state; };

// === SACRIFICE_COST_POPULATION_IN_LAST_TURN

export const getSacrificedPopulationInLastTurn = (state: IGameState) => state.sacrifice.cost.population.current;
export const setSacrificedPopulationInLastTurn = (value: number) => (state: IGameState) => { state.sacrifice.cost.population.current = value; return state; };
export const changeAmountOfSacrificedPopulationInLastTurn = (amount: number) => (state: IGameState) => { state.sacrifice.cost.population.current += amount; return state; };

// === SACRIFICE_COST_POPULATION_IN_TOTAL

export const getSacrificedPopulationInTotal = (state: IGameState) => state.sacrifice.cost.population.total;
export const setSacrificedPopulationInTotal = (value: number) => (state: IGameState) => { state.sacrifice.cost.population.total = value; return state; };
export const changeAmountOfSacrificedPopulationInTotal = (amount: number) => (state: IGameState) => { state.sacrifice.cost.population.total += amount; return state; };

// === SACRIFICE_COST_RESOURCES_IN_LAST_TURN

export const getSacrificedResourcesInLastTurn = (state: IGameState) => state.sacrifice.cost.resources.current;
export const setSacrificedResourcesInLastTurn = (value: number) => (state: IGameState) => { state.sacrifice.cost.resources.current = value; return state; };
export const changeAmountOfSacrificedResourcesInLastTurn = (amount: number) => (state: IGameState) => { state.sacrifice.cost.resources.current += amount; return state; };

// === SACRIFICE_COST_RESOURCES_IN_TOTAL

export const getSacrificedResourcesInTotal = (state: IGameState) => state.sacrifice.cost.resources.total;
export const setSacrificedResourcesInTotal = (value: number) => (state: IGameState) => { state.sacrifice.cost.resources.total = value; return state; };
export const changeAmountOfSacrificedResourcesInTotal = (amount: number) => (state: IGameState) => { state.sacrifice.cost.resources.total += amount; return state; };

// === SACRIFICE_COST

export const getSacrificeResourcesCost = (state: IGameState) => {
	const turn = state.turn;
	const sacrificeCount = getSacrificeCount(state);
	const resources = getResourcesAmount(state);
	return Math.min(1 + turn + 5 * sacrificeCount + 2 * Math.floor(turn / 5), Math.max(2 + turn * 2, resources));
};
export const getSacrificePopulationCost = (state: IGameState) => {
	const turn = state.turn;
	const sacrificeCount = getSacrificeCount(state);
	return 1 + turn + 5 * sacrificeCount + 5 * Math.floor(turn / 5);
};

export const getUltimateSacrificeCost = (state: IGameState) => {
	return 1000;
};

export const changeAmountOfSacrificedPopulation = (amount: number) => (state: IGameState) => {
	changeAmountOfSacrificedPopulationInLastTurn(amount)(state);
	changeAmountOfSacrificedPopulationInTotal(amount)(state);
};

export const changeAmountOfSacrificedResources = (amount: number) => (state: IGameState) => {
	changeAmountOfSacrificedResourcesInLastTurn(amount)(state);
	changeAmountOfSacrificedResourcesInTotal(amount)(state);
};
