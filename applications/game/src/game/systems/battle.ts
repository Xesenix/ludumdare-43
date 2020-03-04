import { inject } from 'lib/di';

import { IGameState } from '../interfaces';
import { getAttackPower, getBaseAttackPower } from '../models/skills/attack';
import { DataStore } from '../store';

@inject([
	'game:data-store',
])
export class BattleSystem {
	constructor(
		private dataStore: DataStore<IGameState>,
	) {
	}

	public getAttackPower(state: IGameState = this.dataStore.getState()) {
		return getAttackPower(state);
	}
	public getBaseAttackPower(state: IGameState = this.dataStore.getState()) {
		return getBaseAttackPower(state);
	}
}
