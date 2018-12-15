import {
	changeAmountOf,
	get,
	set,
} from 'game/data';

// === POPULATION_CURRENT

export const getCurrentPopulation = get<number>('population', 'current');
export const setCurrentPopulation = set<number>('population', 'current');
export const changeAmountOfCurrentPopulation = changeAmountOf('population', 'current');

// === POPULATION_TRAINED

export const getTrainedPopulation = get<number>('population', 'trained');
export const setTrainedPopulation = set<number>('population', 'trained');
export const changeAmountOfTrainedPopulation = changeAmountOf('population', 'trained');

// === POPULATION_KILLED

export const getKilledPopulation = get<number>('population', 'killed');
export const setKilledPopulation = set<number>('population', 'killed');
export const changeAmountOfKilledPopulation = changeAmountOf('population', 'killed');

// === POPULATION_MAX

export const getMaxPopulation = get<number>('population', 'max');
export const setMaxPopulation = set<number>('population', 'max');
export const changeAmountOfMaxPopulation = changeAmountOf('population', 'max');
