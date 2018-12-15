import pipeline from 'pipeline-operator';

import { reserveResources } from 'game/features/resources/resources';
import {
	changeAmountOfCurrentGuards,
	changeAmountOfTrainedGuards,
	getCurrentGuards,
	getMaxGuards,
	getTrainedGuards,
	setTrainedGuards,
} from 'game/features/units/guards';
import {
	changeAmountOfCurrentIdles,
	changeAmountOfTrainedIdles,
	getCurrentIdles,
	getTrainedIdles,
} from 'game/features/units/idles';
import { IGameState } from 'game/store';
import { payResources } from '../features/resources/resources';

export const scheduleTrainingGuards = (amount: number) => (state: IGameState) => {
	const guards = getCurrentGuards(state);
	const alreadyTrainedGuards = getTrainedGuards(state);
	const idles = getCurrentIdles(state);
	const alreadyTrainedIdles = getTrainedIdles(state);
	const availableToTrain = Math.min(getMaxGuards(state) - guards - alreadyTrainedGuards, idles - alreadyTrainedIdles);
	const trainedGuards = Math.min(availableToTrain, amount);

	return pipeline(
		state,
		changeAmountOfTrainedGuards(trainedGuards),
		changeAmountOfTrainedIdles(trainedGuards),
		reserveResources(trainedGuards),
	);
};

// TODO: add resource cost
export const trainGuardsRule = (state: IGameState) => {
	const trained = getTrainedGuards(state);

	return pipeline(
		state,
		setTrainedGuards(0),
		changeAmountOfTrainedIdles(-trained),
		changeAmountOfCurrentGuards(trained),
		changeAmountOfCurrentIdles(-trained),
		payResources(trained),
	);
};

