import { inject } from 'lib/di';

import { getCurrentIdles } from 'game/models/units/idles';

import { IGameState } from '../game.interfaces';
import { DataStore } from '../store';

@inject([
	'game:data-store',
])
export class IdlesSystem {
	constructor(
		private dataStore: DataStore<IGameState>,
	) {
	}

	public getCurrentAmount = (state: IGameState = this.dataStore.getState()): number => {
		return getCurrentIdles(state);
	}

	public getCurrentAmountDiff(state: IGameState, prev: IGameState = this.dataStore.getState()): number {
		return getCurrentIdles(state) - this.getCurrentAmount(prev);
	}
}
