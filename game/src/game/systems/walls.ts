import { createDraft, finishDraft } from 'immer';

import {
	// prettier-ignore
	getWallsBuildCost,
	getWallsLevel,
	getWallsReduction,
} from 'game/models/buildings/walls';
import {
	// prettier-ignore
	changeWallsLevel,
} from 'game/models/buildings/walls';
import {
	// prettier-ignore
	changeAmountOfResources,
	getFreeResourcesAmount,
} from 'game/models/resources/resources';
import { inject } from 'lib/di';

import { IGameState } from '../game.interfaces';
import { DataStore } from '../store';


@inject([
	'game:data-store',
])
export class WallsSystem {
	constructor(
		private dataStore: DataStore<IGameState>,
	) {
	}

	public canBuild(amount: number = 1, state: IGameState = this.dataStore.getState()): boolean {
		const cost = getWallsBuildCost(state)(amount);
		const resources = getFreeResourcesAmount(state);

		return resources >= cost;
	}

	public build(amount: number = 1, state: IGameState = createDraft(this.dataStore.getState())): IGameState {
		const cost = getWallsBuildCost(state)(amount);

		changeAmountOfResources(-cost)(state);
		changeWallsLevel(1)(state);

		return state;
	}

	public commitBuild(amount: number = 1): void {
		this.dataStore.setState(finishDraft(this.build(amount)));
	}

	public getLevel(state: IGameState = this.dataStore.getState()): number {
		return getWallsLevel(state);
	}

	public getBuildCost(state: IGameState = this.dataStore.getState()): number {
		return getWallsBuildCost(state)(1);
	}

	public getWallsReduction(state: IGameState = this.dataStore.getState()): number {
		return getWallsReduction(state);
	}
}
