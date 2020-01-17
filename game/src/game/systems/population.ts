import { inject } from 'lib/di';

import {
	// prettier-ignore
	getCurrentChildren,
	setCurrentChildren,
} from 'game/models/units/children';
import { getCurrentGuards } from 'game/models/units/guards';
import {
	// prettier-ignore
	changeAmountOfCurrentIdles,
	getCurrentIdles,
} from 'game/models/units/idles';
import { setCurrentIdles } from 'game/models/units/idles';
import {
	// prettier-ignore
	getCurrentPopulation,
	getMaxPopulation,
} from 'game/models/units/population';
import { getCurrentWorkers } from 'game/models/units/workers';

import { IGameState } from '../game.interfaces';
import { DataStore } from '../store';

@inject([
	'game:data-store',
])
export class PopulationSystem {
	constructor(
		private dataStore: DataStore<IGameState>,
	) {
	}

	public populationIncreaseRule = (state: IGameState): IGameState => {
		const idles = getCurrentIdles(state);
		const newChildren = Math.floor(idles / 2);
		const children = getCurrentChildren(state);
		const newAdults = children;

		changeAmountOfCurrentIdles(newAdults)(state);
		setCurrentChildren(newChildren)(state);

		return state;
	}

	public populationLimitRule = (state: IGameState): IGameState => {
		const max = getMaxPopulation(state);
		const guards = getCurrentGuards(state);
		const children = getCurrentChildren(state);
		const idles = getCurrentIdles(state);
		const workers = getCurrentWorkers(state);
		const maxChildren = Math.min(max - workers - guards - idles, children);
		const maxIdles = Math.min(max - workers - guards - maxChildren, idles);

		setCurrentIdles(maxIdles)(state);
		setCurrentChildren(maxChildren)(state);

		return state;
	}

	public getCurrentAmount = (state: IGameState = this.dataStore.getState()): number => {
		return getCurrentPopulation(state);
	}

	public getCurrentAmountDiff = (state: IGameState, prev: IGameState = this.dataStore.getState()): number => {
		return getCurrentPopulation(state) - this.getCurrentAmount(prev);
	}

	public getMaxAmount = (state: IGameState = this.dataStore.getState()): number => {
		return getMaxPopulation(state);
	}

	public getMaxAmountDiff = (state: IGameState, prev: IGameState = this.dataStore.getState()): number => {
		return getMaxPopulation(state) - this.getMaxAmount(prev);
	}

}
