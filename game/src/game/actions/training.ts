import pipeline from 'pipeline-operator';

import {
	// prettier-ignore
	changeAmountOfReservedResources,
	getFreeResourcesAmount,
	getReservedResources,
	getResourcesAmount,
	payReservedResources,
} from 'game/features/resources/resources';
import {
	// prettier-ignore
	changeAmountOfCurrentGuards,
	changeAmountOfTrainedGuards,
	getCurrentGuards,
	getTrainedGuards,
	setTrainedGuards,
} from 'game/features/units/guards';
import {
	// prettier-ignore
	changeAmountOfCurrentIdles,
	getCurrentIdles,
	getFreeIdles,
} from 'game/features/units/idles';
import {
	// prettier-ignore
	changeAmountOfCurrentWorkers,
	changeAmountOfTrainedWorkers,
	getCurrentWorkers,
	getTrainedWorkers,
	setTrainedWorkers,
} from 'game/features/units/workers';
import { IGameState } from 'game/store';

const resetTrainedGuards = setTrainedGuards(0);
const resetTrainedWorkers = setTrainedWorkers(0);

/**
 *
 * @param IGameState state
 */
export const canTrainWorkers = (state: IGameState) => {
	const available = getFreeIdles(state);
	const availableWorkers = getTrainedWorkers(state) + getCurrentWorkers(state);
	return (amount: number) => available >= amount && availableWorkers >= -amount;
};

export const scheduleTrainingWorkers = (amount: number) => (state: IGameState): IGameState => {
	const workers = getCurrentWorkers(state);
	const alreadyTrainedWorkers = getTrainedWorkers(state);
	const idles = getCurrentIdles(state);
	const trainedWorkers = Math.max(-workers - alreadyTrainedWorkers, Math.min(idles - alreadyTrainedWorkers, amount));

	return pipeline(
		// prettier-ignore
		state,
		changeAmountOfTrainedWorkers(trainedWorkers),
	);
};

export const trainWorkersRule = (state: IGameState) => {
	const trained = getTrainedWorkers(state);

	return pipeline(
		// prettier-ignore
		state,
		resetTrainedWorkers,
		changeAmountOfCurrentWorkers(trained),
		changeAmountOfCurrentIdles(-trained),
	);
};

export const canTrainGuards = (state: IGameState) => {
	const availableIdles = getFreeIdles(state);
	const availableResources = getFreeResourcesAmount(state);
	const availableGuards = getTrainedGuards(state) + getCurrentGuards(state);
	return (amount: number) => availableIdles >= amount && availableResources >= amount && availableGuards >= -amount;
};

export const scheduleTrainingGuards = (amount: number) => (state: IGameState): IGameState => {
	const guards = getCurrentGuards(state);
	const alreadyTrainedGuards = getTrainedGuards(state);
	const alreadyReservedResources = getReservedResources(state);
	const availableIdles = getFreeIdles(state);
	const resourcesAmount = getResourcesAmount(state);
	const freeResources = resourcesAmount - alreadyReservedResources;
	const resourcesReservedForTrainingGuards = Math.max(alreadyTrainedGuards, 0);
	const trainedGuards = Math.max(-alreadyTrainedGuards - guards, Math.min(availableIdles, freeResources, amount));
	const resourcesChange = Math.max(-resourcesReservedForTrainingGuards, trainedGuards);

	return pipeline(
		// prettier-ignore
		state,
		changeAmountOfTrainedGuards(trainedGuards),
		changeAmountOfReservedResources(resourcesChange),
	);
};

export const trainGuardsRule = (state: IGameState) => {
	const trained = getTrainedGuards(state);
	const reservedResources = Math.max(0, trained);

	return pipeline(
		// prettier-ignore
		state,
		resetTrainedGuards,
		changeAmountOfCurrentGuards(trained),
		changeAmountOfCurrentIdles(-trained),
		payReservedResources(reservedResources),
	);
};
