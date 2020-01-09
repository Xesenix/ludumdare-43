import { IGameState } from 'game';
import { changeAmountOfResources } from 'game/models/resources/resources';
import { getFreeResourcesAmount } from 'game/models/resources/resources';
import {
	// prettier-ignore
	changeAmountOfSacrificedPopulation,
	changeAmountOfSacrificedResources,
	getSacrificePopulationCost,
	getUltimateSacrificeCost,
} from 'game/models/skills/sacrifice';
import {
	// prettier-ignore
	changeAmountOfSacrificeCount,
} from 'game/models/skills/sacrifice';
import { changeAmountOfWeaknessLevel } from 'game/models/skills/weakness';
import { getCurrentIdles } from 'game/models/units/idles';
import { changeAmountOfCurrentIdles, getFreeIdles } from 'game/models/units/idles';

export const canSacraficeForEnemiesWeakness = (state: IGameState): boolean => {
	const cost = getSacrificePopulationCost(state);
	const available = getCurrentIdles(state);

	return available >= cost;
};

export const sacrificeIdlesForEnemiesWeakness = (state: IGameState): IGameState => {
	const cost = getSacrificePopulationCost(state);

	changeAmountOfSacrificeCount(1)(state);
	changeAmountOfCurrentIdles(-cost)(state);
	changeAmountOfWeaknessLevel(1)(state);
	changeAmountOfSacrificedPopulation(cost)(state);

	return state;
};

export const canMakeUltimateSacrifice = (state: IGameState): boolean => {
	const { win } = state;
	const cost = getUltimateSacrificeCost(state);
	const idles = getFreeIdles(state);
	const resources = getFreeResourcesAmount(state);

	return !win && cost <= resources && cost <= idles;
};

export const makeUltimateSacrifice = (state: IGameState): IGameState => {
	const cost = getUltimateSacrificeCost(state);

	changeAmountOfSacrificeCount(1)(state);
	changeAmountOfCurrentIdles(-cost)(state);
	changeAmountOfResources(cost)(state);
	changeAmountOfSacrificedPopulation(cost)(state);
	changeAmountOfSacrificedResources(cost)(state);
	state.win = true;

	return state;
};
