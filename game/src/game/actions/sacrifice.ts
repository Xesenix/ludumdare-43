import pipeline from 'pipeline-operator';

import { update } from 'game/data';
import { changeAmountOfResources } from 'game/features/resources/resources';
import { getFreeResourcesAmount } from 'game/features/resources/resources';
import {
	// prettier-ignore
	changeAmountOfSacrificedPopulation,
	changeAmountOfSacrificedResources,
	getSacrificePopulationCost,
	getUltimateSacrificeCost,
} from 'game/features/skills/sacrifice';
import {
	// prettier-ignore
	changeAmountOfSacrificeCount,
	getSacrificeResourcesCost,
} from 'game/features/skills/sacrifice';
import { changeAmountOfWeaknessLevel } from 'game/features/skills/weakness';
import { getCurrentIdles } from 'game/features/units/idles';
import { changeAmountOfCurrentIdles, getFreeIdles } from 'game/features/units/idles';
import { IGameState } from 'game/store';

export const canSacraficeForImmunity = (state: IGameState): boolean => {
	const { immunity } = state;
	const cost = getSacrificeResourcesCost(state);
	const available = getFreeResourcesAmount(state);

	return !immunity && available >= cost;
};

export const sacrificeResourcesForImmunity = (state: IGameState): IGameState => {
	const cost = getSacrificeResourcesCost(state);

	if (!canSacraficeForImmunity(state)) {
		return state;
	}

	return pipeline(
		// prettier-ignore
		state,
		changeAmountOfSacrificeCount(1),
		changeAmountOfResources(-cost),
		changeAmountOfSacrificedResources(cost),
		update<boolean>('immunity', () => true)(),
	);
};

export const canSacraficeForEnemiesWeakness = (state: IGameState): boolean => {
	const cost = getSacrificePopulationCost(state);
	const available = getCurrentIdles(state);

	return available >= cost;
};

export const sacrificeIdlesForEnemiesWeakness = (state: IGameState): IGameState => {
	const cost = getSacrificePopulationCost(state);

	return pipeline(
		// prettier-ignore
		state,
		changeAmountOfSacrificeCount(1),
		changeAmountOfCurrentIdles(-cost),
		changeAmountOfWeaknessLevel(1),
		changeAmountOfSacrificedPopulation(cost),
	);
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

	return pipeline(
		// prettier-ignore
		state,
		changeAmountOfSacrificeCount(1),
		changeAmountOfCurrentIdles(-cost),
		changeAmountOfResources(cost),
		changeAmountOfSacrificedPopulation(cost),
		changeAmountOfSacrificedResources(cost),
		update<boolean>('win', () => true)(),
	);
};
