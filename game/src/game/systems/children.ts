import { inject } from 'lib/di';

import { getCurrentChildren } from 'game/models/units/children';

import {
	// prettier-ignore
	changeAmountOfChildrenKilledInLastTurn,
	changeAmountOfChildrenKilledInTotal,
} from 'game/models/units/children';

import { IGameState } from '../game.interfaces';
import { DataStore } from '../store';

@inject([
	'game:data-store',
])
export class ChildrenSystem {
	constructor(
		private dataStore: DataStore<IGameState>,
	) {
	}

	public getCurrentAmount = (state: IGameState = this.dataStore.getState()): number => {
		return getCurrentChildren(state);
	}

	public getCurrentAmountDiff(state: IGameState, prev: IGameState = this.dataStore.getState()): number {
		return getCurrentChildren(state) - this.getCurrentAmount(prev);
	}

	public changeAmountOfChildrenKilled = (amount: number, state: IGameState = this.dataStore.getState()): IGameState => {
		changeAmountOfChildrenKilledInLastTurn(amount)(state);
		changeAmountOfChildrenKilledInTotal(amount)(state);

		return state;
	}
}
