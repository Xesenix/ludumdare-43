import pipeline from 'pipeline-operator';

import {
	getCurrentChildren,
	getKilledChildren,
	getTrainedChildren,
} from 'game/features/units/children';
import {
	getCurrentGuards,
	getKilledGuards,
	getTrainedGuards,
} from 'game/features/units/guards';
import {
	getCurrentIdles,
	getKilledIdles,
	getTrainedIdles,
} from 'game/features/units/idles';
import {
	setCurrentPopulation,
	setKilledPopulation,
	setTrainedPopulation,
} from 'game/features/units/population';
import {
	getCurrentWorkers,
	getKilledWorkers,
	getTrainedWorkers,
} from 'game/features/units/workers';
import { IGameState } from 'game/store';

export const populationReport = (state: IGameState) => {
	return pipeline(
		state,
		setKilledPopulation(getKilledChildren(state) + getKilledGuards(state) + getKilledIdles(state) + getKilledWorkers(state)),
		setCurrentPopulation(getCurrentChildren(state) + getCurrentGuards(state) + getCurrentIdles(state) + getCurrentWorkers(state)),
		setTrainedPopulation(getTrainedChildren(state) + getTrainedGuards(state) + getTrainedIdles(state) + getTrainedWorkers(state)),
	);
};
