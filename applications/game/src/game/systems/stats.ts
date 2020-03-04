import { inject } from 'lib/di';

import { IGameState } from '../interfaces';
import { getResourcesStolenInLastTurn } from '../models/resources/resources';
import { getSacrificeCount } from '../models/skills/sacrifice';
import { getPopulationKilledInLastTurn } from '../models/units/population';
import { DataStore } from '../store';

@inject([
	'game:data-store',
])
export class StatsSystem {
	constructor(
		private dataStore: DataStore<IGameState>,
	) {
	}

	public getResourcesStolenInLastTurn(state: IGameState = this.dataStore.getState()): number {
		return getResourcesStolenInLastTurn(state);
	}

	public getPopulationKilledInLastTurn(state: IGameState = this.dataStore.getState()): number {
		return getPopulationKilledInLastTurn(state);
	}

	public getSacrificeCount(state: IGameState = this.dataStore.getState()): number {
		return getSacrificeCount(state);
	}
}
