import { createDraft, finishDraft } from 'immer';

import {
	// prettier-ignore
	changeCottagesLevel,
	getCottagesBuildCost,
} from 'game/models/buildings/cottages';
import { getCottagesLevel } from 'game/models/buildings/cottages';
import {
	// prettier-ignore
	changeAmountOfResources,
	getFreeResourcesAmount,
} from 'game/models/resources/resources';
import { inject } from 'lib/di';

import { IGameState } from '../interfaces';
import { DataStore } from '../store';


@inject([
	'game:data-store',
])
export class CottagesSystem {
	constructor(
		private dataStore: DataStore<IGameState>,
	) {
	}

	public canBuild(amount: number = 1, state: IGameState = this.dataStore.getState()): boolean {
		const cost = getCottagesBuildCost(state)(amount);
		const resources = getFreeResourcesAmount(state);

		return resources >= cost;
	}

	public build(amount: number = 1, state: IGameState = createDraft(this.dataStore.getState())): IGameState {
		const cost = getCottagesBuildCost(state)(amount);

		changeAmountOfResources(-cost)(state);
		changeCottagesLevel(1)(state);

		return state;
	}

	public commitBuild(amount: number = 1, state: IGameState = createDraft(this.dataStore.getState())): void {
		this.dataStore.setState(finishDraft(this.build(amount, state)));
	}

	public getBuildCost(state: IGameState = this.dataStore.getState()): number {
		return getCottagesBuildCost(state)(1);
	}

	public getLevel(state: IGameState = this.dataStore.getState()): number {
		return getCottagesLevel(state);
	}
}
