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

	changeAmountOfTrainedWorkers(trainedWorkers)(state);

	return state;
};

export const trainWorkersRule = (state: IGameState): IGameState => {
	const trained = getTrainedWorkers(state);

	setTrainedWorkers(0)(state);
	changeAmountOfCurrentWorkers(trained)(state);
	changeAmountOfCurrentIdles(-trained)(state);

	return state;
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

	changeAmountOfTrainedGuards(trainedGuards)(state);
	changeAmountOfReservedResources(resourcesChange)(state);

	return state;
};

export const trainGuardsRule = (state: IGameState): IGameState => {
	const trained = getTrainedGuards(state);
	const reservedResources = Math.max(0, trained);

	setTrainedGuards(0)(state);
	changeAmountOfCurrentGuards(trained)(state);
	changeAmountOfCurrentIdles(-trained)(state);
	payReservedResources(reservedResources)(state);

	return state;
};
