import { createDraft, finishDraft } from 'immer';

import {
	// prettier-ignore
	changeAmountOfReservedResources,
	getFreeResourcesAmount,
	getReservedResources,
	getResourcesAmount,
	payReservedResources,
	useResources,
} from 'game/models/resources/resources';
import {
	// prettier-ignore
	changeAmountOfCurrentGuards,
	changeAmountOfTrainedGuards,
	getCurrentGuards,
	getTrainedGuards,
	setCurrentGuards,
	setTrainedGuards,
} from 'game/models/units/guards';
import {
	// prettier-ignore
	changeAmountOfCurrentIdles,
	getFreeIdles,
} from 'game/models/units/idles';
import { inject } from 'lib/di';

import { IGameState } from '../game.interfaces';
import { DataStore } from '../store';

@inject([
	'game:data-store',
])
export class GuardsSystem {

	constructor(
		private dataStore: DataStore<IGameState>,
	) {
	}

	public trainRule(state: IGameState): IGameState {
		const trained = getTrainedGuards(state);
		const reservedResources = Math.max(0, trained);

		setTrainedGuards(0)(state);
		changeAmountOfCurrentGuards(trained)(state);
		changeAmountOfCurrentIdles(-trained)(state);
		payReservedResources(reservedResources)(state);

		return state;
	}

	public upkeepRule(state: IGameState): IGameState {
		const guards = getCurrentGuards(state);
		const resourcesAmount = getResourcesAmount(state);
		const guardsPaid = Math.min(guards, resourcesAmount);

		setCurrentGuards(guardsPaid)(state);
		changeAmountOfCurrentIdles(guards - guardsPaid)(state);
		useResources(guardsPaid)(state);

		return state;
	}

	public canTrain = (amount: number, state: IGameState = this.dataStore.getState()): boolean => {
		const availableIdles = getFreeIdles(state);
		const availableResources = getFreeResourcesAmount(state);
		const availableGuards = getTrainedGuards(state) + getCurrentGuards(state);

		return availableIdles >= amount && availableResources >= amount && availableGuards >= -amount;
	}

	public getCurrentAmount = (state: IGameState = this.dataStore.getState()): number => {
		return getCurrentGuards(state);
	}

	public getCurrentAmountDiff(state: IGameState): number {
		return getCurrentGuards(state) - this.getCurrentAmount();
	}

	public getTrainedAmount = (state: IGameState = this.dataStore.getState()): number => {
		return getTrainedGuards(state);
	}

	public scheduleTraining = (amount: number, state: IGameState = createDraft(this.dataStore.getState())): IGameState => {
		const guards = getCurrentGuards(state);
		const alreadyTrainedGuards = getTrainedGuards(state);
		const alreadyReservedResources = getReservedResources(state);
		const availableIdles = getFreeIdles(state);
		const resourcesAmount = getResourcesAmount(state);
		const freeResources = resourcesAmount - alreadyReservedResources;
		const resourcesReservedForTrainingGuards = Math.max(alreadyTrainedGuards, 0);
		const trainedGuards = Math.max(-alreadyTrainedGuards - guards, Math.min(availableIdles, freeResources, amount));
		const resourcesChange = Math.max(-resourcesReservedForTrainingGuards, trainedGuards);

		changeAmountOfTrainedGuards(trainedGuards)(state);
		changeAmountOfReservedResources(resourcesChange)(state);

		return state;
	}

	public scheduleTrainingAction = () => {
		this.dataStore.setState(finishDraft(this.scheduleTraining(1)));
	}
}
