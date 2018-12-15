import {
	changeAmountOf,
	get,
	set,
} from 'game/data';

// === WORKERS_CURRENT

export const getCurrentWorkers = get<number>('workers', 'current');
export const setCurrentWorkers = set<number>('workers', 'current');
export const changeAmountOfCurrentWorkers = changeAmountOf('workers', 'current');

// === WORKERS_TRAINED

export const getTrainedWorkers = get<number>('workers', 'trained');
export const setTrainedWorkers = set<number>('workers', 'trained');
export const changeAmountOfTrainedWorkers = changeAmountOf('workers', 'trained');

// === WORKERS_KILLED

export const getKilledWorkers = get<number>('workers', 'killed');
export const setKilledWorkers = set<number>('workers', 'killed');
export const changeAmountOfKilledWorkers = changeAmountOf('workers', 'killed');

// === WORKERS_MAX

export const getMaxWorkers = get<number>('workers', 'max');
export const setMaxWorkers = set<number>('workers', 'max');
export const changeAmountOfMaxWorkers = changeAmountOf('workers', 'max');
