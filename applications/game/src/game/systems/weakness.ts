import produce, { createDraft } from 'immer';

import { changeAmountOfWeaknessLevel, getWeaknessDamageReduction } from 'game/models/skills/weakness';
import { getWeaknessLevel, getWeaknessPerLevelReduction } from 'game/models/skills/weakness';
import { getCurrentIdles } from 'game/models/units/idles';
import { inject } from 'lib/di';

import { IGameState } from '../interfaces';
import {
	// prettier-ignore
	changeAmountOfSacrificeCount,
	changeAmountOfSacrificedPopulation,
	getSacrificePopulationCost,
	getSacrificeResourcesCost,
} from '../models/skills/sacrifice';
import { changeAmountOfCurrentIdles } from '../models/units/idles';
import { DataStore } from '../store';

@inject([
	'game:data-store',
])
export class WeaknessSystem {
	constructor(
		private dataStore: DataStore<IGameState>,
	) {
	}

	public getLevel(state: IGameState = this.dataStore.getState()): number {
		return getWeaknessLevel(state);
	}

	public canSacraficeForEnemiesWeakness = (state: IGameState = this.dataStore.getState()): boolean => {
		const cost = getSacrificePopulationCost(state);
		const available = getCurrentIdles(state);

		return available >= cost;
	}

	public buyLevel = (value: number, state: IGameState = createDraft(this.dataStore.getState())): IGameState => {
		const cost = getSacrificePopulationCost(state);

		// TODO: check if value > 1 works correctly on cost
		changeAmountOfSacrificeCount(value)(state);
		changeAmountOfCurrentIdles(-cost)(state);
		changeAmountOfWeaknessLevel(value)(state);
		changeAmountOfSacrificedPopulation(cost)(state);

		return state;
	}

	public canLevelUp(state: IGameState = this.dataStore.getState()): boolean {
		const cost = getSacrificePopulationCost(state);
		const available = getCurrentIdles(state);

		return available >= cost;
	}

	public getPerLevelReduction(state: IGameState = this.dataStore.getState()): number {
		return getWeaknessPerLevelReduction(state);
	}

	public getNextLevelDamageReduction(state: IGameState = this.dataStore.getState()): number {
		return getWeaknessDamageReduction(produce(state, changeAmountOfWeaknessLevel(1)));
	}

	public getDamageReduction(state: IGameState = this.dataStore.getState()): number {
		return getWeaknessDamageReduction(state);
	}

	public getPopulationCost(state: IGameState = this.dataStore.getState()): number {
		return getSacrificePopulationCost(state);
	}

	public getResourceCost(state: IGameState = this.dataStore.getState()): number {
		return getSacrificeResourcesCost(state);
	}

	public getNextLevelResourceCost(state: IGameState = this.dataStore.getState()): number {
		return getSacrificeResourcesCost({ ...state, turn: state.turn + 1 });
	}
}
