import { inject } from 'lib/di';

import { getResourcesAmount } from 'game/models/resources/resources';
import { changeAmountOfResources } from 'game/models/resources/resources';
import { getCurrentWorkers } from 'game/models/units/workers';

import { IGameState } from '../game.interfaces';
import { DataStore } from '../store';

@inject([
	'game:data-store',
])
export class ResourcesSystem {
	constructor(
		private dataStore: DataStore<IGameState>,
	) {
	}

	public gatherResourcesRule = (state: IGameState): IGameState => {
		const workers = getCurrentWorkers(state);
		const resourceGathered = workers;

		changeAmountOfResources(resourceGathered)(state);

		return state;
	}

	public getAmount(state: IGameState = this.dataStore.getState()): number {
		return getResourcesAmount(state);
	}

	public getAmountDiff(state: IGameState, prev: IGameState = this.dataStore.getState()): number {
		return getResourcesAmount(state) - this.getAmount(prev);
	}
}
