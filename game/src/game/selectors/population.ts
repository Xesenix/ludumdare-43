import {
	getCurrentIdles,
} from 'game/features/units/idles';
import {
	getTrainedPopulation,
} from 'game/features/units/population';
import { IGameState } from 'game/store';

export const hasFreePopulation = (amount: number) => (state: IGameState): boolean => {
	const trained = getTrainedPopulation(state);
	const idles = getCurrentIdles(state);

	return trained + amount <= idles;
};
