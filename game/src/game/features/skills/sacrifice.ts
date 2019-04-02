import {
	// prettier-ignore
	changeAmountOf,
	get,
	set,
} from 'game/data';
import { IGameState } from 'game/store';
import pipeline from 'pipeline-operator';
import { getResourcesAmount } from '../resources/resources';

// === SACRIFICE_COUNT

export const getSacrificeCount = get<number>('sacrifice.count', 0);
export const setSacrificeCount = set<number>('sacrifice.count');
export const changeAmountOfSacrificeCount = changeAmountOf('sacrifice.count');

// === SACRIFICE_COST_POPULATION_IN_LAST_TURN

export const getSacrificedPopulationInLastTurn = get<number>('sacrifice.cost.population.current', 0);
export const setSacrificedPopulationInLastTurn = set<number>('sacrifice.cost.population.current');
export const changeAmountOfSacrificedPopulationInLastTurn = changeAmountOf('sacrifice.cost.population.current');

// === SACRIFICE_COST_POPULATION_IN_TOTAL

export const getSacrificedPopulationInTotal = get<number>('sacrifice.cost.population.total', 0);
export const setSacrificedPopulationInTotal = set<number>('sacrifice.cost.population.total');
export const changeAmountOfSacrificedPopulationInTotal = changeAmountOf('sacrifice.cost.population.total');

// === SACRIFICE_COST_RESOURCES_IN_LAST_TURN

export const getSacrificedResourcesInLastTurn = get<number>('sacrifice.cost.resources.current', 0);
export const setSacrificedResourcesInLastTurn = set<number>('sacrifice.cost.resources.current');
export const changeAmountOfSacrificedResourcesInLastTurn = changeAmountOf('sacrifice.cost.resources.current');

// === SACRIFICE_COST_RESOURCES_IN_TOTAL

export const getSacrificedResourcesInTotal = get<number>('sacrifice.cost.resources.total', 0);
export const setSacrificedResourcesInTotal = set<number>('sacrifice.cost.resources.total');
export const changeAmountOfSacrificedResourcesInTotal = changeAmountOf('sacrifice.cost.resources.total');

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

export const changeAmountOfSacrificedPopulation = (amount: number) => (state: IGameState) =>
	pipeline(
		// prettier-ignore
		state,
		changeAmountOfSacrificedPopulationInLastTurn(amount),
		changeAmountOfSacrificedPopulationInTotal(amount),
	);

export const changeAmountOfSacrificedResources = (amount: number) => (state: IGameState) =>
	pipeline(
		// prettier-ignore
		state,
		changeAmountOfSacrificedResourcesInLastTurn(amount),
		changeAmountOfSacrificedResourcesInTotal(amount),
	);
