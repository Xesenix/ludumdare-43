import { createDraft, finishDraft } from 'immer';

import { changeAmountOfResources } from 'game/models/resources/resources';
import { getFreeResourcesAmount } from 'game/models/resources/resources';
import {
	// prettier-ignore
	changeAmountOfSacrificedPopulation,
	changeAmountOfSacrificedResources,
	getUltimateSacrificeCost,
} from 'game/models/skills/sacrifice';
import {
	// prettier-ignore
	changeAmountOfSacrificeCount,
} from 'game/models/skills/sacrifice';
import { changeAmountOfCurrentIdles, getFreeIdles } from 'game/models/units/idles';
import { inject } from 'lib/di';

import { IGameState } from '../interfaces';
import {
	// prettier-ignore
	getSacrificeCount,
	getSacrificedPopulationInTotal,
	getSacrificedResourcesInTotal,
} from '../models/skills/sacrifice';
import { DataStore } from '../store';

@inject([
	'game:data-store',
])
export class SacrificesSystem {
	constructor(
		private dataStore: DataStore<IGameState>,
	) {
	}

	public canMakeUltimateSacrifice = (state: IGameState = this.dataStore.getState()): boolean => {
		const { win } = state;
		const cost = getUltimateSacrificeCost(state);
		const idles = getFreeIdles(state);
		const resources = getFreeResourcesAmount(state);

		return !win && cost <= resources && cost <= idles;
	}

	public getSacrificeCost = (state: IGameState = createDraft(this.dataStore.getState())): number => {
		return getUltimateSacrificeCost(state);
	}

	public makeUltimateSacrifice = (state: IGameState = createDraft(this.dataStore.getState())): IGameState => {
		const cost = getUltimateSacrificeCost(state);

		changeAmountOfSacrificeCount(1)(state);
		changeAmountOfCurrentIdles(-cost)(state);
		changeAmountOfResources(cost)(state);
		changeAmountOfSacrificedPopulation(cost)(state);
		changeAmountOfSacrificedResources(cost)(state);
		state.win = true;

		this.dataStore.setState(finishDraft(state));

		return state;
	}

	public makeUltimateSacrificeAction = () => {
		this.makeUltimateSacrifice();
	}

	public getTotalResourcesUsed = (state: IGameState = this.dataStore.getState()): number => {
		return getSacrificedResourcesInTotal(state);
	}

	public getTotalPopulationUsed = (state: IGameState = this.dataStore.getState()): number => {
		return getSacrificedPopulationInTotal(state);
	}

	public getCount = (state: IGameState = this.dataStore.getState()): number => {
		return getSacrificeCount(state);
	}
}
