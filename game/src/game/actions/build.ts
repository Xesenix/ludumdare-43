import {
	// prettier-ignore
	changeCottagesLevel,
	getCottagesBuildCost,
} from 'game/features/buildings/cottages';
import { getWallsBuildCost } from 'game/features/buildings/walls';
import {
	// prettier-ignore
	changeWallsLevel,
} from 'game/features/buildings/walls';
import {
	// prettier-ignore
	changeAmountOfResources,
	getFreeResourcesAmount,
} from 'game/features/resources/resources';
import { IGameState } from '../store';

export const canBuildCottages = (state: IGameState) => (amount: number = 1) => {
	const cost = getCottagesBuildCost(state)(amount);
	const resources = getFreeResourcesAmount(state);

	return resources >= cost;
};

export const buildCottages = (amount: number = 1) => (state: IGameState): IGameState => {
	const cost = getCottagesBuildCost(state)(amount);

	changeAmountOfResources(-cost)(state);
	changeCottagesLevel(1)(state);

	return state;
};

export const canBuildWalls = (state: IGameState) => (amount: number = 1) => {
	const cost = getWallsBuildCost(state)(amount);
	const resources = getFreeResourcesAmount(state);

	return resources >= cost;
};

export const buildWalls = (amount: number = 1) => (state: IGameState): IGameState => {
	const cost = getWallsBuildCost(state)(amount);

	changeAmountOfResources(-cost)(state);
	changeWallsLevel(1)(state);

	return state;
};
