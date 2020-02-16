import { createDraft, finishDraft } from 'immer';

import {
	// prettier-ignore
	changeAmountOfCurrentIdles,
	getCurrentIdles,
	getFreeIdles,
} from 'game/models/units/idles';
import {
	// prettier-ignore
	changeAmountOfCurrentWorkers,
	changeAmountOfTrainedWorkers,
	getCurrentWorkers,
	getTrainedWorkers,
	setTrainedWorkers,
} from 'game/models/units/workers';
import { inject } from 'lib/di';

import { IGameState } from '../interfaces';
import { DataStore } from '../store';

@inject([
	'game:data-store',
])
export class WorkersSystem {

	constructor(
		private dataStore: DataStore<IGameState>,
	) {
	}

	public trainRule(state: IGameState): IGameState {
		const trained = getTrainedWorkers(state);

		setTrainedWorkers(0)(state);
		changeAmountOfCurrentWorkers(trained)(state);
		changeAmountOfCurrentIdles(-trained)(state);

		return state;
	}

	public canTrain = (amount: number, state: IGameState = this.dataStore.getState()): boolean => {
		const available = getFreeIdles(state);
		const availableWorkers = getTrainedWorkers(state) + getCurrentWorkers(state);

		return available >= amount && availableWorkers >= -amount;
	}

	public getCurrentAmount = (state: IGameState = this.dataStore.getState()): number => {
		return getCurrentWorkers(state);
	}

	public getCurrentAmountDiff(state: IGameState, prev: IGameState = this.dataStore.getState()): number {
		return getCurrentWorkers(state) - this.getCurrentAmount(prev);
	}

	public getTrainedAmount = (state: IGameState = this.dataStore.getState()): number => {
		return getTrainedWorkers(state);
	}

	public scheduleTraining = (amount: number, state: IGameState = createDraft(this.dataStore.getState())): IGameState => {
		const workers = getCurrentWorkers(state);
		const alreadyTrainedWorkers = getTrainedWorkers(state);
		const idles = getCurrentIdles(state);
		const trainedWorkers = Math.max(-workers - alreadyTrainedWorkers, Math.min(idles - alreadyTrainedWorkers, amount));

		changeAmountOfTrainedWorkers(trainedWorkers)(state);

		return state;
	}

	public scheduleTrainingAction = (amount: number) => {
		this.dataStore.setState(finishDraft(this.scheduleTraining(amount)));
	}
}
